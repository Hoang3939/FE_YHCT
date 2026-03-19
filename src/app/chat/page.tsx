'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? 'http://localhost:3000';
const RAG_BASE_URL = process.env.NEXT_PUBLIC_RAG_API_URL ?? 'http://localhost:8000';

type ChatMessage = {
  messageId?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
};

type Conversation = {
  conversationId: string;
  conversationTitle: string | null;
  lastMessageContent: string | null;
  messageCount: number;
};

export default function ChatPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await fetch(`${AUTH_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload?.message ?? 'Không thể lấy thông tin tài khoản.');
        }

        setFullName(payload.fullName ?? '');
        setEmail(payload.email ?? '');
      } catch (error) {
        localStorage.removeItem('auth_token');
        router.push('/login');
      }
    };

    loadProfile();
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return;
    }

    const loadConversations = async () => {
      try {
        const response = await fetch(`${AUTH_BASE_URL}/auth/conversations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const payload = await response.json().catch(() => []);
        if (!response.ok) {
          throw new Error(payload?.message ?? 'Không thể tải cuộc trò chuyện.');
        }
        const list = Array.isArray(payload) ? payload : [];
        setConversations(list);
        if (list.length > 0) {
          setActiveConversationId((prev) => prev ?? list[0].conversationId);
        }
      } catch {
        setConversations([]);
      }
    };

    loadConversations();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token || !activeConversationId) {
      setChatMessages([]);
      return;
    }

    const loadMessages = async () => {
      try {
        const response = await fetch(
          `${AUTH_BASE_URL}/auth/conversations/${activeConversationId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const payload = await response.json().catch(() => []);
        if (!response.ok) {
          throw new Error(payload?.message ?? 'Không thể tải tin nhắn.');
        }
        setChatMessages(Array.isArray(payload) ? payload : []);
      } catch {
        setChatMessages([]);
      }
    };

    loadMessages();
  }, [activeConversationId]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    const token = localStorage.getItem('auth_token');

    try {
      await fetch(`${AUTH_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } finally {
      localStorage.removeItem('auth_token');
      setFullName('');
      setEmail('');
      setMessage('');
      setChatMessages([]);
      setIsLoggingOut(false);
      router.push('/login');
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      await fetch(`${AUTH_BASE_URL}/auth/conversations/${conversationId}/delete`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } finally {
      setConversations((prev) => prev.filter((item) => item.conversationId !== conversationId));
      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
        setChatMessages([]);
      }
    }
  };

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!message.trim() || isSending) return;

    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    const userMessage = message.trim();
    setMessage('');
    setIsSending(true);

    let conversationId = activeConversationId;

    try {
      if (!conversationId) {
        const createResponse = await fetch(`${AUTH_BASE_URL}/auth/conversations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: userMessage.slice(0, 40) }),
        });

        const created = await createResponse.json().catch(() => ({}));
        if (!createResponse.ok) {
          throw new Error(created?.message ?? 'Không thể tạo cuộc trò chuyện.');
        }

        conversationId = created.conversationId;
        setActiveConversationId(conversationId);
        setConversations((prev) => [created, ...prev]);
      }

      const userRecordResponse = await fetch(
        `${AUTH_BASE_URL}/auth/conversations/${conversationId}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: 'user', content: userMessage }),
        },
      );
      await userRecordResponse.json().catch(() => ({}));

      setChatMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

      const response = await fetch(`${RAG_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.detail ?? 'Không thể gửi câu hỏi.');
      }

      const assistantContent = payload.reply ?? '';

      const assistantRecordResponse = await fetch(
        `${AUTH_BASE_URL}/auth/conversations/${conversationId}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: 'assistant', content: assistantContent }),
        },
      );
      await assistantRecordResponse.json().catch(() => ({}));

      setChatMessages((prev) => [...prev, { role: 'assistant', content: assistantContent }]);
      setConversations((prev) =>
        prev.map((item) =>
          item.conversationId === conversationId
            ? {
                ...item,
                lastMessageContent: assistantContent,
                messageCount: (item.messageCount ?? 0) + 2,
              }
            : item,
        ),
      );
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: err instanceof Error ? err.message : 'Đã có lỗi xảy ra.' },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#2b2f2b] flex items-center justify-center p-[24px]">
      <div className="w-[1200px] max-w-full min-h-[720px] rounded-[18px] overflow-hidden border border-[#1f2a23] bg-[#0c1210] shadow-[0_30px_80px_rgba(0,0,0,0.55)] flex">
        <aside className="w-[280px] border-r border-[#1f2a23] bg-[#0c120f] flex flex-col">
          <div className="p-[16px]">
            <button
              type="button"
              onClick={() => {
                setActiveConversationId(null);
                setChatMessages([]);
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
              Tìm kiếm
            </div>
            <div className="flex items-center gap-[8px]">
              <span className="text-[14px]">⚙️</span>
              Cài đặt
            </div>
          </div>
          <div className="mt-[16px] px-[16px] text-[12px] text-[#c4c9c4] flex-1 overflow-y-auto">
            <div className="mb-[12px]">Cuộc trò chuyện</div>
            <div className="flex flex-col gap-[8px]">
              {conversations.length === 0 ? (
                <div className="text-[11px] text-[#7d887f]">Chưa có cuộc trò chuyện.</div>
              ) : (
                conversations.map((item) => (
                  <div
                    key={item.conversationId}
                    className={`group relative flex items-start justify-between gap-[8px] px-[10px] py-[8px] rounded-[10px] border text-[11px] ${
                      activeConversationId === item.conversationId
                        ? 'border-[#3c4c43] bg-[#202a26] text-[#e1e7e2]'
                        : 'border-transparent hover:border-[#2d3931] text-[#c4c9c4]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveConversationId(item.conversationId)}
                      className="flex-1 text-left min-w-0 pr-[14px]"
                    >
                      <div className="font-semibold truncate">
                        {item.conversationTitle ?? 'Cuộc trò chuyện'}
                      </div>
                      {item.lastMessageContent ? (
                        <div className="text-[10px] text-[#8f9992] truncate mt-[2px]">{item.lastMessageContent}</div>
                      ) : null}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteConversation(item.conversationId)}
                      className="absolute top-[8px] right-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 text-[#8f9992] hover:text-[#f39c9c] transition-colors"
                      title="Xóa"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[14px] h-[14px]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="p-[16px]">
            <div className="flex items-center gap-[10px] rounded-[10px] bg-[#1b2320] border border-[#28332b] px-[12px] py-[10px] text-[12px] text-[#cfd5cf]">
              <div className="w-[26px] h-[26px] rounded-[6px] bg-[#00d492] text-[#0c1210] flex items-center justify-center font-semibold">C</div>
              <div className="flex-1">
                <div className="text-[#e2e7e2]">{fullName || '...'}</div>
                <div className="text-[10px] text-[#a7b0aa]">{email || ''}</div>
              </div>
              <div className="w-[6px] h-[6px] rounded-full bg-[#00d492]" />
            </div>
          </div>
        </aside>

        <section className="flex-1 relative min-h-[720px]">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:84px_100%] opacity-30 pointer-events-none" />
          <header className="h-[54px] border-b border-[#1f2a23] flex items-center justify-between px-[20px] text-[#cfd5cf] text-[13px]">
            <div className="flex items-center gap-[12px]">
              <span className="w-[10px] h-[10px] rounded-full bg-[#9adbc1]" />
              Logo
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

          <div className="relative min-h-[calc(100%-54px)] flex flex-col text-white px-[24px] pt-[120px] pb-[24px]">
            <div className="text-center">
              <div className="text-[28px] font-['Playfair_Display']">Chào {fullName || '...'}</div>
              <div className="text-[22px] font-['Playfair_Display']">Bạn muốn tra cứu bài thuốc nào?</div>
            </div>

            <div className="mt-[28px] flex-1 overflow-y-auto pr-[6px]">
              {chatMessages.length === 0 ? (
                <div className="text-center text-[12px] text-[#cfd5cf]">Chưa có hội thoại.</div>
              ) : (
                <div className="flex flex-col gap-[14px]">
                  {chatMessages.map((item, index) => (
                    <div
                      key={`${item.role}-${index}`}
                      className={`max-w-[80%] rounded-[16px] px-[14px] py-[10px] text-[13px] leading-relaxed whitespace-pre-wrap ${
                        item.role === 'user'
                          ? 'ml-auto bg-[#2c3832] border border-[#3d4b43] text-[#e7eee9]'
                          : 'bg-[#1a231f] border border-[#2a3430] text-[#d8e0da]'
                      }`}
                    >
                      {item.content}
                    </div>
                  ))}
                  {isSending ? (
                    <div className="max-w-[80%] rounded-[16px] px-[14px] py-[10px] text-[13px] text-[#d8e0da] bg-[#1a231f] border border-[#2a3430]">
                      Đang trả lời...
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <form
              onSubmit={handleSend}
              className="mt-[20px] w-full bg-[#8a8f8c] text-[#1b1f1c] rounded-[14px] p-[12px] shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
            >
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Nhập câu hỏi..."
                className="w-full h-[64px] resize-none bg-transparent text-[13px] text-[#1b1f1c] placeholder:text-[#2b2f2b] outline-none"
              />
              <div className="flex items-center justify-between text-[11px] text-[#2b2f2b]">
                <div className="flex items-center gap-[14px]">
                  <div className="w-[22px] h-[22px] rounded-[6px] bg-[#f4f6f5] flex items-center justify-center">+</div>
                  <div className="flex items-center gap-[6px]">
                    <span className="w-[12px] h-[12px] rounded-full border border-[#2b2f2b]" />
                    Đính kèm
                  </div>
                  <div className="flex items-center gap-[6px]">
                    <span className="w-[12px] h-[12px] rounded-full border border-[#2b2f2b]" />
                    Nghiên cứu
                  </div>
                </div>
                <div className="flex items-center gap-[8px]">
                  <div className="w-[22px] h-[22px] rounded-full bg-[#f4f6f5] flex items-center justify-center">🎤</div>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-[22px] h-[22px] rounded-full bg-[#f4f6f5] flex items-center justify-center disabled:opacity-60"
                  >
                    ↑
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-[12px] flex flex-wrap items-center justify-center gap-[10px] text-[11px] text-[#cfd5cf]">
              {['Bài thuốc trị ho khan?', 'Vị thuốc Cam Thảo có tác dụng gì?', 'Hà Thủ Ô là gì?'].map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setMessage(item)}
                  className="px-[10px] py-[6px] rounded-[10px] bg-[#3b433f] border border-[#515b56] hover:border-[#6a756f]"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
