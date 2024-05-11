import NextAuth from 'next-auth/next';
import CredentialsProvider from "next-auth/providers/credentials"
import {compare} from 'bcrypt'
import { sql } from '@vercel/postgres'

const handler = NextAuth({
    providers: [CredentialsProvider({
        credentials: {
            email: {},
            password: {},
        },
        async authorize(credentials, req) {
            //todo: again, validate data inputs if it's valid (e.g., email, password format)
            const response = await sql`
            SELECT * FROM users WHERE email=${credentials?.email}
            `;
            const user = response.rows[0];

            //compare password with hashed password. In case undefined, default to blank string
            const passwordCorrect = await compare(credentials?.password || "", user.password);
            if (passwordCorrect) {
                return  {
                    id: user.id,
                    email: user.email,
                };
            }
            return null;
            console.log(credentials);
        },
    })]
})

export {handler as GET, handler as POST}