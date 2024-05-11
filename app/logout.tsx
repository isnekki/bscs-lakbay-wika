'use client'
//logout, modify as neededd. Render this in layout.tsx
import {signOut} from 'next-auth/react'

export default function Logout() {
    return (
        <span onClick={() => {
            signOut();
        }}>

        </span>
    )
}