import { useTheme } from '../../utils/theme';
import { pageFunction } from '../page_manager'

export default function FooterMobile() {
  const { theme } = useTheme();

  return (
    <nav data-theme={theme} className="fixed bottom-0 left-0 right-0 mx-2 bg-[var(--card)] rounded-t-lg sm:hidden">
      <div className="flex justify-around text-sm h-15 rounded-t">
        <button onClick={() => pageFunction.setPageState({ page: 'home' })} className="opacity-70 w-full border border-[var(--border)] text-[var(--text)] rounded-tl-lg hover:cursor-pointer">หน้าแรก</button>
        <button onClick={() => pageFunction.setPageState({ page: 'schedule' })} className="opacity-70 w-full border border-[var(--border)] text-[var(--text)] rounded-tr-lg hover:cursor-pointer">ตารางเรียน</button>
      </div>
    </nav>
  )
}
