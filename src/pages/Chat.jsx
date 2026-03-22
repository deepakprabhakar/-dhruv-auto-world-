import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  collection, addDoc, getDocs, doc, updateDoc,
  query, where, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const SYSTEM_PROMPT = `You are an expert used-car advisor working for Dhruv Auto World in India.

Speak in a friendly yet professional tone. Keep responses concise and well-structured.

Help users choose the best second-hand car based on:
- budget (in Indian Rupees)
- mileage / fuel economy
- maintenance cost
- usage pattern (city / highway / mixed)
- family or personal use
- preferred fuel type (petrol / diesel / CNG / EV)

When recommending cars:
- Suggest 2-4 cars maximum
- State the price range clearly in INR
- Explain why each car fits the user's needs
- Mention approximate maintenance cost level (low/medium/high)

If user asks about a specific car:
- Give honest pros and cons
- Mention real-world issues if any
- Compare with 1-2 alternatives

If a car is not in the system:
- Still provide helpful, honest advice from your general knowledge

Avoid robotic tone. Be clear, practical, and human. You know the Indian used car market deeply.`;

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

export default function Chat() {
  const { user } = useAuth();
  const location = useLocation();

  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loadingChats, setLoadingChats] = useState(true);
  const [streamingText, setStreamingText] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const currentChatIdRef = useRef(null);
  const messagesRef = useRef(messages);

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { currentChatIdRef.current = currentChatId; }, [currentChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  useEffect(() => {
    if (location.state?.carName) {
      setInput(`Tell me about the ${location.state.carName}. Is it a good second-hand buy in India?`);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, []);

  useEffect(() => {
    if (user) loadChats();
  }, [user]);

  const loadChats = async () => {
    try {
      setLoadingChats(true);
      const q = query(collection(db, 'chats'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const list = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setChats(list);
    } catch (err) {
      console.error('Failed to load chats:', err);
    } finally {
      setLoadingChats(false);
    }
  };

  const selectChat = (chat) => {
    setCurrentChatId(chat.id);
    setMessages(chat.messages || []);
    setStreamingText('');
  };

  const startNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setStreamingText('');
    setInput('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: trimmed },
        { role: 'assistant', content: '⚠️ Groq API key is missing. Add VITE_GROQ_API_KEY to your .env file and restart the dev server.' },
      ]);
      setInput('');
      return;
    }

    let chatId = currentChatIdRef.current;
    const userMsg = { role: 'user', content: trimmed };
    const updatedMsgs = [...messagesRef.current, userMsg];

    setMessages(updatedMsgs);
    setInput('');
    setIsLoading(true);
    setStreamingText('');

    if (!chatId) {
      try {
        const newDoc = await addDoc(collection(db, 'chats'), {
          userId: user.uid,
          title: trimmed.slice(0, 45) + (trimmed.length > 45 ? '...' : ''),
          messages: updatedMsgs,
          createdAt: serverTimestamp(),
        });
        chatId = newDoc.id;
        setCurrentChatId(chatId);
        setChats((prev) => [
          { id: chatId, title: trimmed.slice(0, 45) + (trimmed.length > 45 ? '...' : ''), messages: updatedMsgs },
          ...prev,
        ]);
      } catch (err) {
        console.error('Firestore create error:', err);
      }
    }

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          stream: true,
          max_tokens: 1024,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...updatedMsgs.map((m) => ({ role: m.role, content: m.content })),
          ],
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Groq API error');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter((l) => l.startsWith('data:'));
        for (const line of lines) {
          const data = line.replace('data: ', '').trim();
          if (data === '[DONE]') break;
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content || '';
            fullText += delta;
            setStreamingText(fullText);
          } catch (_) {}
        }
      }

      const assistantMsg = { role: 'assistant', content: fullText };
      const finalMsgs = [...updatedMsgs, assistantMsg];
      setMessages(finalMsgs);
      setStreamingText('');

      if (chatId) {
        try {
          await updateDoc(doc(db, 'chats', chatId), { messages: finalMsgs });
          setChats((prev) =>
            prev.map((c) => (c.id === chatId ? { ...c, messages: finalMsgs } : c))
          );
        } catch (err) {
          console.error('Firestore update error:', err);
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `❌ Error: ${err.message}. Please check your API key and try again.` },
      ]);
      setStreamingText('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#f0f0f0">$1</strong>')
      .replace(/`(.*?)`/g, '<code style="background:rgba(255,255,255,0.08);padding:2px 6px;border-radius:4px;font-family:monospace;font-size:13px;color:#e0e0e0">$1</code>')
      .replace(/\n/g, '<br/>');
  };

  const suggested = [
    'Best car under ₹5 lakh for city use?',
    'Should I buy diesel or petrol used car?',
    'Best family car under ₹8 lakh?',
    'Is Maruti Swift a good second-hand buy?',
  ];

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.layout}>

        {/* Sidebar */}
        <div style={{ ...styles.sidebar, width: sidebarOpen ? 260 : 0, minWidth: sidebarOpen ? 260 : 0, overflow: 'hidden' }}>
          <div style={styles.sidebarInner}>
            <div style={styles.sidebarHeader}>
              <span style={styles.sidebarTitle}>CHATS</span>
              <button onClick={startNewChat} style={styles.newChatBtn}>+ New</button>
            </div>
            <div style={styles.chatList}>
              {loadingChats ? (
                <div style={styles.sidebarMeta}>Loading...</div>
              ) : chats.length === 0 ? (
                <div style={styles.sidebarMeta}>No chats yet</div>
              ) : (
                chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => selectChat(chat)}
                    style={{
                      ...styles.chatItem,
                      ...(chat.id === currentChatId ? styles.chatItemActive : {}),
                    }}
                  >
                    <span style={styles.chatIcon}>💬</span>
                    <span style={styles.chatTitle}>{chat.title || 'Chat'}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Main */}
        <div style={styles.main}>
          {/* Toggle */}
          <button onClick={() => setSidebarOpen(p => !p)} style={styles.toggleBtn}>
            {sidebarOpen ? '◀' : '▶'}
          </button>

          {/* Messages */}
          <div style={styles.messagesArea}>
            {messages.length === 0 && !streamingText ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>🚗</div>
                <h2 style={styles.emptyTitle}>Dhruv Auto World AI</h2>
                <p style={styles.emptyDesc}>
                  Ask anything about second-hand cars in India — budget, maintenance, best picks, comparisons.
                </p>
                <div style={styles.suggestedGrid}>
                  {suggested.map((q) => (
                    <button key={q} onClick={() => { setInput(q); inputRef.current?.focus(); }} style={styles.sugBtn}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={styles.msgList}>
                {messages.map((msg, i) => (
                  <div key={i} style={{ ...styles.msgRow, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    {msg.role === 'assistant' && <div style={styles.botAvatar}>🤖</div>}
                    <div
                      style={msg.role === 'user' ? styles.userBubble : styles.botBubble}
                      dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                    />
                    {msg.role === 'user' && (
                      <div style={styles.userAvatar}>
                        {user?.photoURL
                          ? <img src={user.photoURL} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                          : '👤'}
                      </div>
                    )}
                  </div>
                ))}

                {streamingText && (
                  <div style={{ ...styles.msgRow, justifyContent: 'flex-start' }}>
                    <div style={styles.botAvatar}>🤖</div>
                    <div style={styles.botBubble} dangerouslySetInnerHTML={{ __html: formatMessage(streamingText) }} />
                  </div>
                )}

                {isLoading && !streamingText && (
                  <div style={{ ...styles.msgRow, justifyContent: 'flex-start' }}>
                    <div style={styles.botAvatar}>🤖</div>
                    <div style={styles.dotsWrap}>
                      <span style={styles.dot} />
                      <span style={{ ...styles.dot, animationDelay: '0.2s' }} />
                      <span style={{ ...styles.dot, animationDelay: '0.4s' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div style={styles.inputArea}>
            <div style={styles.inputWrap}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about any car — budget, specs, reliability, best buy..."
                style={styles.textarea}
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                style={{
                  ...styles.sendBtn,
                  opacity: isLoading || !input.trim() ? 0.4 : 1,
                  cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                {isLoading ? '...' : '↑'}
              </button>
            </div>
            <p style={styles.inputHint}>Press Enter to send · Shift+Enter for new line</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dotPulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: { height: '100vh', display: 'flex', flexDirection: 'column', background: '#080808', overflow: 'hidden' },
  layout: { display: 'flex', flex: 1, overflow: 'hidden' },

  sidebar: {
    background: '#0c0c0c',
    borderRight: '1px solid rgba(255,255,255,0.05)',
    transition: 'width 0.25s ease, min-width 0.25s ease',
    flexShrink: 0,
  },
  sidebarInner: { width: 260, height: '100%', display: 'flex', flexDirection: 'column' },
  sidebarHeader: {
    padding: '20px 16px 12px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  sidebarTitle: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 11, fontWeight: 700, letterSpacing: '2px', color: '#3a3a3a',
  },
  newChatBtn: {
    background: '#e53935', color: 'white', border: 'none',
    borderRadius: 6, padding: '5px 12px',
    fontFamily: "'Rajdhani', sans-serif", fontSize: 12, fontWeight: 700,
    cursor: 'pointer', letterSpacing: '0.5px',
  },
  chatList: { flex: 1, overflowY: 'auto', padding: '8px' },
  sidebarMeta: { fontSize: 12, color: '#333', padding: '16px 8px', textAlign: 'center' },
  chatItem: {
    width: '100%', display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 12px', background: 'transparent',
    border: '1px solid transparent', borderRadius: 8,
    cursor: 'pointer', marginBottom: 4, transition: 'all 0.15s',
    textAlign: 'left',
  },
  chatItemActive: {
    background: 'rgba(229,57,53,0.08)',
    border: '1px solid rgba(229,57,53,0.2)',
  },
  chatIcon: { fontSize: 14, flexShrink: 0 },
  chatTitle: {
    fontSize: 13, color: '#888', overflow: 'hidden',
    textOverflow: 'ellipsis', whiteSpace: 'nowrap',
    fontFamily: "'DM Sans', sans-serif",
  },

  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' },

  toggleBtn: {
    position: 'absolute', left: 12, top: 12, zIndex: 10,
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 6, color: '#444', fontSize: 11, padding: '5px 8px',
    cursor: 'pointer', transition: 'all 0.2s',
  },

  messagesArea: { flex: 1, overflowY: 'auto', padding: '60px 0 20px' },

  emptyState: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', height: '100%', padding: '40px 24px', textAlign: 'center',
  },
  emptyIcon: { fontSize: 52, marginBottom: 16 },
  emptyTitle: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 28, fontWeight: 700, color: '#f0f0f0', marginBottom: 8,
  },
  emptyDesc: { fontSize: 14, color: '#555', lineHeight: 1.7, maxWidth: 420, marginBottom: 32 },
  suggestedGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%', maxWidth: 520,
  },
  sugBtn: {
    padding: '12px 16px', background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10,
    color: '#666', fontSize: 13, cursor: 'pointer', textAlign: 'left',
    fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s', lineHeight: 1.4,
  },

  msgList: { padding: '20px 40px', display: 'flex', flexDirection: 'column', gap: 20 },
  msgRow: { display: 'flex', alignItems: 'flex-start', gap: 12 },
  botAvatar: {
    width: 32, height: 32, borderRadius: '50%',
    background: 'rgba(229,57,53,0.1)', border: '1px solid rgba(229,57,53,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, flexShrink: 0,
  },
  userAvatar: {
    width: 32, height: 32, borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, flexShrink: 0, overflow: 'hidden',
  },
  botBubble: {
    maxWidth: '70%', padding: '14px 18px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '4px 16px 16px 16px',
    fontSize: 14, color: '#c0c0c0', lineHeight: 1.7,
    fontFamily: "'DM Sans', sans-serif",
  },
  userBubble: {
    maxWidth: '70%', padding: '14px 18px',
    background: 'rgba(229,57,53,0.12)', border: '1px solid rgba(229,57,53,0.2)',
    borderRadius: '16px 4px 16px 16px',
    fontSize: 14, color: '#e0e0e0', lineHeight: 1.7,
    fontFamily: "'DM Sans', sans-serif",
  },
  dotsWrap: {
    display: 'flex', gap: 6, padding: '16px 18px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '4px 16px 16px 16px', alignItems: 'center',
  },
  dot: {
    width: 8, height: 8, borderRadius: '50%', background: '#e53935',
    display: 'inline-block',
    animation: 'dotPulse 1.2s ease-in-out infinite',
  },

  inputArea: {
    padding: '16px 40px 20px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(8,8,8,0.95)',
  },
  inputWrap: {
    display: 'flex', alignItems: 'flex-end', gap: 12,
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 14, padding: '12px 12px 12px 18px',
  },
  textarea: {
    flex: 1, background: 'transparent', border: 'none', outline: 'none',
    color: '#e0e0e0', fontSize: 14, fontFamily: "'DM Sans', sans-serif",
    resize: 'none', lineHeight: 1.6, maxHeight: 160, overflowY: 'auto',
  },
  sendBtn: {
    width: 36, height: 36, borderRadius: 8, background: '#e53935',
    border: 'none', color: 'white', fontSize: 18, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, transition: 'all 0.2s',
  },
  inputHint: {
    fontSize: 11, color: '#2a2a2a', textAlign: 'center', marginTop: 8,
    fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.5px',
  },
};
