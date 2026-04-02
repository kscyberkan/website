import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X } from 'lucide-react';
import { useTheme, type Theme } from '../utils/theme';

// ข้อมูลสีที่จะแสดงในถาด (อิงจากที่เรากำหนดไว้ใน global.css)
const themeOptions: { id: Theme; color: string }[] = [
    { id: 'pink', color: '#ec4899' },
    { id: 'blue', color: '#0284c7' },
    { id: 'green', color: '#10b981' },
    { id: 'dark', color: '#1e293b' },
    { id: 'light', color: '#f8fafc' },
];

export default function ThemeSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const { theme: currentTheme, setTheme } = useTheme();

    return (
        <div className="fixed bottom-6 right-6 z-[999] flex flex-col-reverse items-center gap-3">
            {/* 1. ปุ่มหลัก (สลับเปิด/ปิดถาด) */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 rounded-full bg-[var(--primary)] text-white shadow-lg flex items-center justify-center focus:outline-none border-2 border-[var(--bg)]"
            >
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {isOpen ? <X size={28} /> : <Palette size={28} />}
                </motion.div>
            </motion.button>

            {/* 2. ถาดตัวเลือกธีม (เลื่อนขึ้นด้านบน) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-3 bg-[var(--card)] p-3 rounded-full shadow-2xl border border-[var(--border)] backdrop-blur-sm bg-opacity-80"
                    >
                        {themeOptions.map((t, index) => (
                            <motion.button
                                key={t.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }} // ทำให้ปุ่มทยอยเด้งออกมา
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                    setTheme(t.id);
                                    setIsOpen(false); // ปิดถาดหลังจากเลือกเสร็จ
                                }}
                                className={`w-10 h-10 rounded-full border-2 transition-all shadow-sm ${
                                    currentTheme === t.id 
                                        ? 'border-[var(--primary)] scale-110 shadow-[var(--primary-glow)]' 
                                        : 'border-transparent hover:border-gray-300'
                                }`}
                                style={{ backgroundColor: t.color }}
                                title={`Switch to ${t.id} theme`}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}