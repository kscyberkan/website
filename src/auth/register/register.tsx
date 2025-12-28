import './register.css';
import InputField from '../../../components/inputfield';
import Button from '../../../components/button';
import register from './function';
import { useRef, useState } from 'react';
import type { RegisterData } from '../../types/register_data';
import { authFunction } from '../auth';
import { motion } from 'framer-motion';
import { useTheme } from "../../../utils/theme";

function ValidateData(registerData: RegisterData): boolean {

    if (registerData.name == "") { alert("Name is required"); return false; }
    if (registerData.lastname == "") { alert("Lastname is required"); return false; }
    if (registerData.nickname == "") { alert("Nickname is required"); return false; }
    if (registerData.address == "") { alert("Address is required"); return false; }
    if (registerData.username == "") { alert("Username is required"); return false; }
    if (registerData.password == "") { alert("Password is required"); return false; }
    if (registerData.phone == "") { alert("Phone is required"); return false; }

    return registerData.name !== "" &&
        registerData.lastname !== "" &&
        registerData.nickname !== "" &&
        registerData.address !== "" &&
        registerData.username !== "" &&
        registerData.password !== "" &&
        registerData.phone !== "";
}

export default function Register() {
    const { theme } = useTheme();

    const name = useRef<HTMLInputElement>(null);
    const lastname = useRef<HTMLInputElement>(null);
    const nickname = useRef<HTMLInputElement>(null);
    const address = useRef<HTMLInputElement>(null);
    const username = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const phone = useRef<HTMLInputElement>(null);

    function handleRegister(e: React.FormEvent) {
        e.preventDefault();

        const registerData: RegisterData = {
            name: name.current?.value || "",
            lastname: lastname.current?.value || "",
            nickname: nickname.current?.value || "",
            address: address.current?.value || "",
            username: username.current?.value || "",
            password: password.current?.value || "",
            phone: phone.current?.value || ""
        };

        if (!ValidateData(registerData)) return;

        register.Register(registerData);
    }

    return (
        <div data-theme={theme} className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)] px-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: [1.05, 1], opacity: 1 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="w-full max-w-md rounded-3xl bg-[var(--card)] p-6 sm:p-8 shadow-xl"
            >
                <h2 className="text-center text-2xl sm:text-3xl font-bold mb-6 text-[var(--primary)]">สมัครสมาชิก</h2>


                <div className="space-y-4">
                    <InputField.Default ref={name} type='text' label='Name' placeholder='ชื่อ' maxLength={50} />
                    <InputField.Default ref={lastname} type='text' label='Lastname' placeholder='นามสกุล' maxLength={50} />
                    <InputField.Default ref={nickname} type='text' label='Nickname' placeholder='ชื่อเล่น' maxLength={20} />
                    <InputField.Default ref={address} type='text' label='Address' placeholder='ที่อยู่' maxLength={200} />
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
                    <InputField.Default ref={phone} type='text' label='Phone' onChange={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, '')
                    }}
                        maxLength={10}
                        inputMode='numeric'
                        placeholder='เบอร์โทรศัพท์' />
                </div>

                <Button.Default label="Login" onClick={handleRegister} />

                <p className="mt-4 text-center text-sm opacity-70">
                    มีบัญชีแล้ว?
                    <span onClick={() => authFunction.setAuthMode('login')} className="cursor-pointer text-[var(--primary)] hover:underline">เข้าสู่ระบบ</span>
                </p>
            </motion.div>
        </div>
    );
}