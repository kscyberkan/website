import './home.css';
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme, type Theme } from "../../utils/theme";
import auth from '../auth/function';
import { pageFunction } from '../page_manager';

// TODO: Remove
import { type VideoProps } from './video/video';

const videos: VideoProps = {
  videoData: [
    {
      id: 1,
      lessonTitle: "การขึ้นห่วง",
      videoSrc: "/videos/crochet-basic.mp4",
      posterSrc: "https://images.unsplash.com/photo-1582582494700-4f98e9f7d9b3",
      durationText: "15 นาที",
      description: "เรียนรู้การขึ้นห่วงโครเชต์อย่างถูกต้อง"
    },
    {
      id: 2,
      lessonTitle: "ลายโซ่",
      videoSrc: "/videos/crochet-basic.mp4",
      posterSrc: "https://images.unsplash.com/photo-1582582494700-4f98e9f7d9b3",
      durationText: "20 นาที",
      description: "ฝึกถักลายโซ่พื้นฐาน"
    },
    {
      id: 3,
      lessonTitle: "ลายถักแน่น",
      videoSrc: "/videos/crochet-basic.mp4",
      posterSrc: "https://images.unsplash.com/photo-1582582494700-4f98e9f7d9b3",
      durationText: "30 นาที",
      description: "เรียนรู้ลายถักแน่นสำหรับโปรเจกต์ต่างๆ"
    }
  ]
};

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    auth.removeLoginData();
  }

  return (
    <div data-theme={theme} className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-[var(--card)] shadow-sm">
        <h1 className="text-xl font-bold text-[var(--primary)]">Crochet Class</h1>

        <div className="relative">
          <button onClick={() => setOpen(!open)} className="flex items-center gap-3">
            <span className="text-sm opacity-80">ผู้เรียน</span>
            <img src="https://i.pravatar.cc/40" className="w-9 h-9 rounded-full hover:cursor-pointer" />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}       // เริ่มต้น: ซ่อน + ขยับขึ้นเล็กน้อย
                animate={{ opacity: 1, y: 0 }}        // แสดงเต็ม
                exit={{ opacity: 0, y: -10 }}         // ปิด: ซ่อน + ขยับขึ้น
                transition={{ duration: 0.1 }}        // ความเร็ว animation
                className="absolute right-0 mt-3 w-56 rounded-xl bg-[var(--card)] shadow-lg border border-[var(--border)] overflow-hidden z-50"
              >
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--hover)]">แก้ไขโปรไฟล์</button>

                <div className="px-4 py-3">
                  <p className="text-xs mb-2 opacity-60">Theme</p>
                  <div className="flex flex-wrap gap-2">
                    {['pink', 'blue', 'green', 'dark', 'light'].map(t => (
                      <button
                        key={t}
                        onClick={() => setTheme(t as Theme)}
                        className="px-2 py-1 text-xs rounded-lg border border-[var(--border)] hover:bg-[var(--hover)] hover:cursor-pointer"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="border-[var(--border)]" />
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-200 hover:cursor-pointer"
                >
                  ออกจากระบบ
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl p-8 bg-[var(--hero)]"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-[var(--primary)]">
            ยินดีต้อนรับสู่คลาสถักโครเชต์ 🧶
          </h2>
          <p className="opacity-80 mb-4">เรียนรู้ สร้างสรรค์ และสนุกไปกับงานฝีมือ</p>
          <button onClick={() => pageFunction.setPageState({ page: 'time_table' })} className="rounded-xl bg-[var(--primary)] px-6 py-3 text-white font-semibold">ดูตารางเรียน</button>
        </motion.div>
      </section>

      {/* Courses */}
      <section className="px-6">
        <h3 className="text-lg font-semibold mb-4">คอร์สของคุณ</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {["พื้นฐานโครเชต์", "ถักกระเป๋า", "ถักตุ๊กตา"].map(course => (
            <motion.div
              key={course}
              whileHover={{ scale: 1.03 }}
              className="rounded-2xl bg-[var(--card)] p-5 shadow"
            >
              <h4 className="font-semibold text-[var(--primary)] mb-2">{course}</h4>
              <p className="text-sm opacity-70 mb-3">เรียนรู้ทีละขั้นตอน พร้อมวิดีโอ</p>
              <button onClick={() => pageFunction.setPageState({ page: 'home_video', props: videos })} className="text-sm text-[var(--primary)] hover:underline hover:cursor-pointer">เข้าบทเรียน →</button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Schedule */}
      <section className="px-6 py-10">
        <h3 className="text-lg font-semibold mb-4">ตารางเรียนวันนี้</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center rounded-xl bg-[var(--card)] p-4 shadow">
            <div>
              <p className="font-medium text-[var(--primary)]">พื้นฐานโครเชต์</p>
              <p className="text-sm opacity-70">10:00 - 11:30</p>
            </div>
            <button className="text-sm text-[var(--primary)] hover:underline">เข้าคลาส</button>
          </div>
        </div>
      </section>

      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[var(--card)] border-t border-[var(--border)] sm:hidden">
        <div className="flex justify-around py-2 text-sm">
          <button className="text-[var(--primary)] font-medium">หน้าแรก</button>
          <button className="opacity-70">ตารางเรียน</button>
        </div>
      </nav>
    </div>
  );
}
