import { RegionData } from "@/utils/Dev-RegionDummyData"

export interface MapDetails {
    regionName: string
    regionData: RegionData[]
    x: number
    y: number
    isOpen: boolean    
   // ...rest
}

export default function MapDetailsTooltip({ regionName, regionData, x, y, isOpen }: MapDetails) {
    const regionHovered = regionData.find(regionData => regionData.region.toLocaleLowerCase() === regionName.toLocaleLowerCase())
    return (
        <div className={`absolute flex flex-col items-center justify-around bg-white shadow-2xl border border-black border-1 w-auto h-auto transition-all rounded-lg p-2`} style={{ display: `${isOpen ? "block" : "none"}`, left: `${x}px`, top: `${y}px` }}>
            <div id="top" className="flex flex-col items-center m-2">
                <span className="text-black font-sf-bold text-xl">{regionHovered?.region}</span>
                <span className="text-black font-sf-regular text-xs">{regionHovered?.name}</span>
            </div>
            <div id="middle" className="flex flex-col items-center m-2">
                <span className="text-gray-400 font-sf-regular text-xs">Area: {regionHovered?.["land-area"]}</span>
                <span className="text-gray-400 font-sf-regular text-xs">Barangays: {9999}</span>
            </div>
            <div id="bottom" className="flex flex-col items-center m-2">
                <div id="languages-spoken" className="flex flex-row items-center justify-between w-full">
                    {
                        regionHovered?.["languages-spoken"].split(", ").map((languageSpoken, index) => (
                            <LanguageChip key={index} language={languageSpoken} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

function LanguageChip({ language }: { language: string }) {
    return (
        <div className="bg-emerald-950 rounded-md mx-1">
            <span className="flex items-center justify-center font-sf-regular text-xs px-2">{language}</span>
        </div>
    )
}