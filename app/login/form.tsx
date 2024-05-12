'use client'

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation";
import Image from 'next/image'

export default function Form() {
    const [isAccountValid, setIsAccountValid] = useState(true)
    const router = useRouter();
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const response = await signIn('credentials', {
            email: formData.get('email'),
            password: formData.get('password'),
            redirect: false,
        });

        console.log({ response });
        //handle login error
        if (!response?.error) {
            router.push("/"); 
            router.refresh(); //refresh cache
        } else {
            setIsAccountValid(false)
        }
        
    }
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-island-background bg-[#173f2a] bg-cover bg-blend-multiply">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 mx-auto w-96 mt-10 h-96 justify-center bg-transparent border-2.5 rounded-2xl border-white">
            <h1 className="flex items-center justify-center text-3xl font-sf-semibold" >Login</h1>
                <div className="relative w-full h-12 mt-7 px-4">
                    <input name="email" className="w-full h-12 bg-transparent border-2.5 rounded-full border-white px-3 placeholder-white pr-10"  type="email" placeholder="Email"/>
                    <Image src={'/user.svg'} alt={'Icon image'} width={32} height={32} className="absolute text-base translate-x-1/2 right-10 top-2"/>
                </div>
                <div className="relative w-full h-12 mt-7 px-4">
                    <input name="password" className="w-full h-12 bg-transparent border-2.5 rounded-full border-white px-3 placeholder-white pr-10" type="password" placeholder="Password"/>
                    <Image src={'/lock.svg'} alt={'Icon image'} width={32} height={32} className="absolute translate-x-1/2 right-10 top-2"/>
                </div>
                {isAccountValid ? null : <p className="text-sm text-red-500 justify-center italic flex">Invalid email or password</p>}
                <div className="flex justify-between mx-5 mt-2">
                    <label className="text-xs"><input className="mx-1" type="checkbox" />Remember me</label>
                    <a className="text-xs" href="#">Forgot password?</a>
                </div>
                <div className="relative w-full h-12 mt-4 px-4">
                    <button className="w-full h-12 bg-white outline-none border-none rounded-full text-black font-sf-semibold hover:bg-slate-100" type='submit'>Login</button>
                </div>
                <div className="flex justify-center">
                    <p className="text-sm">Don&apos;t have an account? <a className="text-sm font-sf-semibold hover:underline" href="/register">Register</a></p>
                </div>
            </form>
        </div>
    )
}