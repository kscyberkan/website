export type Video = {
    id: number;
    title: string;
    videoSrc: string;           // URL ของวิดีโอ
    posterSrc: string;          // Thumbnail
    durationText: string;       // เช่น "10:30"
    description: string;
    category?: string;          // หมวดหมู่ (เช่น 'React', 'TypeScript')
    instructorName?: string;    // ชื่อผู้สอน
    createdAt?: string | Date;  // วันที่ลงวิดีโอ
    isCompleted?: boolean;      // สำหรับ Check ว่า User เรียนจบหรือยัง (ถ้ามีระบบ Progress)
};
export type Episode = Video;

export type Course = {
    id: number;
    title: string;
    description: string;
    instructorName?: string;
    episodes: Episode[];
};
