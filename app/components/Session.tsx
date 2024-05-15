"use server"

import { Session, getServerSession } from 'next-auth';

export async function getSession(): Promise<Session | null> {
    return await getServerSession()
}