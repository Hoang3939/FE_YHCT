'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Settings, LogOut, ChevronUp, Menu, X, MessageSquare, FileUp, BookOpen, MessageCircleWarning, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { clearSession, ensureValidAccessToken, hasSession, logoutSession } from '@/lib/session';
import { useToast } from '@/components/toast/ToastContext';

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? 'http://localhost:3001';
const CHAT_BASE_URL = process.env.NEXT_PUBLIC_CHAT_BASE_URL ?? 'http://localhost:3002';

type ChatMessage = {
  messageId?: string;
  role: 'user' | 'assistant';
  content: string;
  attachments?: string[];
  timestamp?: string;
  feedbackType?: 'good' | 'bad' | 'copy' | null;
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
  const messagesRef = useRef<ChatMessage[]>([]);
  
  // Note: messagesRef is updated manually after each setMessages call
  // Do NOT use useEffect to sync, it causes race conditions
  
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const [currentView, setCurrentView] = useState<'chat' | 'settings'>('chat');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(true);
  const [useMemory, setUseMemory] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isTogglingMemory, setIsTogglingMemory] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [isChangingPwd, setIsChangingPwd] = useState(false);
  const { showToast } = useToast();

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
            const loadedMessages = data.map((m: any) => ({
              role: m.role,
              content: m.content,
              attachments: m.attachments,
              messageId: m.messageId
            }));
            messagesRef.current = loadedMessages;
            setMessages(loadedMessages);
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

  const startRename = (conv: Conversation) => {
    setEditingId(conv.conversationId);
    setEditTitle(conv.conversationTitle || '');
  };

  const cancelRename = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const saveRename = async (conversationId: string) => {
    if (!editTitle.trim()) {
      cancelRename();
      return;
    }
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${CHAT_BASE_URL}/chat/conversations/${conversationId}/title`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editTitle.trim() }),
      });
      if (res.ok) {
        setConversations((prev) =>
          prev.map((c) =>
            c.conversationId === conversationId
              ? { ...c, conversationTitle: editTitle.trim() }
              : c
          )
        );
        showToast('Đã cập nhật tên cuộc trò chuyện', 'success');
      } else {
        showToast('Không thể đổi tên. Vui lòng thử lại.', 'error');
      }
    } catch {
      showToast('Không thể kết nối. Kiểm tra mạng của bạn.', 'error');
    } finally {
      setEditingId(null);
      setEditTitle('');
    }
  };

  const handleFeedback = async (messageIndex: number, type: 'good' | 'bad' | 'copy') => {
    const currentMessages = messagesRef.current;
    const msg = currentMessages[messageIndex];
    console.log('handleFeedback:', { idx: messageIndex, type, msgId: msg?.messageId, msg, allMessages: currentMessages });
    
    if (!msg) {
      console.error('Message not found at index', messageIndex, currentMessages);
      showToast('Lỗi: Không tìm thấy tin nhắn', 'error');
      return;
    }

    // Handle copy action immediately (no need for messageId)
    if (type === 'copy') {
      navigator.clipboard.writeText(msg.content);
      showToast('Đã sao chép vào clipboard', 'success');
      return;
    }

    // For good/bad, we need messageId to save to backend
    if (!msg.messageId) {
      showToast('Chưa thể đánh giá - đang đợi lưu tin nhắn...', 'error');
      console.error('No messageId for message:', msg);
      return;
    }

    const token = localStorage.getItem('accessToken');
    const currentFeedbackType = msg.feedbackType;
    const isRemoving = currentFeedbackType === type;

    // Show toast immediately when selecting
    if (type === 'good') {
      showToast(isRemoving ? 'Đã hủy đánh giá' : 'Cảm ơn phản hồi của bạn! 🎉', 'success');
    } else if (type === 'bad') {
      showToast(isRemoving ? 'Đã hủy đánh giá' : 'Cảm ơn, chúng tôi sẽ cải thiện.', 'success');
    }

    // Update UI immediately (optimistic update)
    setMessages((prev) =>
      prev.map((m, idx) =>
        idx === messageIndex
          ? { ...m, feedbackType: isRemoving ? null : type }
          : m
      )
    );

    try {
      const url = `${CHAT_BASE_URL}/chat/messages/${msg.messageId}/feedback`;
      const res = await fetch(url, {
        method: isRemoving ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        ...(isRemoving ? {} : { body: JSON.stringify({ type }) }),
      });

      if (!res.ok) {
        // Revert on error - get current feedbackType from currentMessages
        const originalFeedbackType = currentMessages[messageIndex]?.feedbackType;
        setMessages((prev) =>
          prev.map((m, idx) =>
            idx === messageIndex
              ? { ...m, feedbackType: originalFeedbackType }
              : m
          )
        );
        showToast('Không thể gửi phản hồi. Vui lòng thử lại.', 'error');
      }
    } catch (e) {
      console.error('Feedback error:', e);
      showToast('Không thể kết nối. Kiểm tra mạng của bạn.', 'error');
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

    messagesRef.current = newMessages;
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
      console.log('API Response:', payload); // Debug: check if messageId exists
      const assistantMessage: ChatMessage = { 
        role: 'assistant', 
        content: payload.reply ?? 'Không có phản hồi',
        messageId: payload.messageId
      };
      const updatedMessages = [...newMessages, assistantMessage];
      console.log('Setting messages with messageId:', payload.messageId, updatedMessages);
      // Update ref BEFORE setMessages to ensure handleFeedback can access it immediately
      messagesRef.current = updatedMessages;
      setMessages(updatedMessages);
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
      const errorMessages: ChatMessage[] = [
        ...newMessages,
        {
          role: 'assistant',
          content: 'Có lỗi xảy ra khi kết nối tới RAG API. Vui lòng kiểm tra backend.',
        },
      ];
      messagesRef.current = errorMessages;
      setMessages(errorMessages);
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


  const toggleMemory = async () => {
    setIsTogglingMemory(true);
    const newValue = !useMemory;
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${AUTH_BASE_URL}/auth/me/memory`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ useMemory: newValue }),
      });
      if (res.ok) {
        setUseMemory(newValue);
        showToast(
          newValue 
            ? 'AI sẽ ghi nhớ thông tin sức khỏe của bạn 🧠' 
            : 'Đã tắt ghi nhớ. AI sẽ không nhớ thông tin cũ.',
          'success'
        );
      } else {
        showToast('Không thể cập nhật. Vui lòng thử lại.', 'error');
      }
    } catch {
      showToast('Không thể kết nối. Kiểm tra mạng của bạn.', 'error');
    } finally {
      setIsTogglingMemory(false);
    }
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
          privacyMode,
        }),
      });
      if (res.ok) {
        localStorage.setItem('userFullName', username);
        showToast('Đã lưu cài đặt!', 'success');
      } else {
        showToast('Lưu thất bại. Vui lòng thử lại.', 'error');
      }
    } catch {
      showToast('Không thể kết nối. Kiểm tra mạng của bạn.', 'error');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPwd) { showToast('Vui lòng nhập mật khẩu hiện tại', 'error'); return; }
    if (newPwd.length < 8) { showToast('Mật khẩu mới phải có ít nhất 8 ký tự', 'error'); return; }
    if (newPwd !== confirmPwd) { showToast('Xác nhận mật khẩu không khớp', 'error'); return; }
    setIsChangingPwd(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${AUTH_BASE_URL}/auth/me/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
      });
      const data = await res.json() as { message?: string };
      if (!res.ok) throw new Error(data.message ?? 'Đổi mật khẩu thất bại');
      showToast('Đổi mật khẩu thành công', 'success');
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Đổi mật khẩu thất bại', 'error');
    } finally {
      setIsChangingPwd(false);
    }
  };

  const renderSettings = () => (
    <div className="relative flex-1 bg-[#0c1210] text-[#cfd5cf] overflow-y-auto w-full h-full flex flex-col p-[40px] z-20">
      <div className="max-w-[700px] w-full mx-auto flex flex-col gap-[40px]">
        <h2 className="text-2xl font-display text-[#e2e7e2]">Cài đặt</h2>

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
            <div className="flex w-full items-center justify-between text-[14px]">
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
                <span className="text-[12px] text-[#6f7a73]">AI sẽ nhớ thông tin sức khỏe quan trọng từ các cuộc trò chuyện để tư vấn tốt hơn.</span>
              </div>
              <button 
                onClick={toggleMemory}
                disabled={isTogglingMemory}
                className={`w-[40px] h-[22px] rounded-full relative transition-colors disabled:opacity-50 ${useMemory ? 'bg-[#3b82f6]' : 'bg-[#5b605d]'}`}
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

        {/* Bảo mật */}
        <div className="flex flex-col gap-[24px]">
          <h3 className="text-[18px] text-[#e2e7e2] font-semibold">Bảo mật</h3>

          <div className="flex flex-col gap-[16px] border-t border-[#1f2a23] pt-[24px]">
            <div className="flex w-full items-center text-[14px]">
              <div className="w-[200px] flex flex-col shrink-0">
                <span className="font-semibold text-[#cfd5cf]">Mật khẩu hiện tại</span>
              </div>
              <input
                type="password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                placeholder="••••••••"
                className="flex-1 rounded-[8px] bg-[#3b433f] border border-[#54625b] px-[12px] py-[8px] text-[#e2e7e2] outline-none"
              />
            </div>

            <div className="flex w-full items-center text-[14px] border-t border-[#1f2a23] pt-[16px]">
              <div className="w-[200px] flex flex-col shrink-0">
                <span className="font-semibold text-[#cfd5cf]">Mật khẩu mới</span>
                <span className="text-[12px] text-[#6f7a73]">Tối thiểu 8 ký tự</span>
              </div>
              <input
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder="••••••••"
                className="flex-1 rounded-[8px] bg-[#3b433f] border border-[#54625b] px-[12px] py-[8px] text-[#e2e7e2] outline-none"
              />
            </div>

            <div className="flex w-full items-center text-[14px] border-t border-[#1f2a23] pt-[16px]">
              <div className="w-[200px] flex flex-col shrink-0">
                <span className="font-semibold text-[#cfd5cf]">Xác nhận mật khẩu</span>
              </div>
              <input
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                placeholder="••••••••"
                className="flex-1 rounded-[8px] bg-[#3b433f] border border-[#54625b] px-[12px] py-[8px] text-[#e2e7e2] outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => void handleChangePassword()}
              disabled={isChangingPwd}
              className="px-[20px] py-[10px] bg-[#00d492] hover:bg-[#00e39c] text-[#0c1210] font-semibold rounded-[8px] transition-colors disabled:opacity-50"
            >
              {isChangingPwd ? 'Đang lưu...' : 'Đổi mật khẩu'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <main className="min-h-screen w-full bg-[#2b2f2b] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-7xl min-h-[720px] rounded-2xl overflow-hidden border border-[#1f2a23] bg-[#0c1210] shadow-[0_30px_80px_rgba(0,0,0,0.55)] flex">
        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileSidebarOpen(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-72 border-r border-[#1f2a23] bg-[#0c120f] flex flex-col z-10">
              <div className="flex items-center justify-between p-4 border-b border-[#1f2a23]">
                <span className="font-display text-lg text-white">Y-RAG</span>
                <button onClick={() => setMobileSidebarOpen(false)} className="text-[#9fb0a5] hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4">
                <button
                  onClick={() => { setActiveConversationId(null); setMessages([]); setMessage(''); setAttachments([]); setCurrentView('chat'); setMobileSidebarOpen(false); }}
                  className="w-full h-9 rounded-lg bg-[#5b605d] text-white text-xs font-medium flex items-center justify-center gap-2 hover:bg-[#6b706d] transition-colors"
                >
                  <span className="text-sm">✎</span> Trò chuyện mới
                </button>
              </div>
              {/* Mobile Navigation Links */}
              <div className="px-4 py-2 text-xs text-[#c4c9c4] flex flex-col gap-2 border-b border-[#1f2a23]">
                <Link
                  href="/library"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex items-center gap-2 px-2 py-1.5 -mx-2 rounded-md transition-colors hover:bg-[#1b2320]"
                >
                  <BookOpen size={14} />
                  Thư viện
                </Link>
                <Link
                  href="/contribute"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex items-center gap-2 px-2 py-1.5 -mx-2 rounded-md transition-colors hover:bg-[#1b2320]"
                >
                  <PlusCircle size={14} />
                  Đóng góp
                </Link>
                <Link
                  href="/feedback"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex items-center gap-2 px-2 py-1.5 -mx-2 rounded-md transition-colors hover:bg-[#1b2320]"
                >
                  <MessageCircleWarning size={14} />
                  Góp ý
                </Link>
              </div>
              <div className="mt-2 px-4 text-xs text-[#c4c9c4] flex-1 overflow-y-auto">
                <div className="mb-3 font-semibold text-[#a7b0aa]">Cuộc trò chuyện</div>
                <div className="flex flex-col gap-1.5">
                  {conversations.map((conv) => (
                    <div
                      key={conv.conversationId}
                      className={`group flex items-center gap-1 px-2.5 py-2 rounded-lg transition-colors ${activeConversationId === conv.conversationId ? 'bg-[#2a3630] text-white' : 'hover:bg-[#1b2320]'}`}
                    >
                      {editingId === conv.conversationId ? (
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={() => saveRename(conv.conversationId)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveRename(conv.conversationId);
                            if (e.key === 'Escape') cancelRename();
                          }}
                          autoFocus
                          className="flex-1 bg-transparent text-[13px] font-medium outline-none border-b border-[#5b605d]"
                        />
                      ) : (
                        <>
                          <button
                            onClick={() => { selectConversation(conv.conversationId); setCurrentView('chat'); setMobileSidebarOpen(false); }}
                            className="flex-1 text-left truncate text-[13px] font-medium"
                          >
                            {conv.conversationTitle || 'Trò chuyện mới'}
                          </button>
                          <button
                            onClick={() => startRename(conv)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#3b433f] rounded transition-all"
                            title="Đổi tên"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-64 lg:w-72 border-r border-[#1f2a23] bg-[#0c120f] flex-col">
          <div className="p-4">
            <button
              onClick={() => {
                setActiveConversationId(null);
                setMessages([]);
                setMessage('');
                setAttachments([]);
                setCurrentView('chat');
              }}
              className="w-full h-9 rounded-lg bg-[#5b605d] text-white text-xs font-medium flex items-center justify-center gap-2 hover:bg-[#6b706d] transition-colors"
            >
              <span className="text-sm">✎</span>
              Trò chuyện mới
            </button>
          </div>
          <div className="px-4 text-xs text-[#c4c9c4] flex flex-col gap-2">
            <div className="flex items-center gap-2 opacity-50">
              <span className="text-sm">🔍</span>
              Tìm kiếm (Coming soon)
            </div>
            {/* Navigation Links */}
            <Link
              href="/library"
              className="flex items-center gap-2 px-2 py-1.5 -mx-2 rounded-md transition-colors hover:bg-[#1b2320]"
            >
              <BookOpen size={14} />
              Thư viện
            </Link>
            <Link
              href="/contribute"
              className="flex items-center gap-2 px-2 py-1.5 -mx-2 rounded-md transition-colors hover:bg-[#1b2320]"
            >
              <PlusCircle size={14} />
              Đóng góp
            </Link>
            <Link
              href="/feedback"
              className="flex items-center gap-2 px-2 py-1.5 -mx-2 rounded-md transition-colors hover:bg-[#1b2320]"
            >
              <MessageCircleWarning size={14} />
              Góp ý
            </Link>
            <button 
              className={`flex items-center gap-2 px-2 py-1.5 -mx-2 rounded-md transition-colors ${currentView === 'settings' ? 'bg-[#2a3630] text-white' : 'hover:bg-[#1b2320]'}`}
              onClick={() => setCurrentView('settings')}
            >
              <span className="text-sm">⚙️</span>
              Cài đặt
            </button>
          </div>
          <div className="mt-4 px-4 text-xs text-[#c4c9c4] flex-1 overflow-y-auto">
            <div className="mb-3 font-semibold text-[#a7b0aa]">Cuộc trò chuyện</div>
            <div className="flex flex-col gap-1.5">
              {conversations.map((conv) => (
                <div
                  key={conv.conversationId}
                  className={`group relative px-[10px] py-[8px] rounded-[8px] transition-colors ${
                    activeConversationId === conv.conversationId
                      ? 'bg-[#2a3630] text-white'
                      : 'hover:bg-[#1b2320]'
                  }`}
                >
                  {editingId === conv.conversationId ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={() => saveRename(conv.conversationId)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveRename(conv.conversationId);
                        if (e.key === 'Escape') cancelRename();
                      }}
                      autoFocus
                      className="w-full bg-transparent text-[13px] font-medium outline-none border-b border-[#5b605d] pr-[40px]"
                    />
                  ) : (
                    <>
                      <button
                        onClick={() => { selectConversation(conv.conversationId); setCurrentView('chat'); }}
                        className="w-full text-left"
                      >
                        <div className="truncate pr-[40px] text-[13px] font-medium">
                          {conv.conversationTitle || 'Trò chuyện mới'}
                        </div>
                        <div className="truncate pr-[40px] text-[10px] text-[#6f7a73]">
                          {conv.lastMessageContent || '...'}
                        </div>
                      </button>
                      <div className="absolute top-[8px] right-[8px] flex items-center gap-1">
                        <button
                          onClick={() => startRename(conv)}
                          className="w-[18px] h-[18px] rounded-full flex items-center justify-center text-[#6f7a73] hover:text-[#00d492] hover:bg-[rgba(0,212,146,0.1)] opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Đổi tên"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(e, conv.conversationId)}
                          className="w-[18px] h-[18px] rounded-full flex items-center justify-center text-[#6f7a73] hover:text-[#ff4d4d] hover:bg-[rgba(255,77,77,0.1)] opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Xóa"
                        >
                          ×
                        </button>
                      </div>
                    </>
                  )}
                </div>
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
          <header className="relative z-10 shrink-0 border-b border-[#1f2a23] px-4 py-3 text-[#cfd5cf]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className="md:hidden p-1.5 rounded-lg hover:bg-[#1b2320] transition-colors"
                >
                  <Menu size={20} />
                </button>
                <div className="flex items-center gap-2 text-sm">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#9adbc1]" />
                  <span className="font-medium text-[#e2e7e2]">YHCT Assistant</span>
                  <span className="hidden sm:inline text-[#6f7a73]">/</span>
                  <span className="hidden sm:inline text-xs text-[#9fb0a5]">rag-fast-2.5</span>
                </div>
              </div>

              {/* Navigation moved to UserAppShell */}
            </div>
          </header>

          {currentView === 'settings' ? (
            renderSettings()
          ) : (
          <div className="relative flex-1 flex flex-col items-center justify-center text-center text-white px-[24px]">
            {messages.length === 0 ? (
              <div className="z-10">
                <div className="font-display text-2xl sm:text-3xl text-[#f1f5f2]">Chào {username ? username.split(' ').pop() : 'Bạn'}</div>
                <div className="font-display text-lg sm:text-xl text-[#dbe6de]">Bạn muốn tra cứu bài thuốc nào?</div>
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
                          <div className="flex flex-col gap-[8px]">
                            <div
                              dangerouslySetInnerHTML={{ __html: renderMarkdownLinks(msg.content) }}
                              className="whitespace-pre-wrap text-[14px] leading-relaxed"
                            />
                            {/* Feedback buttons */}
                            <div className="flex items-center gap-[8px] mt-[4px] pt-[8px] border-t border-[#28332b]">
                              <button
                                onClick={() => handleFeedback(idx, 'good')}
                                className={`p-[4px] rounded-[6px] transition-colors ${
                                  msg.feedbackType === 'good'
                                    ? 'text-[#4ade80] bg-[#1a3a2e]'
                                    : 'text-[#6f7a73] hover:text-[#4ade80] hover:bg-[#1a3a2e]/50'
                                }`}
                                title="Phản hồi tốt"
                                aria-label="Phản hồi tốt"
                              >
                                <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleFeedback(idx, 'bad')}
                                className={`p-[4px] rounded-[6px] transition-colors ${
                                  msg.feedbackType === 'bad'
                                    ? 'text-[#ff6b6b] bg-[#3a1a1a]'
                                    : 'text-[#6f7a73] hover:text-[#ff6b6b] hover:bg-[#3a1a1a]/50'
                                }`}
                                title="Phản hồi xấu"
                                aria-label="Phản hồi xấu"
                              >
                                <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2M7 20v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714-.211-1.412-.608-2.006L7 13V4" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleFeedback(idx, 'copy')}
                                className="p-[4px] rounded-[6px] transition-colors text-[#6f7a73] hover:text-[#00d492] hover:bg-[#1a3a2e]/50"
                                title="Sao chép"
                                aria-label="Sao chép"
                              >
                                <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                            </div>
                          </div>
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
              className={`w-full max-w-xl bg-[#8a8f8c] text-[#1b1f1c] rounded-xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all ${
                messages.length > 0 ? 'absolute bottom-6 z-10' : 'mt-4'
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
