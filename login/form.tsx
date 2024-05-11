'use client'

import { FormEvent } from "react";
import { signIn } from "next-auth/react"

export default function Form() {
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        signIn('credentials', {
            email: formData.get('email'),
            password: formData.get('password'),
            redirect: false,
        });
    }
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 mx-auto max-w-md mt-10 h-screen justify-center">
            <input name="email" className="border border-black text-black"  type="email" />
            <input name="password" className="border border-black text-black" type="password" />
            <button type='submit' >Login</button>
        </form>
    )
}