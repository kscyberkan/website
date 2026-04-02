import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./utils/theme";
import { type Video } from "./types/video";
import { useEffect, useState, useRef } from "react";
import {
    Play, Pause, Maximize, Minimize, Settings,
    Check, ChevronRight, Gauge, MonitorPlay,
    Volume2, Volume1, VolumeX, ListVideo
} from "lucide-react";
import { goTo } from "./page_manager";

export default function Video(props: { videoData?: Video[], onEpisodeComplete?: (id: number) => void }) {
    const { theme } = useTheme();
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>(0);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);

    // Volume States
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [prevVolume, setPrevVolume] = useState(1);

    // Settings States
    const [showSettings, setShowSettings] = useState(false);
    const [settingMode, setSettingMode] = useState<"main" | "quality" | "speed">("main");
    const [quality, setQuality] = useState("720p");
    const [speed, setSpeed] = useState(1);

    const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 4];
    const qualities = ["1080p", "720p", "480p", "360p"];

    // ✅ track completed episodes locally (seed จาก props)
    const [completedIds, setCompletedIds] = useState<Set<number>>(
        () => new Set(props.videoData?.filter(v => v.isCompleted).map(v => v.id) ?? [])
    );

    const handleEnded = () => {
        if (!currentVideo) return;
        setCompletedIds(prev => {
            if (prev.has(currentVideo.id)) return prev;
            const next = new Set(prev);
            next.add(currentVideo.id);
            return next;
        });
        props.onEpisodeComplete?.(currentVideo.id);
        setIsPlaying(false);
    };

    useEffect(() => {
        if (props.videoData?.length && !currentVideo) {
            const firstVideo = props.videoData[0];
            if (firstVideo) {
                setCurrentVideo(firstVideo);
            }
        }

        const handleFsChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
            if (!document.fullscreenElement) setShowControls(true);
        };
        document.addEventListener("fullscreenchange", handleFsChange);
        document.addEventListener("webkitfullscreenchange", handleFsChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFsChange);
            document.removeEventListener("webkitfullscreenchange", handleFsChange);
        };
    }, [props.videoData]);

    const updateProgress = () => {
        if (videoRef.current) {
            setProgress(videoRef.current.currentTime);
            requestRef.current = requestAnimationFrame(updateProgress);
        }
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(updateProgress);
        return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
    }, []);

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        if (isPlaying && !showSettings) {
            controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
        }
    };

    const handleVolumeChange = (val: number) => {
        setVolume(val);
        if (videoRef.current) {
            videoRef.current.volume = val;
            videoRef.current.muted = val === 0;
        }
        setIsMuted(val === 0);
    };

    const toggleMute = () => {
        if (isMuted) handleVolumeChange(prevVolume || 0.5);
        else { setPrevVolume(volume); handleVolumeChange(0); }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) containerRef.current?.requestFullscreen().catch(console.error);
        else document.exitFullscreen();
    };

    const changeVideo = (video: Video) => {
        setCurrentVideo(video);
        setIsPlaying(false);
        setProgress(0);
        if (videoRef.current) {
            videoRef.current.load();
            setTimeout(() => {
                videoRef.current?.play();
                setIsPlaying(true);
            }, 100);
        }
    };

    const formatTimeFull = (time: number) => {
        if (isNaN(time)) return "00:00.000";
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        const ms = Math.floor((time % 1) * 1000);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
    };

    return (
        <motion.div data-theme={theme} className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 pb-24 font-sans">
            <style>{`
                .custom-scroll::-webkit-scrollbar { width: 4px; }
                .custom-scroll::-webkit-scrollbar-track { background: transparent; }
                .custom-scroll::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 10px; }
            `}</style>

            <div className="max-w-[800px] mx-auto">
                {!isFullscreen && (
                    <header className="py-6 flex items-center justify-between">
                        <h1 className="text-xl font-black text-[var(--primary)] italic tracking-tighter uppercase">ZNOX PRO</h1>
                        <button
                            onClick={() => goTo.home()}
                            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] opacity-70 hover:opacity-100 hover:border-[var(--primary)] transition cursor-pointer"
                        >
                            ← หน้าหลัก
                        </button>
                    </header>
                )}

                <section
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    style={{ cursor: showControls ? "default" : "none" }}
                    className={`relative overflow-hidden bg-black transition-all duration-300 shadow-2xl
                    ${isFullscreen ? "fixed inset-0 z-[9999] rounded-none border-none w-screen h-screen" : "rounded-[2.5rem] border border-[var(--border)] aspect-video"}`}
                >
                    <video
                        ref={videoRef} src={currentVideo?.videoSrc}
                        className="w-full h-full object-contain cursor-pointer"
                        onClick={togglePlay}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onEnded={handleEnded}
                    />

                    {/* Play Overlay */}
                    <AnimatePresence>
                        {(!isPlaying || showControls) && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                onClick={togglePlay}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 z-10 shadow-2xl cursor-pointer hover:bg-black/40 transition-colors"
                            >
                                {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" />}
                            </motion.button>
                        )}
                    </AnimatePresence>

                    {/* ✅ Settings Menu (Speed & Quality กลับมาแล้ว) */}
                    <AnimatePresence>
                        {showSettings && showControls && (
                            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-24 right-8 bg-black/85 backdrop-blur-2xl border border-white/10 rounded-[2.2rem] p-3 z-30 min-w-[220px] text-white shadow-2xl overflow-hidden">
                                <AnimatePresence mode="wait">
                                    {settingMode === "main" ? (
                                        <motion.div key="main" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="flex flex-col gap-1">
                                            <p className="text-[10px] opacity-40 font-bold px-3 py-1 uppercase tracking-widest text-center">Settings</p>
                                            <button onClick={() => setSettingMode("speed")} className="flex items-center justify-between p-3 hover:bg-white/10 rounded-2xl transition-all cursor-pointer">
                                                <div className="flex items-center gap-3 text-sm"><Gauge size={18} /> Speed</div>
                                                <span className="opacity-50 text-xs flex items-center">{speed === 1 ? "Normal" : `${speed}x`} <ChevronRight size={14} /></span>
                                            </button>
                                            <button onClick={() => setSettingMode("quality")} className="flex items-center justify-between p-3 hover:bg-white/10 rounded-2xl transition-all cursor-pointer">
                                                <div className="flex items-center gap-3 text-sm"><MonitorPlay size={18} /> Quality</div>
                                                <span className="opacity-50 text-xs flex items-center">{quality} <ChevronRight size={14} /></span>
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="sub" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }} className="flex flex-col">
                                            <button onClick={() => setSettingMode("main")} className="p-2 text-[10px] font-bold opacity-40 uppercase tracking-widest hover:opacity-100 flex items-center gap-2 mb-2 cursor-pointer">
                                                <ChevronRight size={14} className="rotate-180" /> Back
                                            </button>
                                            <div className="custom-scroll overflow-y-auto max-h-[250px] pr-1 flex flex-col gap-1.5">
                                                {(settingMode === "speed" ? speeds : qualities).map(item => {
                                                    const isActive = (settingMode === "speed" ? speed : quality) === item;
                                                    return (
                                                        <button
                                                            key={item}
                                                            onClick={() => {
                                                                if (settingMode === "speed") {
                                                                    if (videoRef.current) videoRef.current.playbackRate = Number(item);
                                                                    setSpeed(Number(item));
                                                                } else {
                                                                    setQuality(String(item));
                                                                }
                                                                setSettingMode("main");
                                                            }}
                                                            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${isActive ? 'bg-[var(--primary)]/20 border-2 border-[var(--primary)]' : 'hover:bg-white/5 border-2 border-transparent opacity-60'}`}
                                                        >
                                                            <span>{settingMode === "speed" ? (item === 1 ? "Normal" : `${item}x`) : item}</span>
                                                            {isActive && <Check size={16} className="text-[var(--primary)]" strokeWidth={3} />}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Bottom Controls */}
                    <AnimatePresence>
                        {showControls && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col gap-3 z-20">
                                <div className="flex justify-between text-[11px] text-white/80 font-mono tabular-nums px-1">
                                    <span>{formatTimeFull(progress)}</span>
                                    <span>{formatTimeFull(videoRef.current?.duration || 0)}</span>
                                </div>
                                <div className="flex items-center gap-5">
                                    <button onClick={togglePlay} className="text-white hover:text-[var(--primary)] transition-colors cursor-pointer active:scale-90">
                                        {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                                    </button>

                                    <div className="group flex items-center gap-2 overflow-hidden transition-all duration-300 max-w-[40px] hover:max-w-[150px]">
                                        <button onClick={toggleMute} className="text-white hover:text-[var(--primary)] cursor-pointer shrink-0">
                                            {isMuted || volume === 0 ? <VolumeX size={22} /> : volume < 0.5 ? <Volume1 size={22} /> : <Volume2 size={22} />}
                                        </button>
                                        <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={(e) => handleVolumeChange(parseFloat(e.target.value))} style={{ background: `linear-gradient(to right, white ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) 0%)` }} className="w-20 h-1 appearance-none rounded-full cursor-pointer accent-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    <input type="range" min="0" max={videoRef.current?.duration || 0} step="0.001" value={progress} onChange={(e) => { const val = parseFloat(e.target.value); if (videoRef.current) videoRef.current.currentTime = val; setProgress(val); }} style={{ background: `linear-gradient(to right, var(--primary) ${(progress / (videoRef.current?.duration || 1)) * 100}%, rgba(255,255,255,0.1) 0%)` }} className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer accent-white" />

                                    <div className="flex items-center gap-4">
                                        <button onClick={() => { setShowSettings(!showSettings); setSettingMode("main"); }} className={`transition-all cursor-pointer hover:scale-110 ${showSettings ? "text-[var(--primary)] rotate-45" : "text-white"}`}>
                                            <Settings size={22} />
                                        </button>
                                        <button onClick={toggleFullscreen} className="text-white hover:text-[var(--primary)] transition-colors cursor-pointer hover:scale-110">
                                            {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {!isFullscreen && (
                    <>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-8 bg-[var(--card)] p-8 rounded-[2.5rem] border border-[var(--border)] shadow-sm">
                            <h2 className="text-3xl font-black italic tracking-tighter uppercase">{currentVideo?.title}</h2>
                            <p className="mt-4 opacity-50 text-sm leading-relaxed tracking-wide">{currentVideo?.description}</p>
                        </motion.div>

                        {/* Playlist Section */}
                        <div className="mt-10">
                            <div className="flex items-center gap-3 mb-6 px-4">
                                <ListVideo size={24} className="text-[var(--primary)]" />
                                <h3 className="text-lg font-black italic uppercase tracking-tighter">Playlist ({props.videoData?.length || 0})</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {props.videoData?.map((video, idx) => {
                                    const isActive = currentVideo?.id === video.id;
                                    const isDone = completedIds.has(video.id);
                                    return (
                                        <motion.button
                                            key={video.id}
                                            whileHover={{ x: 5 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => changeVideo(video)}
                                            className={`flex items-center gap-4 p-4 rounded-3xl border transition-all cursor-pointer text-left
                                            ${isActive
                                                    ? "bg-[var(--primary)]/10 border-[var(--primary)] shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]"
                                                    : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--primary)]/50 opacity-70 hover:opacity-100"}`}
                                        >
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 
                                                ${isActive ? "bg-[var(--primary)] text-white shadow-lg" : "bg-[var(--bg)] opacity-50"}`}>
                                                {isDone && !isActive
                                                    ? <Check size={18} className="text-[var(--primary)]" strokeWidth={3} />
                                                    : isActive && isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill={isActive ? "white" : "currentColor"} />
                                                }
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className={`text-sm font-bold truncate ${isActive ? "text-[var(--primary)]" : ""}`}>
                                                    {idx + 1}. {video.title}
                                                </h4>
                                                <p className="text-[11px] opacity-40 truncate mt-1">Lesson Video</p>
                                            </div>
                                            {isActive && (
                                                <div className="flex gap-1 pr-2 items-end h-4"> {/* ใส่ items-end เพื่อให้แท่งเริ่มจากฐานด้านล่าง */}
                                                    {[1, 2, 3].map(i => (
                                                        <motion.div
                                                            key={i}
                                                            animate={{ height: [6, 16, 6] }}
                                                            transition={{
                                                                repeat: Infinity,
                                                                duration: 0.5,
                                                                delay: i * 0.1
                                                            }}
                                                            style={{ originY: 1 }} // ✅ กำหนดจุดหมุน/จุดยึดไว้ที่ด้านล่าง (1 คือ 100% หรือ bottom)
                                                            className="w-1 bg-[var(--primary)] rounded-full"
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
}