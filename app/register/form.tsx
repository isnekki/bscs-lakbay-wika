'use client'

import { FormEvent, useState } from "react";
import Image from 'next/image';

export default function Form() {

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordSame, setIsPasswordSame] = useState(true);

    const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    const handleConfirmPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setIsPasswordSame(false);
        } else {
            const formData = new FormData(e.currentTarget)
            const response = await fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password'),
                display_name: formData.get('display_name'),
                is_admin: false,
            }),
        });
        console.log({ response })
        }
        
    }
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-island-background bg-[#173f2a] bg-cover bg-blend-multiply">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 mx-auto w-96 mt-10 h-register justify-center bg-transparent border-2.5 rounded-2xl border-white">
            <h1 className="flex items-center justify-center text-3xl font-sf-semibold" >Register</h1>
                <div className="relative w-full h-12 mt-5 px-4">
                    <input name="displayName" className="w-full h-12 bg-transparent border-2.5 rounded-full border-white px-3 placeholder-white pr-10"  type="text" placeholder="Display Name"/>
                    <Image src={'/displayName.svg'} alt={'Icon image'} width={32} height={32} className="absolute text-base translate-x-1/2 right-10 top-2"/>
                </div>
                <div className="relative w-full h-12 mt-5 px-4">
                    <input name="email" className="w-full h-12 bg-transparent border-2.5 rounded-full border-white px-3 placeholder-white pr-10"  type="email" placeholder="Email"/>
                    <Image src={'/user.svg'} alt={'Icon image'} width={32} height={32} className="absolute text-base translate-x-1/2 right-10 top-2"/>
                </div>
                <div className="relative w-full h-12 mt-5 px-4">
                    <input onChange={handlePassword} name="password" className="w-full h-12 bg-transparent border-2.5 rounded-full border-white px-3 placeholder-white pr-10" type="password" placeholder="Password"/>
                    <Image src={'/lock.svg'} alt={'Icon image'} width={32} height={32} className="absolute translate-x-1/2 right-10 top-2"/>
                </div>
                <div className="relative w-full h-12 mt-5 px-4">
                    <input onChange={handleConfirmPassword} name="confirmPassword" className="w-full h-12 bg-transparent border-2.5 rounded-full border-white px-3 placeholder-white pr-10" type="password" placeholder="Confirm password"/>
                    <Image src={'/lock.svg'} alt={'Icon image'} width={32} height={32} className="absolute translate-x-1/2 right-10 top-2"/>
                </div>
                {isPasswordSame ? null : <p className="text-sm text-red-500 justify-center italic flex">Password does not match</p>}
                <div className="relative w-full h-12 mt-4 px-5">
                    <button className="w-full h-12 bg-white outline-none border-none rounded-full text-black font-sf-semibold hover:bg-slate-100" type='submit'>Create Account</button>
                </div>
                <div className="flex justify-center">
                    <p className="text-sm">Already have an account? <a className="text-sm font-sf-semibold hover:underline" href="/login">Login</a></p>
                </div>
            </form>
        </div>
    )
}