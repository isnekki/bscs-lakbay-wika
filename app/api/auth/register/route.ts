import { NextResponse } from "next/server";
import {hash} from 'bcrypt'
import {sql} from '@vercel/postgres'
export async function POST(request: Request) {
    try {
        const {email, password} = await request.json();
        //todo: validate email and password (make sure email are valid nad or password must not contain shit or etc. fuck this.)
        console.log({email, password})

        //hash the pw
        const hashedPassword = await hash(password, 10);
        
        const response = await sql`
        INSERT INTO users (email, password)
        VALUES (${email}, ${hashedPassword})
        `;


    } catch (error) {
        console.log({error})
    }

    return NextResponse.json({message: 'success'});
}