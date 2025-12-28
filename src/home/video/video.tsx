import { motion } from "framer-motion";
import { useTheme } from "../../../utils/theme";
import { type Video } from "../../types/video";
import { use, useEffect, useState } from "react";

export type VideoProps = {
    videoData?: Video[];
};

export default function Video(props: VideoProps) {
    const { theme } = useTheme();

    const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

    useEffect(() => {
        document.title = "บทเรียนวิดีโอ - Crochet Class";
        setCurrentVideo(props.videoData ? props.videoData[0] : null);
    }, []);

    function handleLessonClick(lesson: Video) {
        if (currentVideo?.id === lesson.id) return;

        setCurrentVideo(lesson);
    }

    return (
        <div data-theme={theme} className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 pb-24">
            {/* Header */}
            <header className="py-6 text-center">
                <h1 className="text-2xl font-bold text-[var(--primary)]">บทเรียนวิดีโอ</h1>
                <p className="text-sm opacity-70">สอนถักโครเชต์แบบทีละขั้นตอน</p>
            </header>

            {/* Video Player */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden bg-black shadow-lg"
            >
                <video
                    controls
                    className="w-full aspect-[16/9]"
                    poster="https://images.unsplash.com/photo-1582582494700-4f98e9f7d9b3"
                >
                    <source src="/videos/crochet-basic.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </motion.div>

            {/* Lesson Info */}
            <section className="max-w-3xl mx-auto mt-6 rounded-2xl bg-[var(--card)] p-6 shadow">
                <h2 className="text-lg font-semibold text-[var(--primary)] mb-2">{currentVideo?.lessonTitle}</h2>
                <p className="text-sm opacity-80 mb-4">
                    {currentVideo?.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">⏱ {currentVideo?.durationText}</span>
                </div>
            </section>

            {/* Lesson List */}
            <section className="max-w-3xl mx-auto mt-6">
                <h3 className="font-semibold mb-3">บทเรียนอื่น ๆ</h3>
                <div className="space-y-3">
                    {props.videoData?.map((lesson) => {
                        const active = currentVideo?.id === lesson.id;
                        return (
                            <motion.button
                                key={lesson.lessonTitle}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.96 }}
                                className={`w-full flex justify-between items-center rounded-xl px-4 py-3 shadow transition border hover:cursor-pointer
                                    ${active ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                                        : 'bg-[var(--card)] border-[var(--border)] hover:bg-[var(--hover)]'}`}
                                onClick={() => handleLessonClick(lesson)}
                            >
                                <span>{lesson.lessonTitle}</span>
                                <span className={`text-sm ${active ? 'opacity-90' : 'text-[var(--primary)]'}`}>
                                    {active ? 'กำลังดู' : 'ดูวิดีโอ →'}
                                </span>
                            </motion.button>
                        )
                    })}
                </div>
            </section>

            {/* Bottom Nav (Mobile) */}
            <nav className="fixed bottom-0 left-0 right-0 bg-[var(--card)] border-t border-[var(--border)] sm:hidden">
                <div className="flex justify-around py-2 text-sm">
                    <button className="opacity-70">หน้าแรก</button>
                    <button className="opacity-70">ตารางเรียน</button>
                </div>
            </nav>
        </div>
    );
}