"use client"
/** NATIVE PACKAGES */
import Image from "next/image";

/** EXTERNAL PACKAGES */
import Modal from 'react-modal'

/** CUSTOM COMPONENTS */
import PhilippinesMap from "./components/PhilippinesMap";
import MapDetailsTooltip from "./components/MapDetailsTooltip";
import { getDummyData } from "@/utils/Dev-RegionDummyData";

/** ASSETS */
import BSCSLogo from '../assets/images/logo-white.png'
import { createRef, useState } from "react";

Modal.setAppElement("#homepage")

export default function Home() {
  const [tooltipCoordinates, setTooltipCoordinates] = useState<{ x: number, y:number }>({ x: 0, y: 0 })
  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false)
  const [regionName, setRegionName] = useState<string>("")
  const mapContainerRef = createRef<HTMLDivElement>()

  const dummyRegionData = getDummyData()

  function handleMapOnMouseEnter(e: React.MouseEvent) {
    if (!mapContainerRef || !mapContainerRef.current) return
    const { clientX, clientY } = e
    setTooltipCoordinates({ x: clientX - mapContainerRef.current.getBoundingClientRect().x, y: clientY - mapContainerRef.current.getBoundingClientRect().y })
    setRegionName(e.currentTarget.id)
    setIsTooltipOpen(true)
  }
  
  function handleMapOnMouseLeave(e: React.MouseEvent) {
    setIsTooltipOpen(false)
  }

  return (
    <main id="homepage" className="flex min-h-screen flex-col items-center justify-between">
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
          <h1 className="text-7xl font-sf-regular font-bold text-white">The Filipino Languages</h1>
          <h3 className="text-3xl font-sf-regular text-white">Explore. Navigate. Discover.</h3>
          <button className="bg-[#173f2a] text-xl text-white my-12 py-4 px-16 w-min rounded-full">Start</button>
        </div>
      </div>
      <div className="h-screen w-full bg-white p-12">
        <div ref={mapContainerRef} className="relative h-full w-full">
          <MapDetailsTooltip regionName={regionName} regionData={dummyRegionData} isOpen={isTooltipOpen} x={tooltipCoordinates.x} y={tooltipCoordinates.y} />
          <PhilippinesMap regionData={dummyRegionData} onMouseEnter={handleMapOnMouseEnter} onMouseLeave={handleMapOnMouseLeave} />
        </div>
      </div>
    </main>
  );
}
