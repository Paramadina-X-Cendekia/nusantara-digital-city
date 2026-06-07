import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import axios from 'axios';
export default function SenaAiPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Halo! Saya Sena, panduan AI untuk Sinergi Nusa. Ada yang bisa saya bantu hari ini?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSaran, setShowSaran] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragConstraints, setDragConstraints] = useState({ top: 0, left: 0, right: 0, bottom: 0 });
    const messagesEndRef = useRef(null);

    // Load initial position from localStorage
    const initialPosition = (() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('senaPosition');
            return saved ? JSON.parse(saved) : { x: 0, y: 0 };
        }
        return { x: 0, y: 0 };
    })();

    const [isOnLeftSide, setIsOnLeftSide] = useState(() => {
        if (typeof window !== 'undefined') {
            return initialPosition.x < -(window.innerWidth / 2);
        }
        return false;
    });

    const x = useMotionValue(initialPosition.x);
    const y = useMotionValue(initialPosition.y);

    const templates = [
        "Apa itu Sinergi Nusa?",
        "Bagaimana cara daftar kontribusi?",
        "Di mana saya bisa melihat wisata?",
        "Apa itu leaderboard?"
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Update drag constraints dynamically on resize
    useEffect(() => {
        const updateConstraints = () => {
            setDragConstraints({
                left: -(window.innerWidth - 100),
                top: -(window.innerHeight - 100),
                right: 0,
                bottom: 0
            });
        };
        updateConstraints();
        window.addEventListener('resize', updateConstraints);
        return () => window.removeEventListener('resize', updateConstraints);
    }, []);

    // === FIX: Snap Y ke 0 setiap kali popup dibuka ===
    useEffect(() => {
        if (isOpen) {
            animate(y, 0, { type: "spring", stiffness: 300, damping: 30 });
            // Update localStorage agar Y tersimpan sebagai 0
            const currentX = x.get();
            localStorage.setItem('senaPosition', JSON.stringify({ x: currentX, y: 0 }));
        }
    }, [isOpen]);

    const handleSend = async (text) => {
        if (!text.trim()) return;

        const userMessage = { role: 'user', content: text };
        const newMessages = [...messages, userMessage];
        
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);
        setShowSaran(false);

        try {
            const history = newMessages.slice(-10).map(m => ({
                role: m.role,
                content: m.content
            }));
            
            const response = await axios.post('/ask-sena', { messages: history });
            
            if (response.data && response.data.reply) {
                setMessages([...newMessages, { role: 'assistant', content: response.data.reply }]);
            }
        } catch (error) {
            console.error("Kesalahan API Sena:", error);
            setMessages([...newMessages, { role: 'assistant', content: 'Maaf, sepertinya koneksi saya sedang terputus. Silakan coba lagi.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(input);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        style={{ x, y }}
                        className="relative w-20 flex justify-center pointer-events-none z-40"
                    >
                        <motion.div
                            onPointerDownCapture={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className={`absolute bottom-4 ${isOnLeftSide ? 'left-0 origin-bottom-left' : 'right-0 origin-bottom-right'} bg-white dark:bg-slate-900 w-[350px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[80vh] flex flex-col rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden pointer-events-auto`}
                        >
                            {/* Header */}
                            <div className="bg-primary px-5 py-4 flex items-center justify-between text-white shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-transparent flex items-center justify-center shrink-0 overflow-visible">
                                        <img src="/images/sena%20pose%20buku.webp" alt="Sena" className="w-full h-full object-contain drop-shadow-[0_0_5px_rgba(59,130,246,0.5)] select-none pointer-events-none" draggable="false" onDragStart={(e) => e.preventDefault()}
                                             onError={(e) => { e.target.outerHTML = '<span class="material-symbols-outlined text-2xl text-white">auto_awesome</span>'; }} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg leading-tight">Sena AI</h3>
                                        <p className="text-xs text-white/80 font-medium">Asisten Sinergi Nusa</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                            </div>

                            {/* Chat Body */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50 custom-scrollbar">
                                {messages.map((msg, idx) => (
                                    <motion.div 
                                        key={idx}
                                        initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
                                            msg.role === 'user' 
                                                ? 'bg-primary text-white rounded-br-none shadow-md shadow-primary/20' 
                                                : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-bl-none shadow-sm'
                                        }`}>
                                            <div className="whitespace-pre-wrap font-medium leading-relaxed" style={{ wordBreak: 'break-word' }}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                
                                {isLoading && (
                                    <motion.div 
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="flex justify-start"
                                    >
                                        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1.5">
                                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Templates Section */}
                            <AnimatePresence>
                                {showSaran && !isLoading && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="px-4 pb-2 bg-slate-50 dark:bg-slate-950/50 shrink-0 overflow-hidden"
                                    >
                                        <div className="flex items-center justify-between mb-2 pl-1">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Saran Pertanyaan:</p>
                                            <button onClick={() => setShowSaran(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                                <span className="material-symbols-outlined text-sm">close</span>
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {templates.map((tpl, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleSend(tpl)}
                                                    className="px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary text-slate-600 dark:text-slate-300 hover:text-primary rounded-full transition-colors truncate max-w-full text-left"
                                                >
                                                    {tpl}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Input Area */}
                            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">
                                <div className="flex items-end gap-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all p-1.5 pl-2 relative">
                                    <button 
                                        onClick={() => setShowSaran(!showSaran)} 
                                        title="Tampilkan saran pertanyaan"
                                        className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-xl transition-colors mb-0.5 ${showSaran ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-primary hover:bg-slate-200 dark:hover:bg-slate-800'}`}
                                    >
                                        <span className="material-symbols-outlined text-xl">lightbulb</span>
                                    </button>
                                    <textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Tanya Sena..."
                                        className="flex-1 max-h-[100px] bg-transparent border-none focus:ring-0 text-sm py-2.5 resize-none text-slate-700 dark:text-slate-200"
                                        rows="1"
                                        style={{ minHeight: '40px' }}
                                    />
                                    <button
                                        onClick={() => handleSend(input)}
                                        disabled={!input.trim() || isLoading}
                                        className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary transition-colors my-auto"
                                    >
                                        <span className="material-symbols-outlined text-lg">send</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Action Button */}
            <motion.button
                style={{ x, y, touchAction: "none" }}
                drag
                dragConstraints={dragConstraints}
                dragElastic={0.15}
                dragMomentum={false}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(e, info) => {
                    setTimeout(() => setIsDragging(false), 150);
                    
                    const currentX = x.get();
                    const currentY = y.get();
                    const halfWidth = window.innerWidth / 2;
                    let targetX = currentX;

                    if (currentX < -halfWidth) {
                        targetX = -(window.innerWidth - 110);
                        setIsOnLeftSide(true);
                    } else {
                        targetX = 0;
                        setIsOnLeftSide(false);
                    }

                    // === FIX: Jika popup terbuka, selalu kembalikan Y ke 0 ===
                    const targetY = isOpen ? 0 : currentY;

                    animate(x, targetX, { type: "spring", bounce: 0.4, duration: 0.6 });
                    animate(y, targetY, { type: "spring", stiffness: 300, damping: 30 });
                    localStorage.setItem('senaPosition', JSON.stringify({ x: targetX, y: targetY }));
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                whileDrag={{ scale: 1.05, cursor: "grabbing" }}
                onClick={() => {
                    if (!isDragging) setIsOpen(!isOpen);
                }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="group w-20 h-20 bg-transparent flex items-center justify-center relative overflow-visible cursor-grab pointer-events-auto"
            >
                {/* Tooltip Chat Bubble */}
                <AnimatePresence>
                    {isHovered && !isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.9 }}
                            className={`absolute bottom-full mb-2 w-56 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 pointer-events-none z-50 ${isOnLeftSide ? 'left-4 rounded-bl-none origin-bottom-left' : 'right-4 rounded-br-none origin-bottom-right'}`}
                        >
                            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 break-words leading-relaxed">
                                {"Aku Sena, panduan AI. Ada yang bisa kubantu?".split("").map((char, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.1, delay: index * 0.03 }}
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="absolute top-0 right-2 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse z-20 shadow-md"></div>
                
                {/* Gambar Default (Sena Pose Buku) */}
                <img src="/images/sena%20pose%20buku.webp" alt="Sena" draggable="false" onDragStart={(e) => e.preventDefault()}
                     className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-opacity duration-500 group-hover:opacity-0 z-10 select-none pointer-events-none" 
                     onError={(e) => { e.target.outerHTML = '<div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-primary text-white shadow-xl"><span class="material-symbols-outlined text-3xl">chat_bubble</span></div>'; }} />
                     
                {/* Gambar Hover (Sena Pose Menunjuk) */}
                <img src="/images/sena%20pose%20menunjuk.webp" alt="Sena Menunjuk" draggable="false" onDragStart={(e) => e.preventDefault()}
                     className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 select-none pointer-events-none" />
            </motion.button>
        </div>
    );
}
