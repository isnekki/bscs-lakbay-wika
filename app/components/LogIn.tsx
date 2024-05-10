import React from 'react'
import Image from 'next/image'
import UserImage from "../../assets/icons/user.png"
import Link from 'next/link'
const LogIn = () => {
    return (
        
        <Image className='icon'
            src={UserImage}
            height={30}
            width={30}
            alt='User Icon'
        />
    )
}

export default LogIn