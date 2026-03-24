'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? 'http://localhost:3000';

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

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    setUsername(localStorage.getItem('userFullName') ?? '');
    setUserEmail(localStorage.getItem('userEmail') ?? '');

    const loadProfileAndConversations = async () => {
      try {
        // Load Profile
        const profileRes = await fetch(`${AUTH_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (profileRes.ok) {
          const profile = await profileRes.json();
          setUsername(profile.fullName ?? '');
          setUserEmail(profile.email ?? '');
        } else {
          // If profile fails, token might be invalid
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          router.push('/login');
          return;
        }

        // Load Conversations
        const convRes = await fetch(`${AUTH_BASE_URL}/chat/conversations`, {
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

    loadProfileAndConversations();
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token || !activeConversationId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${AUTH_BASE_URL}/chat/conversations/${activeConversationId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setMessages(data.map((m: any) => ({ 
              role: m.role, 
              content: m.content,
              attachments: m.attachments // backend doesn't seem to return this yet, but for future proofing
            })));
          }
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [activeConversationId]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    try {
      await fetch(`${AUTH_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userFullName');
      localStorage.removeItem('userEmail');
      setUsername('');
      setUserEmail('');
      setMessages([]);
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
      const res = await fetch(`${AUTH_BASE_URL}/chat/conversations/${deletingId}`, {
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

      const response = await fetch(`${AUTH_BASE_URL}/chat/message`, {
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
      const convRes = await fetch(`${AUTH_BASE_URL}/chat/conversations`, {
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
            <div className="flex items-center gap-[8px]">
              <span className="text-[14px]">⚙️</span>
              Cài đặt
            </div>
          </div>
          <div className="mt-[16px] px-[16px] text-[12px] text-[#c4c9c4] flex-1 overflow-y-auto">
            <div className="mb-[12px] font-semibold text-[#a7b0aa]">Cuộc trò chuyện</div>
            <div className="flex flex-col gap-[6px]">
              {conversations.map((conv) => (
                <button
                  key={conv.conversationId}
                  onClick={() => selectConversation(conv.conversationId)}
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
            <div className="flex items-center gap-[10px] rounded-[10px] bg-[#1b2320] border border-[#28332b] px-[12px] py-[10px] text-[12px] text-[#cfd5cf]">
              <div className="w-[26px] h-[26px] rounded-[6px] bg-[#00d492] text-[#0c1210] flex items-center justify-center font-semibold text-[14px]">
                {username ? username.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-[#e2e7e2] truncate">{username || 'Khách'}</div>
                <div className="text-[10px] text-[#a7b0aa] truncate">{userEmail}</div>
              </div>
              <div className="w-[6px] h-[6px] rounded-full bg-[#00d492]" />
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
              <button
                type="button"
                onClick={handleLogout}
                className="px-[10px] py-[4px] rounded-[8px] border border-[#2d3931] text-[#cfd5cf] text-[11px] hover:text-white"
              >
                {isLoggingOut ? '...' : 'Đăng xuất'}
              </button>
            </div>
          </header>

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
