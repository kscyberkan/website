import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../utils/theme";

export default function Schedule() {
  const { theme } = useTheme();
  const [courses, setCourses] = useState([
    { day: 'จันทร์', time: '10:00 - 11:30', name: 'พื้นฐานโครเชต์' },
    { day: 'พุธ', time: '13:00 - 14:30', name: 'ถักกระเป๋า' },
    { day: 'ศุกร์', time: '15:00 - 16:30', name: 'ถักตุ๊กตา' },
  ]);

  const [open, setOpen] = useState(false);
  const [day, setDay] = useState('');
  const [time, setTime] = useState('10:00 - 11:30');
  const [name, setName] = useState('');

  const addCourse = () => {
    if (!name) return alert('กรุณากรอกชื่อคอร์ส');
    setCourses([...courses, { day, time, name }]);
    setName('');
    setOpen(false);
  };

  return (
    <div data-theme={theme} className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 pb-24">
      <header className="py-6 text-center">
        <h1 className="text-2xl font-bold text-[var(--primary)]">ตารางเรียน</h1>
        <p className="text-sm opacity-70">ดูและจัดการตารางเรียนของคุณ</p>
      </header>

      {/* ตาราง */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-[var(--card)]">
              <th className="p-3 text-left text-sm border border-[var(--border)]">วัน</th>
              <th className="p-3 text-left text-sm border border-[var(--border)]">เวลา</th>
              <th className="p-3 text-left text-sm border border-[var(--border)]">คอร์ส</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c, i) => (
              <motion.tr key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--card)]">
                <td className="p-3 border border-[var(--border)]">{c.day}</td>
                <td className="p-3 border border-[var(--border)]">{c.time}</td>
                <td className="p-3 border border-[var(--border)]">{c.name}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ปุ่มเพิ่มคอร์ส */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-6 rounded-full bg-[var(--primary)] px-6 py-3 text-white shadow-lg"
      >
        + เพิ่มคอร์ส
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl bg-[var(--card)] p-6"
            >
              <h2 className="text-lg font-semibold mb-4 text-[var(--primary)]">เพิ่มคอร์ส</h2>

              <div className="space-y-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ชื่อคอร์ส"
                  className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2"
                />

                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2"
                />

                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2"
                >
                  <option>09:00 - 10:30</option>
                  <option>10:00 - 11:30</option>
                  <option>13:00 - 14:30</option>
                  <option>15:00 - 16:30</option>
                </select>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-xl border border-[var(--border)] py-2"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={addCourse}
                  className="flex-1 rounded-xl bg-[var(--primary)] py-2 text-white"
                >
                  เพิ่ม
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
