/** NATIVE PACKAGES */
import Image from "next/image";

/** CUSTOM COMPONENTS */
import PhilippinesMap from "./components/PhilippinesMap";

/** ASSETS */
import BSCSLogo from '../assets/images/logo-white.png'
import Philippines from '../assets/svgs/philippines.svg'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <nav className="absolute flex items-center w-full p-12">
        <div className="flex justify-between w-1/5 text-lg font-regular">
          <span>Introduction</span>
          <span>Team</span>
          <span>Languages</span>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Image 
              src={BSCSLogo} 
              alt="BSCS Logo"   
              width={125}
              height={125}
            />
        </div>
      </nav>
      <div id="container" className="flex flex-col items-center p-12 w-full h-screen w-full bg-island-background bg-[#173f2a] bg-cover bg-blend-multiply">
        <div className="h-full w-full flex flex-col p-12 justify-center">
          <h1 className="text-7xl font-sf-regular font-bold">The Filipino Languages</h1>
          <h3 className="text-3xl font-sf-regular">Explore. Navigate. Discover.</h3>
          <button className="bg-[#173f2a] text-xl my-12 py-4 px-16 w-min rounded-full">Start</button>
        </div>
      </div>
      <div className="h-screen w-full bg-white p-12">
        <div className="relative h-full w-full">
          <PhilippinesMap />
        </div>
      </div>
    </main>
  );
}
