import { NextResponse } from "next/server";
import {hash} from 'bcrypt'
import {sql} from '@vercel/postgres'
export async function POST(request: Request) {
    try {
        const {email, password, display_name, is_admin} = await request.json();
        //todo: validate email and password (validate if email contains @... and password is at least 8 characters or somthn.)
        console.log({email, password})

        //hash the pw
        const hashedPassword = await hash(password, 10);
        
        const response = await sql`
        INSERT INTO users (email, display_name, password, is_admin)
        VALUES (${email}, ${display_name},${hashedPassword}, ${is_admin})
        `;

    } catch (error) {
        console.log({error})
    }

    return NextResponse.json({message: 'success'});
}