import useWindowDimensions from "@/hooks/useWindowDimensions"

export interface MapDetails {
    regionName: string
    x: number
    y: number
    isOpen: boolean
    
    // ...rest
  }
  
  export default function MapDetailsTooltip({ regionName, x, y, isOpen }: MapDetails) {
    return (
      <div className={`absolute bg-red-200 w-80 h-80 transition-all`} style={{ opacity: `${isOpen ? 1 : 0}`, left: `${x}px`, top: `${y}px` }}>
        <span className="text-black">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam hic nobis autem magni eligendi. Consectetur maiores officia fugit qui sapiente?</span>
        {regionName}
      </div>
    )
  }