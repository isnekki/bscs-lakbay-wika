import React from 'react'
import Image from 'next/image'
import Styles from './page.module.css'
import Form from './form'

const loginPage = () => {
  return (
    <Form />
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
