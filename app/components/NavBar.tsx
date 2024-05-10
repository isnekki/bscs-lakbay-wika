import Image from "next/image";
import BSCSLogo from '../../assets/images/logo-white.png'
import React from 'react'
import SearchBar from "./SearchBar";
import LogIn from "./LogIn";
const NavBar = () => {
  return (
    <nav className="fixed flex gap-4 justify-between items-center w-full p-6 ">
      <Image 
        src={BSCSLogo} 
        alt="BSCS Logo"   
        width={125}
        height={125}
      />
      <div className="flex gap-4 justify-between w-1/5 text-lg font-regular">
        <span>Introduction</span>
        <span>Team</span>
        <span>Languages</span>
      </div>
      
      <div className="flex gap-4  ">
        <SearchBar/>
        <LogIn />
      </div>
      

    </nav>
  )
}

export default NavBar;