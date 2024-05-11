import React from 'react'
import Image from 'next/image'
import Styles from './page.module.css'

const loginPage = () => {
  return (
    <main>
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-full h-full bg-red-600 m-0 rounded-md shadow-md px-8 py-6">
            <form className="bg-red-600" action="">
                <h1 className="text-[36px] text-center" >Login</h1>
                <div className="relative w-full h-[50px] my-6 mx-0">
                    <input className="w-full h-[50px] bg-transparent outline-none border-2 rounded-full text-[16px] pt-[20px] pr-[45px] pb-[20px] pl-[20px]" type="text" placeholder='Username' required/>
                    <Image src={'/user.svg'} alt={'Icon image'} width={32} height={32} className="absolute right-0 top-[18px] translate-x-1/2 text-[16px]"/>
                </div> 
                <div className="relative w-max h-[50px] my-6 mx-0">
                    <input className="w-full h-1/2 bg-transparent outline-[none] border-[2.5px] border-[solid] rounded-[40px] text-[16px] text-[#fff] pl-[20px] pr-[45px] py-[20px]" type="password" placeholder='Password' required/>
                    <Image src={'/lock.svg'} alt={'Icon image'} width={32} height={32} className="absolute right-0 top-[18px] translate-x-1/2 text-[16px]"/>
                </div>
                <div className="">
                    <label><input type="checkbox" />Remember me</label>
                    <a href="#">Forgot password?</a>
                </div>
                <button type='submit' className="">Login</button>
                <div className="">
                    <p>Don't have an account? <a href="#">Register</a></p>
                </div>
            </form>
        </div>
        </div>
    </main>
  )
//   return (
//     <div className={Styles.page}>
//         <div className={Styles.wrapper}>
//         <form action="">
//             <h1>Login</h1>
//             <div className={Styles.inputBox}>
//                 <input type="text" placeholder='Username' required/>
//                 <Image src={'/user.svg'} alt={'Icon image'} width={32} height={32} className={Styles.icon}/>
//             </div>
//             <div className={Styles.inputBox}>
//                 <input type="password" placeholder='Password' required/>
//                 <Image src={'/lock.svg'} alt={'Icon image'} width={32} height={32} className={Styles.icon}/>
//             </div>
//             <div className={Styles.rememberForgot}>
//                 <label><input type="checkbox" />Remember me</label>
//                 <a href="#">Forgot password?</a>
//             </div>
//             <button type='submit' className={Styles.loginButton}>Login</button>
//             <div className={Styles.registerLink}>
//                 <p>Don't have an account? <a href="#">Register</a></p>
//             </div>
//         </form>
//     </div>
//     </div>
//   )
}

export default loginPage
