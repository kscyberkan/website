import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./utils/theme";
import { Play, ChevronRight, CheckCircle2, Clock, BookOpen, Lock } from "lucide-react";
import { type Course } from "./types/video";
import { goTo } from "./page_manager";
import { useState } from "react";

// ── Mock data ────────────────────────────────────────────────────────────────

const mockCourses: Course[] = [
    {
        id: 1,
        title: "React & TypeScript",
        description: "เรียนรู้การสร้าง Web App สมัยใหม่ด้วย React 19 และ TypeScript แบบ Production-Ready",
        instructorName: "ZNOX Master",
        episodes: [
            { id: 101, title: "ติดตั้ง & Setup Project", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", posterSrc: "", durationText: "12:30", description: "ติดตั้ง Vite + React + TypeScript และ Config ESLint", category: "React", isCompleted: true },
            { id: 102, title: "JSX & Component พื้นฐาน", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", posterSrc: "", durationText: "18:45", description: "เขียน Component แรกและเข้าใจ JSX อย่างลึกซึ้ง", category: "React", isCompleted: true },
            { id: 103, title: "useState & useEffect", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", posterSrc: "", durationText: "24:10", description: "จัดการ State และ Side Effects ใน Functional Component", category: "React", isCompleted: false },
            { id: 104, title: "Custom Hooks & Context", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", posterSrc: "", durationText: "31:05", description: "สร้าง Hooks ของตัวเองและแชร์ State ด้วย Context API", category: "React", isCompleted: false },
        ],
    },
    {
        id: 2,
        title: "Tailwind CSS Pro",
        description: "ออกแบบ UI สวยงามอย่างรวดเร็วด้วย Tailwind CSS v4 ตั้งแต่พื้นฐานจนถึง Animation",
        instructorName: "ZNOX Master",
        episodes: [
            { id: 201, title: "Utility-First คืออะไร?", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", posterSrc: "", durationText: "09:20", description: "แนวคิดเบื้องหลัง Tailwind และทำไมถึงต่างจาก Bootstrap", category: "Design", isCompleted: true },
            { id: 202, title: "Layout ด้วย Flex & Grid", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", posterSrc: "", durationText: "22:15", description: "จัดวาง Layout ซับซ้อนด้วย Flexbox และ CSS Grid", category: "Design", isCompleted: false },
            { id: 203, title: "Dark Mode & Theming", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", posterSrc: "", durationText: "16:40", description: "สร้างระบบ Theme ที่ Switch ได้ง่ายด้วย CSS Variables", category: "Design", isCompleted: false },
            { id: 204, title: "Animation & Transition", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", posterSrc: "", durationText: "19:55", description: "ใส่ชีวิตให้ UI ด้วย Tailwind Animate และ Custom Keyframes", category: "Design", isCompleted: false },
        ],
    },
    {
        id: 3,
        title: "Bun & Backend API",
        description: "สร้าง REST API ความเร็วสูงด้วย Bun Runtime ตั้งแต่ Route จนถึง Deploy",
        instructorName: "ZNOX Master",
        episodes: [
            { id: 301, title: "ทำความรู้จัก Bun Runtime", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", posterSrc: "", durationText: "11:00", description: "Bun คืออะไร เร็วกว่า Node ยังไง และ Install อย่างไร", category: "Backend", isCompleted: false },
            { id: 302, title: "สร้าง HTTP Server", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", posterSrc: "", durationText: "20:30", description: "สร้าง Server ด้วย Bun.serve() และจัดการ Routes", category: "Backend", isCompleted: false },
            { id: 303, title: "SQLite & Bun Database", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", posterSrc: "", durationText: "28:15", description: "เชื่อมต่อ SQLite ด้วย bun:sqlite และทำ CRUD", category: "Backend", isCompleted: false },
            { id: 304, title: "Auth & JWT", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", posterSrc: "", durationText: "35:50", description: "ระบบ Login ด้วย JWT Token และ Middleware", category: "Backend", isCompleted: false },
        ],
    },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function EpisodeList({ course, onClose, onEpisodeComplete }: { course: Course; onClose: () => void; onEpisodeComplete: (id: number) => void }) {
    const completedCount = course.episodes.filter(e => e.isCompleted).length;
    const progress = Math.round((completedCount / course.episodes.length) * 100);

    return (
        <motion.div
            key="episode-list"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
        >
            {/* Back header */}
            <button
                onClick={onClose}
                className="flex items-center gap-2 text-sm opacity-50 hover:opacity-100 transition mb-5 cursor-pointer"
            >
                <ChevronRight size={15} className="rotate-180" />
                กลับหน้าหลัก
            </button>

            {/* Course header */}
            <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">{course.instructorName}</p>
                <h2 className="text-2xl font-black">{course.title}</h2>
                <p className="text-sm opacity-55 mt-1 leading-relaxed">{course.description}</p>

                {/* Progress */}
                <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="h-full rounded-full bg-[var(--primary)]"
                        />
                    </div>
                    <span className="text-xs font-bold text-[var(--primary)] w-10 text-right">{progress}%</span>
                </div>
            </div>

            {/* Episode list */}
            <div className="flex flex-col gap-2">
                {course.episodes.map((ep, i) => (
                    <motion.div
                        key={ep.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * i, duration: 0.3 }}
                        onClick={() => goTo.video({ videoData: course.episodes, onEpisodeComplete })}
                        className="group flex items-center gap-4 bg-[var(--card)] rounded-xl px-4 py-3.5 border border-[var(--border)] cursor-pointer hover:border-[var(--primary)] transition-all"
                    >
                        {/* Index / check */}
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black transition-transform group-hover:scale-110"
                            style={{ background: `color-mix(in srgb, var(--primary) 14%, transparent)` }}
                        >
                            {ep.isCompleted
                                ? <CheckCircle2 size={16} className="text-[var(--primary)]" />
                                : <span className="text-[var(--primary)]">{i + 1}</span>
                            }
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className={`font-semibold text-sm truncate ${ep.isCompleted ? "opacity-50" : ""}`}>{ep.title}</p>
                            <p className="text-xs opacity-40 flex items-center gap-1 mt-0.5">
                                <Clock size={11} />
                                {ep.durationText}
                            </p>
                        </div>

                        <ChevronRight size={15} className="opacity-25 group-hover:opacity-70 flex-shrink-0 transition-opacity" />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

// ── Course card colors ────────────────────────────────────────────────────────

const CARD_ACCENTS = [
    { icon: "⚛️", label: "Frontend" },
    { icon: "🎨", label: "Design" },
    { icon: "⚡", label: "Backend" },
];

// ── Main Home Page ────────────────────────────────────────────────────────────

type HomeProps = {
    courses?: Course[];
};

export default function HomePage({ courses: initialCourses = mockCourses }: HomeProps) {
    const { theme } = useTheme();
    const [courses, setCourses] = useState<Course[]>(initialCourses);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    const markComplete = (episodeId: number) => {
        setCourses(prev => prev.map(course => ({
            ...course,
            episodes: course.episodes.map(ep =>
                ep.id === episodeId ? { ...ep, isCompleted: true } : ep
            ),
        })));
        // sync selectedCourse ด้วยถ้ากำลัง drill-down อยู่
        setSelectedCourse(prev => prev ? {
            ...prev,
            episodes: prev.episodes.map(ep =>
                ep.id === episodeId ? { ...ep, isCompleted: true } : ep
            ),
        } : null);
    };

    const totalEpisodes = courses.reduce((s, c) => s + c.episodes.length, 0);
    const completedEpisodes = courses.reduce((s, c) => s + c.episodes.filter(e => e.isCompleted).length, 0);
    const overallProgress = totalEpisodes > 0 ? Math.round((completedEpisodes / totalEpisodes) * 100) : 0;

    return (
        <div
            data-theme={theme}
            className="min-h-screen bg-[var(--bg)] text-[var(--text)] relative overflow-hidden"
        >
            {/* bg glow */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse 80% 50% at 50% -5%, color-mix(in srgb, var(--primary) 15%, transparent), transparent)` }}
            />

            <div className="relative max-w-2xl mx-auto px-5 py-12 min-h-screen flex flex-col">

                <AnimatePresence mode="wait">
                    {selectedCourse ? (
                        <EpisodeList
                            key={selectedCourse.id}
                            course={selectedCourse}
                            onClose={() => setSelectedCourse(null)}
                            onEpisodeComplete={markComplete}
                        />
                    ) : (
                        <motion.div
                            key="home"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="flex flex-col gap-8 flex-1"
                        >
                            {/* Header */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.45 }}
                            >
                                <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
                                    <span className="text-[var(--primary)]">ZNOX</span>
                                </h1>
                                <p className="text-base opacity-50 mt-1">เลือกหลักสูตรที่ต้องการเรียน</p>
                            </motion.div>

                            {/* Overall progress */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.45, delay: 0.08 }}
                                className="bg-[var(--card)] rounded-2xl p-5 border border-[var(--border)]"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <BookOpen size={15} className="text-[var(--primary)]" />
                                        <span className="text-sm font-semibold">ความคืบหน้าทั้งหมด</span>
                                    </div>
                                    <span className="text-sm font-black text-[var(--primary)]">{completedEpisodes}/{totalEpisodes} บท</span>
                                </div>
                                <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${overallProgress}%` }}
                                        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                                        className="h-full rounded-full bg-[var(--primary)]"
                                    />
                                </div>
                                <p className="text-xs opacity-40 mt-2">{overallProgress}% สำเร็จแล้ว</p>
                            </motion.div>

                            {/* Course cards */}
                            <div className="flex flex-col gap-3">
                                <p className="text-xs font-bold uppercase tracking-widest opacity-35">หลักสูตร</p>
                                {courses.map((course, i) => {
                                    const completed = course.episodes.filter(e => e.isCompleted).length;
                                    const total = course.episodes.length;
                                    const pct = Math.round((completed / total) * 100);
                                    const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];
                                    const isStarted = completed > 0;

                                    return (
                                        <motion.div
                                            key={course.id}
                                            initial={{ opacity: 0, y: 18 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: 0.12 + i * 0.09 }}
                                            onClick={() => setSelectedCourse(course)}
                                            className="group bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 cursor-pointer hover:border-[var(--primary)] transition-all"
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Icon */}
                                                <div
                                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform group-hover:scale-105"
                                                    style={{ background: `color-mix(in srgb, var(--primary) 12%, transparent)` }}
                                                >
                                                    {accent.icon}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <h3 className="font-black text-base leading-tight">{course.title}</h3>
                                                        <ChevronRight
                                                            size={16}
                                                            className="opacity-25 group-hover:opacity-80 group-hover:translate-x-0.5 flex-shrink-0 transition-all"
                                                        />
                                                    </div>
                                                    <p className="text-xs opacity-50 mt-0.5 line-clamp-2 leading-relaxed">{course.description}</p>

                                                    {/* Episode count & status */}
                                                    <div className="flex items-center gap-3 mt-3">
                                                        <span className="text-xs opacity-40">{total} บท</span>
                                                        {isStarted ? (
                                                            <>
                                                                <span className="w-1 h-1 rounded-full bg-current opacity-20" />
                                                                <span
                                                                    className="text-xs font-semibold"
                                                                    style={{ color: `var(--primary)` }}
                                                                >
                                                                    เรียนอยู่ {pct}%
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="w-1 h-1 rounded-full bg-current opacity-20" />
                                                                <span className="text-xs opacity-35 flex items-center gap-1">
                                                                    <Lock size={10} /> ยังไม่เริ่ม
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Progress bar */}
                                                    {isStarted && (
                                                        <div className="mt-3 h-1 bg-[var(--border)] rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${pct}%` }}
                                                                transition={{ duration: 0.7, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                                                                className="h-full rounded-full bg-[var(--primary)]"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Spacer */}
                            <div className="flex-1" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
