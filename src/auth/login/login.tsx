import './login.css';
import InputField from '../../components/inputfield';
import login from './function';
import { authFunction } from '../auth';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../utils/theme';
import Button from '../../components/button';

export default function Login() {
    const { theme } = useTheme();
    const username = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);


    function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        const user = username.current?.value || "";
        const pass = password.current?.value || "";

        login.Login(user, pass);
    }

    return (
        <div
            data-theme={theme}
            className="min-h-screen flex items-center justify-center px-4 py-8 bg-[var(--bg)] text-[var(--text)]"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: [1.05, 1], opacity: 1 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="w-full max-w-sm rounded-3xl bg-[var(--card)] p-6 shadow-xl"
            >
                <h2 className="text-center text-2xl font-bold mb-6 text-[var(--primary)]">
                    เข้าสู่ระบบ
                </h2>


                <div className="space-y-4">
                    <InputField.Default ref={username} type='text' onChange={(e) => {
                        e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                    }}
                        maxLength={16}
                        label='Username' placeholder='ชื่อผู้ใช้' />
                    <InputField.Default ref={password} type='password' onChange={(e) => {
                        e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                    }}
                        maxLength={16}
                        label='Password' placeholder='รหัสผ่าน' />
                </div>

                <Button.Default label="Login" onClick={handleLogin} />

                <p onClick={() => authFunction.setAuthMode('register')} className="mt-4 text-center text-sm opacity-70">
                    ยังไม่มีบัญชี?{' '}
                    <span className="cursor-pointer text-[var(--primary)] hover:underline">
                        สมัครสมาชิก
                    </span>
                </p>
            </motion.div>
        </div>
    );
}