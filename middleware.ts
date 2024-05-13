export {default} from 'next-auth/middleware'
export const config = {matcher: ['/dashboard']} //sample page to protect routes if user is logged out in middleware.ts