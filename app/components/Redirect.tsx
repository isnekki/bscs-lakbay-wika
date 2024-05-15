"use server"

import { RedirectType, redirect } from "next/navigation"

export async function navigate(path: string, type?: RedirectType) {
    redirect(path, type)
}