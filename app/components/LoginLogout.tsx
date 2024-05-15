"use client"
import { Session } from 'next-auth';
import { getSession } from './Session';
import { useEffect, useState } from 'react';
import { navigate } from './Redirect';
import { signOut } from 'next-auth/react'
import { RedirectType, usePathname } from 'next/navigation';
import Image from 'next/image';

import UserImage from '../../assets/icons/user.png'

export default function LoginLogout() {
    const [session, setSession] = useState<Session | null>(null)
    const pathname = usePathname()

    async function handleOnClick(e: React.MouseEvent) {
        e.preventDefault()
        if (session === null) return await navigate("/login", RedirectType.replace)
        return await signOut()
    }

    useEffect(() => {
        (async () => {
            const browserSession = await getSession()
            setSession(browserSession)
        })();
    }, [pathname])

    return (
        <div className="flex flex-row">
            {
                session !== null && <Image 
                    className='icon mx-2'
                    src={UserImage}
                    height={30}
                    width={30}
                    alt='User Icon'
                />
            }
            <button onClick={handleOnClick}>{session !== null ? "Logout" : "Login"}</button>
        </div>
    )
}