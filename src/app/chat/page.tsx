'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { MessageSquare, Settings, LogOut, ChevronUp, FileUp } from 'lucide-react';
import { clearSession, ensureValidAccessToken, hasSession, logoutSession } from '@/lib/session';

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? 'http://localhost:3001';
const CHAT_BASE_URL = process.env.NEXT_PUBLIC_CHAT_BASE_URL ?? 'http://localhost:3002';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  attachments?: string[];
  timestamp?: string;
};

type Conversation = {
  conversationId: string;
  conversationTitle: string | null;
  lastMessageContent: string | null;
  messageCount: number;
  updatedAt?: string;
};

export default function ChatPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [currentView, setCurrentView] = useState<'chat' | 'settings'>('chat');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [customInstructions, setCustomInstructions] = useState('');
  const [privacyMode, setPrivacyMode] = useState(true);
  const [useMemory, setUseMemory] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    if (!hasSession()) {
      router.push('/login');
      return;
    }

    setUsername(localStorage.getItem('userFullName') ?? '');
    setUserEmail(localStorage.getItem('userEmail') ?? '');

    const loadProfileAndConversations = async () => {
      try {
        const token = await ensureValidAccessToken();
        if (!token) {
          router.push('/login');
          return;
        }

        const profileRes = await fetch(`${AUTH_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!profileRes.ok) {
          clearSession();
          router.push('/login');
          return;
        }

        const profile = await profileRes.json();
        setUsername(profile.fullName ?? '');
        setUserEmail(profile.email ?? '');
        setCustomInstructions(profile.customInstructions ?? '');
        if (profile.privacyMode !== undefined) setPrivacyMode(profile.privacyMode);
        if (profile.useMemory !== undefined) setUseMemory(profile.useMemory);

        const convRes = await fetch(`${CHAT_BASE_URL}/chat/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (convRes.ok) {
          const data = await convRes.json();
          if (Array.isArray(data)) setConversations(data);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    void loadProfileAndConversations();
  }, [router]);

  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const token = await ensureValidAccessToken();
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`${CHAT_BASE_URL}/chat/conversations/${activeConversationId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setMessages(data.map((m: any) => ({
              role: m.role,
              content: m.content,
              attachments: m.attachments
            })));
          }
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadMessages();
  }, [activeConversationId, router]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await logoutSession();
      setUsername('');
      setUserEmail('');
      setMessages([]);
      setConversations([]);
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setIsLoggingOut(false);
      router.push('/login');
    }
  };

  const selectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${CHAT_BASE_URL}/chat/conversations/${deletingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        if (activeConversationId === deletingId) {
          setActiveConversationId(null);
          setMessages([]);
        }
        setConversations((prev) => prev.filter((c) => c.conversationId !== deletingId));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setShowDeleteModal(false);
      setDeletingId(null);
    }
  };

  const onChooseFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    const allowedExt = ['.pdf', '.doc', '.docx'];
    const valid = selected.filter((f) =>
      allowedExt.some((ext) => f.name.toLowerCase().endsWith(ext)),
    );

    setAttachments((prev) => {
      const merged = [...prev, ...valid];
      return merged.slice(0, 5);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async (text: string) => {
    const safeText = text.trim();
    if ((!safeText && attachments.length === 0) || isLoading) return;

    const userDisplayContent = safeText;
    const currentAttachmentsNames = attachments.map((file) => file.name);

    const newMessages: ChatMessage[] = [
      ...messages,
      {
        role: 'user',
        content: userDisplayContent,
        attachments: currentAttachmentsNames,
      },
    ];

    setMessages(newMessages);
    setMessage('');
    setIsLoading(true);

    const token = localStorage.getItem('accessToken');
    try {
      const formData = new FormData();
      formData.append('message', safeText || 'Phân tích nội dung file đính kèm');
      if (activeConversationId) formData.append('conversationId', activeConversationId);
      attachments.forEach((file) => formData.append('attachments', file));

      const response = await fetch(`${CHAT_BASE_URL}/chat/message`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('API Error');
      }

      const payload = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: payload.reply ?? 'Không có phản hồi' }]);
      setAttachments([]);

      if (!activeConversationId && payload.conversationId) {
        setActiveConversationId(payload.conversationId);
      }

      // Refresh conversations list
      const convRes = await fetch(`${CHAT_BASE_URL}/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (convRes.ok) {
        const data = await convRes.json();
        if (Array.isArray(data)) setConversations(data);
      }
    } catch (error) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Có lỗi xảy ra khi kết nối tới RAG API. Vui lòng kiểm tra backend.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMarkdownLinks = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" class="text-[#00d492] hover:underline">$1</a>',
      );
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${AUTH_BASE_URL}/auth/me`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: username,
          customInstructions,
          privacyMode,
          useMemory,
        }),
      });
      if (res.ok) {
        localStorage.setItem('userFullName', username);
        alert('Lưu cài đặt thành công!');
      } else {
        alert('Lưu thất bại!');
      }
    } catch (e) {
      console.error(e);
      alert('Có lỗi xảy ra.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const renderSettings = () => (
    <div className="relative flex-1 bg-[#0c1210] text-[#cfd5cf] overflow-y-auto w-full h-full flex flex-col p-[40px] z-20">
      <div className="max-w-[700px] w-full mx-auto flex flex-col gap-[40px]">
        <h2 className="text-[28px] font-['Playfair_Display'] text-[#e2e7e2]">Cài đặt</h2>

        <div className="flex flex-col gap-[24px]">
          <h3 className="text-[18px] text-[#e2e7e2] font-semibold">Tài khoản</h3>
          
          <div className="flex flex-col gap-[12px] border-t border-[#1f2a23] pt-[24px]">
            <div className="flex w-full items-center text-[14px]">
              <div className="w-[200px] flex flex-col">
                <span className="font-semibold text-[#cfd5cf]">Họ và tên</span>
                <span className="text-[12px] text-[#6f7a73]">Họ và tên thật của bạn</span>
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="VD. Cục dàng"
                className="flex-1 rounded-[8px] bg-[#3b433f] border border-[#54625b] px-[12px] py-[8px] text-[#e2e7e2] outline-none"
              />
            </div>

            <div className="flex w-full items-center text-[14px] mt-[12px] border-t border-[#1f2a23] pt-[24px]">
              <div className="w-[200px] flex flex-col">
                <span className="font-semibold text-[#cfd5cf]">Email</span>
                <span className="text-[12px] text-[#6f7a73]">Địa chỉ Email của bạn</span>
              </div>
              <input
                type="text"
                value={userEmail}
                disabled
                placeholder="cucdang@gmail.com"
                className="flex-1 rounded-[8px] bg-[#3b433f] border border-[#54625b] px-[12px] py-[8px] text-[#8a8f8c] outline-none cursor-not-allowed opacity-70"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[24px]">
          <h3 className="text-[18px] text-[#e2e7e2] font-semibold">Tùy chỉnh</h3>
          
          <div className="flex flex-col gap-[16px] border-t border-[#1f2a23] pt-[24px]">
            <div className="flex flex-col gap-[12px] text-[14px]">
               <div className="flex flex-col">
                 <span className="font-semibold text-[#cfd5cf]">Hướng dẫn tùy chỉnh</span>
                 <span className="text-[12px] text-[#6f7a73]">Đưa ra các chỉ dẫn cho AI hoặc chỉ định bất kỳ tùy chọn ưu tiên nào cho kết quả đầu ra.</span>
               </div>
               <textarea
                 value={customInstructions}
                 onChange={(e) => setCustomInstructions(e.target.value)}
                 placeholder="VD: Chỉ đưa ra các câu trả lời ngắn gọn"
                 className="w-full h-[80px] rounded-[8px] bg-[#3b433f] border border-[#54625b] p-[12px] text-[#e2e7e2] outline-none resize-none"
               />
            </div>

            <div className="flex w-full items-center justify-between text-[14px] mt-[12px] border-t border-[#1f2a23] pt-[24px]">
              <div className="flex flex-col">
                <span className="font-semibold text-[#cfd5cf]">Chế độ riêng tư</span>
                <span className="text-[12px] text-[#6f7a73]">Ngăn chặn việc sử dụng dữ liệu của bạn để huấn luyện.</span>
              </div>
              <button 
                onClick={() => setPrivacyMode(!privacyMode)}
                className={`w-[40px] h-[22px] rounded-full relative transition-colors ${privacyMode ? 'bg-[#3b82f6]' : 'bg-[#5b605d]'}`}
              >
                <div className={`w-[18px] h-[18px] bg-white rounded-full absolute top-[2px] transition-all ${privacyMode ? 'left-[20px]' : 'left-[2px]'}`} />
              </button>
            </div>

            <div className="flex w-full items-center justify-between text-[14px] mt-[12px] border-t border-[#1f2a23] pt-[24px]">
              <div className="flex flex-col">
                <span className="font-semibold text-[#cfd5cf]">Sử dụng bộ nhớ</span>
                <span className="text-[12px] text-[#6f7a73]">Ghi nhớ các cuộc trò chuyện trước đó và những chi tiết bạn đã chia sẻ.</span>
              </div>
              <button 
                onClick={() => setUseMemory(!useMemory)}
                className={`w-[40px] h-[22px] rounded-full relative transition-colors ${useMemory ? 'bg-[#3b82f6]' : 'bg-[#5b605d]'}`}
              >
                <div className={`w-[18px] h-[18px] bg-white rounded-full absolute top-[2px] transition-all ${useMemory ? 'left-[20px]' : 'left-[2px]'}`} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-[10px] w-full flex justify-end">
          <button 
            onClick={handleSaveSettings}
            disabled={isSavingSettings}
            className="px-[20px] py-[10px] bg-[#00d492] hover:bg-[#00e39c] text-[#0c1210] font-semibold rounded-[8px] transition-colors disabled:opacity-50"
          >
            {isSavingSettings ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen w-full bg-[#2b2f2b] flex items-center justify-center p-[24px]">
      <div className="w-[1200px] max-w-full min-h-[720px] rounded-[18px] overflow-hidden border border-[#1f2a23] bg-[#0c1210] shadow-[0_30px_80px_rgba(0,0,0,0.55)] flex">
        <aside className="w-[280px] border-r border-[#1f2a23] bg-[#0c120f] flex flex-col">
          <div className="p-[16px]">
            <button
              onClick={() => {
                setActiveConversationId(null);
                setMessages([]);
                setMessage('');
                setAttachments([]);
                setCurrentView('chat');
              }}
              className="w-full h-[36px] rounded-[8px] bg-[#5b605d] text-white text-[12px] flex items-center justify-center gap-[8px]"
            >
              <span className="text-[14px]">✎</span>
              Trò chuyện mới
            </button>
          </div>
          <div className="px-[16px] text-[12px] text-[#c4c9c4] flex flex-col gap-[10px]">
            <div className="flex items-center gap-[8px]">
              <span className="text-[14px]">🔍</span>
              Tìm kiếm (Coming soon)
            </div>
            <button 
              className={`flex items-center gap-[8px] px-[8px] py-[6px] -mx-[8px] rounded-[6px] transition-colors ${currentView === 'settings' ? 'bg-[#2a3630] text-white' : 'hover:bg-[#1b2320]'}`}
              onClick={() => setCurrentView('settings')}
            >
              <span className="text-[14px]">⚙️</span>
              Cài đặt
            </button>
          </div>
          <div className="mt-[16px] px-[16px] text-[12px] text-[#c4c9c4] flex-1 overflow-y-auto">
            <div className="mb-[12px] font-semibold text-[#a7b0aa]">Cuộc trò chuyện</div>
            <div className="flex flex-col gap-[6px]">
              {conversations.map((conv) => (
                <button
                  key={conv.conversationId}
                  onClick={() => { selectConversation(conv.conversationId); setCurrentView('chat'); }}
                  className={`w-full text-left px-[10px] py-[8px] rounded-[8px] transition-colors group relative ${
                    activeConversationId === conv.conversationId
                      ? 'bg-[#2a3630] text-white'
                      : 'hover:bg-[#1b2320]'
                  }`}
                >
                  <div className="truncate pr-[20px] text-[13px] font-medium">
                    {conv.conversationTitle || 'Trò chuyện mới'}
                  </div>
                  <div className="truncate pr-[20px] text-[10px] text-[#6f7a73]">
                    {conv.lastMessageContent || '...'}
                  </div>
                  <div
                    onClick={(e) => handleDeleteClick(e, conv.conversationId)}
                    className="absolute top-[8px] right-[8px] w-[18px] h-[18px] rounded-full flex items-center justify-center text-[#6f7a73] hover:text-[#ff4d4d] hover:bg-[rgba(255,77,77,0.1)] opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </div>
                </button>
              ))}
              {conversations.length === 0 && (
                <div className="text-[#6f7a73] italic text-center py-[10px]">Chưa có cuộc trò chuyện</div>
              )}
            </div>
          </div>
          <div className="p-[16px]">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu((prev) => !prev)}
                className="flex w-full items-center gap-[10px] rounded-[10px] bg-[#1b2320] border border-[#28332b] px-[12px] py-[10px] text-[12px] text-[#cfd5cf] transition-colors hover:bg-[#222c28]"
              >
                <div className="w-[26px] h-[26px] rounded-[6px] bg-[#00d492] text-[#0c1210] flex items-center justify-center font-semibold text-[14px]">
                  {username ? username.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex-1 overflow-hidden text-left">
                  <div className="text-[#e2e7e2] truncate">{username || 'Khách'}</div>
                  <div className="text-[10px] text-[#a7b0aa] truncate">{userEmail}</div>
                </div>
                <ChevronUp
                  size={14}
                  className={`transition-transform ${showUserMenu ? '' : 'rotate-180'}`}
                />
              </button>

              {showUserMenu ? (
                <div className="absolute bottom-[calc(100%+8px)] left-0 right-0 z-30 overflow-hidden rounded-[12px] border border-[#28332b] bg-[#131917] shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentView('settings');
                      setShowUserMenu(false);
                    }}
                    className="flex w-full items-center gap-[10px] px-[12px] py-[10px] text-left text-[12px] text-[#d6ddd8] transition-colors hover:bg-[#1f2824]"
                  >
                    <Settings size={14} />
                    Cài đặt người dùng
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      router.push('/feedback');
                    }}
                    className="flex w-full items-center gap-[10px] px-[12px] py-[10px] text-left text-[12px] text-[#d6ddd8] transition-colors hover:bg-[#1f2824]"
                  >
                    <MessageSquare size={14} />
                    Góp ý
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      router.push('/contribute');
                    }}
                    className="flex w-full items-center gap-[10px] px-[12px] py-[10px] text-left text-[12px] text-[#d6ddd8] transition-colors hover:bg-[#1f2824]"
                  >
                    <FileUp size={14} />
                    Đóng góp tài liệu
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      void handleLogout();
                    }}
                    className="flex w-full items-center gap-[10px] px-[12px] py-[10px] text-left text-[12px] text-[#ffb4b4] transition-colors hover:bg-[#2a1d1d]"
                  >
                    <LogOut size={14} />
                    Đăng xuất
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </aside>

        <section className="flex-1 relative flex flex-col">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:84px_100%] opacity-30 pointer-events-none" />
          <header className="relative z-10 h-[54px] shrink-0 border-b border-[#1f2a23] flex items-center justify-between px-[20px] text-[#cfd5cf] text-[13px]">

            <div className="flex items-center gap-[12px]">
              <span className="w-[10px] h-[10px] rounded-full bg-[#9adbc1]" />
              YHCT Assistant
              <span className="text-[#6f7a73]">/</span>
              rag-fast-2.5
            </div>
            <div className="flex items-center gap-[8px]">
              <button className="px-[10px] py-[4px] rounded-[8px] bg-[#6b6f6c] text-white text-[11px]">Chia sẻ</button>
            </div>
          </header>

          {currentView === 'settings' ? (
            renderSettings()
          ) : (
          <div className="relative flex-1 flex flex-col items-center justify-center text-center text-white px-[24px]">
            {messages.length === 0 ? (
              <div className="z-10">
                <div className="text-[28px] font-['Playfair_Display']">Chào {username ? username.split(' ').pop() : 'Bạn'}</div>
                <div className="text-[22px] font-['Playfair_Display']">Bạn muốn tra cứu bài thuốc nào?</div>
              </div>
            ) : (
              <div className="absolute inset-0 top-0 bottom-[140px] overflow-y-auto p-[24px] flex flex-col items-center">
                <div className="w-full max-w-[800px] flex flex-col gap-[20px] text-left">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[80%] rounded-[14px] p-[14px] ${
                          msg.role === 'user'
                            ? 'bg-[#3b433f] text-[#e2e7e2]'
                            : 'bg-[#1b2320] text-[#cfd5cf] border border-[#28332b]'
                        }`}
                      >
                        {msg.role === 'assistant' ? (
                          <div
                            dangerouslySetInnerHTML={{ __html: renderMarkdownLinks(msg.content) }}
                            className="whitespace-pre-wrap text-[14px] leading-relaxed"
                          />
                        ) : (
                          <div className="flex flex-col gap-[8px] items-end">
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="flex flex-wrap gap-[6px] justify-end">
                                {msg.attachments.map((name, fileIdx) => (
                                  <div
                                    key={`${name}-${fileIdx}`}
                                    className="max-w-[280px] rounded-[12px] border border-[#54625b] bg-[#2f3733] px-[10px] py-[8px] text-left"
                                  >
                                    <div className="text-[10px] uppercase tracking-wide text-[#a7b0aa] mb-[3px]">Tệp đính kèm</div>
                                    <div className="text-[13px] text-[#e2e7e2] break-words">{name}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                            {msg.content && (
                              <div className="whitespace-pre-wrap text-[14px] leading-relaxed rounded-[14px] bg-[#ece9df] text-[#1f2421] px-[16px] py-[10px]">
                                {msg.content}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-[14px] p-[14px] bg-[#1b2320] text-[#cfd5cf] border border-[#28332b]">
                        <div className="flex items-center gap-[6px]">
                          <span className="w-[8px] h-[8px] rounded-full bg-[#00d492] animate-bounce" />
                          <span className="w-[8px] h-[8px] rounded-full bg-[#00d492] animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-[8px] h-[8px] rounded-full bg-[#00d492] animate-bounce [animation-delay:-0.3s]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div
              className={`w-[580px] max-w-full bg-[#8a8f8c] text-[#1b1f1c] rounded-[14px] p-[12px] shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all ${
                messages.length > 0 ? 'absolute bottom-[24px] z-10' : 'mt-[18px]'
              }`}
            >
              <input
                type="text"
                placeholder="Nhập câu hỏi..."
                className="w-full bg-transparent outline-none text-[14px] text-[#1b1f1c] placeholder:text-[#3a3f3b] mb-[10px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (message.trim() || attachments.length > 0) && !isLoading) {
                    handleSendMessage(message);
                  }
                }}
                disabled={isLoading}
              />

              {attachments.length > 0 && (
                <div className="mb-[8px] flex flex-wrap gap-[6px]">
                  {attachments.map((file, idx) => (
                    <div
                      key={`${file.name}-${idx}`}
                      className="px-[8px] py-[4px] rounded-[8px] bg-[#f4f6f5] text-[11px] text-[#2b2f2b] flex items-center gap-[6px]"
                    >
                      <span className="max-w-[220px] truncate">{file.name}</span>
                      <button type="button" onClick={() => removeAttachment(idx)} className="font-bold leading-none">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-[#2b2f2b]">
                <div className="flex items-center gap-[14px]">
                  <button
                    type="button"
                    className="w-[22px] h-[22px] rounded-[6px] bg-[#f4f6f5] flex items-center justify-center hover:bg-[#e0e3e1] transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    +
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={onChooseFiles}
                  />
                  <span className="text-[11px]">Đính kèm .pdf/.doc/.docx</span>
                </div>
                <div className="flex items-center gap-[8px]">
                  <button
                    className="w-[22px] h-[22px] rounded-full bg-[#f4f6f5] flex items-center justify-center transition-colors disabled:opacity-50 enabled:hover:bg-[#e0e3e1] enabled:cursor-pointer"
                    disabled={(!message.trim() && attachments.length === 0) || isLoading}
                    onClick={() => handleSendMessage(message)}
                  >
                    ↑
                  </button>
                </div>
              </div>
            </div>

            {messages.length === 0 && (
              <div className="mt-[12px] flex flex-wrap items-center justify-center gap-[10px] text-[11px] text-[#cfd5cf] z-10">
                {['Bài thuốc trị ho khan?', 'Vị thuốc Cam Thảo có tác dụng gì?', 'Hà Thủ Ô là gì?'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleSendMessage(item)}
                    disabled={isLoading}
                    className="px-[10px] py-[6px] rounded-[10px] bg-[#3b433f] border border-[#515b56] hover:bg-[#4a544f] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
          )}
        </section>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-[#1b2320] border border-[#28332b] rounded-[18px] p-[24px] w-[400px] shadow-2xl transition-all scale-100 opacity-100">
            <div className="text-[18px] font-semibold text-[#e2e7e2] mb-[12px]">Xóa cuộc trò chuyện?</div>
            <p className="text-[#a7b0aa] text-[14px] leading-relaxed mb-[24px]">
              Tất cả nội dung tin nhắn trong cuộc trò chuyện này sẽ bị xóa vĩnh viễn và không thể khôi phục.
            </p>
            <div className="flex justify-end gap-[12px]">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingId(null);
                }}
                className="px-[16px] py-[8px] rounded-[10px] text-[#cfd5cf] hover:bg-[#2a3630] transition-colors text-[14px]"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="px-[16px] py-[8px] rounded-[10px] bg-[#ff4d4d] text-white hover:bg-[#ff3333] transition-colors text-[14px]"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
