import React from 'react'
import Form from './form'
import { getSession } from '../components/Session'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
    const session = await getSession()
    //if there is session, redirect to homepage.
    if (session) {
        redirect("/")
    }
    return (
        <Form />
    )
}
