import useWindowDimensions from "@/hooks/useWindowDimensions"

export interface MapDetails {
    regionName: string
    x: number
    y: number
    isOpen: boolean    
   // ...rest
}

const dummyRegionData = [
    {
      "region": "CAR",
      "name": "Cordillera Administrative Region",
      "short-info": "Cordillera Administrative Region jaan ako nag aaral madami bondok jan",
      "population": 7.7,
      "land-area": "12,000",
      "languages-spoken": "Tagalog, Kapampangan, Pangasinan",
      "population-distribution": "Tagalog: 70%, Kapampangan: 20%, Pangasinan: 10%",
      "major-dialects": "Tagalog",
      "language-resources": "www.docs.google.com"
    },
    {
      "region": "NCR",
      "name": "National Capital Region",
      "short-info": "jan sa manila pangit jan maosok",
      "population": 15,
      "land-area": "14,000",
      "languages-spoken": "Tagalog, Bicolano, English",
      "population-distribution": "Tagalog: 80%, Bicolano: 15%, English: 5%",
      "major-dialects": "Tagalog",
      "language-resources": "www.slu.edu.ph"
    },
    {
      "region": "ARMM",
      "name": "Bangsamoro",
      "short-info": "mmmmm sarap",
      "population": 3.2,
      "land-area": "16,000",
      "languages-spoken": "Tagalog, Mindoro languages, English",
      "population-distribution": "Tagalog: 75%, Mindoro languages: 20%, English: 5%",
      "major-dialects": "Tagalog",
      "language-resources": "www.baguiocity.com"
    },
    {
      "region": "Region-I",
      "name": "Ilocos Region",
      "short-info": "Northwestern tip of Luzon, known for beaches and windsurfing",
      "population": 5.3,
      "land-area": "13,851",
      "languages-spoken": "Ilocano, Tagalog, Pangasinan",
      "population-distribution": "Ilocano: 85%, Tagalog: 10%, Pangasinan: 5%",
      "major-dialects": "Ilocano",
      "language-resources": "www.github.com"
    },
    {
      "region": "Region-II",
      "name": "Cagayan Valley",
      "short-info": "Cagayan Valley, known for its rice terraces and waterfalls",
      "population": 3.2,
      "land-area": "26,846",
      "languages-spoken": "Tagalog, Ilocano, Ibanag",
      "population-distribution": "Tagalog: 55%, Ilocano: 30%, Ibanag: 15%",
      "major-dialects": "Ilocano",
      "language-resources": "www.slu.edu.ph"
    },
    {
      "region": "Region-III",
      "name": "Central Luzon",
      "short-info": "Central Luzon, known for its volcanoes and hot springs",
      "population": 12.3,
      "land-area": "39,706",
      "languages-spoken": "Tagalog, Kapampangan, Pangasinan",
      "population-distribution": "Tagalog: 70%, Kapampangan: 20%, Pangasinan: 10%",
      "major-dialects": "Tagalog",
      "language-resources": "www.fb.com"
    },
    {
      "region": "Region-IVA",
      "name": "Calabarzon",
      "short-info": "CALABARZON, known for its beaches, mountains, and industrial parks",
      "population": 15.4,
      "land-area": "14,230",
      "languages-spoken": "Tagalog, Bicolano, English",
      "population-distribution": "Tagalog: 80%, Bicolano: 15%, English: 5%",
      "major-dialects": "Tagalog",
      "language-resources": "www.instagram.com"
    },
    {
      "region": "Region-IVB",
      "name": "Mimaropa",
      "short-info": "MIMAROPA, known for its islands, beaches, and marine life",
      "population": 3.1,
      "land-area": "13,328",
      "languages-spoken": "Tagalog, Mindoro languages, English",
      "population-distribution": "Tagalog: 75%, Mindoro languages: 20%, English: 5%",
      "major-dialects": "Tagalog",
      "language-resources": "www.tiktok.com"
    },
    {
      "region": "Region-V",
      "name": "Bicol Region",
      "short-info": "Southern part of Luzon, known for Mayon Volcano and Bicolano cuisine",
      "population": 6.7,
      "land-area": "9,575",
      "languages-spoken": "Bicolano, Tagalog, English",
      "population-distribution": "Bicolano: 80%, Tagalog: 15%, English: 5%",
      "major-dialects": "Bicolano",
      "language-resources": "www.pakyu.com"
    },
    {
      "region": "Region-VI",
      "name": "Western Visayas",
      "short-info": "Panay Island and surrounding islands, known for sugar production and beaches",
      "population": 7.5,
      "land-area": "20,760",
      "languages-spoken": "Hiligaynon, Cebuano, Tagalog",
      "population-distribution": "Hiligaynon: 65%, Cebuano: 20%, Tagalog: 15%",
      "major-dialects": "Kapampangan",
      "language-resources": "www.bicolexpress.com"
    },
    {
      "region": "Region-VII",
      "name": "Central Visayas",
      "short-info": "Cebu Island and Bohol Island, known for chocolate production and diving",
      "population": 5.1,
      "land-area": "14,849",
      "languages-spoken": "Cebuano, Tagalog, English",
      "population-distribution": "Cebuano: 85%, Tagalog: 10%, English: 5%",
      "major-dialects": "Kapampangan",
      "language-resources": "www.instagram.com"
    },
    {
      "region": "Region-VIII",
      "name": "Eastern Visayas",
      "short-info": "Leyte Island and Samar Island, known for its historical sites and natural beauty",
      "population": 4.2,
      "land-area": "23,142",
      "languages-spoken": "Cebuano, Waray, Tagalog",
      "population-distribution": "Cebuano: 50%, Waray:50%",
      "major-dialects": "Caviteno",
      "language-resources": "www.tiktok.com"
    },
    {
      "region": "Region-IX",
      "name": "Zamboanga Peninsula",
      "short-info": "cloud nine",
      "population": 4.4,
      "land-area": "12,123",
      "languages-spoken": "Tagalog, Kapampangan, Pangasinan",
      "population-distribution": "Ilocano: 85%, Tagalog: 10%, Pangasinan: 5%",
      "major-dialects": "Ilocano",
      "language-resources": "www.instagram.com"
    },
    {
      "region": "Region-X",
      "name": "Northern Mindanao",
      "short-info": "x-men",
      "population": 6,
      "land-area": "132,233",
      "languages-spoken": "Tagalog, Bicolano, English",
      "population-distribution": "Tagalog: 55%, Ilocano: 30%, Ibanag: 15%",
      "major-dialects": "Ilocano",
      "language-resources": "www.tiktok.com"
    },
    {
      "region": "Region-XI",
      "name": "Davao Region",
      "short-info": "seven eleven",
      "population": 7,
      "land-area": "21,677",
      "languages-spoken": "Tagalog, Mindoro languages, English",
      "population-distribution": "Tagalog: 70%, Kapampangan: 20%, Pangasinan: 10%",
      "major-dialects": "Tagalog",
      "language-resources": "www.instagram.com"
    },
    {
      "region": "Region-XII",
      "name": "Soccsksargen",
      "short-info": "eyyy",
      "population": 8,
      "land-area": "11,111",
      "languages-spoken": "Hiligaynon, Cebuano, Tagalog",
      "population-distribution": "Tagalog: 75%, Mindoro languages: 20%, English: 5%",
      "major-dialects": "Tagalog",
      "language-resources": "www.tiktok.com"
    },
    {
      "region": "Region-XIII",
      "name": "Caraga",
      "short-info": "This is the region where they call \"Region Thirteen",
      "population": 5.5,
      "land-area": "90,123",
      "languages-spoken": "Cebuano, Waray, Tagalog",
      "population-distribution": "Cebuano: 85%, Tagalog: 10%, English: 5%",
      "major-dialects": "Bicolano",
      "language-resources": "www.sanmiguel.com"
    }
]

export default function MapDetailsTooltip({ regionName, x, y, isOpen }: MapDetails) {
    const regionHovered = dummyRegionData.find(regionData => regionData.region.toLocaleLowerCase() === regionName.toLocaleLowerCase())
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
                        regionHovered?.["languages-spoken"].split(", ").map(languageSpoken => (
                            <LanguageChip language={languageSpoken} />
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