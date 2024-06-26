"use client"

import { ProvinceData, RegionData, getProvinceData, getRegionSVGs } from "@/utils/Dev-RegionDummyData"
import { useState, createRef, useEffect } from "react"

import Image from "next/image"
import Modal from 'react-modal'
import parse from 'html-react-parser'

import BackgroundImage from '../../assets/images/background.png'
import Pin from '../../assets/images/pin.png'
import Close from '../../assets/images/close.png'
import ReactModal from "react-modal"

interface PhilippinesMapProps {
  regionData: RegionData[]
  onMouseEnter: (e: React.MouseEvent) => void
  onMouseLeave: (e: React.MouseEvent) => void
}

const regionSvgs = getRegionSVGs()
const provinceData = getProvinceData()

const languageColors = [
  "#3498db", // Blue
  "#e74c3c", // Red
  "#2ecc71", // Green
  "#9b59b6", // Purple
  "#f39c12", // Orange
  "#1abc9c", // Turquoise
  "#e67e22", // Brown
  "#6a1b9a", // Dark Purple
  "#d35400", // Rust
  "#27ae60", // Forest Green
  "#8e44ad", // Violet
  "#c0392b", // Dark Red
  "#16a085", // Dark Cyan
  "#f1c40f", // Yellow
  "#34495e", // Midnight Blue
];

const languageData = [
  {
    "language": "Tagalog",
    "resource": "facebook.com"
  },
  {
    "language": "Tagalog",
    "resource": "classroom.google.com"
  },
  {
    "language": "Bicolano",
    "resource": "classroom.google.com"
  },
]

const phraseData = [
  {
    "language": "Tagalog",
    "phrase": "Hindi",
    "translation": "No"
  },
  {
    "language": "Tagalog",
    "phrase": "Salamat",
    "translation": "Thank you"
  }
]

export default function PhilippinesMap({ regionData, onMouseEnter, onMouseLeave }: PhilippinesMapProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [modalData, setModalData] = useState<{ regionSVG: string, regionData: RegionData } | null>(null)
  const [selectedProvince, setSelectedProvince] = useState<{ svg?: SVGPathElement, provinceData: ProvinceData } | null>(null)
  const [isLanguageResourcesOpen, setIsLanguageResourcesOpen] = useState<boolean>(false)
  const [isPopularPhrasesOpen, setIsPopularPhrasesOpen] = useState<boolean>(false)
  const [pinCoordinates, setPinCoordinates] = useState<{ x: number, y:number }>()


  const divRef = createRef<HTMLDivElement>()
  const modalContainerRef = createRef<HTMLDivElement>()

  const modalStyles = {
    content: {
      display: 'flex',
      width: '85vw',
      height: '90vh',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      borderRadius: '30px',
    },
    overlay: {
      background: "rgba(50, 50, 50, 0.5)"
    }
  }

  useEffect(() => {
    if (divRef && divRef.current) {
      divRef.current.children[0].setAttribute("style", "margin: auto; height: 100%; width: 100%;")

      const provinceSVG = divRef.current.childNodes[0]

      provinceSVG.addEventListener("click", handleProvinceOnClick)

      return () => provinceSVG.removeEventListener("click", handleProvinceOnClick)
    }
  }, [divRef, handleProvinceOnClick])

  function handleProvinceOnClick(e: Event) {
    if (e.target instanceof SVGPathElement === false) return
    if (selectedProvince && selectedProvince.svg) {
      selectedProvince.svg.classList.remove("selected")
    }
    const province = e.target as SVGPathElement
    province.classList.add("selected")
    
    if (e instanceof MouseEvent && modalContainerRef.current !== null) {
      setPinCoordinates({ x: e.clientX - modalContainerRef.current.getBoundingClientRect().x, y: e.clientY - modalContainerRef.current.getBoundingClientRect().y })
    }

    const selectedProvinceData = provinceData.find(p => p.province.toLocaleLowerCase() === province.id.replaceAll("-", " ").toLocaleLowerCase())

    if (!selectedProvinceData) return

    setSelectedProvince({ svg: province, provinceData: selectedProvinceData })
  }

  function handleOnClick(e: React.MouseEvent) {
    const regionName = e.currentTarget.id
    const clickedRegionSVGString = Object.entries(regionSvgs).find(([key, _]) => key.toLocaleLowerCase() === regionName)
    const clickedRegionDetails = regionData.find(region => region.region.toLocaleLowerCase() === regionName.toLocaleLowerCase())

    if (!clickedRegionDetails || !clickedRegionSVGString) return

    setModalData({ regionSVG: clickedRegionSVGString[1], regionData: clickedRegionDetails })
    setIsModalOpen(true)
  }

  function handleCloseModal() {
    setSelectedProvince(null)
    setIsModalOpen(false)
  }

  return (
    <>
      <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal} style={modalStyles}>
        <div id="modal-container" ref={modalContainerRef}> 
          { 
            selectedProvince && <div className="absolute z-10" style={{ top: `${pinCoordinates?.y}px`, left: `${pinCoordinates?.x}px` }}>
              <Image 
                src={Pin}
                alt="Pinned location"
                width={15}
                height={15}
              />
            </div>
          }
          <div id="container" className="flex flex-col w-full h-full p-4">
            <div id="header" className="relative flex w-full items-center justify-end">
              <button onClick={handleCloseModal} className="bg-white invert rounded-full p-2 text-sm">
                <Image 
                  src={Close} 
                  alt="Close modal"              
                  width={10}
                  height={10}
                />
              </button>
            </div>
            <div id="body" className="relative flex flex-1 overflow-auto w-full">
              <div id="map-container" className="flex flex-col justify-center items-center h-full w-1/2">
                <span className="text-black font-sf-semibold text-4xl">{modalData?.regionData.region}</span>
                <span className="text-black font-sf-regular italic text-3xl">{selectedProvince?.provinceData.capital.replace("City", "")}</span>
                <div ref={divRef} className="relative h-3/5 w-full my-16">
                  {
                    parse(modalData?.regionSVG ?? "")
                  }
                </div>
              </div>
              <div id="details-container" className="relative flex h-full w-1/2 p-8 items-center justify-center">
                <div className="flex flex-col h-full w-full rounded-3xl bg-[#f3ffec] p-16 overflow-auto shadow-xl">
                  <Image 
                    src={BackgroundImage}
                    alt="Province Image"
                    style={{
                      borderRadius: "30px",
                      boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)"
                    }}
                  />
                  <span id="short-description" className="text-black font-sf-medium text-xl my-4">{selectedProvince?.provinceData["short-info"] ?? modalData?.regionData["short-info"]}</span>
                  <div id="primary-languages" className="flex justify-between items-center my-4">
                    <span className="text-black font-sf-semibold text-3xl">Primary Languages</span>
                    <div>
                      {
                        selectedProvince ?
                        selectedProvince?.provinceData.languages.split(", ").map((language, index) => <span key={index} className="shadow-2xl text-white text-sm py-2 px-3 m-1 rounded-lg bg-emerald-950">{language}</span>) :
                        modalData?.regionData["languages-spoken"].split(", ").map((language, index) => <span key={index} className="shadow-2xl text-white text-sm py-2 px-3 m-1 rounded-lg bg-emerald-950">{language}</span>)
                      }
                    </div>
                  </div>
                  <div id="population" className="flex justify-between my-2">
                    <span className="text-black font-sf-semibold text-xl">Population</span>
                    <span className="text-black font-sf-medium text-xl">{selectedProvince?.provinceData.population ?? modalData?.regionData.population}</span>
                  </div>
                  <div id="land-area" className="flex justify-between my-2">
                    <span className="text-black font-sf-semibold text-xl">Land Area (m<sup>2</sup>)</span>
                    <span className="text-black font-sf-medium text-xl">{selectedProvince?.provinceData["land-area"] ?? modalData?.regionData["land-area"]}</span>
                  </div>
                  <div id="major-dialects-or-popular-literatue" className="flex justify-between my-2">
                    <span className="text-black font-sf-semibold text-xl">{selectedProvince ? "Popular Literature" : "Major Dialects"}</span>
                    <span className="text-black font-sf-medium text-xl">{selectedProvince?.provinceData["popular-literature"] ?? modalData?.regionData["major-dialects"]}</span>
                  </div>
                  {
                    selectedProvince?.provinceData["lit-address"] &&
                    <div id="literature-address">
                      <span>Full Address of Popular Literature</span>
                      <span>{selectedProvince.provinceData["lit-address"]}</span>
                    </div>
                  }
                  <div id="population-distribution-by-language" className="flex flex-col w-full items-center my-2">
                    <span className="text-black font-sf-semibold text-xl mb-2">Population Distribution by Language</span>
                    {
                      selectedProvince ?
                      selectedProvince.provinceData["population-distribution"].split(", ").map((distribution, index) => {
                        const [language, percentage] = distribution.split(":")
                        return (
                          <div key={index} id="distribution-container" className="w-full bg-gray-400 rounded-md mb-2">
                            <div id="distribution-percentage" style={{ background: languageColors[index], width: percentage }} className="flex items-center justify-between rounded-md flex-row p-2">
                              {
                                Number(percentage.replace("%", "")) >= 15 &&
                                <div id="language" className="flex flex-row justify-center  h-full w-full">
                                  <span className="text-black font-sf-regular text-xs">{`${language.substring(0, 10)}${language.length >= 10 ? "..." : ""}`}</span>
                                </div>  
                              }
                              <span className="text-black font-sf-regular text-xs">{percentage}</span>
                            </div>
                          </div>
                        ) 
                      }) :
                      modalData?.regionData["population-distribution"].split(", ").map((distribution, index) => {
                        const [language, percentage] = distribution.split(":")
                        return (
                          <div key={index} id="distribution-container" className="w-full bg-gray-400 rounded-md mb-2">
                            <div id="distribution-percentage" style={{ background: languageColors[index], width: percentage }} className="flex items-center justify-between rounded-md flex-row p-2">
                              {
                                Number(percentage.replace("%", "")) >= 15 &&
                                <div id="language" className="flex justify-center  h-full w-full">
                                  <span className="text-black font-sf-regular text-xs">{language}</span>
                                </div>  
                              }
                              <span className="text-black font-sf-regular text-xs">{percentage}</span>
                            </div>
                          </div>
                        ) 
                      })
                    }
                  </div>
                  {
                    !selectedProvince && (
                      <>
                        <div id="language-resources" className="bg-gray-300 w-full rounded-lg p-6 my-2">
                          <div id="header" className="flex items-center justify-between">
                            <span className="text-black font-sf-semibold text-lg">Lanugage Resources</span>
                            <button className="text-black text-xl" onClick={() => {setIsLanguageResourcesOpen(!isLanguageResourcesOpen)}}>{isLanguageResourcesOpen ? "-" : "+"}</button>
                          </div>
                          <div id="container">
                            {
                              isLanguageResourcesOpen && modalData?.regionData["languages-spoken"].split(", ").map((language, languageIndex) => {
                                const langData = languageData.filter(data => data.language.toLocaleLowerCase() === language.toLocaleLowerCase())
                                if (langData.length === 0) return (
                                  <div key={languageIndex} className="mt-4">
                                    <span className="text-black font-sf-semibold text-lg">{language}</span>
                                  </div>
                                )
                                return (
                                  <div key={languageIndex} className="flex flex-col mt-4">
                                    <span className="text-black font-sf-semibold text-md">{langData[0].language}</span>
                                    {
                                      langData.map((individualLanguage, index) => (
                                        <span key={index} className="text-black font-sf-regular text-sm">{individualLanguage.resource}</span>
                                      ))
                                    }
                                  </div>
                                )
                              })
                            }
                          </div>
                        </div>

                        <div id="popular-phrases" className="bg-gray-300 w-full rounded-lg p-6 my-2">
                          <div id="header" className="flex items-center justify-between">
                            <span className="text-black font-sf-semibold text-lg">Popular Phrases</span>
                            <button className="text-black text-xl" onClick={() => {setIsPopularPhrasesOpen(!isPopularPhrasesOpen)}}>{isPopularPhrasesOpen ? "-" : "+"}</button>
                          </div>
                          <div id="container">
                            {
                              isPopularPhrasesOpen && modalData?.regionData["languages-spoken"].split(", ").map((language, languageIndex) => {
                                const phrases = phraseData.filter(data => data.language.toLocaleLowerCase() === language.toLocaleLowerCase())
                                if (phrases.length === 0) return (
                                  <div key={languageIndex} className="mt-4">
                                    <span className="text-black font-sf-semibold text-lg">{language}</span>
                                  </div>
                                )
                                return (
                                  <div key={languageIndex} className="flex flex-col mt-4">
                                    <span className="text-black font-sf-semibold text-md">{phrases[0].language}</span>
                                    {
                                      phrases.map((phrase, index) => {
                                        return (
                                          <span key={index} className="text-black font-sf-regular text-sm">{`${phrase.phrase} (${phrase.language}) - ${phrase.translation} (English)`}</span>
                                        )
                                      })
                                    }
                                  </div>
                                )
                              })
                            }
                          </div>
                        </div>
                      </>
                    )
                  }
                </div>
              </div>
            </div>
            {/* <div id="footer" className="flex items-center justify-end">
              <button onClick={handleCloseModal} className="transition hover:bg-white hover:text-emerald-950 min-w-24 bg-emerald-950 border border-emerald-950 border-1 py-3 px-4 rounded-lg mx-2 text-xs font-sf-regular">CLOSE</button>
              <button className="transition hover:bg-white hover:text-emerald-950 min-w-24 bg-emerald-950 border border-emerald-950 border-1 py-3 px-4 rounded-lg mx-2 text-xs font-sf-regular">BACK</button>
              <button className="transition hover:bg-white hover:text-emerald-950 min-w-24 bg-emerald-950 border border-emerald-950 border-1 py-3 px-4 rounded-lg mx-2 text-xs font-sf-regular">NEXT</button>
            </div> */}
          </div>
        </div>
      </Modal>
          <svg
              width="inherit"
              height="inherit"
              version="1.2"
              baseProfile="tiny"
              id="map-svg"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 1395.1 2290.5"
              overflow="visible"
              xmlSpace="preserve"
            >
              <g id="ncr" className="region pointer-events-[bounding-box]" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleOnClick}>
                <path
                  fillRule="evenodd"
                  fill="#979797"
                  d="M599.9,934.6c-3.3-6.7-0.7-16.4,0.6-18.3c2.5-3.6,4.8,2.5,3.9-6.7
          c-0.4-4,0.5-6.8,0.5-10.7c0.2-0.1,0.4-0.3,0.5-0.4c1.1-0.6,2-1,3.2-1.4c-1.4-2.2-1-2.6-3-4.4c0.5-4.1,1.4-2.9,1.5-7.1
          c0.1-3.4,0.5-5.7,0.7-7.5c-2.8,1-3.3,2.6-7.9,1.5c-2.1-0.5-1.4-0.9-3.6-1.1c-1-0.1-1.1,0.6-1.7,0.5c-4.6,7.6-11.9,2.6-10.1,10.2
          l-2.9,1.5c0.7,1.1,4.8,6.8,4.9,7c0.9,3.8-2.7,3.5,1.9,8.5c2.7,2.8,4.4,9.2,1.1,13l-3.1,2.5c1.7,3.8,5.8,10.8,6.3,14.5
          C597.1,935.2,596.4,935.5,599.9,934.6z"
                />
              </g>
              <g id="car" className="region pointer-events-[bounding-box]" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleOnClick}>
                <path
                  fillRule="evenodd"
                  fill="#959595"
                  d="M649,589.5l8.4-2.6c5.4-1.8,4.3,2.2,6.5-5.2c0-0.1,0.9-2.4,0.9-2.4
            c3.3-6.3,6.7,0.8,4.3-12.7c-2-11.7-0.8-15.5-28.2-10.7c-3.5,0.6-6.3,3.1-9.1,4.7L625,563c-3.6,0.7-27-1.9-28,2.1
            c-4.6,2.2-3.7,0.7-7.8,0.6l-1.3,1.9c3.6,5.9-1.2,11.4-2.3,13.8c-1.3,2.8-1.2,4.1-3.2,5.9c-2.2,2-3.6,1.4-5.2,2.2
            c-1.9,1.1,0-0.3-1.5,1.3c4.1,4.9,1.5,5.5,1.5,12.2c-0.1,4.9-0.4,12,0.3,16.6c3.4,2,9.6,0,16.9-1.2c5.3-0.9,12.6-2.6,18.9-2.7
            c4.7-0.1,13.8-2.6,16.4-5.5c1-1.2,1.4-1.6,2.2-2.6l4.6-6.5c1.1-2.4-0.1-2.3,1.2-4.4c2.1-3.3,1.8-1.5,5.1-3.4
            C646.1,591.6,644.3,589.2,649,589.5z"
                />
                <path
                  fillRule="evenodd"
                  fill="#959595"
                  d="M540,677c0,0-0.8,1.4,3.1,1.8c1.9,0.2,3.6-0.3,4.9-0.6
            c0.7-0.2,1.4-0.3,2-0.4c0.3-0.1,1.9-0.5,2.6-0.7c1.4-0.3,2.9-0.5,5.1-0.3c-1.2-6.1-0.9-6.2,1.8-10.9c3.4-6.1,1.2-5.8,9.4-5.8
            c3.6-11.4,5.4-4.7,5.3-22.5c0-5.5-0.1-7.6,1.3-11.8c1.5-4.3-0.3-14.9,0.2-24.2c0.8-15-1.2-8.8-5.2-14.1c-1.1-1.5-1.2-4.1-2-5.5
            c-0.8-1.2-2.4-1.2-6.8-7.3c-2.9,0.7-4.1,1.9-6.3,2.2c-3.6,0.5-5-0.2-8.5,0.8c-8,2.3-4.4,13-8.1,28.9c-1.2,5-5.2,7.1-7.7,10.8
            c-1.7,2.4-0.9,8.4-6.1,11.5c-3.1,1.9-2.4-0.7-5.1,4.1c-3.2,5.7,3.4,28.5,5.3,38.4C538.5,675,528.4,674.8,540,677z M551.3,679
            l-0.3,0.4L551.3,679z M538.9,679.5l-0.3-0.5L538.9,679.5z"
                />
                <path
                  fillRule="evenodd"
                  fill="#959595"
                  d="M608.6,537.3c-1-0.2-3-1.9-3.1-2.6c-2.2-0.2-1,0.2-2.7-0.5
            c-1-0.4-2-1.3-2.2-1.5l-1.7-3l-3.9-0.2c-2.6-0.7-4.5-0.9-6.6-1.3c-2.2-0.4-4.1-0.1-5.6-1.7l-3.3,0.4c0.3,2.6,0.4,4.1-1.6,4.8
            c0.1,3.2-8,2.7-8,3.6c-0.7,1.4,0.5,0-0.9,1c-0.7,0.6-1.3,0.8-1.9,1.4c-7.7,8-4.6,20.2-4.2,24.5c0.5,5.7-0.1,6.6-1.5,10.8l7.4,6.8
            c3.3,2.9,0.4,5.4,6,8.2c7,1.6,12.8-13.5,12.8-14.2c0.3-4.8-2.9-6.1-0.3-8.5c2.3-2.1,4.1-0.9,7.2-0.8c0.6-0.5,1.2-1,1.8-1.4
            c4.1-2.4,10.9-1.9,15.6-1.3c21.9,2.6,25.4-12.7,54.6-8.7c0.1-4.8,0.3-10.6,0-15.4c-0.4-7.4-2-5.2-0.3-12.6
            c-21.2-4.8-13.3-8.3-26.6-3c-7,2.7-2.5,5.8-13.8,13C620.9,538.3,614.6,538.5,608.6,537.3z"
                />
                <path
                  fillRule="evenodd"
                  fill="#959595"
                  d="M619,471c-3.6-2.6-8.9-6.8-13.3-5.4c-3.1,7.5,9.9,14-6.4,20.5
            c-4,1.6-7.3,3.8-8.2,8.5c-0.5,2.8-0.1,5.1-0.6,7.8c-0.1,0.5-0.7,2.5-1,3.2c-2.5,5.3-5.4,11.4-8.2,16.9c-0.1,0.2-0.2,0.4-0.2,0.5
            c-0.4,0.8-0.5,1.4-0.7,1.7c4,0.7,5.7,1.3,9.4,2c7.7,1.6,5.6,0.3,9.9,1.9c2.8,1.1,1.9,2.1,3.4,3.5l3.8,2c10.4,5.3,18.5,0.1,25.6-7.5
            c6.8-7.3-1.4-2.3,10-7.4c2-0.9,3.2-1.7,5.2-1.5c2.4,0.2,15,5.3,19.7,5.8l5-13.8c0.1-0.2,0.2-0.4,0.2-0.6c2.7-8.9,3.2-5,7.4-7.9
            c2.6-1.9,3.1-6.5,1.1-9.2c-3.6-5-20.7-19.2-24.3-24.5c-4.7-0.3-5,2.2-6.2-3c-2.6,1.7-4.8,2.4-5,6.5c-1.4,0-1.4,0-2.7-0.2l-2-0.5
            c-2.2-0.7-2-1-4.4-1.7c-3.3-1.1-7-1-9.7-2c-0.2,0.3-1.5,2.7-1.6,2.7C623.1,470.6,624.7,475.2,619,471z M588.4,528.2
            c2.1,0.4,3.9,0.7,6.6,1.3L588.4,528.2z"
                />
                <path
                  fillRule="evenodd"
                  fill="#959595"
                  d="M621.6,470.5l1.4-1v-0.4c0.7-1.2,0.1-0.7,1-1.8c0.9-1.2,0.3-0.5,1.3-1.4
            c2.3-1.2,9.4,0.3,12.3,1.7l4.4,1.9l8.1-7.2c-1.9-3.4,1.1-2.8-7-12.2c-1-1.2-0.5-0.8-1.7-1.7c-2.2-1.9-3.4-1.3-7.8-1.3
            c0.2-4.1,10.1-24.5,12.6-29.6c1.6-3.1,4.6-4.8,7.9-6.3c1.3-13,3.5-4.4,4-17.5c0.3-10.1,1-8-2.7-17l-18.2-10.3c-4-1.7-4-0.3-6.9-3.1
            c-5.5-5.4-3.7-3.8-11.8-7.4c-5.1-2.2-8.5-4.6-14.3-5l-0.1-8.1l-4.2,0.4c-0.1,0.4-0.2,0.5-0.3,0.8l-1,2.4c-1.2,1.9-0.1,0.1-2.2,1.9
            c-2.8,2.3-1.2,3.6-4.1,5.1c-1.9,1-7.7,2.3-6.9,11.9c0.3,2.9,1.5,4.2,1.4,6.5c-0.3,4.6-1.4,11.2,0.5,16.9c5.3,15.9-3.1,5.3-3.3,18.5
            c-0.2,7.4-1.5,13.8,1.3,15.5c1.9,1.2,4.6,1.3,5.9,4.3c1,4.1-0.2,12.5,3.6,13.8c1.9,0.7,1.8-1.7,6-1c2.4,0.5,4.3,2.7,5.7,3.7
            c0.5,7,2.3,13.8,2.4,20.1C613.1,464.9,618.7,467.9,621.6,470.5z"
                />
                <path
                  fillRule="evenodd"
                  fill="#959595"
                  d="M542.7,444c-6.1,1.9-8.1,1-10.2,7.1c-2.4,7.1-2,4.3-4,8.8l-4.3,9.2
            c-2.6,5.2-2.6,11.1-3.7,13.8c-1,2.6-0.2-1.3-1.6,2.6c-1.5,4.3,1.3,4.1,3.4,3.5c6.6-1.9,11,2.9,11.2,3.6c0,6.8,0.3,7.5-3,12.1
            c-1.2,1.6-2.4,2.8-2,5.3c1,6.6,5.5,5.3,10.1,5.3l6,6.5c5.5,5,0,4.5,3.2,14.5l12.1,1c0.9-1.4,1.7-2.6,2.5-4c19,0,8.8,0.7,15.9-3.1
            l0.2-3.8c0.1-2.7,0.3-2.6,0.8-4.8l0.8-1c1.3-2.1,2-3.9,3.1-6c0.5-1.1,1-2.2,1.6-3.4c1.5-3.3,0.8-0.3,1.3-3.8l0.8-1
            c2.3-5.8,3-7.8,3-16.4c3.1-1.4,4.5-3.7,8.6-5.3c5.1-2,5.5-2.9,7.9-7c-0.9-2.6-1.5-2.2-2.3-5.1c-0.6-2.5-0.8-4.2-1.5-6.4
            c1.5-1,2.5-1.8,4.5-2.8l-2.6-19.2c-0.6-0.6-3.1-2.4-4.1-2.6c-2.8-0.7-3.1,0.6-5.7,1.2c-5.1-2.9-5-6.3-5-13.7
            c-1.5-3.2-3.9-4.4-6.8-5.8l-4.3,2.9c-13.2-5.7-10.4,2.4-16.2,5c-1.6,0.7-5.8,1.4-7.5,1.8c-1.8,6.4-2.5,7.8-8.1,9.5L542.7,444z"
                />
              </g>
              <g id="region-i" className="region pointer-events-[bounding-box]" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleOnClick}>
                <path
                  fillRule="evenodd"
                  fill="#A6A6A6"
                  d="M527.8,735.3c1.2-2.7,1.6-4.2,2.5-6.7c0.7-1.9,1.6-5.1,2.8-7.1
            l1.4,0.8c1.4,2.7,2.8,5.9,4.2,8.8c4.1-1.2,10.4-3.4,14-4.1c2.6-0.5,4.3,0.8,6.1,2c2.4,1.7,3,2.4,3.9,5.2c6.3-1.9,4.7-2.9,7.4-7.7
            c0.7-1.2,0.7-1.2,1-2.1c0.9-3.1-0.7-1.8,1.5-4.5c3.1-3.8,2.9,0.1,4.6-7.2c3.7-15.9-2.2-12.2-4.2-19c-4.1-13.7-2-9.4-11.6-13.4
            c-6.4-2.7-2.7-2-9.9-1.4l-0.3,0.4c-5,0.6-6.8,1.8-12.1,0.1l-0.3-0.5l-1.3-0.4l-1.2-0.8l-1.7-0.9l-2.5-0.9l-1.5-1l-0.5-0.6
            c-1.4-0.5-4.1-1.7-5.2-1.4c-4.8,1.6,4.1,4.2-10.9,4.2c-3.6,13.8-19.5,22.5-32.8,23.1c-4.3,0.2-9.8-2.7-12.6-5.9l2.2-2.7
            c-1.1-0.5-1.9-0.9-2.9-1.5c-0.2-6.6,2.2-0.5-0.2-5.9l2.2-1c-2.6-2.2-1.1-0.6-6.7-3.8l-3.3-1.4c-0.7,1.4-0.6,1.7-1.3,2.9l-6.2-5.9
            c-0.1-0.2-0.2-0.4-0.3-0.5l-4.8-3.5c-2.7-1.2-3.1-0.8-5.9,0.2c0.3-3.6,0.9-3.4,3-4.8l-1-5.2c1.5,0.3,0.8,0.2,1.5,0.6l1.4,1
            c0.2,0.1,0.3,0.2,0.5,0.3l5.4,5.5c2.3,2.3,0.7,2.2,3.6,4l0.9-3c-1.9-1.1,0.7,1.4-1-0.5c-0.6-0.7-0.3-0.2-0.4-2.1
            c-0.2-2.6,0.1-3.6,2.4-5.6l-2.5-3.4c-0.1-0.2-0.2-0.4-0.3-0.5l-2.6-2.6c-2.4,2.9,0,2.1-3.2,3.2l-1.6,0.6c-2.2,1.4,2.1,0.8-3.1,1.4
            c1.8-12.8,0-2.6-0.2-11.3c0.3,0.2,0.6,0.1,0.8,0.4l5.2,1.8c-1.4-7.4-3.8-6.7-6.4-6.5l-0.4,5c-5.3-0.7-5.7-0.5-8,3.6l-4.1-0.7
            c-3.6,3.4-5,4.1-6,10c-0.5,3-0.6,3.2-0.3,6.6c0.7,7.4-5.1,3.4-0.7,14.1c2.4,5.7-0.7,2.6-0.6,8c0,2.6-0.6,4-1.2,6.6
            c1.3,1.7,1,1,2.2,3.3c-3.7,7.9-4.6,6.2-1.5,12.9l5.3,0.4c0.2-3.4-0.5-4.1,6.6-5.7l6.4,14.8c0.9,1.7,0.5,0.6,1.1,2.2
            c0.1,0.2,0.1,0.5,0.2,0.7l1,2.6c12,0,5.5-3.4,13.4-5.8c6.7,4.3,2.9,5,13.8,6c4.1,6.8-0.3,6.3,5.9,15.9c1.7,2.7,6.8,10.9,8.7,12.5
            c2.7-0.5,3.9-2.4,6.6-3.7c3.6-1.7,4.3-3.2,7.3-8.5c0.9-1.5,0.7-2.5,1.9-3.9l6-5.6c4.7,1.9,2.8,3.1,10,3
            C523.9,738.8,526.6,740.3,527.8,735.3z"
                />
                <path
                  fillRule="evenodd"
                  fill="#A6A6A6"
                  d="M517.9,444.8c-4,0.2-1.8-0.3-4.1,1.1l-3.4,2.3
            c1.1,3.3-0.8,0.5,2.9,2.5c-0.2,2-0.2,0.9-0.4,3.1c2.3-1.1,0.6,0.4,2-1.9c1.9,8.5-7.7,10.7-8.9,12.3c-0.9,1.2,0.7,1-1.7,5.7
            c-1.7,3.4-4.1,9.6-1,13.5c7,8.9,2,5.6,10.6,8c0.8,2.7,0.2,2.6,0.7,4.6l1.7,3.1c1.5,2.5,2.2,4,1.4,7.7l-0.7,2.3
            c0,0.1,0.1,0.3,0.1,0.3l0.7,1.7c-3.2,3,0.9,1.6-4.1,3.3c0,3,0.1,1.9-0.2,3.4l-0.8,10.7c-0.7,5.5-2.2-0.2,0.1,6.7l3.8,26.1
            c-0.5,9.4-1.1,4.3-5.9,14.5l14.8-1.2c0,20,1.4,9.4,2.2,14.2c0,4.2-0.3,3.5,2.2,5.8c0.1,9.9-0.9,5-1.3,10.1l4.9,5.8
            c5.5-4.5,5.5-15,6.1-21.7c0.5-4.7,0.2-8.4,3.1-11.1c3.3-3,7.1-2,11.8-2.6c3.3-0.4,4.9-1.8,5.8-4.1c4.3-10.2-3.5-9.6,1.7-27.6
            c1.4-4.8,2.1-5.8,4.9-8.7c-5.7,0.1-2.6,1.4-6.4,3.1c-3.8,1.6-9.1-0.1-13.5-0.2c-1.1-2.1-2.3-2.9-2-5.5c0.1-1,0.9-2.4,0.6-5.3
            c-0.5-5-2.2-3.6-4.6-5.7c-5.3-4.8,0.4-4.3-11.1-4.5l-2.7-5.1c-2.2-8.2,5.6-5.4,4.8-18.1c-9.7-7.2-5.9-1.9-13.8-2.2
            c-2.6-6.3-0.1-4.9,2.3-15.9c0.7-3.3,1.3-5,2.9-8c1.5-2.7,2-4.8,3.3-7.3c-1.2-1.7-2.6-2.6-2.9-5.2c-1.7-16.4,4.4-6.2,2.8-19.8
            c-2.9-1.4-5.7-1.7-10-1.4C515.4,441.8,516.3,437.6,517.9,444.8z"
                />
                <path
                  fillRule="evenodd"
                  fill="#A6A6A6"
                  d="M501.6,585.5c-3.9,9.2,1.4,9.7,0.4,17.2c0,0-0.7,4.4-0.9,4.9
            c-0.9,2.7-1.4,1.7-2.2,3.4c-1.9,4.2,1.3,7.7-4.9,5.5l3.3,4.6c5.1,7.9-1.7,7.8,1.5,13.5c5.3,9.7,1.2,10.6,1.5,15.2
            c0.4,5.9,1.8,1.1,2.3,5c0.1,0.7-0.7,3.4-0.3,5.7c0.3,2,1.5,3.9,2.2,6.1l1.1-2.9c4.2,5.9,2.9,0.5,7.3,12h8.2c0.4-1,0.7-1.6,1.1-2.7
            c3.9-8.9-11.4-33-1.9-43.9c2.9-3.4,1,1.4,5.5-4.6c4.1-5.3,1.4-2.1,2.2-6.1c0.3-1.6,3.2-4.4,4.2-6.1c-0.9-1.3-4.4-5.4-5.3-6.2
            c0.1-4,1.5-5.7,1.5-6.3l-2.6-10.6c-1.5-3.8-1.9,2.9-1.9-12.4c-17.4,0-12.6,2-17.6,5.7L501.6,585.5z"
                />
                <path
                  fillRule="evenodd"
                  fill="#A6A6A6"
                  d="M551.4,436.8c0.9-1.4,1.2-3.5,2.6-5.1c1.6-1.8,2.8-1.6,5.4-2.2
            c6.9-1.4,4-3.6,8.4-6.7c6.2-4.3,13.6,5.7,14.7-6.3c0.5-6.3-1.3-12.9,1.5-16.9c8.9-12.7-1.4-0.7,1.1-28.1c0.4-4.4-3.2-6.8,0.2-14.1
            c1.7-3.5,2-9.8,2.8-15c0.2-1.5,0.2-2,0.4-3.8c0.1-1,0-1.2,0.2-2.2c0-0.1,0.4-2,0.5-2.3l-1,1c-4.9,4.7-9,2.6-11.5-1.7
            c-1.8-3.1-3.4-4.6-4.6-8.5c-5,0.8-1.9,0.8-4.6,1.9c-1.4,0.6-0.7,0-1.8,0.4c-3.3,1.2-3.3,1.9-3.1,4.3c0,0.5,1.7,4.2-1.2,7.7
            c-0.9,1-0.2,0.3-1.4,1.2c-7.2,4.7-18.3-0.5-18.5-0.5c-3.2,1.4-6.4,4.3-8.3,6.1c-1.8,3.6,2.8,5.5,3.8,16.1c0.6,6.1,1.2,7.7-1.8,13.8
            l-8.6,15c-1.5,7.7,3.1,5.1-6,14.8c0.5,1.9,0.5,4.5,0.3,7.2c-0.1,3.1,1.2,3.3,2.5,5.4c-0.9,2.3-0.7,1.4-1.7,2.9
            c-2.7,4.2,0.6,3.6-4.6,7.1c-2.8,1.9-1-1.1-2.4,3.2c6.4,0,8.9-0.6,13.7,1.6c0.3,1.7,0.5,4,0.4,6.1c-0.3,5.7-4.4,4.5-3.1,14.3
            c0.7,4.8,3.6,2.7,4.7-0.4c1-2.8,1.1-7.2,5.7-9.2c0.7-0.3,2.4-1.1,3.3-1.2C539.3,442.4,551.1,437.2,551.4,436.8z"
                />
              </g>
              <g id="region-ii" className="region pointer-events-[bounding-box]" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleOnClick}>
                <path
                  fillRule="evenodd"
                  fill="#747474"
                  d="M726.6,633.5c0.7-0.5,0.5-0.4,1.5-1c8.9-4.7,25.6-2,35.6-2.2
            c4.3,0,8.9-10.6,10.8-15.1c2.8-6.7,6.7-12.1,9.7-18.7c0.6-1.3,1-2.1,1.6-3.3c2.4-4.4,0.9-4.8,4.2-11c1.5-2.8,1.4-0.7,1.4-4
            c0-2.5-0.8-1.2,0.5-4.1c3.8-8.7-3-6.3,3.7-14.8l3.2-7.7c1.4-4.1,0.7-4.6,0.1-9.2c-2.4,0.9-1.7,1.7-3.4,2.6
            c-2.7,1.4-2.2-0.4-5.7,1.7c-1.4-3.5-1.5-1.8-3.5-4.3s-1.7-4.5-0.7-7.3c2-5.5,1.2-1.9,0.4-5c-0.7-2.7-0.5-6-0.1-8.8
            c2.7,1.7,1.4,1.6,2.9,4.3c-0.1-5.3-1.5-5-3.4-8.4c-3.7-6.8-1.3-1.4-6.3-5.5c-3.3,2,0.4,1.2-3,1.5c-3.5,0.4-8.3,3.1-8.5-3.2
            c-7.4,2.7-2.9-1.7-6.8-4.7c0.1-0.2,0.2-0.8,0.3-0.7c0,0.2,0.2-0.5,0.2-0.6c1.1-3.3-2.2-4.4-3.7-7.7c-0.9-1.9-1.3-3.4-2.2-5.3
            l-1.4-4.3c-14.1,0-32.3-2.1-45.9,1c-5.2,1.2-2.6,2.1-15.3,2.8l-9.6,0.9c-1,17,0.1,7.2-6.7,13.2c-1.5,1.4-2.2,3.8-2.6,5.9l-0.7,1
            l-0.5,1.4l-1,2.2c0.1,1.7,0.8,2.4-1,2.4c-0.3,5-3.6,9.1-3.8,12.2c-0.1,1.2,0.8,4.4,1,6.5c0.3,2.8,0.1,6.4,0.1,9.2
            c0,14.6,4.1,20.6,3.6,30.2c-10.3,8.5-4.6,7.7-7.2,10.9c-3.6,2.4-3.6,1.2-7.9,2.7c-3.6,0.5-3.5,1-6.5,2c-2.3,0.8-3,1-4,2.6
            c-7.6,3.4-10.2,4.5-3.2,10.9c3.5,3.2,2.3,3.8,3.3,8.5c0.8,4,4.2,2.6,9.1,2.6c4,0,8,0,11.9,0l25.3,33.7L726.6,633.5z M782.6,520.5
            l-2.1-4.4c3.2-1.4,2.1-0.8,3.2,0.7C786.1,519.8,783,520.3,782.6,520.5z"
                />
                <path
                  fillRule="evenodd"
                  fill="#747474"
                  d="M736.2,631.5l-43.6,20.3L683,639c-1.4-1.9-1.9-2.9-3.4-4.8
            c-16.4-20.5-8.8-16.9-32.6-16.9c0,3.2-0.1,4.1-0.5,6.3c-1.5,9.8-7.2,23,6.5,22.2l-1.4,12.7l-19.6,9.3c0,10.6,3,20.7,3,33l18.6,16.2
            c2.9-1.4,8.1-7.1,11.3-9.6l33.4-29.4c12.6-10.2,19.6-21.5,29.2-33.7C730.2,640.8,734.8,635.8,736.2,631.5z"
                />
                <path
                  fillRule="evenodd"
                  fill="#747474"
                  d="M651.5,647c-8.6-2.2-3.4,1.4-9.7-4.1c1.6-14.2,7.3-26.2-0.6-37.4
            c-1.9-2.7-1-2.2-4.8-2.8c-0.4,0.9-0.7,1.7-1.1,3.1l-2.3,3.6c-5.5,5.8-8,7.4-20.4,8c-11.1,0.5-22.5,5.1-34.4,5.2
            c-2.7,14.4-2.3,0.9-2.4,21.7c0,3-3.6,16.7-6.8,17.3h-4.2c-2,0.6-11.6,14.4-0.9,17.9c2.7,0.9,4.6,1.9,7.3,2.6
            c0.5,3.1,1.7,6.1,2.7,8.2l11.7-1.7c4.7-0.3,7.6-1.5,12.5,0.2l1.9,0.7c5.2,1.5,15.2,0.2,16.7,6.9c1.4,6.5,0.3,18.8,2.3,24.4
            c1.4,3.9,3.7,4,5.8,7.5c1.8,3.1,2.3,5.2,4.4,8.6c1.5-1,3.6-2.9,5.4-4.3c5.5-4.1,10.9-7.7,15.7-12.7c2.1-2.2,0.5-0.2,1.4-1.9
            c-6.3-5.6-12.7-10.9-18.3-16.8c0-12.6-3-22.4-3-33.5c0.8-2.2,3.4-2.5,5.4-3.4l6.3-3c1.2-0.5,5.5-2,6.4-2.7
            C649.9,657.5,651.8,650.6,651.5,647z"
                />
                <path
                  fillRule="evenodd"
                  fill="#747474"
                  d="M600.7,331.5c-1.4,0-3-0.9-4.2-1.4c-4.1,3.9-4.7,0.5-5.8,4.9l-2.2,17.6
            c5.8-1.4,8.4-8.2,9.4-9.6c0.7-1,7.7-4.8,7.7,2v4.4c3.9,0.2,19.2,6.8,21.9,9c1.5,1.2,2.3,2.6,3.8,3.8c2.8,2.4,1.7,0.8,5.5,2.1
            l19.9,11.1l3.8,11.4c-0.3,7.2-1,11.6-3.7,18.4c-1.1,2.7-0.7,4.4-1.2,7.2c-2.4,1.5-6.1,2.3-7.6,5c-3,5.3-11.3,23.5-12.2,28l6,0.1
            c3.9,6.5,7.7,7,9,13.4c0.5,2.9,1.2,3.6,1.4,6.8c5.7-0.8,5.8,1.1,15.1,10.5l13.8,13.5c4.8-0.3,12.4-1.4,17.7-1.5
            c6.4-0.2,3.2,0.1,7.4-1.7c5.1-2.2,41.1-1.3,48-1.3c-0.5-10.3-3.4-3.6-3.3-15.6c0-8.6-1-8.6-2.3-12.6l-0.7-10.2c0,0,1.1-0.5,1.4-2.6
            c0.4-2.9-1-0.7,1.9-3.8l-0.8-5c1.4-1.1,2.4-2,3.7-3.2c-0.4-3.4-1.4-3.1-1.3-6.8c0.1-4.4,1-4,1.4-7.4c-1.5-5.7-1.6,0.8-1.7-5
            c0-5-2.9-5.1,0.4-9.7c2-2.7,0.7,0.3,3.1-2.7c6-7.7-0.2-1.9,7-5.6c2.7-1.4,0.8-0.7,2.6-3.2l7.6-11c0.5-1.3,0.7-3.5,0.8-5.2
            c0.3-3.3-1.2-10.8-3.8-13.8c-4.8-5.4-5.4-2.6-8.2-9.5c-1.7-4-0.2-0.9-0.2-4.7c0-5.7-3.9-2.6-5.9-2.6c-10.9,0-3.3-2.2-8.1,7.9
            c-2.7,5.8-0.4,7.3-1.7,12.4c-6.8-0.3-3.5,0.8-14,10.5c-11.5,10.7-28.2,0-38.4-3.6l-23.6-9.3c-5.8-3.5-6-2.2-12.5-7.5l-8.7-5.5
            c-7.6-4.5-9.2-2-18.3-9.4c-0.9-0.7-1.2-0.8-2-1.4c-1.7-1.2-2.1-1.7-3.6-3.2c-5.1-5.1-9.2-7.5-19.1-7.5
            C604.8,329.3,602.6,331.5,600.7,331.5z M640.3,222.8l4.8,3.5c1,6,0.9,5.5,5.6,7.7c3.7,1.9,5.7,2.4,9.6,3.8l1.2-0.5
            c0.1,0,0.4-0.2,0.5-0.2c8.3-3.9,1.2-3.2,1.6-10c0.3-4.4,0.2-4-0.1-8.5c-3.2,0.5-1.9,0.2-4,2.6c-3.8-0.7-7.4-2.3-10.5-2.9
            c-4.8-1-1.4,1.9-5.6,3.7C641.3,222.7,642.6,221.4,640.3,222.8z M710.8,278.1c-0.1,4.9,1,2.5-1.4,6.4l-0.6,1.1
            c2.2,2.2,1.6,1.2,2.4,4.2c-2,2-3.5,2.2-5.8,4.2l1.2,6.8c8.1,1.1,2.9-4.1,8.4-8.2c7.9-5.9,6.8-3,7.2-8.7l3.8-0.5l1.6-3.2
            c-10.1-4.5-2.9-5.7-9.6-5.7C714.3,274.5,713.4,276.5,710.8,278.1z M630.9,291.9c-1.2,1.6-0.6,1.2-1.9,1.5c4.7,4.5,3.3,4.6,14,2.5
            c4.9-1,14,0,14.3-4.8c-2.4,1.2-6.1-1.8-8.7-3.1l-11.8,3.4C634.9,291.9,632.8,291.8,630.9,291.9z M714.5,195.1
            c0.7,4.7,0.6,4.7,9.1,10.5c7.2-7.3,1.8-6.2,4.3-11l-3-2.9c-0.3,0.2-0.6,0.1-0.7,0.4L714.5,195.1z M626.6,273
            c0.1-7.2-1.1-11.6-2.5-17.3c-1-4,0.5-2.6-2-5.4c-2.4,2.5-3.4,9.8-2.9,13.5c0.5,3.7,1.4,3.1,3.4,5
            C625.7,271.6,622.9,270.9,626.6,273z M743.7,338.9l2.2,2.6l-1.6,3.9c3.1-2.2,5.7-4.4,5.2-9.9c-3.5,1.2,0.2-1-2.7,0.7
            C745.8,336.8,744.6,338,743.7,338.9z"
                />
                <path
                  fillRule="evenodd"
                  fill="#858585"
                  d="M707.7,80c-1.5,3.1-0.4,9.3,1.2,12l1.7-2.5c0.1-0.1,0.3-0.3,0.4-0.4
            c1.8-1.9,2-0.4,2-3.8C713,81.3,710.7,79.4,707.7,80z M723.6,61.9c0.5,4.4,0.4,4.8-2.7,7.7c-3,2.9-3.4,3.6-3.4,8.9
            c5.5,0.7,4.1,0.5,6-1.2c0.9-0.9,1.7-2.1,2.1-2.7c-1.1-3.1-1.4-1.4-2-4.3c7.3-9.9,9.9-4.9,9.2-10.5
            C728.4,58.6,730.2,59.4,723.6,61.9z M702.2,28.9c1.9-0.6,4.6-2.2,5.8-3.9c3.2-4.4-1.4-3.3,3.5-6c-0.9-7.5,2.9-6.6-1.5-11.4
            c-6.4,1.7-1.3,2.4-6.6,10.4C700.8,21.8,696.5,24.2,702.2,28.9z"
                />
              </g>
              <g id="region-iii" className="region pointer-events-[bounding-box]" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleOnClick}>
                <path
                  fillRule="evenodd"
                  fill="#CFCFCF"
                  d="M530,734.5c-1.2,3.3-1.4,4.8-4.7,5.9c-6.1,0-13.2,1.1-16.3-2.2
            c-0.2,0.1-0.5,0-0.7,0.3l-5,3.8c-3.5,4.3-5.1,14.7-13.7,14.7c1.7,11.2-5,2.2-9.9,17.9c-1.7,5.6-1.4,13.4-2.8,18.6l8,5.2
            c6,3.9,10.6,6.4,14.9,12.8c0.8,1.2,1.7,3,2.5,4.2l2.9,4.9c6.8-3.3,3.8-3.1,16.7-8.7c15.7-6.7,10.2-2.7,17.7-4.1
            c1.6-0.3,2.1-0.9,3.7-1.2c2.8-0.5,4.9,0.3,7,0.2c7.6-0.5,2.7,0,7,1c1.7-4.2,2-2.8,0.9-6.8c-5.3,0.7-5.5-0.1-4.5-5.2
            c1-5.5,0.7-4.7,3.3-8.1c-0.5-1-0.6-1.9-1.1-2.8c-4-7.5,0.2-2.7-2-9.6c-0.8-2.4-2.2-4.4-2-6.6c0.3-3.4,1.7-3.5,2.2-7.3
            c-6.7-2.4-2.7,0.8-8.4-4.8c-4.4-4.3-3.1-3.2-5.1-9.1c-1.9-5.8-2.3-13-3.6-16.2c-1.2-3-1.7-1.8-2.4-5.6c-0.2,0.1-0.5,0.1-0.5,0.3
            C532,725.5,531.2,731,530,734.5z"
                />
                <path
                  fillRule="evenodd"
                  fill="#CFCFCF"
                  d="M527.8,864.1c0.8,0.9,1.5,1.5,2.2,2.4c1.7,2.2,1.9,6.3,11.2,6.5
            c4.2-4.7,2.4-4.3,4.8-7c2-2.3,3.6-4.3,5.6-7c3.1-4.1,3.4-10.3,15.5-6.5c0.9-1.5,0.9-2.3,2-3.1c5.9-4.3-1.7-2.2,5.1-6.4
            c1.4-0.8,1.4-0.5,2.9-1.7c-0.9-5.3-2.1-1-2.2-7.1c3.1-1.4,4.3-0.4,5.8-3.9c0.8-1.9,0.4-0.7,0.8-2.7c-1.7-1.7-3.3-2.1-2.6-5.7
            c-0.9-3.2,0.7-0.9-7.5,0.5c-1.2-1.5-2.5-2.7-3.8-4.2h-7.9l-2-7.3c-1.5-2.6,0-0.9-3.3-2.3c-2.7-1.2-10.2-0.9-11.6-0.3
            c-9,3.1-4.3-1.9-17.1,3.7c-6.2,2.7-24.3,7.7-22,19c0.7,3.2,4.4,0.5,5.2,9.4c1,11.5,1.8,5.1,3.8,11.6
            C521.2,845.3,514.8,863.5,527.8,864.1z"
                />
                <path
                  fillRule="evenodd"
                  fill="#CFCFCF"
                  d="M480.2,770l0.6-1.2l0.8-1.7l1-2.3l0.8-0.9l0.9-0.8l2.4-0.9l1.8-0.4
            l-0.1-2.8l-4.4-0.2c-1.4-1.9-2.4-3.6-3.9-6c-8.8-14.4-5.8-8.8-9.5-22.3c-9.4-0.7-8.2-1.5-13.2-6c-2.7,1.2-5.6,5.4-7.5,5.9H440
            c0.3,1.1,2.7,7.9,2.8,8.7l-5,1.7c2.6,6.9,5.7,5.5,8.2,6c0.5,8.2-2.2,9.6-3.6,12.1c1.8,2.5,2.8,3.4,1.4,6.8c1.4-0.1,2.5-0.7,3.1-0.7
            c2.9-0.1,1.5,0.4,1.4,1.4c-0.2,2.4-1.7-1.4,0.3,2.9c3.3,7,1.9,1.8,0.7,6.5c-1,3.9,0.7-1.2-0.1,2.4c-3.4,0.6-3.8,1.1-6.8-0.4
            c0.5,4,0.1,1.8,2.1,4.4c-2.4,1.5-1.6,0.3-3.7,2.5c6.7,9.2,8.1,7.6,10.5,14.5c1.2,3.5,1.1,2.1,2,3l2.2,3.1c0.6,1.1,1.6,2.1,2.5,3.3
            c-0.9,3.1-1.9,1.9-0.4,5.4c3.8,8.7,5.6,18,6.8,27.5c0.5,4.1-0.7,2.3-1,6.1l-0.7,13.4c5.5,5.4,4.1,5.6,3.8,8.4l2.4,2
            c0.1,0.1,0.3,0.3,0.5,0.5c-1.2,2.5-1.6,1.6-2.1,3.8c2.7,1.7,7-2,5.7,4.3c4.1,0.2,7.9,4.9,9.1-3c0.9-5.6,1.4-3.6,1.9-7.3
            c0.5-3.8-1-2.7-2.3-6.4c4.5-0.7,6.4-2.5,7.2,3.4l2.9-0.5l0.4,5.4c4.6-1.4,5.1-6.4,11.6-7.7c8.2-1.7,5.4-3.1,9.8-8.4
            c-1.4-3.4-5.4-6.8-5.9-11.1c-0.9-7.5-0.5-7.7-5.3-11.8c-0.2-6.8-0.7-5.6,2-10c-6.3-9.8-3.1-8.3-11.6-16.9c-3.3-3.4-5-3.2-8.5-5.7
            l-9-6c0.5-4,1.2-8.1,1.8-12.2C477.8,776.8,478,774.1,480.2,770z"
                />
                <path
                  fillRule="evenodd"
                  fill="#CFCFCF"
                  d="M521.9,865.3l-0.7-0.8l-0.9-0.8l-1.5-1l-0.9-0.8c-0.9-1.1-1.5-1.3-0.2-3.3
            l0.1-4l-0.7-1.6c-3.9-0.4-1-0.3-2.2,0.7c-0.2,3.3-1.3,4.6-2.8,6.9c-1.8,2.6-2.9,3.9-6.3,4.7c-4.8,1-8.8,3-10.1,7.7l-0.2,0.9
            c0,0.1-0.1,0.3-0.1,0.4c0,0.1-0.1,0.3-0.2,0.5l-3.6-0.3c1.5,3,0.7,0.4,1.1,3.6c-3.1,1.2-0.4,0.7-4,2c2.6,1.9,1.9,0.3,4.5,2
            c-0.6,2.9,1,0-0.9,1.4c0,0-3.7,1-3.1,5.3c0.3,2.4,3.8,3.1,6,5.8c0.6,0.8,1.1,1.7,1.4,2l5.1,1.7c2.9,0.9,8.1,0.2,6.5,12.3
            c-0.7,4.9-1.9-0.6-0.9,5.2c1.7,9.4,3.4,6.5,8.9,9c3.2,1.4,1.7,2.9,5.8,4.4l0.8-3.7c1.8,0.5,5.5,4.3,10.5,0.6
            c4.3-3.2,6.2-8.3,4.3-14.4c-0.4-1.3-0.5-1.6-1-3.4c-1.6-5.9-1.4-11.4-2.9-13.7c-1.8-2.7-3.2-0.9-1.7-5l-2.6,0.3
            c-0.9-7.8-0.5-4.8,0.3-14.2l-0.9-3.3c-0.7-1.1,0.4-3.4,0.8-4.6C526.8,865.1,528.5,866,521.9,865.3z"
                />
                <path
                  fillRule="evenodd"
                  fill="#CFCFCF"
                  d="M641.6,774.2c-3.2-8.2-6-17.1-9.1-26l-5.8-11.8c-1-2-1.4-3.6-2.4-5.8
            c-1.8-3.9-1.7-2.5-4.2-5.1c-8.7-9.4,1.7-27.3-8.9-32.1l-15.4-3.7c-4.4-0.7-17.8-0.2-21.5,3.1c3.3,7.4,5.8,1.9,5.3,14.3
            c-0.3,7.2-1.4,11.1-6.5,14.1c-0.6,6.1-0.6,4.4-2.9,8.9c-5.3,10.5-9.3,3.6-10.9,1.9c-1.4-1.5-2.1-3.2-4.4-3.6
            c-4.1,0.6-13.3,3.2-15.7,4.8c2.5,8.5,1.7,19.4,10.2,24.7c2.6,1.6,4.9,1.6,7.8,3.8c-1,3.2-4.8,4.5-3.2,9.2c2.2,6.7,2.4,3.2,1.8,10.8
            c2.7,3.2,1.5,1.2,2.9,5.8c0,0.1-3.6,6.4-3.7,12c3.1,0.1,3.9-0.5,5.1,1.9l0.7,3.4l-0.6,0.6c-0.7,3.4-1.9,6.1,0.7,9.6
            c1.1,1.4,0.5,1.2,2.3,1.9c10.1,0,5.1,2.5,9.6,3.7l0.7-0.6c2.9-0.2,3.1-1.5,4.5-3.5l3.8-1c4.3-2.5,1.3-0.7,6.5-1.7
            c2.7-0.5,3.1-2.1,6-3.4c1.8-0.8,12.7-2.4,14.9-2.5c9.2-0.5,5.8,10.2,24.9,9.7c0.5-1.9,0.5-1.2,1.1-3.1c1-2.9,0.9-6,2-8.6
            C638.6,803,642.6,776.8,641.6,774.2z"
                />
                <path
                  fillRule="evenodd"
                  fill="#CFCFCF"
                  d="M635.4,813.8L635.4,813.8z M636.4,815.5l-0.8,2.5
            c-0.3,1.9-0.2,1.9,0.9,4.2c2,4.1,2.2,3,2.2,8.9c0,3.9,0,7.8,0,11.7c1.2-3.1,0-3,2.4-6.5c1.8-2.6,3.1-3.8,4.3-6.1
            c1.4-5.8-3.5-5.6-0.5-9.4c1.6-2,1.6-3.8,3.6-5.6c-5-10.8-8.5-12.5-2.7-23.7l4.9,2.4l1.8-3.3c1.7-2.6,0.7-2.7,4.2-4.1
            c0-3.6,1.9-4.9,1.7-7.1c0-0.3-0.5,1.6-0.5-1.8c0-7.2,4.3-7.1,6.5-11.1l3-3.8c0.9-1.5,0.1-1,1.4-2.8c2-2.8,5.3-4.8,7.3-7
            c-1.4-2.2,0.2-1-2.9-1.5c1-4.4,1.9-1.7,1.5-5.8c2.4-0.5,3.1-1,4.5-2.1c-1.2-5.3-3.6-4.8-8.8-4.1c-4.9-6.2-6.6-20.2,2.1-26.1
            c5-3.4,0.9-3.5,7.5-5.1c3.1-7.3,1.5-3.6,8.5-9.2c4.8-3.8,3.5-7.6,10.2-4.8c2.1-1.6,1.4-1.6,4.2-2.7c3.4-1.4,2.3-1.1,5-3.2
            c6.3-4.8,9.9-0.5,15.8-4.3c4.8-3.1,3-4.3,9.3-5.6l5.6-1.9c-3.1-5.6-0.3-5.4,1.9-10.1h7.6l-1.3,6.2l-5.4,2.9
            c-0.1,7.9-1,7.3-6.5,12.1c-3,2.7-6.2,7.9-6.9,12.3c2.8-1.9,7.7-4.9,9.2-8.4c1.2-2.9-0.6-3.6,2-6.4c2-2.1,2.8-1,4.9-4.3
            c2.1-3.2,5.7-6.6,9-8.6c5.1-3.2,1.9-3.8,5.3-8.2c1.4-1.8,1.1-1.5,1.5-3.4c-3.6,2-3.7,2.4-6.2,0.9l0.4-1.6c1.4-5.5,4-4.9,6-10.3
            c-2.5-3.7-3.6-2.3-3.8-7.5c1.6-2.4,2.7-2.2,3.6-5.1c0.9-2.8,0.9-3.2,2.2-5.7c-23.9-0.2-21-3.3-28.8,7c-1.8,2.4-4.4,5.4-5.8,7.6
            l-5.5,7.8c-2.2,2.8-3.9,5.1-5.8,7.6c-7.6,9.9-17.7,18.1-27.2,26.5l-28.6,25c-4.9,4.7-26.3,23.2-30.2,24.3
            c1.1,6.2,8.7,25.2,11.4,33.1c4.3,12.1,1.1,10.8-1.8,29.3c-0.1,0.7-0.2,1.4-0.4,2.1C638.3,806.5,638.5,809.6,636.4,815.5z"
                />
                <path
                  fillRule="evenodd"
                  fill="#CFCFCF"
                  d="M592.6,877.5l1.5-0.3c1.4-0.2,0.2-0.8,4.1-0.1c1.6,0.3,2.2,1.1,3.7,1.3
            c-0.3-1.1,19.9-10.4,23.4-8.6l1.1-0.6c3.4-1.9,6.8-5.1,10.9-6.5c0-4.6,0.7-6.5,0.7-11.4l-0.8-22.6c-0.6-4.1-2.7-4.2-2.9-9.4
            c-6.5-0.3-9.4-0.2-14.6-2.8c-4.6-2.3-3.6-5.4-8-7c-3.1,0-14.6,1.5-16.7,2.5c-2.1,1-3.9,2.8-6,3.3l-7.2,1.9c-0.1,2.6,0,1.6-0.5,3.6
            c-0.8,2.9-0.3,0.7-1,2.9l3.8,3.8c-0.7,2.3-1.4,3.4-2.2,5.2l-0.6,0.6c-1.3,2.1-0.3,0.8-2.6,1.9c-1.2,0.5,0-0.6-1.9,1.1
            c0.9,2.3,1.5,2.2,2.9,5c-2,2.6-3.1,2.9-6,4.7l0.5,3.3l-0.6,0.7l-2,0.7c-6.9,3.1,2.7,4-13.5,3.1c-0.8,0.7-0.5,0.3-1.3,1.4
            c-3.9,4.7-12.5,15.7-14.7,20.6l2.7,3.2c6.1-0.2,13.9,1.5,19.9,1.4c5.1-0.1,4.7-1.1,7.8,2.7c2.2,2.7,5.4,4.4,9.3,4.4l-1-4.5l5.8,0.8
            C591.1,880,592.2,878.5,592.6,877.5z"
                />
              </g>
              <g id="region-iva" className="region pointer-events-[bounding-box]" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleOnClick}>
                <path
                  fillRule="evenodd"
                  fill="#E9E9E9"
                  d="M624.5,871.5l-14.2,4c-0.5,3.1-1.2,2.8-1.5,5.8c0,0.3,0,1.2,0,1.5
            c-0.1,4.3,0.5,4.7-1,8.4c2.6,4.3,4.9,7.3-0.7,7.9c-1.4,4.2-1,9-0.2,13c3.9-0.2,4.1-0.3,6.7,1.6c4,3.1,3.2,5.8,5.5,9.6l2.7,4.8
            c1.4-2.1-1.1-3.8-0.1-6.8l6.1-7l2.9,0.9c-0.4,1.4-0.3,0.9-0.5,3.1c5-0.5,1.9-0.9,4.6,1.4c1.4,1.3,1.4,1,2,2.7
            c2.2,6.1,2.6,5.1,0.4,11.7c-0.9,2.7-3.9,8.2-2.5,10.8c2,0.6,2.4-1.4,4.2-3.4c2.1-2.3,1.5-1.9,4.5-2.9l-2.8-2.8
            c1.8-6.6,1.4-2.4,0-9.4c-1.1-5.3-0.7-11.4,4.1-15.2l5.6-2.7c1.9-0.5,2.7-0.8,4.6-1c-1-7.7-14.3-23.8-16.2-30.2
            c-1.9-6.7-0.5-6.9-0.3-13.3C631.7,866.6,630,872.6,624.5,871.5z"
                />
                <path
                  fillRule="evenodd"
                  fill="#E9E9E9"
                  d="M622.9,944.8c3.1-3.4-0.2-2.7,5.1-5.3c-3.6-2.6-3.6,0.3-4.3-5.4
            c-0.5-4.2,0.2-2.4-1.5-4.4c-0.1,3.3-0.4,5.7-0.7,8C621.3,941.5,622.5,940.8,622.9,944.8z M599.9,936c-1.9,1.9-5,1.4-7.7,2.1
            c-0.2,3.1-0.8,3.9,1.3,2.5c3.9,0,3.9-0.5,6.9,1.2c-0.9,4.3-3.6,5.4-3.3,11.1c0.2,3.1-0.4,9.5,0,11.7c6,2.4,18.6,1,21.7,7.6
            c2.8,6.1,0,11.5,6.1,15.7l3.9,3.6c1.2-0.8,0.9-0.3,2.5-1.2l2.5-1.3c4.5-2,1.6-2.1,5.2-3.8c4.5-2.2,8.5-1.8,9.8-7l7.2-0.9
            c8.4-2.1,1.1-14,13.9-14.1c0.8-3.8,4.7-8.4,6.7-12.6c2-4.1-0.4-11.2-0.4-16.7l-7.8-3.6c-5.1-1.7-9.3-16.6-13.2-21.1
            c-17.8,2-14,12.7-12.3,21.3c0.9,4.1-1.9,6,3.5,7.2l0.6-5.9c3.9-0.4,7.2-1.9,9.5,2c2,3.5,0.9,6.5-1.2,9c-3.2-3.5,0.5-3.4-5.3-3.6
            c0.9,5.3,1.5,0.9,0.7,6.5c-3.9-1.1-2.5-0.6-4.1,0.9c-2.6,2.3-0.6,1-3.9,2.8c-2.7,1.5-1.7,1.3-3.4,3.2l-3.2,2.7
            c-2.9,2.8-1.7,4.8-7.1,5.3c-2,0.2-2.9-0.9-4.4-0.6c-2.1,0.4-0.6,0.9-3.6,1.7c-7.6-3.4-1.8-1.9-4.1-6.6c-0.7-1.4-1-1.2-1.4-2
            c-0.7-1.2-0.3-0.6-0.8-1.7c-1.2-2.9,0-1.7-2.4-3.4c-5.9-4.2-1.6-4.3-8.6-9C601.9,937.8,600.7,937.6,599.9,936z"
                />
                <path
                  fillRule="evenodd"
                  fill="#E9E9E9"
                  d="M572.5,975.8c12.2-1.6,14.9-4.9,24.1-8.8c-0.6-1.6-2-8.1-2-9.2
            c0,0,0.7-2.4,0.8-3c0.3-2-0.4-4.1,0.4-6.3c0.9-2.4,1.5-3.2,2.1-6c-1.8-0.7-2.1-0.5-2.3-0.4c-2.5,0.9-3.1,1.5-5.3,0.8
            c-0.8-4.6,2.1-6-0.7-11.6c-1.8-3.4-3.2-5.2-4.4-9.3c-11.2,4-6-1.4-13.6,7.3l-7.5,6.7c-2.7,2.4-1.4,3.5-5.7,6
            c-2.6,1.5-1.5,0.4-3.5,2.4c-1.1,1.1-1.3,1-1.9,3c-21.8,0-8.5,9.2-7.2,12.6c1.4,3.4,2.1,7,6,8.1c4.9,1.4,3.1-2.2,10.3,2.2
            c3.1,1.9,6.2,3.2,7.2,7C571.3,976.6,571.6,976.5,572.5,975.8z"
                />
                <path
                  fillRule="evenodd"
                  fill="#E9E9E9"
                  d="M570.2,1034.6c1.3,1.4,0,0.5,2.1,1.7c5.7,3.2,4.4,2.7,11.6,1.7
            c-1.4-4.8-1.2-2.6-6.7-3c-3.9-0.3-0.2-0.4-3.7-1.1C569.1,1032.9,570.7,1034.3,570.2,1034.6z M604.1,1048l-5.2-0.2
            c-0.2,1.9,0.6,2.2,1.9,3.5c3.7,3.4,3.3,1.1,3.5,1c0-0.2,0.1-0.4,0.2-0.5c0-0.1,0.1-0.4,0.1-0.5L604.1,1048z M596.7,1001.3
            c-6.5,1.4-6.1,6.7-7.9-2.5c-2.2-1.4-4.8-2-4.8-5.2c0-2.8,0.9-2,1-2.4c1-2.6,0.7-2.6,0.2-6.5c-1.3-9.5-0.1-1.7-2-7l2.1-1.4
            c0.1-0.1,0.3-0.2,0.4-0.3c0.2-0.2,1-1.4,1.2-1.7c10.3,0.7,5.3-0.6,12.2-0.6c5.1,6.8,1.4,3.8,0.9,9.4l4.5,0.1c0.6,3.6,0,1.7-0.8,4.8
            C600.4,1001.8,595.8,989.8,596.7,1001.3z M574.6,977.1c-2.3,0.3-4.8,1.8-6.8,2.4l-1-4.8c-3.4-0.9-5.1-2.5-8.2-4.4
            c-5.5-3.3-9.3,3.8-14.4-9.2c-0.9-2.3-3.3-4.4-5.3-6c-3.7,1.6-1.7,0.2-2.6,2.1c-0.1,0.2-0.3,1.1-0.4,1.3c0,0-0.7,1.3-0.8,1.7
            l3.7,0.7c-1,1.6-0.2,0.4-1.2,1.4l-1.5,1.1c2.7,1.4,1.5,0.4,2.5,2.8c-3.7,1.8-1.2-0.4-2.7,2.4l3.9,1.9l0.3,3.6
            c0,0.1,0.1,0.3,0.1,0.3l0.5,5.5c-1.1,5.6-2.3,4.4,1,9.6l-2.6,2.1c2.3,15-1.4,13.2,1.2,20.1c1.1,2.9,2.5,6.3,5.7,7.1
            c2.6-5.6-2.4-5.7-2-11.2c5.3-0.9,11.8,3.4,8.6-2c-1.6-2.8-4.3-7.5,1.2-9.1c0.2-0.1,0.7-0.2,0.9-0.2l2.9-0.2
            c5.6,1.4,13.2,2.2,18.6,4.7c4.7,2.2,5.6,7.9,2.4,12.1c2,1.7,3.2,3.6,3.5,6.7c-0.2,0.9-5.5,3.3-7.5,7.5c0.9,2.6,1.1,2.5,3.2,3.9
            c1.8-2.1,1.7-1.2,3.1-3.3c6.3-9.7,5.1-13.1,17.3-8.4c1.7,7.7,2.2,4.9,0.9,9.8c-0.8,3.2,0.2,2.9-0.2,5c-0.5,2.3-0.8,1.7-1.7,3.9
            c2.3,1.5,2.4,0.8,3.1,1l2.3,1.3c0.1-0.2,0.3,0.3,0.5,0.5c3.1-3,10.1-3.6,14-4.2c0.9,0.9,1.7,2,2.6,3c9,0,7.4,7.8,14.4,1.9
            c1.4-1.2,2.2-2.3,3.4-3.2c6.4-5.3,8.1-5.4,12.4-2.5c2-1.5,4.3-3.2,6.5-4.7c-1.7-1.4-0.6-0.9-3.4-1.3c1.4-7.5-4.9-5.2,1-16.1
            c-6.6-3-9-0.9-12.7-6.4c-4.4,0-8.2,0.1-11.8-1c-3.3-1-2-1.4-3.5-3.1c-0.9-1-2.3-1.6-3.3-2.5v-3.9c1.9-2.3,3.4-2.5,2.5-6.2
            c-0.9-1.8-3-1.5-4.3-3.2c-3.6-4.4-0.5-14.2-5.8-16.9l-1.8-0.9c-17.8-5.8-13-2.6-20.3,1.3c-2.1,1.1-4.3,1.5-6.6,2.5s-3.9,1.8-7.1,3
            c-1.1,0.4-1.7,0.9-3.4,0.7C575.3,977.2,574.8,977.1,574.6,977.1z"
                />
                <path
                  fillRule="evenodd"
                  fill="#E9E9E9"
                  d="M706.2,840.8c-0.7,2.8-0.7,1.8,0,4.5c-3.1,2.2-2.3,0.7-2.6,4.4
            c-0.2,2.3-1.6,3.8-1.5,5.5c1.9,1.2,1.8-0.4,4.1,0.3c2.8,0.9,1.8,1.7,3,3.9c1.3,2.2,1.2,1,2.1,4.6c0.6,2.4,0.3,3.3,0.7,4.4
            c1.2,3.9,4.4,4.4,5.4,7.9l3.1,10.1L716,888c-0.3,14.6,5.6,10.8,13.2,4.3c5.8-4.9,2.4-10.2,1.9-16.1c-0.9-12.8-5.7-0.5-7.4-16.7
            c0.2,0,0.4-0.3,0.5-0.1l2.4-0.8c1.5-0.5,3.1-0.9,4.6-1.3c-0.4-3.4-1.1-3.4-0.2-5c-2.7-2.5-0.7,1-3.6-0.3c-0.4-1.9,1.6-4.6,5.5-5.2
            c1.3,1.7,2.3,3.4,3.5,5c-1.7-9.8-3.9-6.8-6.7-6.5c0.3-0.9,4.4-6.1-4.7-4.6l-1.7-2.4c-7.8,1.4-5.2,1.3-8.3,2.9
            C712,842.8,709.8,841.5,706.2,840.8z M721.9,957.1c-1.6-1.9,0.8-0.3-2.2-2.2c-2.6,1.4-1.7,2-3,4.4c6.6,3.7,6.1,10.9,12.4,13.3
            c9.9,3.7,1.7,1.9,10.1,6.6l9.7,7.1c3.8,1.7,3-0.2,5.8,0.7c-1.7-6.5-3.5-6-7.1-9.6C746.5,976,727,963.2,721.9,957.1z M743.6,873.3
            c1.9,0.9,3.8,1.2,5.5,2.1c1.4,0.8,2.8,2.1,4.5,3.1c6.1,3.4,4.6-0.2,8.7,5.8c0.1,0.2,0.3,0.4,0.4,0.6c0.9-4.1-0.3-3.6,0.4-9.5
            c-6-0.1-3.8-0.4-8.2-1.7c0.7-8.5,0-5.2-6.3-4.1l-7.1-1l1.8,4.1C743.4,873,743.5,873.1,743.6,873.3z M770.9,890.5
            c3.7,2.4,13.7-0.2,17.7-1.5c-1.7-3.5,0-0.8-2.4-2.9c-2.2-1.9-1-1.4-3.6-2.6c-4.1,1.8-1,2-6.6,3.1
            C772.4,887.5,771.9,887.5,770.9,890.5z M701.8,945.5l2.1,6.1c2.9-2,0.1,0.5,2-2.9c0.9-1.6,0.9-0.9,1.7-2.9
            C706.1,944.8,703.6,943.6,701.8,945.5z M730.9,864.5c0.2,1.6-0.2,2.3,2.5,3c3.4,0.9,4.8-1.5,4.8-1.5c-1.1-0.7-1.5-1-3.3-1.6
            C730.2,863,731.5,864.2,730.9,864.5z M791.4,969.5c-7.4-2.1-7.2,9.1-13,10.2l-9.5-1c-0.6-2.6,1-6.4,1-10.5L765,969
            c0-2.2,0.3-1.8,0.3-3.5c-0.2-3.9-0.7-0.6-1.1-3.9c-0.2-2.3,1.7-6.6,0.9-9c-5.2,1.4-1.4,5-3.4,8.9l-3.8-1.5c-3.5,2.8-4.1,2.3-3,7.5
            c-0.3-0.1-1.8-0.4-2-0.4s-0.5,0.1-0.6,0.1s-0.5,0.3-0.5,0.2c-0.1-0.2-0.3,0.2-0.5,0.3l3.5,5.2c1.2,2,6.1,5.2,8.5,6.7
            c2.2,1.4,2.2,2,5.1,2.3l-0.3,3.7l4.9-1.4c-0.2,0.6-2.6,5.2-3.1,4.2c-0.1-0.2-0.4,0.2-0.6,0.3l-0.9,4.5c-3.1-1-5.6-1.3-8.4-2.1
            c-5-1.3-2.4-3.6-6.4-2.1c1.5,1.5,2.1,3,4,4.8c3.5,3.2,1.4,0.3,5.3,1.8l-1.8,6.7c-4.2-0.6-7.4-3.5-10-3.4
            c-6.6,0.2-16.2-2.1-21.8-6.1c-3.6-2.6-0.1-1.2-4.2-2c-1.6-0.3-2.8-1-4.4-2c-3.9-2.4-5.1-2.7-7.9-6.3c-3.9-5-21.9-14.9-20.8-21.3
            c1.5-2.6,3.3-4.6,3.6-8.5l-4.4-4.1c0.4-5.5,1.2-5.9-2.8-9.7c-2.8-2.7-3.8-5.1-7-7.3c-0.1-8.4-4-12.8-4.5-20.7s-3.7-12.7-1.9-19.5
            c1.8,0.7,2,1.3,2.7,2.7c2.8-3.5,0.3-1.5,4.3-3.9c1.7-1,3.2-1.9,5.1-3.1l3.8,2.7c0.1-3.2-2.4-4.3-4.3-6.1
            c-3.3-3.3-9.2-7.8-11.2-10.7c-2.4-3.5-1.6-3.6-0.3-7.3c-5.8-2.6-4.1-7.7-6.2-13.8c-1.7-4.9-4.8-8.6-7.3-12.7
            c-3.2-5.2-2-10.2-3.9-15.9c-1-2.8-1.4-3.9-4.4-5.1c-6.6-2.6-4.1,2.6-7.9,5c1.5,5.6,3.3,5.2-1.4,12.4c-0.9,1.4-2.2,2.7-2.7,4
            c-0.7,2-0.2,3.4-1,5.8c-0.9,2.9-1,1.3-1,5.5c0,7.3-1.2,20.5,0.2,25.8l14.7,26.4c1.9,3.3,2.5,5.5,4.6,8.8c1.3,2,1.5,3.3,2.5,5
            c0.9,1.7,1.4,2.6,2.3,4.4c1.6,3.6,2.4,6.5,5.6,7.9c2.9,1.3,7.9,3.1,8.5,5.6c2,8.1,2.1,14.6-2.2,21.8c-9.6,16.2-10.3,4.1-12.7,14.1
            c-1.4,5.6-1.5,4.8-4.6,8.7c-11.5,0-4.5,1.5-15.9,6.7L633,992c-1.2,0.7-0.4,0.3-1.5,0.7c-6.1,2.4-2.5,1.5-4.6,4.1
            c-1.7,2-1-1.6-2.4,2.4c0.8,3.2,0.2,1,2.5,3.1c1.8,1.5,0.7,0.9,2.3,2.8c4.7,1.2,8.2,1.9,13.4,2.1c2,3.4,1.2,2.4,5.3,3.4
            c3,0.7,4.4,1.4,7.2,1.7c3.1-2.8,2.8-3.6,7.4-5.1l14.1-6c0.2-0.1,0.4-0.3,0.5-0.3c3.1-1.5,7-2.2,10.1-2.2c0.2-3.1-0.5-1.7-0.3-5.4
            c2.1-0.8,2.4-1.3,4.1-1.4c0.8,0,4.1,0.3,5.4,0.3c1,2.9,0.3,1.5,2.4,4.1L695,997c-0.4,2.8-1.3,3.4-0.3,6.2c4.4-0.3,4.5-3.6,5.1-6.4
            l0.8-2c7.2,0.7,0.2,5.5,6.3,7.3l3.7,0.9c2.4,0.6,2.5,2.3,4.3,3.9c2.4,2,6.1,1.3,8.6,2.4c2.3,1,2.5,1.1,2.6,2.9
            c0.1,1.4-0.5,2.1,0.8,2.9c1.2,0.8,3.3,0.4,4.8,0.4l5.9,3.9c0.1-0.2,0.2-0.4,0.2-0.4c0-0.1,0.2-0.3,0.2-0.4l0.4-1.4
            c4,1.4,7.3,4.7,8.8,8.5s-0.4,1.2,2.4,3.5c2.7,2.3,0.6-0.7,2.4,3.2c2.9,6.5,3,2.2,5.5,11.7l7.8-0.8c1.3,1.8,0.7,0.3,1,2
            c0.8,3.4-0.5-2.9,0.2,1.5c0,0.2,0.1,0.7,0.2,0.9c0.1-0.1,0.2-0.2,0.2-0.3l5.9-1.8c1,1.4,0.9,0.7,1.4,1.6c2,3.2-1.6,2.6,3.2,4.4
            c3.2,1.2,5.8,2.2,6.9,5.6c1.8,5.5,6.8,10.6,11.5,13.6c0.6,3.3,0.8,4.3,2.3,6.9c4.7,7.9,1.2,8.2,1.3,10.4c0.1,2.4,0.2,4.4-1.4,6.5
            c6.7,3.7,5.5,8.7,12.3,10.8c4.3,0.2,4.4-5.5,14.3-8c-1-6.7-2.8-6.1-3.4-14.3c-0.3-3.9,0.3-8.5-2.1-13.2l-10.1-15.1
            c-2.9-2.5-2.8-1-3.1-5.7c6.7,2.4,4.4,8.4,9.6,6.7l-6.3-6.1c-1.3-1-3.1-1.5-4.3-2.5l-8.4-10c-0.7-2.1-0.1-2.7-0.9-5
            c-1.3-3.6-2.2-2.6-0.3-6.8l4.5,0.3c-1.3-5-2.2-4.2-1-11.4c-0.7-3.8-12.1-14.5-13.9-20.7c2.9,1.4,0.9,0.3,3,2c3.3,2.7,1.5,1.5,6.8,2
            l5.9,0.5c0.2-1.9,0.1-3.5,0.2-4.8c1.1-0.2,3.7,1.9,13.7-1.7l2.7-0.4c0.3-0.1,0.5-0.1,0.7-0.2l14.3-5c-2.6-1-5.8-2.1-8.5-3.1
            C813.8,978.8,803.3,973,791.4,969.5z"
                />
              </g>
              <g id="region-ivb" className="region pointer-events-[bounding-box]" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleOnClick}>
                <path
                  fillRule="evenodd"
                  fill="#C1C1C1"
                  d="M747.2,1192.1c0.1-2.7,0.1-6.8-0.9-9.1c-2.5-6.1,0.7-2.3,4.4-5.2
            c-1-3.9-1.1-2.1-5.1-3.2c-1.7,2.3-0.9,1.6-3.5,3.1c-3.3,1.9-1,0.8-3.6,2.9c-1.5,0.4-3.1,0.3-5,0.9c-1.5,0.5-1.9,1-4.3,1.5
            c-1.8,6.8-1.5,4,0.1,6.9c1.3,2.4,0.1,1.4,0.8,4.8c0.4,1.9,0.9,2.9,0.2,6.4c-2.1,10.6-3.3,10.1-6.8,10.6c-3.7,0.4-2,6.7-3.8,10.4
            c-1.2,2.6-0.4-0.5-1.5,2.6c2.7,4.5,0.2,0.5,3.3,2.3c2.9,1.7,2.6,3.4,2.6,4.1c2.7-0.1,2.7-0.8,7.3,3.6l-3.9,6.6l-2.7-2.2
            c-2.5,4.1-1.4,1.9,0.1,7.2l3.7-0.3c-1.5,2.6-0.5,1.8,0.5,3.7c0.7,1.2,1.6,2.6,2.3,3.1c2.4-4.4-1.4-2,1.7-7.1
            c4.1-6.8,1.9,1.8,5.3-4.4c-3.1-0.5-3.6-1.3-3.5-4.8c0.2-4.4,3.1-8.2,4.9-11.8l1.7-6.5c0.5-2.6-1.1-2.5,0.3-6.5c1.1-2.9,0.6,1.5,1-3
            C743.5,1203.4,742.5,1195.3,747.2,1192.1z M814.5,1228.8c7.5-8.3,5.6,0.1,8-13.8c0.6-3.4,2.3-2.7-0.6-7.7c-2.4-4.1-1.8-1.2-2.7-6.6
            c-9.5-3.4-3.6-0.9-9.3-1.7c-4.2-0.6-5.1-2.3-9-1.1c-5,1.5-3.9-1.8-8.5,1.5c-14.5,10.4,4.5,14.8,4.7,14.9c1.7,0.7,5,2,6,3.3
            c1.2,1.5,1.1,3,2.2,5.4C806.8,1226.2,810.1,1222.6,814.5,1228.8z M769.2,1200c3.2,0,4-2.4,4-4.2c0-4.5-0.9-3.5-2.1-5.6
            c-1.1-1.7-1.5-7.2-3.6-9.6c-2.8,3.2-0.7,1.2-2.4,5.5l-1.7,2.7c1.6,4.3,0.5,2.6,0.9,5.7c0.3,1.8,1.9,3.9,2.6,5.5H769.2z M739,1140
            c4.9-1.2-0.7,1.5,3-6.3c-3.2-1.1-4.5-0.7-8-0.4c0.3,3.4,0.6,2,1.7,3.6c0.1,0.2,0.2,0.3,0.3,0.5C737.6,1140.2,734.2,1139.4,739,1140
            z M717.4,1258.3c0,2.5,3.6,4.4,5.9,4.4c0.3-3.6-0.4-6-1.2-8.6c-2.6,0.4-2.8,0.9-4.7,2.5V1258.3z M692.5,1136.7
            c-2.4-1.4-2.5-2.1-6.1-1.5c-0.8,5.2,1.2,4.3,3.8,6.3C691.5,1139.8,691.7,1139.8,692.5,1136.7z"
                />
                <path
                  fillRule="evenodd"
                  fill="#C1C1C1"
                  d="M644.1,1100c1.8,6.8,1.3,5.6-0.9,8.1c-4.8,5.4-5.5,5.2-9.7,1.9
            c1.4-10,3.8-1.2,2.2-14.3c3.1-0.2,2.9,0,5-1.4C642.1,1096.2,643.3,1097.1,644.1,1100z M611.7,1073.2c0,4.7,0.3,2.5-1.7,3.1
            C608.9,1074.2,609.8,1074,611.7,1073.2z M586.9,1060.2c-1.3-2.7-0.7-2.2,0.2-4.2c-1.9-0.3-1.7-0.4-2.6-0.3c-4.6,0.7-4.1-0.1-7,0.9
            c-1.2,7.2,1.6,14.2-2.6,18.3l-10.2,10.6c1.3,1.9,1.2,1.8,3.7,3.2c1.8,1,2.2,1.3,3.7,2.2c5.2,3.3,23.2,11.8,31.4,17.1
            c2.9,1.9,4.8,2.4,7.8,3.9c5,2.5,10,6,15.4,9l0.4,113.5c0.7-2.6,0-2.9,1.5-5.3c1.4-2.3,1.2-1.9,4.4-2.5c10.2-2,2.3-2.9,8-4.9
            c2.2,3.6,0.8,5.7,5,4.7l-1.4-5.9c-0.3-2.3-0.5-2.4,0.7-4.7c5.3-0.3,3.4,1.2,8.4,1.2c-3.4-3.2-5.9-5.4-5.6-11.1
            c1.2-3,0.2-0.1,1.7-2.6c4.1-6.3,0.5-5.6,2.6-9.2c7,2.6,8-7.1,15.5-12.2c-0.5-6.6-0.3-6.8-2.3-11.4c-2.2-5.2-2.4-3.5-5.6-6.8
            c-4-4.2-2.2-10.1-0.9-14.6c0.7-2.5-0.1-0.6-0.7-3.2c-1.5-6.3,1.9-7.3,1.6-11.5c-0.3-4.7-3.6-7.4,0.2-13c4.9-7.1,7.7-1,7.7-11.1
            c-2.2-1.6-3.4-4.1-7.6-3.4c-4.8,0.8-1.5,2.5-8.2,0.2c0-5.6,5-14-8.2-13.1c-0.9-3-3-6.2-5-8.3l-6.5-7c-2.4-2.7-2.6-0.7-7.7-5.8
            c-1.9-1.9-4.8-4.2-5.8-6.7c-3.1,4-3.6,0.9-7.4,4.4c-3.2-1.2,0.6-0.9-3.7-1.9c-4.7-1.1-5,3.9-10.2,0.3l-3.5-3.2
            C589.4,1061,592.9,1063.3,586.9,1060.2z"
                />
                <path
                  fillRule="evenodd"
                  fill="#C1C1C1"
                  d="M742.3,1068.1c0.7-0.5,8.7-1.4-1.6-8.3c-2.6,1-1.9,2.2-5.1,0.9v-1.1
            c0-0.3,0.3-0.3,0.2-1.2l-3.2-4.8c-0.7-1-0.2-0.3-1.1-1.4l-0.7-0.7c-1.1,1.4,0.1,1-1.2,2.1c-2.7,2.5-7.8,0.1-10.1-1.4l-1.4,2.2
            c-2.9-1.5-2.3-0.3-4.3-2.9l-3.2-3.6l-1.7,8.7c-1.9,4.7-3.6,4.9-5.6,7.2c0.6,3.2,2,4.2,2.2,7.7c0.3,3.6-0.7,4.9-0.7,8.5
            c4.5,2.8,2.5,2.6,5.6,6.7c2.9,3.7,4.1,1,7.9,3.9c1.3,1,0.7,0.7,1.9,1.3c7,3.8,2.9,7.7,12.6,7.7c3-3.8,4.2-4.4,2.1-9.8
            c2.6-2.8,3.4-5.1,6.8-7.2c7.6-4.8,0.6-3.2,7.1-6.7C745.8,1070.8,744.9,1074.5,742.3,1068.1z"
                />
                <path
                  fillRule="evenodd"
                  fill="#C1C1C1"
                  d="M608.6,1233c0.1-0.2,0.3,0.3,0.5,0.4c3.9,1.9,4-4,16.1,3.9
            v-116l-55.8-30.2c-3.8-2.1-4.4-1.1-7.2-4.5c1.7-3.1,4.2-4.3,6.5-7.7l4.6-4.8c0.2-0.2,0.7-0.6,0.9-0.8c0.7-0.6,1-0.9,1.5-1.4
            l-0.3-14.3c-3.1,1.7-2.4,1.7-6.9,2.6c-6.2,1.2-7,3.6-13.9,0.6c-5.6-2.4-8.8-1.7-12.4-1.7c-2.4,0-6.6-1.8-9.3-2.4
            c-8-1.7-9.6,1.5-16.7-2c-3.4-1.7-4.3-1.6-8.1-0.5c-5.8,1.7-9.2,5-11.1,10.6c-0.8,2.3,1.2,4.2,2.9,6.2c2.7,3.3,3.2,2.5,7.1,3.7
            c2.2-2.2,1.6-1.5,1.7-4.8c4.9-0.9,3.2-2.3,6.2-2.1c7.9,0.5,2.7,4.7,5,10c4.3,9.9-0.7,7.7,2.7,10.8l3.9,1.9c0.9-1.7,0.7,4.6,0.7,5.3
            c3.9-1.5,4.6,0.5,9.2,0.2l1.7,3.5c1.8,0.1,3.3,0,4.8,0.6c3.9,1.5,0.7-0.4,2.7,2.7l7.2,12c4.1,7.6,4.9,2.3,8.5,20
            c1.1,5.4,3,5.1-0.3,14.8c4,4.5,1.6,10.7,3.6,16.2c3.3,0.6,4-1.7,7.3,0.3c2.8,1.7,0.9,3.1,3.6,6.3c0.9,1.1,2.2,2.2,2.9,3l4.1,6
            c3.9,8.2-4.2,8,0.7,16.1c11.6,19.2,6.4,5.8,12.2,16.2c2.1,3.8,4.3,4.4,6.9,7.2l2-1.9c1-0.7-0.7-0.1,1.7-0.8
            c1.5,1.3,1.5,1.5,2.7,3.4l1,2.8c-0.9,2-6.2,0.6-3.8,4.9L608.6,1233z M493.7,1023c-1.4-0.9-0.6-0.1-1.7-1.1l-5.5-9.4
            c-4-0.9-6.5-0.2-9.8-3.1c-1.2-1.1-8.4-6-10-2.4c-1.6,3.9,0-0.3,1,2.7c0.6,1.9,0-0.3,0.1,2.3c0.5,8.6,7,4.4,9.4,11
            c4.2,0,4.1-0.1,6.4,2.2c2.9,2.9,0.9,0.9,5.4,2.2l1.4,2.7c0.9,1.7,0.7,1.5,1.5,2.7l1.3-1.7c1.5-2.5,1.3,1.7,0.8-3.5
            c-1.8,0.9-4.2,1.2-4.6-1.4C489.1,1023.5,491.8,1024,493.7,1023z M607.6,1240.7c-3-3.8-1.1-0.5-2-5.7c-0.4-2.1-1.2-3.1-2-5.5
            c-0.8-2.8-0.2-3.2-3.7-3.2c-3.6,0-3.1,6.3-2.9,9.7c2.4,0.6,3.9,1.4,6.3,2.1c1.3,4.9,1.4,7.1,6.8,8
            C609.5,1243.7,609.1,1242.6,607.6,1240.7z M497.1,1018.5c2.1-2.6,1.7-0.6,3.4-3.9c-1.9-2.9-2.6-2.9-5.4-4.6l-2.1,2.6
            c-0.9,2-0.3-1-0.7,3.3L497.1,1018.5z M511.6,1035.8c-5,0-3.7,0.3-6.8-1.4c-0.6-0.3-2.6-1.4-3.1-1.4c-3.7-0.5-1.8,0.4-2.4,0.8
            c3.2,0.9,4.7,0.9,7.3,2.7l5,3.8C513.2,1037.8,512.8,1038.7,511.6,1035.8z"
                />
                <path
                  fillRule="evenodd"
                  fill="#C1C1C1"
                  d="M286,1530.6c-4,2.4,0,0.2-2.6,4.4c-1.9,3.1-1.5,0.2-1.8,5.8
            c-0.5,0.1-2.8,0.5-3.3,0.7c-1.5,0.8-0.1,0-1.5,1.2c-1.9,1.7-3.3,2.7-6.3,3l1.9,4.1c-1.8,1.7-2,2.5-2.2,5.6
            c-2.5,0.8-0.7,0.1-2.7,1.5l-1,0.7c-0.1,0.1-0.4,0.3-0.5,0.3l-0.9,0.5c2.6,4.7-2.7,6.9-4.9,9.5c-3.9,4.7-6,9.2-10.7,12.9
            c-2.7,2.1-1.5,1.3-4.8,2.7c-3.7,1.6-6.8,4-6.3,8.7c-3.6,1-1.5-0.1-3.8,2.9l-4.2-1.4l-2.7,2c2.2,4.5,2,5.6-1.9,9
            c-1.4,1.2-2.6,1.9-3.5,3.3c-1.7,2.4,0,1.7-2.9,3.7c-6.8,4.7-10.2,6.1-11.4,16.3c-2,0.2-2.9,0.5-4.2,0.9c-4.5,1.3-4.1,3.3-3.8,8
            c-2.4,0.7-2.3,0.9-5.1,1.4c-0.8,4.2-3.1,4.2-5.7,6.8l-1,0.8c-0.2,0.1-0.4,0.2-0.5,0.3c-2.3,1.7-1.8,0-1.9,4.2c-3.4,0.6-3.4,1-5.6,0
            c-0.8-2-0.4-2.2,0.3-4.5c-4,1.2-2.6,1.4-5.3,3.3c-3.8-0.7-0.3-0.5-3.3-0.8c-1-0.1-2.5,0-3.5,0.1c-2.4,3.8-6.1,8.1-10.3,9
            c-1.7,0.3-2.6,1.6-4,2.7c-0.8,0.6-1.3,0.9-1.9,1.4c0.3,5.2-0.4,1.9-2.2,6.3c-1,2.5,0.4,2.6-1.4,6.8c-2.9,0.7-3.3,0.3-6,1.5
            c-0.8-1.4-1-2.3-2-3.7c-1.7,4.5-1.7-0.1-5.8,3.5c-1.6,1.4-2.5,3.8-3.2,5.9c-1.8,5.8,0.1,2-3.7,5.6c-3.2,3-0.7,2.9-6.5,2.9
            c-0.4,3.9-2.7,4.8-4.6,6.9l-0.8,0.9c-0.1,0.1-0.3,0.3-0.4,0.4s-0.3,0.3-0.4,0.4c-1.8,2.2-1,3-3.4,5c-2.2,1.8-2.6,5.1-4.8,6.9
            c-4.8,3.9-1.8,1.7-2.7,7.2c-3.8,1-8,0.9-9.9,3.7c-0.9,1.2-0.3,0.9-1.2,2.2c-0.3,0.5-1.5,1.5-1.5,1.5c-1.3,2,0.2,0-0.6,3.8
            c-4.4,2.2-5.9,2.3-6.7,8c-0.3,0.2,0.8,2-3.2,0.5c0.1,3,0.6,0.5,1.4,4.5c-1.3,1.6,0.9,1.1-3,1.2c-1,7.5-2.4,3.1-4,10.1
            c-0.5,2.4,0.5,4.6,0.1,7c-0.5,2.9-9.5,14.1-3.8,15.7c3.7,1,1.2-1.7,5.7-5.4c2.9-2.4,1.3-2.9,5.8-6c3-2,2.6-3.1,6.4-5.2
            c3-1.7,5.4-2.8,6.3-5.5c2.3-0.4,3.8,0.2,5.7-1c2.7-1.7,0.9-0.1,1.8-2.7c1.4,1.4,0.7,0.8,2.3,1.9l3-1.8c0.2-0.3,0.5-0.3,0.7-0.5
            c0.9,1.4-0.8,0.5,2.1,2.1c1.8,1-0.1,0.3,2.5,0.7l4.8-8.5c3.2-4.4,0.7-5.7-0.5-9.1l5.1-6.2c6,0.1,7.1,3.7,14.6,0.3
            c7.7-3.5,7.9,0.6,14.6-6.5c2.1-2.2,2.4-4.2,4.2-6.6c5.1-1.9,2,2,5.8-2.6c2.3-2.9,1.2-2.9,4.1-5.3c5.3-4.5,11.8-4.8,15.5-8l7-11.4
            c0.5-1,0.7-1.6,1.3-2.8l2-3.1c0.5-0.7,1.3-1.7,1.7-2.4c-1.5-2.4-0.6-0.2-1.5-3.2l3.6-1.5c0.5-5.1,1.4-8.7,3.5-12.3
            c4.1-0.2,7.9-0.5,11.5-3.4c3.4,1.9,2.3,1.1,7.1-0.5c5.4-1.9,5-0.7,8.8-0.7c4.7,0.1,5.6-5.3,8.6-8c1.7-1.5,0.9-1.1,3.6-1.4
            c0.8-5.5,2.3-3.6,4.8-6c1-0.9,0.6-1,2.2-2.2c2.1,0.3,1.5-0.7,2.8,1.3l7-9.6c-1.6-4.4,5-11,6.7-12.8c2.3-2.5,3.2-4.9,5.8-6.9
            c3.1-2.4,1-3.2,2.9-6.1c1.3-2,2.6-1.2,4.5-3.9c1.8-2.6,0.8-3.2,3.4-5.8c2.6-2.5,2.8-1.2,2.5-5.7c4.3-0.3,3.1,0.4,4.1-3.6l-4.3-0.5
            c-2.1-0.4-0.1-0.3-1.8,0.3c-0.2,0-0.5,0.2-0.6,0.2l0.9-3.1l-2.7-0.1c-3.5-12.7,4.1-9.8,4.5-5.8l0.3,3.3l5.1,0.5
            c0.1-2.1,0.3-6.8,0-8.7c-0.9-5.9-3.6-1.4-3.8-10.8c0-4.6-0.9-5.5,2.8-8.4c1-0.7,1.7-1.5,2.6-2.3c2.7,0.5,1,0.7,4.3,1.4
            c3.4-2.7,6.4-7,12.8-6.4c9.4,0.9,10.8-2.3,14.9-2.9c2.9-0.4,5.5-1.2,7.9-1.9c5.8-1.7,10.1-1.5,15.5-4.3c3.2-1.6,1,0.7,2.6-2.5
            c1.8-3.6,2.2-7,2.4-10.4c0.1-1.7,0.2-1,0.6-2.7c1.3-6.4,4.8-10.3,8.1-15.8c3.1-5.1,5.8-5.3,7.9-6.1c2.5-0.9,0.5-0.6,2-2.3
            c1.9-2.2,4.5-1.7,7.3-2.7c4.8-1.7,2.4-1,5.7-3.3c4.3,2,10.6,1.6,15.5,0.2c1.1-5.6,3.4-6.5,7.7-9.1c3.1-1.9,4.7-5.3,8.4-8.2l-1.3-1
            c-1.1-1.1-0.2,0.3-0.8-1.2l2.2-0.9c0,0.2,0.3,0.3,0.3,0.3l1.9,2.5c0.1-0.2,0.3,0.4,0.5,0.6c0.7-3.1,0.1-3-0.8-3.9
            c-0.2-0.2-0.4-0.3-0.5-0.4l-1.4-1.3c-0.2-0.1-0.3-0.3-0.5-0.4c-5.8-4.4-2.2-6.6-7.2-10.8c1.5-3.7,0.3-4.1,4.4-5.4l-4.3-3.7
            c-2.1,2.7,0.2,2.3-4.1,2.5c-4.3,0.2-0.6,0-4.1,1.1c0.2-3.9,3.4-5.8,3.4-9.2c-0.1-3.1-0.2,1.3-0.9-2.4c-0.4-2.6,0.2-9.1,0.3-12
            l-2.4-1c-2,1-3.3,2-5.7,3c-4.6-3.7-1.5-0.4-4-6c-1-2.2-0.8,0.2-1.7-3.5c-0.7-2.7-0.3-2.1,0-4.4c1.2-7.8-2.7-9.4,3.2-13.8l6.5,1.5
            c0.9-4.8-0.5-2.2-0.9-5.9c5.8,0.8,4.1,1.8,7,5.3l1.7-1.7c2-2.7-0.5-5.1,0-9c-3.6,0.6-3-1-5.4,0.2c-2,1-5.3,2.3-7.6,0.1
            c-0.6-0.5-1-1.4-1.3-1.9c-4.1-7.8,0.7-5.2,2.6-11.1c0.8-2.6,2.3-4.8,2.6-6.7c1.2-7.5,1.4-5.5,0.4-14.7c-3.1,0.7-3.6,1.2-6.7,0.1
            c0-2.4,0-4.8,0-7.2c-0.1-6.1-0.7-4.7-2-6c-4.1,1.6-2,3.8-1.9,7.7c-2.2,2.1-3.2,4.3-6.4,3.5c-0.6,5-1.3,2.6-1.7,6.5
            c-0.8,6.8,2.5,8.9-2.5,14.4c-0.1,0.1-0.3,0.3-0.4,0.5l-2.2,1.5c1.8,1.5-2,0.3,3,1.6l-0.9,4.3l3.5-1c0.4,5.9-0.5,9.2-1.7,14.4
            c-6.3,1.5-7.9-3.6-10-8.4l-1.2,4.3c0.4,3.5-1.3,0.7,1.7,2.6l-1.4,2.9c3.5,0.5,3.6,1.5,4.4,4.3c-1.7,0.4-1.1,0-2.5,0.9
            c-3.1-2.4-0.2-1.6-3.4-4.4c-3.2,4.2-0.3,7.9-0.5,11.9c2.4-0.3,5.6-1.9,5.9,0.4c0.1,1-2,4.4-2.5,5c2.6,3.6,0.5,2.4,4.6,5.1
            c0.8-0.3,3.1-1.3,3.4-1.3c2.5,0,2.1,1.2,2.4,1.4c1.2,1.3-1,0.4,2.2,2l2.9,1.2c-0.7,2.6,0,0.4-1.4,2.1c-3.2,3.8,2.2,10.1,2.4,14
            l-4.3,0.7c-1-2.2-0.8-2.9-1.6-4.9c-1.3-0.5,0-0.2-1.2-0.1l-3.2-0.1c1.2-2.1-0.1,0.3,1-1.4c0.6-0.9,0.3-0.2,0.8-1.6l-2.6-1.3
            c-3.2-0.7,1.6,1.5-1.9-0.3l-11.7-7.5c0.9-3.3,0.1-1.9,2.1-3.6c-2.6,0.4-2.8,0.9-4.5-0.4l3.1-2.1c-1.1-1.9-1.7-2.9,0-4.8
            c-1.9-1.2-1.6-1.3-2.9-2.6l-2.5,3.7c-1.5-2.7-0.9-1.4-1.1-4.7l-0.6,1.5c-0.6,1-0.8,1.7-1.5,3.2c1.7,1,3.3,1.1,4.8,2.6
            c-1.4,4.1,0.3-0.7-2,2.8c-0.8,1.2-0.4,1.4-0.4,2.8l3.2,2.9c0.4,4.5-0.7,5.5,1.6,8.5c3.2,0.7,3.2-2.1,5.6,0.2c6,5.6,3.5,7.9,2,14.6
            c-2,8.9-0.7,12.8-10.1,18.1c1.5,3.4,1.5,3.4-0.1,7.1l-4.7,0.3l-1.4,2.6c-4,5-0.8-0.6-4,5.2c-1.9,3.2-1.2,1.2-3.8,3
            c-2.2,1.5-0.7,1-2.6,2.9c-2.4-1.2-3.3-2.9-3.1-6.1l-0.7-6.7c0-0.4-0.2-0.5-0.3-0.7c-1.7,0.9-1.4,0.8-2.9,2.1c1,3.5,2.4,0.5,2.2,6.2
            c-4.6,1.7-2.1-0.4-3.4,2c-0.3,0.5-1,1.9-1.7,3.1c-6.5-5.1-4.2-1.6-9.4-3.5c-0.5,1.4,0.1,3.8-3.1,5.1c0.8,2,0.4,1.4,0.7,2.8
            c4.9-0.3,1.4-1.8,6-2.7l1.1,4.5c-2.6,1.4-4.1-2.8-3,5.1c-6,0.8-1.9,0.1-5.8,2.9c-0.2-0.1-0.5-0.2-0.7-0.2s-0.5-0.2-0.7-0.2
            s-0.5-0.2-0.6-0.2s-0.5,0-0.5-0.2c-0.1-0.2-0.3-0.1-0.5-0.2c1.8,2.7-0.3,1.2,2.8,2.1l-2.8,1.6c1.9,1.3,1.7,0.7,0.9,3.9
            c-2.4,9.3-8.7,2.6-12.2,3.9c-1.5,1.3-1.9,2-3.3,3.1l-3.7-1c-0.7,1.9-0.1,2.9,0.1,5.5s-0.2,3-0.7,5.2l4.3,0.7
            c-1.8,4.2-4.6,5.2-3.6,10.8c-2.6,0.7,2.4-0.7-1.1,0.2c-2.2,0.6-0.3,1.2-4.1,0.8l0.6-4.6l-4.3-1.2c1.6-1.8-2.5-1.5,3.2-1.5
            C285.9,1531,288.7,1532.2,286,1530.6z M449.9,1230c-1,0-2.2,2.2-3.8-0.5c-2.1-3.4,0.2,0-0.3-2.1c-0.3-1.6,0.2,0.8-0.5-1.5
            c0-0.2-0.1-0.4-0.2-0.5c-0.5-1.5,0.2-3.2-5.3-3.6c-4.2,4.6-0.2,2.8-2.1,7.7c2.9-1.2,2-1,6-1c-2.5,2.7-2.7,2-7.5,3.4
            c0.9,5.1-0.2,0.5,2.2,4.6c-0.5,1.5-0.2,1.1-0.9,2.6c-1.9,4.8-2.2,1.7-1.8,7.1c1.4-3.1,1.4-4.8,4-7.1c3.1,1.7,2.4,1.6,2.9,5.1
            c0.5,3.4,2,1.9,3.2,5.5c0.8,2.6-0.1,1.6,0.2,3.5c0.5,2.9-0.3-0.4,1.3,2.5c2.4,4.3-0.7,2.8,4.3,3.9l1,6.8l6.9,1.5
            c4.9,1.2,0.7-0.6,4.6-2.2l3.4,1.7c0,0.7,0,1.8,0,2.5c0.4,3.4-0.2,0.3,0.6,1.9c5.1-0.9,2.9-0.7,0.9-4.3l4.3,0.7
            c-0.9-3.7-1.2-0.9-1-4.8l6.7-0.2c2.4,4.3,1.5,3.3,6.7,5.5l5.1-2.2l3.7,3l7.3-2.4c-1-3.8,0.3-1.2-1.6-3.5c-2.5,1.1-0.5,0.2-2.3,1.9
            c-1.4,1.2,0.7,0.2-1.3,1.1c0-5,0.1-4.7,4.4-5.4c-0.1-3.1-0.3-4.6-1.7-5.9c-4.7-4.3-5.3-3.2-6.1-6.3c-5.1,1.4,0.1,0.9-5.8,0.5
            c0.7-2.9,0.9-7.2-1.1-9.4c-2.9,3.4-1.9,5.7-1.8,9.8l-2.7,0.6c-3.6,1.5-2.4,2.7-9.4-3.3c-2.2-1.9-1.8-2.6-4.4-3.8
            c0.3-3.3-0.5-1.7,1.4-3.4c-5.1,0.3-6,4.4-7.7-4.7C457.1,1234.2,454.9,1230,449.9,1230z M451.8,1279.4c-0.2,0.1-2.1,0.6-2.8,0.9
            c-0.2-1.3-0.5-2.7-0.5-3.6l0.6-4.1c0.1-2.4,1.2,0.3-0.3-1.8c-0.1,0.1-0.2,0.3-0.3,0.4c-0.1,0.1-0.2,0.3-0.3,0.4
            c-0.1,0.1-0.2,0.3-0.3,0.5l-1.3,2.2c-3-1.5-1.4-1.6-4.2-3.6l-3.9,1.9c0.2,0.2,0.3,0.4,0.5,0.5c0.1,0.1,0.3,0.4,0.5,0.5l0.7,5.1
            c-0.7-1.7-3.4-3.5-5.3-4.4c2.8,3.8,3.6,3.4,2.1,8.5c2.3,0.8,2.9,0.9,4.3,3.3c1,1.5,0.3,0.6,1.5,1.9c1,1.3,0.7,0.4,1.5,2
            c-1.3,0.4-3.9-1,0.7,7.8l1.6,2.7c4.7-0.7,2.6-0.2,3.9-3.9l1.3-0.5c0.2-0.1,1.1-0.3,1.3-0.4c0.7-0.2,1.3-0.3,1.9-0.4
            c0.6,2.1,1.1,2.1-0.3,3.6c-0.2,0.2-1.6,1.2-1.9,1.5c-2.6,2.1-2.2,1.7-2.5,3.2c-0.4,1.7,1.4,2.9-2.6,1.5c0.1,1.4,0.2,4.9,0.3,5.3
            l2.4,4.2c1-2.7,0.9-1.5-0.3-4.3c2.4,1.2,2.8,2.5,3,2.1c0.1-0.2,0.3,0.3,0.5,0.4c2.7-2,3.9-3,6.6-5.3c0.1-0.1,0.3-0.3,0.5-0.3
            l2.7-5.3l-2.7-1.2c0.9-0.6,3.8-3.4,4.3-4.3c-1.2-1.5-2.6-2.4-4.5-2.1c0.2-2.8-0.1-2.2,1.4-4.1c-0.2-0.1-0.5-0.2-0.6-0.3l-2.1-2.1
            c3.1-0.8,3.1,1.1,6-1c-3.1-2.2-0.8,0.5-5.7-3.6c-4-3.3-1.5,0.9-5.8-1.9l5.6-2.7c-2.8-2.2-4.5-0.5-6.7,0.6
            C452.1,1279.2,452,1279.3,451.8,1279.4z M45.8,1845.7c0.1,1.6,0.8,2.7,2.1,3.8c3.7-1.8,7.5-8.2,8.7-9.2c-0.9-2.2-0.6-0.8-1.5-3.6
            c1-0.6,1.9-0.8,3-1.3c-0.5-2.5-1.3-7.3-1.7-11.3c-3.1,0.5-2,0.2-2.7-0.3c1.9-1.7,1.1-0.8,2.3-5.8c0.8-3.4,0.1-1.9-0.2-5.8
            c-3.7,0.2-2.6,1.2-6.5,1.4c0.3-3.2-0.1-2.2,4.2-2.2c-0.7-5.5-1.7-5.6-3.7-7l-5.3,4.4l3.9,3.3c-2.7,4.8,2.6-3.4-1.2,1.3
            c-1.1,1.4-0.2-0.3-1,1.5c-0.3,0.6-0.6,2.7-0.9,3.5l-3.5,1.7c-2.2-4-0.7-1.6-0.7-5.1c-3.3,6,0.2,8.4,0.7,11.7
            c0.6,3.5-3.4,5.1-4.1,7.2c2.2,1.1,0.6-2,3.6,1.9L45.8,1845.7z M438.6,1458.9c-3.2-1.5-2.2,0.2-4.4-3.1c-0.2,0.2-0.3,0.5-0.3,0.6
            c-1,3,0.7,3.1-2.4,6.2c-4.9,5-1.5,2.9-4.2,6.6c-1.9-0.9-2.9-1.3-5.5-1.8l-1,4.5l3.3,0.9c0.5,7.5-2.5,10.8,6.6,10.8
            c2.4,0,3.9-2.8,7.5-1.8l-0.9-1.4c-1.1-1.9,0.4,1.7-1-2.1c4.7,0,4.9,0.3,8.6,1.1c-1.3-4.7-4.6-6.8-3.2-10.1l4.6,5.8l1.2-2.8
            c2.6,1.1,5.9,1.3,4.6-4.3c3.9,0.5,2,1,4.4-0.5c-4.6-2.9-0.1-2.7-3.3-4.7c-0.3-0.2-6.8-1.2-7.3-1.1
            C440.3,1462.3,444.4,1461.7,438.6,1458.9z M69.5,1786.6c2.5-0.3,2.6-0.8,4.4-1c2.5-0.3,1.2,2,7-4.5c1.1,1,0.9-1.4,1.9,2.7
            c1.5,5.8-3.8,9,2,12.3c3.3,1.9,5.9-0.5,8.4-2.2c-0.5-2.6-1.2-2.8-1.2-5.3c0.1-4.5,4.4-4.8-1.5-9.9c-3.6-3-2.4,1.7-11.4,0.6
            c-1.7-0.2-1.5,0.2-3.4-0.9c0,0.4,0.7,0.4-1.2,1.9C67.5,1785.7,69.5,1781.1,69.5,1786.6z M416.8,1342.1c0.4,0.6,1.2,1.6,1.6,2.6
            c1.9,4.6,1.5,1.5,4.5,4.3c1,1,0,0,1,1.3c0.1,0.1,0.3,0.6,0.4,0.4c0-0.1,0.2,0.3,0.7,0.5l0.5-4c1.3,0.5,1.6,0.6,3.4,0.7l2.8,0.4
            c0.5,3.2,0.2-2.5-2.2,6c4.5-0.9,1.6,0.5,4.1-3.3c1.2-1.7,1.1-1.6,1.7-3.8c0-0.1,0.1-0.3,0.1-0.5l1.6-4.3c0.4-2.1,0.7-3.6,0.5-6.3
            c-2.9-0.2-1.4-0.3-3.6-0.6c-0.9-0.1-2.1-0.2-3.3-0.3l4.1,3.5c-1.4,3.4-2,3.7-7.3,4.5l-0.9-4.5c-2.9,1.4-0.1,0-2.8,2l2.9,1
            c-0.2,0.2-0.4,0.4-0.5,0.5l-3.4,3.7c-1.5-3.8-0.1-1.2-2.8-3.1c-2-1.4-1-1.2-1.6-2.2L416.8,1342.1z M490.9,1282.5
            c-2.9-1.3-1.9,0-3.8-2.4c1.9-2.8,3.1,0.7,4.9-2.1c1.4-2.2-0.2-6.1-0.7-7.4c-3.4,0.9-8,5.2-8.1,5c0-0.2-0.3,0.2-0.4,0.3
            c0.7,1.1,1.3,2.8,1.9,3.8c1.7,2.7,1,0.5,2.2,2.9c1.6,3.1,0.5,4.4,2.7,8L490.9,1282.5z M601.9,1423.4c2-1.7,1-3.6,1-3.6
            c-3.1,1-2.5-2-2.5,4.2c-8.1,3.4-3.6,0.3-7.7,6.1c3.2,3.2,1.5,2.7,6,5.4c0.6-2.9,0-2.1,3.2-2.3c-1.2-2-1-1.2-1.3-3.9
            c2.5-2,1.2-0.2,2.8-2.5L601.9,1423.4z M396.2,1387.4c1.7-0.3,2,0.1,3.2-1c1.4-1.3,0.6-0.4,0.8-2.6c3.4,1.3,4.4,1.9,4.3-3
            c-2-0.2-2.8-0.5-4.1-1.1c-3.3,3.7-1.4,1.2-5,3.5L396.2,1387.4z M73.2,1801.6c-1.2-5-3.8-3.8-9-3.8
            C65.2,1802.9,69.3,1801.8,73.2,1801.6z M359.2,1413.8c-0.7-5-1.8-1,0.5-9.2C354.6,1404.5,353.7,1411,359.2,1413.8z M63.2,1791.6
            c-2.9-2.5-1-2.7-6.3-2.8C56.6,1794,60.4,1793.4,63.2,1791.6z M589.8,1383.2c-4.5,2.8-3.9-0.2-5.3,3.3c1.2,1.8-0.6,1.7,4.6,1.8
            L589.8,1383.2z M253.3,1954.3c-4.1-0.8-2.6,1.2-5.6,2.1c-1.5,0.4-7.9-1.9-6.3,3.9c0.4,1.5-0.1,0.6,1,1.5c1.5,1.2,2.5,0.8,4.4,1.5
            c4.4,1.5-0.1,1,4,1.5c1,0.1,1.2-0.5,2.6,0.1c0.9-4.6-0.3-3,0.1-5.3L253.3,1954.3z"
                />
              </g>
              <g id="region-v" className="region pointer-events-[bounding-box]" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleOnClick}>
                <path
                  fillRule="evenodd"
                  fill="#717171"
                  d="M903.6,1186.8c-2.4-0.9-3.1-2.4-6.1-3.2l1.7,9.2c1.7,8-1.4,9.1,1.9,10.6
            l1.5,0.5c2.1,1.5,1.9,6,0.3,8.9c-1.8,3.3-1.6-0.5-1.5,4.2c0,3.2,0.4,3.3-1.4,7.1c-1.4,2.8-4.5,5-3.9,8.1c0,0.1,0.1,0.4,0.2,0.5
            c1.1,5.3-2.1-0.8,0.3,3.8c1.4-3,1.4-3.2,5.6-3.4c1.6,2,0.9,0.5,1.4,3.5c0.9-1.4,0.5-1.1,2.3-1.9c0.2,1.5,0.7,2.9-0.3,4l-3.5,2.1
            c0.9,2.1,1.3,2.6,1.5,5.3c-2,0.6-2.2,0.5-4.6,1.6l0.2,3.3c-2.7-0.2-1.9-0.2-4.2-1.1c-0.3,2.1-0.7,3-0.9,4.4c-1.5,12-0.7,2.6-2,7.7
            c-0.6,2.4,0.3,1,0,2.9c-0.5,3.8-5.8,6.2-6.1,12.9c2,2.1,0.7,1.5,3.7,2.6c0.9-1.3,2.9-5.5,4.3-6.5c3.1-2.4,2.8,0.4,5.7-4.3
            c4.3-7,4,0,9.2-10.8c2.2-4.4,2.7-2.9,5.6-5.5c1.7-1.5,2.9-3.5,4.3-5.7c1.9-2.8,2.1-3,3.8-6.1c2.5-4.5,14.7-7.3,20.5,1.6
            s1.7-2.2,5.3,8.1c1.1,3.1,1.2,0.7,1.4,4.8l0.1,1.2c2.3,0.7,1.3,1.2,3.9-0.1c2,2.8-0.6,3.2,5.6,6.6c3.7,2.1,6.8,6.4,7.5,5.3
            c0.1-0.2,0.4,0.2,0.7,0.3c-1.7,2.3-1.6,0.9-3.6,3.3c0.4,1.6,0.3,1.2,0.9,2.4c2,3.9,2.9,2.8,4.7,2.9c3.2,0,11.8,1.5,14.2,3.1
            c2.9,2.1,4.3,4.6,5.5,4.7l1.7,0.1c2.6,0.5,1.7,1.6,4.3,3.2c6.8,4.2,7.5,6.2,10.8,11.9c1.7,3.1,2.2,3.7,5.5,4.9
            c2-4.7-2-6.4-1.7-10.4c0.1-1.4,1.3-3.3,1.5-4.8c0.8-5-1.1-4.8-3.4-9.2c-0.9-1.7-1.1-3.5-2-5.5l-2.3-4.1c-2.6-7.5-1.2-3.4-0.6-4.8
            c3.2,0.2,1,0.2,3,2.9c1,1.4,2.2,2.4,3.3,3.5c-0.3-5.4-3.4-4.1-8.6-14.2c-1-2-0.8-2.9-2.1-4.6l-6.9-8.2c-1.6-3-1.2-6.3-4.8-9.1
            c-3.7,1.1-0.3-0.9-2.7,2.9c-4.9-1.8-2.1-5-8.4-7.2l-2.5,1.5c0.3,3.4,0.7,1.3,1.1,5.3c-4.6-1.9-2.5-2.1-4.4-5.4
            c-1-1.8-7.4-8.2-9.9-15.2c-3.1,0-2.6-0.1-4.9,0.7c-1.3-1.8-2.1-2.4-2.6-5.2l-6.7,3.5c0-4.9,0.6,0.2,1.7-5.9
            c-3.8-2.5-4.8-2.6-4.8-8.7c-6.7-0.1-4.7,0.3-10-3.3c-2.2-1.5-6-8.7-13.8-5c-3.6,1.7-1.3,0.4-2.6,1.9c0,0,0.7,0.5,0.9,4.2
            c-6.1,1.2-1.6,1.9-5.6,3.8l-1.9-2.6c0.9-2,2.9-2.5,4.5-4c-1.1-6.1-1.3-1.5-2.4-7.6C910.5,1186,907.5,1188.3,903.6,1186.8z
              M879.6,1136.2c0.1,0.1,0.3,0.3,0.4,0.4l4.2,4.2c4.7,5,2.2-0.4,6.5,5.3c5.1,7,5.9,0.1,11.4,6.2c2.5,2.8,2,0.6,5.6,6.9
            c2.4,4.2,3.4,9.5,9.5,10.7c-2.5-7.7-2.5-4.3-5.3-7.4c-1.5-1.7-0.4-1.4-2.4-3.6c-5.7-6.3-4.6-4.7-6.2-13.2c0-0.1,0.7-5.6-7.2-5.3
            c-7,0.3-5.6-0.4-9.3-6.4l-2.7-5.8c-2.6-7.2-3.4-1.9-5.6-7l-7.4-11.8c-0.1-0.1-0.3-0.7-0.5-0.9c-4.2,0.7-2.9,1.6-5-2
            c-1.2,0.6-0.9,0.6-1.9,0.7c-5.1,0.6,4.3,0.1-1.8-0.2c-2.6-0.1,0.5-0.3-1.7,0s0.4-0.2-1.7,0.7c1.6,1.4,0,1,2.5,1.1
            c0.3,0,1.4-0.5,1.8-0.5l0.9,3.1c-2.4-0.5-4.6-0.9-6.8,0.7c0.5,1.4,0.3,0.6,2.2,2l1,1c-0.9,2.6-1.5,3.8-1,6.7l1.9,1.3
            c9.4,8.3-0.2-0.2,7.8,4.2c4.7,2.6,3.2-0.5,5.1,0.3c1.5,0.6,1.1,3,2,5.1L879.6,1136.2z M962.2,1180.7c-3.3-5.5-2.5,1.5-11.2-9.7
            c-5,1.6-2.3,2.5-2,5.5l-3.1,1.9c-0.1-0.1-0.3,0.2-0.5,0.3c0.6,2.5,1.3,4.3,3.8,3.5c0.1,8.5,5,9.6,7.2,14.8c0.8,2,0,1.5,2.9,2.6
            c-0.2,4.9-0.2,4.3,2.9,6.6c3.5,2.7,1,1.6,3.4,4.9l8.4,9.2v-5.1c-3.7-2,1.1,0.7-1.3-5c-0.1-0.2-0.2-0.4-0.3-0.6
            c-1.5-3.7-1.3-6.4-2-9.8l-4.2-10.8c-2-5,0.2-2.1-1-4.8C963.3,1180.1,964.1,1183.8,962.2,1180.7z"
                />
                <path
                  fillRule="evenodd"
                  fill="#717171"
                  d="M1027,1126.5c2.2-3.2,1.8-3,0.9-7.8c-12.2-2.5-9.5-2-11.7,5.2
            c-1.2,3.9-1.1,2.6-3.8,3.4c-1.8-3.1,0.2-2.6-2.7-4.7c-0.9-0.6-3.6-1.7-4.4-2.4c-1.3-1.3-1.4-2.6-3.2-4.3c-3.6-3.4-7.2-4.1-9.2,1
            c-4.5,12-6.6,1.1-21.8,13.3c-4.1-1.6-3.4-3.3-6.7-5.1c-2.9-0.7-9.5,1.2-11.1,1.1c-11.9-1.3-8.6-2.8-20.5,3.8c4.3,6,1.9,5,9.2,5
            c1,1.5,4,5.6,5.9,6.5c9.7,4.2,2,0.9,7.1,4.6c0.1-5.5-2.4-6.7,4.6-7.8c-0.8,3.3-2.4,4.8,0.5,7.6c0.7-1.7-0.1-0.6-0.5-4.2
            c0.3,0.2,0.6,0.3,0.8,0.4s0.5,0.2,0.8,0.4c2.6,1.6,1.5,0.6,2.4,2.5l2-3.2c1.4,2.4-0.1,0.7-0.9,3c-0.7,1.9-0.3,2.1,1.2,4.3
            c5.6-2.4,1.6-1.3,4.5-5c4.1,6,9.3-2.1,10-2.7c5-3.9,4.9-4.4,5.5-10.9c3.2,0.9,2,0.7,5.1,0l3.3,3.2l11.6-1.5c2.2,8.7,1,4.6-1.3,12.7
            c-7.4,2.6-2.4-0.9-9.9,0.2c-1.4,2.5,0.6,1.1-1.2,4.7c-2.7,0.3-2.6,0.9-5-1c-0.1-0.1-0.3-0.3-0.4-0.4l-4.7-2.7c-1.7,2.8,0.9,1-5,5.8
            c-3-0.9-2.4-1.7-4.5-0.4c1.2,0.6,2.1,1.2,2.6,1.4c2.5,0.9,0.7,0,3.1,0.3c2.2,3.1,1.8,3.6,1.7,8.7c-0.2,13.9,7.7,15.4,9.7,18.9h3
            c0.3,3.9,0.9,4.4,3,7.1c4.9,6.3,12.6,6.2,16.9,3.2c1.3-1,0.8-0.5,2.2-1.8l-2.4-3.4l2.9-0.9c-0.7-4.3-3.5-4.8,0.8-7.7
            c6.4-4.4,1.4-0.6,3.2-6.8c1.1-3.6,0.2-2.1-1-5.7c1.1-1.1,1.6-3.1,2.2-4.8c2.8-7.9,1-8.1-0.2-16l-3.6-1.9c1.4-6.7,5.8-3.9,3.1-11.4
            c2.4-2.4,1.6-1.8,2.8-4.6L1027,1126.5z"
                />
                <path
                  fillRule="evenodd"
                  fill="#717171"
                  d="M983,1082.4c-2,7.4-1.2,5.7,0.7,11.9c-3.2-1.2-1.6-0.5-2.8-3.8
            c-4.2,1.4,0.6,2-3.9,3l-0.2-6l-10.3-5.6c-0.2-4.6-0.6-3.3-1.7-6.2c-0.9-2.4,0.9-0.7-1.7-4.7c-1.9-3-1.2-2.9-2.6-5.7
            c-1-2.1-1.7-2-3-4.6c-5.9-0.7-6.2-1-8.7-4.7c-2.3-0.1-3.2-0.2-5.2,0.3l-2.6,0.9c-0.1-0.2-0.4,0.2-0.7,0.3
            c-0.6,7.5,5.2-0.3,5.8,14.7l-3.7,2.4c-1.6,0.7-2.7,1-4.3,1.5c-4.8,1.3-3.1,2.5-7.4,1.9c-4.6-0.6-4.9,0.3-8.6,2.3
            c-7.5,4.1-4.4,7-5.4,4.7c-0.6-1.4-10.5,5.1-12.3,6.2c1,2.5-0.2,0.5,1.5,2.6c2,2.6,1.4,0.7,4,6.1c-2.1,3.5,0.7-1.2-1.7,1.7
            c-5.5,6.7-1.2,10.3-3.4,18.1c5.1,3.5-0.3,2.1,3.9,5.7c3.8,1.9,10.1-9.6,18.2-1.5c1.9,1.9,1,2.4,3.9,4.6c11.4-2.9,1.4-6.4,21.7-4.1
            c5.5,0.6,10.7-5.2,17.2,3.6c5.7-1.6,6.8-4.8,14.7-6.1c3.4-0.6,5-0.8,6.4-3.9c0.7-1.5,0.7-2.1,1.4-3.6l1.5-2.7
            c-4.1-2.4-1.4,1.4-5.2-3.9H987c-2.5,0-6.7,5.5-6.8,5.8c-1.1,2,0.1,1.5-1.8,3.8c-7.3,8.6-8.5,0.9-10.3-2c3.8-2,2,2.3,4.2-3.7
            c-1.2-2.2-3.6-1.7-3.6-5.8c0-21.8,12.6-3.9,20.7-12.5c-1.6-2.2-2.1-2.1-3.4-4.3c3.1-6,3.1-2.2,5.9-6.7l-5.8-2.5
            c-7.7-2-2.4-4.2-15.3-8.6L983,1082.4z M990.6,1088.2c1.9,6.8,5.5,5.7,11.2,7.9c8.3,3.3,8.9-2.6,8.9-2.7c2.2-3.8,1.3,0.9,2.2-2.4
            c0.1-0.3,0.4-0.3,0.5-0.3c-5.5-2.8-3.4-2.2-7.2-0.2l-3.2-3.1l-1.7,2.8c-2.9-0.5-4.1-3-6.7-2.8L990.6,1088.2z M1021.8,1101.4
            c4.3,1,5.6,3.9,9.9,1c-0.8-3.4-0.2-3.2-3.1-4.7c-6.1-3.1-9.2-3.2-13.8-0.2c-2.6,1.7-0.6,0.3-1.6,1.6
            C1018.9,1103.8,1017.3,1100.4,1021.8,1101.4z"
                />
                <path
                  fillRule="evenodd"
                  fill="#717171"
                  d="M932.7,1064.8c0-11,5.3-0.5,5.4-0.2
            C939.7,1069.2,932.7,1068.1,932.7,1064.8z M807.2,995.6c-1.4,12,2.2,1.5,8.9,9.6c0.8,0.9,0.9,1.1,1.7,1.7c-1.2,4.1,0.3,4.8,3.4,7
            l0.9-2.2c2.4,0.7,7.6,0.3,9,2.9c4.4,7.6,14.7,7.8,15.4,17.4c-5,0.5-2.3,0.7-5,5.1c3.3,2.6,1.4,2.8,4.7,5.2c0.7,0.6,2.2,1.5,2.9,2.1
            c7,7,9.2,4.1,12.7,9.9c5,0.2,4.2,0.6,8.1,2.4c2.1,0.9,1.8-0.9,6.5,2.2c3.2,2.1,4.1,0.7,7.2,3.1c2.2,1.7-0.2,0.9,2.2,1.7
            c10.1,3.2,5.6,8.4,8.9,14.9c1.3,2.7,2.4,2.5,3.6,6.4c1.5,5,0.5,2.4,4.3,5.4c3.5-1.7,5.5-3.8,9.2-5.1l-1.2-5.5l3-2.8
            c1.3,1.5,2.6,2.6,5,3.7c6.8-3.8,4.8-4.3,13.8-4.1c0.8,0,3.3-1.4,6-2.1c3.1-0.8,4.1-1.3,6.3-3.1c0.5-11.6-6.3-5.4-5.7-15.4l7.9-1.6
            c0-6-5.1-3.9-8.6-5.6c0-3.1,0.2-2.4,2.1-3.9c-1.2-2.9-2.7-3.8-1.2-8.2c0.1-0.4,2.6-6.2,3-7c3.1-6.1,8.3-4.2,13.2-1.6
            c1.6-0.9,1.6-0.9,3.3-2c3.8,1.6,3.8,1.6,8.4,2c7.3,0.7,9.6,6.1,15.7-2.3c1.6-2.1-0.9-0.2,1.9-2.2c4.3,0.9,0.1,0.6,4.3,1.5
            c3.4,0.8,7-1.9,9.5,2.2c0-5.8-4.8-5.5-4.2-10.9c-5.6-0.1-6.3,0.2-10.4-4c-4.4,0.9-6.4-1.1-7.7-2.1c-0.7-0.5-0.3-0.3-1.5-1l-8.8-8.6
            c-1.8-3.7,0.7-1.2-2.6-2.7c-1.2,1.9-0.3,0-1.2,2.8c-0.5,1.7-0.3,1.5-1,3.2c-4.4,0-4.2-0.9-5.8-1c-2.9-0.2-0.1,1.2-4.3-0.1l-7.9-4
            c-1.5-1.1-1.1-0.9-1.7-1.5l-3.1,1.9c-1.9-1.4-3.1-2.5-5.1-0.6c-1.7-2.6,0.2-5.6-6.8-5.9c0.1,2.6,0.7,2,0.9,4.3l-2.1,1.7
            c-4.1-2.7-3.6-4.3-3.6-9.2l-2.2-0.4c0.3-2.2,0.3-2.5-0.7-4.3l-0.8-1.1c-0.1-0.3-0.3-0.4-0.4-0.5c-0.3,0.4,0.6,0.9-1.8,1.7
            c-3.6,1.2-2.7-0.3-2.7-0.3c-0.2-3.1-0.3-2.7,3.2-3.1c-3.8-2.8-0.9-5.6-4.4-8.2c-1,2-0.4,0,0.7,3.4l-4.4,1c0.4,2.8-0.5,2.6,1.5,3.2
            c-4.8,1.1-2.6-3.6-8.4-4c0.7,3.2,1.2,0.5,2.3,4.6c-0.2,0.2-0.4,0.3-0.5,0.4c-3.9,3.6,0,6-6.1,4.9c0.7,1.7,0.2,2.1,0.9,4.8
            c3.6,1.3,1.5,0.1,4.3,2.2c1.9,1.5,2,1.7,3.2,3.4c5.6-2.5,3.4-1,4.2-0.6c-1.6,2.2-3.1,2.7-5.1,5.2c1.9,3.4,6.3,9.2,4.8,13.8
            c-1.7,5-6.6,6.8-10.9,8.6l-3.6,1.3c-5.7,0.8-12.5-0.5-18.1-3c-6.4-2.9-6.2-6-3.9-12.1c-10.9-7.8-13.1-9.8-24.9-16.9
            c-13.5-8.1-12.8-6.5-28.9-2.3c-1.6,0.4,0.2-0.3-2.1,1C812.4,993,809.7,995,807.2,995.6z M953,990.5c1.9,1.3,2,2.5,2.3,3.4l-7.2-0.6
            c-1.3,3.2-0.5,1.9,0.9,5.9c5.9,0,4.1-1.7,9.2-4.2C954.5,991.1,957.8,991.5,953,990.5z M976.2,999c3.3,2.2,1.4,2.2,3.8,2.6
            c0-5.3-1.4-2.2-0.4-10.5C975.3,992.2,977.2,995.1,976.2,999z"
                />
                <path
                  fillRule="evenodd"
                  fill="#717171"
                  d="M1052.7,1001.6c-4.4-2.9-0.9-1.2-2.8-5.2c-5.5,0.2-1.3,1-5,3.9
            c-0.7-1.4-0.4-0.8-1-2.4c-1.5-3.9,0-2.2-1.8-2.9c-3.7-1.3,0.3-4.4-5-12.7c-1-1.7-2.9-2.7-5.8-7.1c-1.3-1.9,0.6-0.4-1.6-1.7
            c-5.5,5.5-0.7,7.5-9.9,4.5c0.1,4.1-1.1,0.8,0.7,5.7c1.4,3.7,0.3,0.9-0.4,4.5c-1.1,5.6,5.3,9-0.3,15.2c1,2.7,1.3,2,1,4.5
            c-1.8,18.4,0.9,5.5-4.8,18.7c-2.7,6.3-3.6,1.1-7.2,5.3c-2.2,2.5-1.7,4.4-2.3,3.3c-0.1-0.2-0.3,0.5-0.5,0.7c2.2,1.8,2.3,4.2,4.8,6.1
            c2.9,2.2,6.2,1.5,11.8,7.5c3,3.2,3.6,4.9,8.2,5c0.2-5.7-1.9-2.6,3.3-9.7c5.3-0.4,5.4-1.5,10.2-0.8c1.3,2.7,0.9,3,1.4,5.8
            c4.8-4,2.6-4.2,3.6-13.5c5.7-2.5,6.8-0.6,6.8-0.6c1.8-2.5,1.4-0.6,1.9-3.6l-2.5-2.3c0-0.1-1.2-3.4-1.3-3.6c1-1.3,1.9-2.7,2.4-3.7
            l0.4-1.7c-0.2-1.2-1.1-2-1.1-2c3.8-3.5,1.7,0.9,2.9-3.1c0.3-0.1,0.8,1.4-0.5-2.8c-0.6-2-0.7-2.2-1.7-3.3
            C1059.7,1005.2,1059.8,1006.3,1052.7,1001.6z M1048.9,994.3c-0.2-3.8-1-3.8-4.4-4.3C1045.2,994,1044.8,994.5,1048.9,994.3z"
                />
                <path
                  fillRule="evenodd"
                  fill="#717171"
                  d="M824.7,980.8c10.2,4.1,19.5,8.9,29.2,14.4
            c6.5,3.8,12.8,9.1,19.2,13.1c2.1-5.2,0.6-2.6,4.8-4.9c0.2-5.2-0.6-3.4-1.2-6.7c-0.8-3.9,0.9-3.6-0.1-6.5c-2.1-3.1-1-0.4-3.8-3.1
            c-3.1-2.9-2.9-4.4-3.4-8.7c0.9-0.8,0-0.7,2.4-1.7l-0.7-3.9c-1.3,0.4-2.1-0.3-2.2-0.3l-2.9,0.9c0.2-3,0.5-1.2-0.5-2.5
            c-0.1-0.1-0.3-0.2-0.5-0.3l-10.7-13.1c-0.1,0-0.3-0.2-0.3-0.2c-3.7-3.2-6.7-7.6-11.1-10.2c-4.3,1.5-7.7,3.1-6.4-3.5
            c-4-0.9-1.8-1.1-5.4-2.1c-2.6,1.5-5.6,5.5-5.7-1.9c-3.2,0.2-3.4-0.4-6,0c0.7,2.1,0.7,2.2,1.9,4.1c2,2.9,1.2-0.1,1.5,3.4
            c-4-0.7-2.6-1.3-6.1-1.9c-0.5,2,1,1.4-1.8,2.7l-0.3-3.5c-0.9,3.2-1.6,2.2-4.7,1.1l0.1-2.9c-3.8-0.1-8.9-2.3-11.5-4.4l0.2,3.6l-2-1
            c-3.8-1.8-5,0.6-8.1,2c-2.2,1.1-2.2,1-3.4,0.2c-0.7,5-0.7,3.4-3.8,4.7l-2.8,3.2c-0.1,0.2-0.3,0.4-0.4,0.5l-0.8,1.2
            c1.6,1.6,1.9,1.9,3,4.3c-3.3-0.2-3.3,0.5-4-1.5c-1.8,6.1-1.1,0.3-2.7,4.5c0.3,6.3,2.3,5.8,2.8,7.8c1.3,5-2.8,2.1-4.9,1.9l-0.9,7.4
            c10.1,1.2,8.2,1,16.9-10.2c3.6,0.3,4.1,1.2,7.4,2.6c2.6,1.1,4.7,1.5,7.2,2.7C813.3,975.3,816.3,977.5,824.7,980.8z"
                />
              </g>
              <g id="region-vi" className="region pointer-events-[bounding-box]" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleOnClick}>
                <path
                  fillRule="evenodd"
                  fill="#D1D1D1"
                  d="M883.4,1517.5c0.8-1.1,2-2.2,2.7-3.1c2-2.3,4.1-4.1,5.3-7.2
            c0.2-2.6-7.2-14.9-7.3-19.1c8.5,0,20-1.4,28,3.7c1.3-3.3,2.2-6.7,3.7-8c4.1-3.7,10.7-6.1,13.5-14.1l2.8-8.2c0.5-1.7,0.4-2.7,0.9-5
            c0.9-4.8,3.2-12.5,6.1-15.5c4.8-5.1,3.9-6.3,1.2-8.2c1.5-3.9-0.5,1.1,1.4-1.8c0.6-0.9,0.7,0,0.5-1.9c-1.8,0.5-1.2,0.5-3.8,0.5
            l-2.1-7.3c-2.9-6-0.5-2.2-1.7-6c-6.5,2.6-5.3-0.3-14-1.5c-1.9-0.3-2.5-1.5-3.1-1.6c-9.2,0.2-4.4,2.4-12.8-2
            c-4.4-2.4-6.5-2.7-12.1-3.9c0.2-1.5-0.8,0.7-3.6,2.1c-1.9,1-4.4,1.2-6,2.4l-4.2,4.1c-4.1,3.9-2.7,3.4-13.8,3.4
            c-1.7,3.3-1.2,2.2-5.9,2.3c2.9,5.9-3.6,3.4,0.4,10.6c2,3.7,1.1,6.1,1.1,11.6l-1.5,2.2c-1.8,3.9,1.5,3.1-1.4,6.8
            c-1.9,2.4-1.5,0.2-2.2,4.4c-0.4,2.5-0.6,2.7-1,5.1c-2,0.9-1.7-0.5-3.8,2.8c-6.5,10.8-7.2,0.5-12.6,8c2,3.3,2.2,1.5,3.2,6.6
            c0.7,4.1,0.2,4.1,2.7,7.4c7.2,9.4,0.1,12.6,0.8,21.1c0.3,3.2-0.6,6.3-0.3,8.8c0.3,2.4,7.9,18.6-3.2,20.9c-4.4,0.9-2.1-1.9-6.3,0.2
            c-7.6,3.8-5.9,13.7-26.5,11.2c-7.3-0.9-11-0.1-17.6-0.1c-0.5,4.2-1.1,8.9-3.6,11.5c-5.3,5.4,0.1,2.9-6.1,8c1.8,3,3.2,2.2,2.5,5.5
            c-0.5,2.2-1.4-1.4-0.3,2.9c0.7,2.6,0.9,0.3,0.7,3.2c-0.2,3.2-3,4.4-1.9,6.5c1.7,3.3,1.5-0.5,5.5,0.2c-0.6,2.3-0.1,1.1-1.6,2.7
            c-1.3,1.3-0.4,0.1-1.7,1.6c3.6,3.2-0.5-2.2,7.8,2.2c-0.5,2.5-1,3.1-1.8,4.5c1.1,0.5,1.3-0.3,2.1,1.6c0.5,1.4,0.9,2.6,1.9,4.4
            c1.7,3.3,0.5,1.3,3.5,3c4.3,2.5,4.1,12.1,15,18.5c3.4-4.2,4.4-9.9,7.2-14.5l24.1-28.7c1-1.2,0.3-0.2,1.2-1.2
            c3.8-4.1,13.5-18.7,16.1-24.2c1.1-2.4,2-4.3,3.3-6.9c6.4-13.3,8.4-15.2,15.3-27C881,1522,882.3,1519,883.4,1517.5z"
                />
                <path
                  fillRule="evenodd"
                  fill="#D1D1D1"
                  d="M808.7,1485.1c1.5,0,5.4-0.6,5.4-0.6c2.7-1.1,0.9-1.3,4.5-4.9l0.9-0.8
            c0.6-0.7,1.1-1.8,1.3-2.2c9-18.2,6.1-15.5,6.1-29.8c-2.8-2-4.7-3.6-7.3-5.9l-7,5l0.3,5.3c-1.6,0.7-2.2,1-3.9,2
            c-2.1,1.2-0.9,1-3,0.5c-0.4,2.3-0.7,3.1-2,4.5l-3.1,3.7c-1.1,1.7-2.2,1.6-1.5,4.8l0.5,1.4c1.1,2.2,1.4,1.6,2.4,1.9
            c-1.1,1.9-2.2,1.8-2.3,1.9c-0.2,0.3,0,1.5,0,2.3c-7.2,2.8-4.8,1.4-6,3.5c0.9,1.2-0.2,1.6,4.3,2c-1.2,4,0.9,3.8,1,8.9l4.6,0.1
            c4-7.7,1.2-5.8,5.6-6.2C809.5,1482.8,811,1483.5,808.7,1485.1z"
                />
                <path
                  fillRule="evenodd"
                  fill="#D1D1D1"
                  d="M805.9,1378
            c-1.6,3.5-8.5,4.7-8.7,4.7c0,0-4.8-1.2-6-1.4c-9.6-1.5-6.1,1.3-16.7-4c-4.2,2.2-9.1,8.2-11.2,11.8c2.2,1.8,3.1,3.4,5.1,5.7
            c5.6,6.6,7.2,6.5,5.2,14.3c-0.9,3.3,0.3,3.8,0.9,7.6c-5.5,0.3-4.3,2.4-6,4.2c-0.1,0.2-0.3,0.3-0.5,0.4c-1.6,1.4-2.6,1-8.7,7.1
            c-2.2,2.3-2.5,6.4-3.9,9.5c-2.3,5.2-3.1,2.4-6.7,5.9c-1.5,1.5-2,2.2-3.6,3.2c-8.6,5.1-4.1,1-6.5,6.8c-2.7,6.5-6.2,1.9-6.2,25.7
            c2.4-0.4,2.6-0.5,4.1-2.6c0.8-1,1.6-2.7,2.1-3.8c7.1-15.8,3.6-3.8,12.1-10.5c9.1-7.3,1.3-3.8,10.9-5.6c3.4-0.6,1.1-0.3,3.5-1.9
            c3.2-2.1,5.1-0.4,8.5-1.5l18.1-3.5c2.9-0.3,9.1,2.4,16.4-1.5c0.5-1.9,0.5-1.8,2.4-3.8l-1.6-3.3c1.5-2.4,3-4.1,6.5-4.8
            c3.8-0.7,2.2,0.5,4.8-1.1c0.8-0.5,0.3-0.4,1.7-0.9c7.1,3.8,7.9,1.6,12.2-6.3c4.5-8.3,0.3-11.1-2-14.7c1.3-1.4,1.3-1.2,2.4-3.1
            c1.2-1.9,1-5.1,10.3-3.8l-0.1-2.7l3.9-1.8c2.8,1.2,0.7,1.5,3.6,1c2.5-1.4,0.2-5.5,3.3-6c3.1-0.4,1.4,3.3,1.5,5.4
            c4.1-3.4,1.4-0.9,1.8-5.4c4.8-0.6,2,1.1,4.4-0.7c5.5-4.1,3.5-6.4,4.2-9.4c0.3-1.2,1.4-3.2,1.9-4.5c5.2,0,5.8,0.8,8,3.6
            c2.2-3,1.8-1.3,4.8-3.6c0-4.3-1-5.2-4.3-6.6l0.8-9.4c2.4-5.2,0.3-1.6-0.1-7.7c3-0.5,1.7,0.8,4.3-0.5c0.7-1.9-0.3-0.6,0.4-2.3
            c1-2.4,3.8-2.2,0.4-6.8l-0.7-1c1.7-3.8,3.7-3.5,4-8.4c-2.1-1.4-1.6-0.7-3.2-2.3c0.3-4.6,1.4-6.8,3.5-9.6l-2.5-3.9
            c-3.1,3.6-4.4,4.7-6.2,9.7c-1.9,5.4-2,6.3-5.9,9.8c-0.1,3.6,1.3,5.3-0.2,7.5c-5.7,8.3-10.1-1.4-15.6,7.2c0.8,2.4,1.9,3.6,2.1,6.3
            l-9,4.4c0,5.1-0.9,5.6-2.9,9.6c-1.7,3.4-5.4,2.7-10.3,2.1c-0.9-2-0.9-5.7-7.5-4.9c-5.5,0.6,0.8,2.3-11,2.1
            c-2.2-2.4-3.9-3.9-4.3-6.9c0-0.3-0.3-0.4-0.5-0.6c-0.9,1,0.1,0.1-2.6,1.1C806,1374,807.1,1375.3,805.9,1378z M897.3,1335.3
            c-2.5,2.1-4.9,0.5-5.5,5.2c1.1,1,1.6,1.6,3.2,1.9c3.1,0.6-0.9-1.6,3.6,0.8C897.2,1339.5,897.5,1339.4,897.3,1335.3z M882.6,1376.2
            c2.2-2,0.3-0.3,1.8-2.6c2.8-4.4,0.1,0.9,4-3.6c0.2-0.2,0.7-1,1-1.5c1.1-1.5,0.3,0.3,1.8-2.3c-5.4-4.8-4.3-1.2-4.4,3.2
            c-2.5,1.7-1.6,0.3-2.9,2.8C883.6,1373,882.8,1375.2,882.6,1376.2z M881.9,1392.7c1.9-1.9,2.4-3.9,4.3-6.2l-5.4,1.2L881.9,1392.7z
              M898.6,1342.5c0.2,0.6,0.5,2.7,0.9,3.2c1.2,2,0.2,0.8,2.4,1.7C903.8,1343,903.5,1343.1,898.6,1342.5z"
                />
                <path
                  fillRule="evenodd"
                  fill="#D1D1D1"
                  d="M820.2,1330.9l-0.6-0.7c-2.5-0.7-0.9-0.2-1.9-0.7c-0.9-0.4-0.7,0.7-1.2-0.7
            c-0.1-0.3-0.4-0.3-0.6-0.4c0.3,0.6,1.2,2.2,1.2,2.3c0.4,1.6,0.2,0.2-0.3,1.2l-0.7,0.9l0.3,2.4l-0.2,1l-1.7,0.1
            c-0.8-0.1-3-0.2-3.2-0.3c-2.5-0.5,0,0.5-1.7-0.7l-0.8-0.8l-4.8,0.4l-1.2,2.2l-0.5,0.9c-5.3,3.1-9.2,3.6-16.2,4.1l-3.5,5.8h-5
            c-0.4,8.8-9.7,16.4-19.5,16.5c0,12.6-2.2,13,3.4,22.4c2.7-0.7,1.9-0.2,3.9-2.4c10.4-12.2,6.4-9.1,15.2-5.7c3.1,1.2,5.3,0.4,8.7,0.7
            c6.2,0.6,12.6,3.6,15.7-3.2c3.2-7.1,8.3-6,13.8-5.8c-1,2.2-1,1.7-2.2,3.6c0.2,0.2,0.4,0.4,0.5,0.5s0.3,0.4,0.4,0.5l1.5,2
            c4.7,0.1,4.1,0.6,7.5-1.1c9.4-5,11.4,3.7,13.2,4.2h5.4c1.6-5.1,3.8-3.9,3.8-11.4l8.2-4.7l-0.3-7.5c5.8-6.1,8.5,1.2,15.4-6.1
            c-1.3-7.2-1.3-5,2.2-9.7c2.2-2.9,2.2-5.6,3.7-8.4c-2.8,0.4-1.2,0.4-3.2,1.5l-8.5,4.7c-9.2,3.5-0.9,1.8-5.5,3.1
            c-3.3,1-4.4-1.6-6,1.4c-0.1,0.2-0.5,0.9-0.6,1.1c-1.2,2.9,1-0.7-0.3,3.6c-2.5-1.2-0.1-0.7-2.5-1.1c-1.4-0.2-1.5,0.1-2.4,0
            c-1.9-0.2-3.2-0.9-4.4-3c2-2.5,0.4-0.7,2.8-2.5c1.9-1.4,0.9-0.6,2.7-2.3c3.2-3.1,1.2-2,5.4-3.6c-0.9-1.1-0.1-0.5-1.8-1.5
            c-0.9-0.5-0.7-0.2-1.7-0.7c-0.8-0.4-2.3-1.4-2.9-1.8c-2.1,1.9-1.8,2.8-5.3,3.6c-0.4-2.2-0.6-2.2-1.5-4.2l3.5-0.7l-2.7-1.8
            c3.1-2.2,1.3,3.1,2.5-1.4c0.1-0.3,0.3-0.3,0.5-0.4c-0.2-0.1-0.3-0.3-0.4-0.3c-2.4-1.9-1.5-1.4-4.1-1.7l0.4-2.9
            c-3.8,1.9-10.4,1.7-15.1,0l1.7,5.2l-6.6,0.8c0.7,2.4,0.5,1.9,1.5,4C818.3,1332.8,821.2,1331.7,820.2,1330.9z"
                />
                <path
                  fillRule="evenodd"
                  fill="#D1D1D1"
                  d="M808.8,1332.8c0-4.2-1.4-5-4.8-6.3c-0.5-0.2-1.1-0.4-1.7-0.6
            c-1.8-0.6-3.8-1.2-5.2-2c-1.1,3.8-0.8,1.7-0.1,5.9c-4.3-1-7.9,3.4-8.2-4.3c1.6,0.1,2.7,0.3,4.4,1l-0.9-3.4
            c-2.7-0.1-1.9,0.3-4.3,0.2c0.4-1.3,0.3-1.9,0.2-2.8c-0.9-0.4-2.2-1.1-3.1-1.8c0.3-3.3,0-2.1,1.7-4c-2.9-2.6-5.2-7-6.3-10.5
            c-5.9,0-9.4,0.8-12.8-2.5c-7.5-7.2,0.7-2.8-8.6-5.2l0.3-2.4c-6,0.3-4.8-2.1-11-1.9c-6.6,0.2-5.8-1.5-10.2-3.6
            c-6.1-2.9-3.2-2.1-7.2-6.2c-4.1-4.3-5-2.1-7.8-5.4c-2.9,2.9-3.8,4-9.2,4c-0.3,5.4,0.3,11.3-2.4,15.1c-4.1,3.6-2.2,2.3-0.9,3.3
            c0.7-0.7,0.2-0.4,1.5-1.2c6.7-3.9,6-4.4,11-5.8c0.3-0.1,1-0.4,1.3-0.4c6.9-0.6,7.8,3.4,10.3,1.8c4.1,5.3,11.1,2,14.4,7.3
            c4,6.5-1.2,13.2,0.8,27.5c0.3,2.3,1.7,3.7,1,5.9c-1,2.9-1.9,2.3-2.5,5.9c3.4,3.6,5.1,2.9,5.1,10.1l2.8,4.2c0.2,5.1-3.2,1.7,1,8.5
            c12.8-2.3,15.9-5.8,19.5-17.7l5.1,0.7c1.2-3.9,1.8-1.7,2.2-6c3.8,0,8-0.6,11.3-1.2c6.7-1.2,3.3-3.1,7.3-4.6
            C803.2,1334.5,805.9,1332.8,808.8,1332.8z"
                />
                <path
                  fillRule="evenodd"
                  fill="#D1D1D1"
                  d="M722.8,1294.4
            c-3.7,0.7-3.6,1.9-6.9,4c-0.4,0.7,0.2,0.6-2,0.9c0.9,0.8-0.6,0.5,1.5,0.7c2.7,0.3-1.2,0,2-0.2c2.3-0.2,1.3-0.3,3.2,0.3l2,0.9
            c1.7,0.4,4.6,0.6,4.6,0.6c2.9,0.9,0.6,2.6,12.1,1.6c1.7,2.5,3,2.8,3.2,6.6c0.4,5.1-0.5,15-1.7,19c-0.4,1.4-0.8,1.1-0.8,3.1
            c0.1,3.3,1.8,4.3-0.9,7.9c-0.9,1.2-1.4,0.7-1.8,2.8c-0.5,2.5,1-1.4-0.1,2.5c-1,3.8-1.8,2.7-0.1,7.9c0.8,2.5-0.2,3.6-0.2,7.1
            c-2.1,0.9-2.5,1.5-3.8,2.7c0,8.9,3.6,4.3,3.1,11.1c-0.4,4.3-3,2.5-1.9,9.5c0.2,1.3,0.2,4,0,6.1c-0.2,3.1,0.5,1.7,0.7,4.4
            c0.3,5.7,1.9,9.5-1.2,14.3c-4.4,7-4.8,3.1-7.7,12.4c-1.1,3.5-2.4,6.4-3.4,9.9c-0.6,2.3-0.7,3.2-1.7,5.1c-5.6,12,11.1,2.7,3.5,30.3
            c-1.2,4.6-10,13.1-6.1,18.8c3.8,5.7,9.8,0.9,14.4-2.7c-1.6-1.6-2.1-1.8-2.2-5c-0.1-5.5,0-13.5,2.6-18.2c0.7-1.3,2-2.5,3.1-4.4
            c1.4-2.4,0.7-3.1,1.8-4.9c1.2-1.9,5.2-3.2,7.7-5.7c7-7.3,5.8,0.8,10.1-11.7c2.7-7.9,1.3-2.8,6.1-8.2c4.8-5.3,4.7-3.1,10-9.7
            c-3.4-7.5,5.7-6.7-3.8-16.9c-19.1-20.3-10.1-20.1-12-31.7c-0.6-3.5-3.6-3.4-2.7-8c1-5,1.7-2.5-1.8-6.3c0-9.1-2.7-5.8-5.2-10.9
            c0.4-3.8,1.7-3.6,2.4-6.5c0.5-1.7-0.7-3.1-0.9-6.1c-0.2-4.2-0.3-12.6,0.3-16.5c2.1-13.3-4.8-10.6-10.6-13.3
            c-2.8-1.3-3.3-1.9-6.2-2.8l-0.6-0.5l-3.8-1.2h-1.7L722.8,1294.4z M643.8,1270.3c4.1-0.9,2-2,5.2-1.3c0.6-6.3-4.4-9-4.7-15.1
            l-4.5-1.9c-1.5,3,0.3,2.1-2.1,4c2.9,0.8,1.1,0.2,3.1,1.3l2.4,1.9c-1.1,2.4-0.1,0.2-1.1,1.9v6.4
            C643.8,1271.7,642.1,1268.5,643.8,1270.3z M664.8,1289l-2.9-2.6l-10.1-0.7c-1.1,0.9-1.4,1.3-2.6,2.8l4.1,1.1
            C657.2,1290.4,658.8,1293.5,664.8,1289z M673.1,1279.7c-0.3-1.1-1.5-2.9-2.2-4.4l-3,1.2c2,4.4-1.9,4.9,1.7,9.5
            c2.7-1.1,2.5-0.2,4.9-1.9c-0.8-3.4-0.2-0.4-0.9-2.2c-1.6-4.7,1,4-0.3-1.1L673.1,1279.7z"
                />
              </g>
              <g id="region-vii" className="region pointer-events-[bounding-box]" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleOnClick}>
                <path
                  fillRule="evenodd"
                  fill="#A1A1A1"
                  d="M881.7,1523.4l-1,1.4l-0.9,1.6l-0.7,1l-1,1.2
            c-1.8,4.7-5.4,8.4-7.7,12.7c-8.7,16.4-6,14.3-17.7,32.6c-7.2,11.1-28.4,33.1-31.9,38.5c-1.7,2.7-5.6,11.5-5.7,14.8
            c13.5,8,6.2,2.5,17.6,5.6c1.5,0.4-0.2,0,1.9,0.3c1.3,0.2,1.4,0.1,2.6,0.5c1.7,0.4,2.8,0.9,4.2,1.8c2.5,1.7,5.4,3.6,7.4,5.1
            c0,11.1-0.1,8.5,2.5,17.5l1.7,4.4c0.9,2.4,0.2,1.4,1.4,3.6c1.8,3.5,2,3.2,3.3,7.6c3.8,1.2,7,3,9.4,5.5c2.5-0.7,3.1-0.9,5.5-1.5
            c2.2-0.5,1.5-1,3.4-2.7l7.2,2.9c0.8-1,1.6-2.4,2.6-3.1c1.3-0.9,0.5-0.2,2.3-1c8.2-3.9,4.9-2.7,7.7-6.7c0.1-0.1,0.3-0.3,0.4-0.4
            l8.9-12.1c1.2-3.1,1.3-6,2.3-9.4c3.5-11.5-2.1-9.4-5-12.8c-1.9-2.3-0.6-4.3-4.3-6.3l-0.3-6c-5.9-0.1-6.2-1.5-7.6-6.5
            c-1.6-6-4.5-4.1-7.2-4.4c1.5-3.9-1.2-0.6,1.2-6.5c-3.8-4.4-6.7-9.9,2.3-8.5c0-3.9,0.7-5,0.9-7.5c0.2-2-0.8-4.4-1.1-7.1l-2-11.3
            c3.2-3.4,2-3.4,2.4-9.4c1.4-1.3,2.4-1.3,3.2-2.6c2.7-4.4,0.9-8,7.2-10.2c0.1-3.8,3.2-9.9,4.8-13.1c5.6-11.2,0.7-7.5,3.9-13.5
            c7.5-13.9,4.7-10.8,5.5-26.8c-10.7-1.4,1.3-3-24.8-3c0.9,3.6,2.7,6.4,3.9,9.9c1.2,3.3,2.4,5.2,3.6,8.4c-2.1,2.2-3.9,4.8-6.4,7.6
            C881.4,1522.1,884.8,1519.3,881.7,1523.4z"
                />
                <path
                  fillRule="evenodd"
                  fill="#A1A1A1"
                  d="M1010.1,1369l-6.8,0.3c-2.5,0.8-0.1,2.9-2.8,6.3c-1.5,1.9-3.1,2.2-4.4,3.9
            c-3.4,4.5-0.2,6.9,0.6,9.6c0.5,1.8-0.4,2.8,0.5,5.8c-4-1-0.9-0.1-3.9-2.3v5.8c-1.9,1.2-3.4,2.4-4.3,4.7c2.5,3,8,3.1,0.3,13.9
            c-1.5,2.1-1.4,2.8-2.2,5.2c-1.4,3.5-1.9,7.8-3.1,10.4c-2.1,4.5-3.9,4.4-3.9,11c-6.5,1.9-6,5.9-11.4,12.3c-2.4,2.8,0.3,3.2-2.2,7.7
            s-3.2,0.9-3.6,6.5c-0.4,5.5-0.6,7.1-3.2,11c-2.7,4-3.5,8.8-8.1,12.8c-8.3,7.2-4.7,4.5-6,14c-0.6,4.3-1.3,2.9-3,4.8
            c-6.5,6.8-3.8,9.3-9,15.3c-0.8,0.9-1.2,1.3-2,2.2l-7.5,7.7c-4.3,3.4-1.6,7.6-3.6,13c-2.8-1.3-0.7-1.3-3.1-4.1l-1,6.8
            c2.6,1.6,4.5,0.3,4.5,4.6c0,5.2-0.2,5.1-4.3,6.8l0.2,6.7c-5.6,5.3-2.7,8.4-4.8,15.2c-0.3,1.2-1.7,3.1-1.7,4.8c0,3,1.1,1.1,0.2,4.6
            l-2.4,11.3c-0.5,4.1-1.5,6-1.6,9.2c-0.1,3.1,0.7,5.6,0.9,9.2c6.5,2,7.1-0.3,10.1-6c2.9-5.5,5.7-4.4,10.5-12.8c2-3.6,2-5.8,3.6-9.9
            l2.2-5.4c1.3-3,1.3-5.7,1.3-9.6c0.7-0.5,1.1-0.7,1.9-1.4c2.5-2,1.9-4.6,1.9-7.7c6.3-5.4,2.1-7.9,10.2-10.4l1.2-7.1
            c1.5-4.5-0.7-6.4-0.1-11.7c0.4-3.6,2.4-8.3,4.1-11.1c4.3,1.1,3.7,2.2,4.2-1.5c0.5-3.2,2.2-5.8,4.4-8.5c3.6-4.5,4.7-1.6,7.7-9
            c4.2-1.3,11.3-0.3,12.6-3.4c2.5-6,2.4-2.9,6.1-6.4c2.3-2.2,2.2-6,6.9-3.1l-0.8,0.9c-0.2,0.2-0.7,0.6-0.9,0.8
            c-1.7,1.8-2,3.1-2.6,5.5l2.7,2.9c5-1.8,3.7-1.2,7.1-4.6c2.6-2.7,3.8-3.3,5.5-6.5c-2,1.2-1.5,1.1-3.4,2.1c-4.3-1.9-1.5-2.4-6.5-1.7
            l-0.8-4.4c1.3-1.2,1.6-1.7,2.6-3c1.9,4.2-1.7-0.1,0.6,3.5c3.2-1.8,3.1-2.1,4.5-4.8c-0.1,0-1.2-0.4-1.4-0.5l-1.9-1.3
            c1.6-1.5,1-1.3,1.7-3.6c1.9-6.3,3.6-7.2,3.6-13.8c0-4.6,1.7-0.2-0.4-4.4c-0.7-1.3-0.9-1.1-0.7-3.5c0.4-4.3,0.3,0.9,0.9-3.4
            c0-0.3,0.2-3.2,0.1-4.3c-0.5-4.3-1.9-4.4-2.1-9.5l-1.5-8.7c7.5-2.9,2.1-5.2,4.4-10.9c4.4-10.9-0.1-5.2-0.7-11.4
            c0.5-5.5,2.8-2.9,1.7-9.1c-0.8-4.6-1-3.9-0.3-8.7l-5.5,0.5c-1.7-2.4-2.7-2.2-3-2.4l-0.2-1.2c0.1-0.1,0.4-0.2,0.5-0.3l3.2-4.3
            c1-1.1,3.5-3.4,4-5.1c1.6-5.6-1-10,4.2-13.5L1010.1,1369z M959.8,1375.9c2.3,1.7,5.5,11.6,5.5,11.6c6.7-2.3,1.7-1.5,10.2-1.5
            c-0.2-4.8,0-2-3.2-5c-4.1-3.8-1.3-12.4-7-15.6l-2.9,5.5C961,1374.4,961.6,1373.2,959.8,1375.9z"
                />
                <path
                  fillRule="evenodd"
                  fill="#A1A1A1"
                  d="M1086.4,1525.1c-4.3,0.1-3.8,0.8-5.6,3.8c-0.2,0-0.5-0.1-0.7-0.2l-1.3-0.2
            c-1.1-0.1-0.1-0.3-1.7,0.1c0,0-2.4,1.1-2.5,1.2c-0.2,4.9-0.5,4.7,0.6,8.5c-2-0.8-2-1-3.5-2.1c-7.5,6.3-5.9-4.4-16.7-4.7
            c0.7-4.2,1.1-3.7-1.8-6.5c-3.6,5.8-3.3,2.3-3.4,7l-0.8-5.6c-7.5-6.3-3.7-1.8-9-1.8c-3.8,0-2.3-2.3-11.2,0.4c-2.1,0.7-3.8-0.3-6,0.1
            c-0.7,1.1,0.1-1-1,1.7c-1,2.8-0.2,3.7-2.1,5.3c-3.8,3.2-2.6-1.4-4.2,5l-2.3-0.9c-2.4-0.5-2.1,0.9-2.6,3.4
            c-3.7,18.6-5.8,6.8-14.3,13.5c-3.2,2.6-2.2,1-7.4,3.6l-1.2,0.6c0,0-2.6,0.3-2.9,0.3c-1.4,6.4,0.1,2.4-3.8,5.3
            c-5.1,3.6-7.8,11.8-7.8,18.3c7.5,2.4,5.4-3.1,10.5,3.4c-1,8.9-2.4-1.5-1.7,11.1c-3.3-1-5.5,1.2-8.4,2.6c-8.9,4-3.2,1.8-7.7,4.4
            c6,3.4,1.2,0.7,2.7,5.1c2.3,0.5,3.3,0.6,5.5-0.4c1.7-0.8,1.1-0.5,2.1-1.4c0.2-0.1,0.3-0.3,0.5-0.5c6.2-5.8,7.4-0.3,8-8.7
            c1.7,0.6,4.3,0.7,6.1,1.2c2.4,0.6,3.5,1.1,5.9,1.8c2.7,0.9,3.9,0.5,7,0.8c4.1,0.3,2.3-0.8,3.9,1.4c3,0,6.1,0.2,8.6-0.3l9.9-1.9
            c4.3-1.4,2.7,0.4,8,1c6.8,0.8,9.3-2.4,12.5-3.2c4.2-1,2.3,0,4.9-2.6c2.9-2.9,1-0.9,4.8-2.3c0.4-5.6,0.4-6.8,5.1-8.7
            c6.2-2.3,3.2-3.7,7.7-5.1c1.9,1.2,0.1-0.5,1.4,1.4c3.2,4.6-0.7,3.9,5.5,2.8c3.6-0.6-0.9,0.3,3.1,0.3c4.7,0,3.7-7.1,4.7-10.5
            c-2.9-1.4-2.2,0.2-5.2-2.4c-2.8-2.4-1.2-2.1-5.8-2.2c0.9-4.8-0.1-1.5,5.1-4.6c2-1.2,1.8-2.8,2.5-5.3l-4.6-2.4
            c0.1-0.1,0.4-0.3,0.5-0.4s0.3-0.3,0.4-0.4c0.7-0.9,0.2,0.1,0.3-1.8c0.1-1.5,0.1-2.6-0.5-4.6c1.3-0.5,2.2-0.5,3.6-0.9
            c-0.2-0.3-0.7-1.3-0.8-1.5c-1.9-5.9,0.3,4.7-0.3-1.4c0,0,0.3-1.8,0.5-2.4c-1.7-0.7-3.2-1.9-4.4-2.7c1-0.8,1.8-1.1,3.1-1.8l-0.2-5
            c5.8,0,3.2-0.7,5.3,2.2c2.8-3.4,0.6-2.8,0-7.5L1086.4,1525.1z"
                />
                <path
                  fillRule="evenodd"
                  fill="#A1A1A1"
                  d="M959.6,1653.5c-6.7-2.2-0.6,0.1-7.8-10.6c-6.1,0.8-4.1,0.8-4.3,5.7
            c-5.3,2.6-1.2,3.1-8.1,4.6c-12.2,2.6-4.2,0-9.7,1l-0.7,5.9c2.6,0.9,6.5,4.3,10.2,7.1l5.2,3.1c2.4,0.9,4.1,0.4,6.6-0.2
            c3.1-7.4,2.2-0.3,7.6-2.8c2.3-1.1,2.4-2.9,2.6-5.3c-4.8-0.1-5.5-1.6-6-6.1l3.2-1.6c0.1-0.1,0.5-0.1,0.6-0.4
            C959.1,1653.6,959.4,1653.7,959.6,1653.5z"
                />
              </g>
              <g id="region-viii" className="region pointer-events-[bounding-box]" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleOnClick}>
                <path
                  fillRule="evenodd"
                  fill="#D8D8D8"
                  d="M1060.9,1458.6
            c8.4-0.2,10.4-1.9,11.9-6l-5-4.5c-1.9-1.1-4.8-1.7-7-2c-3.4,3-6.4,6.7-3.8,11.8L1060.9,1458.6z M1044.5,1450.2
            c-0.1,0.8,0,2.3,0,3.1c3.9-3-0.2-1.4,2.9-2.7c3.3,1.7,2.6-0.5,3.1,2.7c-3.1-0.7-0.8-2.3-4.5-0.7c-2.5,1-1.2,1.3-2.3,3.9
            c-2,4.4-3.9,1.9-3.4,6.7c3.6,1.9,4,0.8,6.6-1c2.5-1.7,3.6-1.8,6.7-2.7c0.2-3.9,1.5-13.6-8.4-11.6
            C1045,1448.2,1044.9,1447.9,1044.5,1450.2z M1070.5,1443.9c6.2-0.4,7.3-6.1,8.2-7.9l1.1-2.7
            C1074.4,1434,1069.3,1438.9,1070.5,1443.9z M1073.9,1346.7l-7.2-2.3c-0.7,0.9-1.5-1.9-0.9,2.6c0.3,2.9,2,0.1,2,6.8
            c-3.8-1.8-4.7-7.2-10.4-13.2l-11.6-11.3l-4.3,3.6c0,4.3,2.6,14,3.7,15.6c1.7,2.6,0.7,0.8,3.7,2c-2.2,4.8-0.9-1.5-2.1,2.5
            c2.1,2.5,1.7,0.9,4.8,2.6c-0.2,0.1-0.4,0.3-0.5,0.3l-2,1.1c-0.1-0.2-0.3,0.2-0.5,0.3c-0.5,6.2,1.6,5.1,3.4,8.7
            c2.6-0.7,0.4-0.4,3.8-1c-1,2.7-0.3,1.4-2.2,3.5l1.3,2.9c0.7,1.1,0.7,0.8,1.5,1.5c-3.4,13.9,0.5,7.8,0.9,18.6
            c-3.2,3.2-1.5,3.2-4.4,6.1c3.3,1.3,1.3,0.7,3,3.8c2.6,4.8,2.8,5.8,0.2,10.4c-1.1,2-1.5,3.1-2.3,4.5l1.3,1.9
            c3.3-1.4,4.2-2.2,7.4-1.4l-1.1,4.4c3.2,1.8-0.1-1.5,4.1,0.8c1.5,0.9,1,1.8,3.2,3.8l4.4-1.2c2.2-1.5,5-8.3,3.8-15.5
            c9.5-11.1,7.7-0.2,16,4c1.9,1,4.1-0.3,6.3,8.7c1.8,7.3,3.8,4.4,6.7,8.5c4.3,6.3,6.8,22.1,6.1,24c-0.5,1.4-5.4,1.8-5.1,12.5
            c0.2,7.9,1.1,4.4-5.3,10.1c1.7,11.1-1.7,12.5,2.1,15.9c1,1,2.3,0.9,4,2.7c0.5,0.5,2.4,3.7,2.6,4.3c2.2,5.1-0.8,5.5-2.1,10.2
            c-0.8,2.7-0.2,5.1-1.8,9.5h4.1c3.1-4.4,9.4-10.4,15.4-11.3c-2-23.3-1.2-13.4,3-26.6c0.8-2.6,1.3-6.5,2.6-9.3c21,0,13.3,2,22.5-7.2
            c13.5-13.5-2.5-5.9,1-16.8l-10.1-3.2c-0.8-0.5,0,0-0.9-0.8c-2.4-1.9-3.7-3.2-4-6.7c-0.7-8-1.3-6.7,0.5-15.4c1-4.7,2-3.6,2.9-6.2
            c1.7-4.9,0.9-11.4,0.7-16.2l-3.2-13.5c-2-4.6,1.8-3.4,2-12.9c-0.9,1.4-1.2,2.4-2.1,3.5c-1.9-2.4-1.2-2.6-0.8-5.8
            c-2,0.5-0.9,0.5-2.7-0.5c-1.5-0.9-2-1.1-3.1-1.9V1357c0.6-3.3,5.1-7.8-3.9-10.1c-5,5.2-1.7-1.6-5.7,2l-1.4-3.6
            c-3.4,1.9,0-0.3-2.2,2.9c-3.4-3-7.1-1.5-7.4-0.7l-1.3,5.2l-14.6,11.5c-8.2,2.8-9.4-0.4-12.2-0.6c-2.6-0.2-0.7,1.4-4.2-0.8
            c-3.1-1.9-4.8-8.4-5.5-12.1C1074.8,1348,1076.2,1348.4,1073.9,1346.7z"
                />
                <path
                  fillRule="evenodd"
                  fill="#D8D8D8"
                  d="M1086.4,1332c-1.2-1.2-3.9-3.2-4.7-4.3c-3.4-4.3-2.3-6.3-5.1-11.4
            c-2.2-4-0.2-2.7-4.1-4.4c-5.6-2.4-6.8-3.3-11.6-3.2c-4.9,0.1-8.9,2-11.4,4.9c2,1.8,2.3,2.6,3.5,5.4c1.8,4,0.1,2.7,3.4,5.5
            c-0.9,2.2-0.8,4.6,0.6,6.2c2.5,2.9-3.1-2.7,0.9,0.8l1,0.7c2.7,2.7-0.2,3.4,8.6,10.6c2.6-2.4,2.1-2,5.5-2.2c2.7-0.1,3.6-0.1,5.3,0.1
            C1084.8,1341.2,1084.9,1337.8,1086.4,1332z"
                />
                <path
                  fillRule="evenodd"
                  fill="#D8D8D8"
                  d="M1164.4,1479.5c0-4.1-3-2.7-3-7.5c0-4.4,3-3.3,3-9.1
            c-1.5-1.1-2.3-1.7-3.9-2.4c-4.1,4.6-8.7,8.9-11.6,13.3l-16.6,0.2c-0.8,2.5-1.9,7.8-2.7,10c-1,2.3-3.4,5.3-3.4,8.1l0.8,17.7
            c-5.4,0.5-7.5,2.5-10.4,5.4c-3.5,3.4-3.9,5.9-9.9,5.9c0.8,2.9-0.7,1.2,1.6,3.2c5.2,4.5,12.5-2.4,17.9,6.3c1.9,3-0.5,0.6,3.2,1.9
            c3.2,1.1,0.5-0.9,3.2,2.5c6,7.2,3.3,2.2,9.2,5.5c2-6.7,0.2-6.1-2.7-17.5c-0.6-2.3-4.3-5.3-2.8-11.5c0.4-1.7,1.5-1,0.4-1.3
            c0-13.9-5.8-20.6,3.7-18.3c3.1,0.8,2,1.1,2.7,2.6l0.5,1.3c0.1,0.2,0.2,0.4,0.3,0.6c0.1,0.2,0.4,0.9,0.5,1.2l5.4,12.9
            c1.6,3.4,1,3.1,3.3,5.9c1.2,1.5,2.4,3.3,4.4,3.8c0.3-2.4-0.2-4.3-0.7-6.7c-2.5-13.5,5.2-4.1,11.3-3.6c4.9,0.3,7.6-2.7,7.6-7.5
            l-1.5-7.5c-0.3-1.2,0-2-1.7-2.7c-3.8-1.6-0.7,0.5-3.7-0.6C1162.3,1488.7,1164.4,1479.7,1164.4,1479.5z M1161.1,1526.6
            c-2.6-1.4-0.5-1.9-4.8-3.1c-0.1,0.2-0.2,0.5-0.3,0.6l-1.3,4.8c0,1.6,2.1,6.1,3.4,7.5c4.6,5,4-1.8,9.6,10.6c0.3,0.7,1.2,2.2,2,3
            c0.8,0.9,0.3,0.4,1.4,1.2c0.5,0.4,1,0.5,1.5,0.9c0.3,3.9,0.3,4,1.9,6.3c2.4,0,3.8,0.9,4.7-1.9c1.1-3.6-0.4-2.7-1.6-4.3
            c-3.1-4.5,1.2-2.8-2.4-7.7c-3.2-4.4-4.9-11.3-7.5-16.1L1161.1,1526.6z"
                />
                <path
                  fillRule="evenodd"
                  fill="#D8D8D8"
                  d="M1021.3,1201.1c-0.2,6.6,1.6,10.9,6,12.4c2.6-2.8,0.2-3.8-1-6.1
            C1024.9,1204.7,1026.6,1203.7,1021.3,1201.1z M1144.8,1172.1l-1.1,0.7c0.2,1.1-1.5,1,0.9,3.2c3.2,2.9,1.2-1.2,2.6,3.3l-3.5,0.5
            c1.6,2.5,4.3,2.5,7,3c0.3-7.7-1.2,1.2-2.4-6.1c-0.5-2.7,1.3-0.9-1.2-5.1C1146.1,1171.7,1145.8,1171.8,1144.8,1172.1z
              M1040.1,1216.5c1.4-4.4-0.5-10.8-4.7-12.8c0.2,3.2,0.8,4.8,1.3,7.1C1037.5,1214.5,1036.9,1215.1,1040.1,1216.5z M1055.6,1173.1
            c-1.7-1.1-2.5-2.6-4.1-1.6l0.6,4.1l3.4,1.8L1055.6,1173.1z M1131.3,1234.4c10.8,0.7,16.5-5.5,27-6.8l1.5-4.9c0.2-1,0.6-3.2,2.2-5.6
            l0.7-1c0.1-0.1,0.3-0.3,0.3-0.5c0-0.3,0.2-0.3,0.3-0.5c4.7,0.7,6,3.8,8.6,6.9c2.2,2.6,4.5,4.9,5.9,8.1c5.9-0.9,8.5-0.8,12.8-4.3
            c-5.3-1.9-0.4,0-4.7,1.3c-3.3-2.4-0.7-1-1.6-3.6c-1.9,2.1-2.8,3.3-6.1,2.4c0.7-2.1,1-2.1,2.9-3.9c-1.8-1.2-0.1,0-1.5-0.5
            c-1.1-0.3-0.8-0.2-1.7-0.7c0.3-3,0.1-1.6,1-3.5c1.2-2.6,2.7-5.1,5.1-6.6c-0.2-0.1-0.4-0.2-0.5-0.2l-5.4-2.8c0.1-4.9,1.8-5.6-4.5-6
            c1.2-2.8,0.7-2.5-1.7-4.8l-12.9-10.2c-1.9,1.4-3,1.4-5,2.1c-3.1-3.2-0.3-1.9-5-2.3c-12.4-1.2-8.1-7.3-10.1-11.1
            c-1.9,1.4-1.6,0.1-1,3.7c0.7,3.5,4.4,11.3-1.5,11.3c-3.3,0-1.9-1.7-3.3-3.7c-3,1.9-3.2,0.9-5.6,3.6c-1.2-2-1.5-0.3,0.4-2l-3.1,0.1
            c-2.9-0.8,0.2-0.9-3.3-1.7c1.4,2.2,0.8,0.7,1.9,3.4c-1.1,0.9-2.2,2.1-3.2,3.4l-8.3-0.1c-1.4-1.8-0.6-1.7-4.4,0
            c-9.8,4.4-3.4,0.7-9.2,2.3l-6.6,0.4c-5.7,0.3-10.8-2.6-12.5-2.4c-2,0.2-3.6,0.9-5.5,1.2c-2.8-1.6-0.9-1.5-4.2-2.1
            c-2.6-0.5-2.8,0.3-4.5-1.2l-2.4-2.4c-1-0.7-1-0.3-1.9-2.4c-0.5,1.5-0.7,1.5-0.6,2.6c0,0.1,1,2.8,1.2,3.3l-4.3-3.6
            c-2,0.3-2.5,0.6-4.1,1.5c-8.2,4.3,1.9,1.4-3.1,1.4c-5.5-0.8-0.2-0.3-4.8-2.9c-2.6-1.4-2,1-3.6-3.2c-6,7.9,1.1,6.2-0.4,16.5
            c3.7,1.7,1.8,0.6,3.6,3.6c2.2,3.7,2.3,1.6,2.4,7.1c0.1,0.2,0.3,0.3,0.4,0.4s0.3,0.3,0.4,0.4s0.3,0.3,0.4,0.4c1,1,0.4,3.1,0.2,4.6
            c-0.5,3.6,2.1,8,3,10.3l10.9-0.7c0.8-2.1,4.7-5.2,6.3-6c4.6,1.2,19.4,10.6,20.7,10.6c3.5-1.1,6.9-4,10.3-5.4
            c2.6-0.2,14.8,8,18.4,9.5c-0.2,9,0.2,14.7,5.5,2.1C1127,1230.4,1124.4,1234,1131.3,1234.4z"
                />
                <path
                  fillRule="evenodd"
                  fill="#D8D8D8"
                  d="
            M1235.8,1441.1c0.1-4.4,1.2-2.9,1.5-6.8c-1.7-1.6-1.9-1.8-3.9-2.4c-2.5,1.9-2.4,2.3-4.4,5l1.4,5.5c3.3,1.1,6.8,2.9,9.4,5.7
            c0.8,0.9,1.2,1.2,1.9,1.8c10.4-1.4,5.5-0.8,8.8-3.5C1246.1,1439.9,1243,1445.5,1235.8,1441.1z M1159.9,1232.7
            c1.9,2.3,0,4.2-0.8,8.1c-2.2,10.8-3.7-12.6-3.6,26.8h11.2c0.7,2.2,3.6,7.3,4.9,9.9c1.8,3.5,4.1,6.6,4.6,9.6c1.1,6.4,2,20,1.5,26.6
            c-15.2,7.6-6.6,12.3-6.6,23.4c0,3.3-0.4,3.8,0.5,7.2c6.1,2.7,8.4,1.6,10,9c-9.7,6.5-6.6,21.6-6,34.1c5.3,0,4.3-0.3,7.5,3.1l5.5-0.7
            l0.9,3.7l2.1-1.1c2-0.8-0.7,0,1.5-0.2c1.4,2.2,1.9,3,4.2,1c2.7-2.4,1.9-0.3,3.1-2c0-0.1,0.5-1.7,0.7-2.1c2.6,1.4,0-0.5,2.4,1.4
            l4.7,4.4c1.8-3.2-0.2-4.4,3.3-9.6c2.4,0.2,2,0.5,4.8,0.7l0.7,4.3c4.4,0.7,7.3-2.7,12-3.4c0.9,2.2-1.4,3.9,4.2,4.4
            c-0.9,3.8-2.6,1.5-1.1,4.5c1.7,3.3,0.9-0.5,3.1,2.9c1,1.5,2.6,5.5,5.3,5.7c6.9,0.5,7.1,9,12.2,10.9c-1.7-6.7-0.7-2.2-3.7-6.1
            c-1.3-1.7-1.7-3.9-3.6-5.6c-2.7-2.3-2.5-1.6-4.4-4.9l-7.9-10.5c-1-2.1-1.2-4.4-2.4-6.7c-1.7-3.2-7.6-6.5-11.7-6.7
            c2.4,2.9,2.7,0.5,3.7,5.2c-3.7,0.6-5.3,2.4-9.5,0.5c-4.1-1.9-2-7.5,0.4-10.3c0.1-0.2,1.3-1.4,1.7-1.8c1.7-2-0.2-0.5,1.5-1.8
            c1-0.8,5.4-0.5,8-8.6l-11.6-9.3c-2.2-3.8-3.6-4.7-5.5-5.8l0.7-5c-5.4-4.7-6.4-7-5.3-14.1c-2.9,0.3-2.2,0.8-4.2,0
            c0.4-1.4,0.4-2.6,0.9-4.1c0.9-3,0.3,0.2,1.2-3.2c0.6,0-0.3,0.3-0.8-3.3l5,0.1c-0.9-3.9-0.9,0.7-2.1-4.6c-0.5-2.4,0.1-7-3.2-7.2
            l-5-0.4c2-4.2,4.4-1.3,8.1-3.4c-0.2-5.9-2.1-4.5-4.8-6l-1.9-9.7c-0.7-2.9,1.4-5.1,0.3-8.5c3.8-2.5,5.6-6.8,8.5-10.6
            c1.7-2.3,0.5-1.4,3.3-2.4l-1.6-1.7c-3.1-3.4-2.1-4.4-3.1-6c-6,2.8-8.6-4.1-0.7-5.4c-0.1-0.2-0.3-0.3-0.4-0.4l-2.1-2.6l8.1-2.4
            c0.1-0.2,0.4-0.2,0.6-0.3c-2.1-5.9-0.7-1.4-3.4-3.6c-1.7-1.5-1.4-1.4-0.7-3.8c-2,0-1.7,0.5-3-0.2c-0.1,0-1.2-0.9-1.4-1.1
            c-1.1-1.1-0.8-1-1.2-1.5c-4.5-5.5-6-2.3-10.1-1.5c-1.4,0.3-3.1,0-4.7,0.2c-2.6,0.4-4.1,1.3-7.8,1.4c-3.6-3.6-8.6-12.1-12.6-14.3
            c-1.7,0.7-0.7,0-1.7,0.9L1159.9,1232.7z"
                />
                <path
                  fillRule="evenodd"
                  fill="#D8D8D8"
                  d="M1045.9,1300.2C1045.9,1300.1,1046,1300.3,1045.9,1300.2l3.7-1.4v-4.2
            l-3.1-1.8l-4.2,3.1c1.3,2.9,0.5,1.8,3.3,4C1045.7,1300.1,1045.8,1300.3,1045.9,1300.2z M1104.6,1303.7c1.2,2.7,0.8,2.9-0.5,5.8
            l-1.8-4.4c-0.2,0.2-0.3,0.4-0.4,0.5s-0.3,0.4-0.3,0.5c-0.1,0.1-0.2,0.4-0.2,0.5c-0.2,0.4,1.6,1-2,1.6l1,1c0.1,0.2,0.3,0.3,0.4,0.5
            c1.5,2.1,0,0.7,1,3.2c0.1,0.1,0.2,0.3,0.3,0.5l0.9,3.4c3.9-1,2.2,2,6.5,3.4c2-1.9,1.5-1.6,2.4-4.1c-2.6-2.4-3.9-1.9-3-5.4
            c-3.1,0.8-2.1,1-3.6,0.3c0.3-3.1,1.7-1.2,2.6-4.6C1107.6,1306.2,1108.6,1304.7,1104.6,1303.7z M1116.8,1315.7c0,0.2,0.2,1,0.3,1.3
            c0.2,0.7,0.2,1.4,0.3,2.1c1.9-0.5,2.1,0.5,4.2,0.8c1.2-2,0.5-2.2-0.2-4.3c2.1-1,2.2-0.7,3-2.7c-2.3-1.5-2.7-0.1-3.7,0.5
            c-1.9-2.9-0.1-1.7-5.6-3.4L1116.8,1315.7z M1022.8,1260.8c3.1,1.7,3.2,1.4,6.3-0.7c2.9-1.9-0.7-1,4.8-1.5l0.7-0.3
            c-0.9-2.6,1.6-1.6-2.3-1.9c-3-0.2,0.7,0.6-2.6,0.6C1025.2,1257,1024.9,1255.2,1022.8,1260.8z M1043.7,1273.9
            c-1.5,3.2-2.9,2.5-3.2,4.6c-0.6,5.5,5.8,1.5,7.2-3.1C1048.4,1273.3,1046.5,1274.1,1043.7,1273.9z M1063.8,1283.9
            c1.9-1.8,1.4,0.9,1.5-2.7c0-0.3-0.4-2.3-0.9-3.7c-4.6,0.4-4.1,0.9-5.5,4.8C1061.2,1282.7,1061.9,1282.7,1063.8,1283.9z
              M1057.8,1269.6c-0.2,0.7-1.7,1.8,0.7,2.9c3.6,1.8,2.4-1,2.5-1C1061.4,1269.4,1059.7,1269.2,1057.8,1269.6z M1159.2,1233.1
            c-0.5-1.4,0.3-2.1-0.5-3.8c-6.1-0.3-9.2,2.6-14.3,4.7c-4.6,1.9-9.7,2.3-14.8,1.5c-1.8-0.3-1.7,0.9-2.2,0.9
            c-2.9,4.6-5.2,11.8-7.2,13.8c-0.5-0.6-3.8-5.5-3.9-5.6c-1.1-2,0.3-3.5,0.7-6.3c-6.1-2-11.2-7-17-8.6c-3.7,1.9-6,4.1-10.1,5.6
            c-4.1-1.6-6.9-3.9-10.6-5.9c-3.4-1.9-6.7-3.4-10.2-5.3c-8.3,6.9-3.3,4.8-16.5,7c1.9,2.8,1.9,7.3,4.3,9.9l4.3,3.2
            c3.6,2.8,5.4,7,8.6,9.8c6,5.3,4.8,4.5,11.7,4.5c3.1,0,8.8,2.1,10.9,4c3.3,3.1,6.2,2.8,8.1,5c-1.4,0.9-6.7-2.3-0.9,2.9
            c2.9,2.7,1.3,7.4,5.4,6.3l0.1,4.3c4.1-0.1,7.2-3.4,9,0.8c-0.1,0-0.3,0.2-0.3,0.2c-0.1,0-0.3,0.1-0.3,0.1l-2.2-0.8
            c-0.6,2.6,0.3,3-1.3,5.7c4.4,0.6,1-0.1,3.9,2c0.2,0.1,0.4,0.2,0.5,0.3l6,5.6c2,3.5,4.8,5.7,7.4,8.5c4.6-3.4,7.3-3.6,13.4-5.8
            c2.9,2.5,2.7,1.3,4.4,5.1c-1,1.4-0.2,0.3-1.4,1.4l-2.9,4.6c-1.2,1.9-2.9,2.4-5.1,4c0.9,4,2.1,3.6,2.7,8c-6.5,2.2-3.6,4.3-5.8,5.7
            c-1.5,1-6.3,0.1-10,0.3c1.3,2.8,0.8,1.1,1.3,2c2.8,5.3-2.1,2.6-4.1,2.2c-0.2,0-2.3,0-3.1-0.2v-5.2c-1.6-0.4,1,0.9,1.2-3.4
            c-4.7,1.5-7.1-0.6-10.9,1.4c1.9,4.8,0.3,1.4,3,3.7l2.1,3.8l5.3,0.8c-1.9,5.3-3.1,3.8,0.7,9.9l5.8-1.1l0.5-2.8l3.7,4.1
            c2.2,1.9,2.9,1.4,6.4,1.1c0.7,4.7,0.8,1.9,2.4,4.4l0.5,2c0.2,1.9,0.8,5.3,1.1,7.4c-4.1,6.8-2.6,1.7-2.2,10.1
            c3.6,0.5,2.2-0.4,3.4,2.1c3.4-2.8,8.7-1.2,13.5-1.6c1.5-0.1,1.9-0.4,4.4-0.5c4.3,1,5.9,9.7,7.1,12.9c2.6,6.8,1.2,13.1,6.3,14
            c2-2,0.3-0.2,1.3-2.1c1.7-3.3,2.3-0.9,2.3-5.6l-0.7-22.6c0-5.8,7.9-10.1,5.5-14.2c-1.2-1.9-4.9-2.3-6.8-3.2
            c-4.3-1.8-2.3-7.3-2.7-10.6c-0.8-6.1-4.6-14.9,0.9-20c1.2-1.1,4.7-2.6,6-3.2c0.3-5.7-0.5-7.6-0.6-13.2c-0.2-12.8-2.2-13.3-6.7-23.6
            c-6.4-14.7-15.1-0.2-15.1-10.8c0-20.1-2-20.9,3.8-23.4L1159.2,1233.1z"
                />
              </g>
              <g id="region-ix" className="region pointer-events-[bounding-box]" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleOnClick}>
                <path
                  fillRule="evenodd"
                  fill="#8B8B8B"
                  d="M953.9,1839.3c2.7-7,2.2-8,3-9.8l-3.1-3.2
                c0.7-2.3,1.4-2.2,2.2-5.2c-2.2-1.6-6.6-2.6-10-3.9c-1.4-0.5-0.6-0.1-1.8-0.9c-2.4-1.4-3.1-16.6-4.3-22.4c-6.4,0-18.4,1-23.4-0.8
                c-9.4-3.4-9.1-2.2-21.9-2.2c0,6.1,1.5,15.7-1.7,19.8c-2.9,3.8-2,3.2-2,8.9c0,6.2-1.4,3.9-5.6,3.1c-5-1-11.3,3.9-14.3,6.3
                c-10,7.9-4.6,5.5-14.6,5.4v9.6l23.2,3.5c0.2,2.2,1,8.5,1.4,10.1c1.3,4.7,1.4,1.9,4.7,6.4l-2.3,5c4.3,4.2,2.2-0.1,6.6,5.1
                c2,2.4,3.6,2.1,1.1,7.2c-7.2-0.3-5.8-1.1-10.8,2.9c0.8,3.1,1,5.3,3.7,6.8c2.8,1.5,1.5-0.5,3.8,2.1c1,1.2,0,1.2,2.3,2.8
                c3.2-3.4,1.4-1.3,0.7-5.9c3.1-1.3,3.1-0.5,4.5-3.7c4.6,0.3,6.1,0.3,11.3,1l-1,4.4c-0.2,1.8-0.4,2.7-0.5,5.1
                c5.9,1.7,4.3,1.7,5.8,6.6l6.3,1.4c1.7,5.1-0.1,2.2,3.8,5.6c3.8-0.9,2.2-2.1,5.8-0.8c-0.2-5.3-1.9-3.3-1-8.1l0.5-2.4l-4.2-2.6
                c-1.1-0.2-1.2,1.4-2.3,0l-2.2-3.7c-0.8-2.3,0-3.3,0.3-5.6c-3.4-0.5-5-1.8-6.7-3.9c2-2.1,1.2-1.4,3.9-3.1c2.4-1.5,1.1-0.1,2.7-4
                c16.4-2,10.7-5.3,13.3-17c-2.1-1.2-2.7-0.7-4.4-2.2c-2.4-2,0.2-0.9-3.6-2.2c0.5-3.6,0.6-5.4,2.3-7.9c2.6,1.6,3.4,1.6,6.7,0l6.1-3.1
                c6.7-3.5,6.2,1.8,13.2,2.1C952.1,1841.2,953.6,1840.2,953.9,1839.3z"
                />
                <path
                  fillRule="evenodd"
                  fill="#8B8B8B"
                  d="M776,1900.1c0-2.2,0.5-1,0.6-4h-13.2c-1.8,2.6-6.9,12.5-7,15.7
                c-0.2,7.7,0.3,14-3.9,18.5c-7,7.4-7.7,8.5-14.3,8.5c-6.5,0-16.8-1.6-22.1,0.6c-1.2,1.1-1.4,8.6-1,10.8c0.3,2.1,1.2,2.9,1.8,5.6
                c0.4,1.7,0.6,3.8,1.2,5.5c2.3,7,6.6,5.4,7.1,5.6c0.7,0.2,2.2,2.2,8.5,4.6c6,2.3,10.7,6.1,14.9,1.7c2-2.1,0.2-0.1,1.2-2.1
                c3.4-6.6,2.4-0.3,3.9-7.2c2.1-10,4.3-5.8,2.9-14c3.6-1,4.7-2.9,6.7-5.6c-0.5-3.2-1.2-2.1-0.8-3.6c0.3-1,1.3-0.9,1.3-3
                c0-4.8-3-0.9,0.9-7.2c3.2-5.1,3.3-11.2,4.3-15.9l5.9,1.7c2.9-4.4,1.3,0,6.9-9.7l-5.5-1L776,1900.1z M759,1967.9
                c3.1-2.1,1.4,1.5,2-3.4c0.5,0.2,2.1,1.1,2.2,1.2c4.2,1.4,4-2.2,2.9-5.1c-7.7,1.2-8,3.9-9.5,5.7c-1.4,1.6-0.4,0.5-2.4,1.8l1.6,2.2
                L759,1967.9z"
                />
                <path
                  fillRule="evenodd"
                  fill="#8B8B8B"
                  d="M870.6,1869.8c6-3.1,1-2.3,5.1-3.6l0.9-0.3
                c1-2.4,0.5-2,2.7-3.6c0.1-3.8-0.3-4.3-0.7-7.5c-0.5-5,0.5-5.8-4.1-6.7c-21-4.4-20,4-20-14.3c-16.3,0-15.3-6.5-33.5,0.1
                c-11.6,4.2-11.8,3.6-19.6,10.6c-13,11.8-9.9,6.7-18,11.3c-3.8,2.1-12.6,19.3-15.4,24.1c-7,12.2-2.4,5.8-5,14.7
                c8.3,0,21,1.3,25.8-8.8l0.7-0.9c0.5,0.9-0.1,0,2,0.9c-1.1,3.9-2.2,3.3-2.9,5.6c7.7-4.8,4.1-6.9,7.9-10.3c-4.1,1.3-13.5,2.9-7.4-3.6
                c2.4-2.5,2.7-1.8,4.4-5.5c1.7-3.6,0.1-0.5,2.2-2.9c1.1-1.2,0.8-1,1.8-2.4c2.5-3.5,0.9,0,4.6-5.5c2.2-3.1,13.2-8.1,17.1-9.3
                c0.7,0.8,1,1.2,1.7,1.9c3.3-3.6,2-1.1,6.3-1.9c1.7,4.9,5,4.7,8.7,2.3c1.7,1.8,1.2,1.8,4.2,2.1c0.2,4.9,1.7,3.6,2.2,6.1
                c-7,3.9-5.8-1.9-5.6,12.6c0,4,1.2,3.9,3.2,6.8c0.6,1,1.2,1.9,1.6,3.5c0.8,3.4-0.3,3.6-0.6,3.9c-3.6-1.1-1.1-0.5-3.3-3.3l-1,3.2
                c-0.8,2.6-0.8,1-1,4.9c6.7-2.5,4.7,3.6,4.1,6.1c0,0.1-0.1,0.4-0.1,0.5c-0.1,0.1-0.2,0.3-0.2,0.5c-3.8,9.1,0,5-3.8,10.1
                c0.1,0.1,1.7,1.9,2,2.2c1.7,2.4-0.2,3.9,2.1,7.2c3.3-0.2,2.2-2.2,7.1-3.6c7-2.1,2.3,0.6,6.6-4.3c2.5,0.4,2.2,0.5,4.3,1.4
                c-0.5-2.1-0.3-0.8-1.7-2.2c-1.6-1.5-1.1,0.2-1.5-2.6c2.3-0.9,4.6,0.2,6.5,0.9c-1-2.7-0.7-1.5-2.5-3.4c-3.1-3.2-0.6-5.1-7.9-6.3
                c-1.3,3.2-0.7,6.6-1.2,8.9c-3.6-0.5-3-0.6-4-4.4c-0.9-3.7-0.6-2.8-3.6-4.9l1.5-0.9c1.5-0.7,0,0.2,1.7-0.8c5.8-3.6,0.9-5.5,0.3-6.6
                c3.6-2.4,2.2,0.2,4.5-4.5c0.6-1.3,0.5-1,1.1-1.8c6.8,0.4,3.2,2.5,6.3,6.7c2.7,3.7,3.6,0.2,6.4,4.3c1.8-2.1,0.1-0.9,3-2.3
                c-1.2-1.9-1.8-1.8-1-4.5c0.1-0.5,0.7-1.7,1-2.3c0.1-0.2,0.2-0.4,0.3-0.6s0.2-0.3,0.3-0.5c2.2-3.4,3.2-7.2,1.5-11.3l3.7-1.8
                C871.9,1871.3,871.7,1871.5,870.6,1869.8z"
                />
                <path
                  fillRule="evenodd"
                  fill="#8B8B8B"
                  d="M761,1832.2c-4.1,9.1-6.9,5.5-10.1,10.1
                c-1.5,2.2-2.1,4.9-3.3,6.8l-2,3c-1.1,1.2,0.4,0-1.1,0.9l0.7,2.7c-0.2,0.1-0.4,0.2-0.5,0.2c-0.9,0.3-2.2-0.7-2.9,3.2
                c3.9,1.4,2.2,0.2,3.8,3.7c3.2,7.5,2,11.1-1.7,15.5l1.2,0.6c0.1,0.1,0.4,0.2,0.5,0.2l2.3,0.4c0.7,5.1-0.8,1.7-4.3,6.8
                c-2.5,3.6-1.9,1.4-5,3.2l1.9,2.2c-5.8,9.1-1.7,6-5,15.9c-1.1,3.4-0.3,1.5-2.2,4.2c2.7,6.9-0.5,2.1,4.4,6.7
                c-1.3,3.6-2.3,2.2-5.8,3.6c-3.1,1.2-0.6,0.3-3,2.2c-3.3,2.6-10.5,7.2-11.4,12.8l22.4,0.2c3.7,0,3.9-1.2,6.7-3.7
                c5.1-4.4,8.3-6.7,8.4-16.7c0-9.9-0.9-6.9,2.8-13.9c10.5-20.2-1.1-7.9,9.2-24.4c2.3-3.6,4-7.2,6-10.6c13.4-23.9,11.3-9.6,21.9-20.1
                c9.4-9.2,14.5-10.6,26.1-15.9c10.9-4.9,18.6-1.7,27.7-0.4c3.1,0.4,11.9,2.2,13.8,1.7c1.8-0.5,8-6.4,9.2-7.5c7.9-6.7,13.5-4.3,17-4
                c0.7-3.2,0-6,0.7-8.5c0.6-2.2,2.8-3.6,3.3-5.7c0.7-2.4,0.2-14.5,0.3-18.1c4.3,0,8.5,0,12.8,0c6.1,0,6,0,10.6,1.9
                c6.1,2.4,16,1.2,23.6,1.2c0.5-6,0.7-52.4-0.1-55.5c-6.3-0.5-5-1-7.8-4.8c1.6-1.5,2-3.2,2.1-6.5l-3.2,2.2c-8.7-2.8,2.1-2.5-11.3-5.6
                l-0.8-0.4c-1,5.1-0.6,1.7,2.8,6.5l1.8,2.5c0-0.2,0.2,0.4,0.3,0.6c-3.5,8.5-3.2,3-8.6,2.8c-1.4,1.5-1,0.7-1.7,3.2
                c-3.3,12.5-5.4,15.2-16.7,12.5c-9-2.2-8.5-0.3-15.4,0.3c-11.6,1.1-5.2,0.8-12.4,5.3c-0.3,3.9,0.2,4.1-1.9,6.7
                c-1.7,2-2.9,2.2-4.1,4.3c-0.7,2.8,4.5,8.8-1.5,11.6c-4.2,2-1-0.8-3.8,2.3c1.5,1.9,0.1,1.4,1.8,3.8c1.9,2.6,8.3,3.3,5.4,8.5
                c-1.6,2.9-1.5,1.7-6.1,5.7c-6.8,5.9-8,3.2-11.5,4.1c-1.4,0.3-1.7,1.4-3.1,2.1c-2.1,1-6.5,1.2-9.2,1.6c-14.4,2.2-12.7-2.9-15.1-6.4
                c-0.8,3.4-4,3.6-4.8,8.2c-8.1,0-1.5,1.9-7.6,3.3c-2.2,0.5-3.3-0.3-7.3,1.1c-5.5,1.9-5.9,0-7.4-0.1c-1.8-0.1-4.1,1.8-7,2.6
                c-9.6,2.7-19.8,5.8-26.2,13.7L761,1832.2z"
                />
              </g>

              <g id="region-x" className="region pointer-events-[bounding-box]" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleOnClick}>
                <path
                  fillRule="evenodd"
                  fill="#C2C2C2"
                  d="M1088.7,1658.8c0,3.2,2.8,5.6,5,7.3c2,1.6-0.1,0.5,2.2,2
                c4.6,3,6.4,0.9,11.3,5.2c3.1-1.6,0.5-0.6,5.4-4.4c-1.4-4.3-1.5-0.3-1.9-4.3c-0.7-7.3-2.3-8.5-7.2-13.3
                C1099,1646.6,1088.7,1648.7,1088.7,1658.8z"
                />
                <path
                  fillRule="evenodd"
                  fill="#C2C2C2"
                  d="M1120.2,1741.6l52.4-0.3c0.4-7-0.7-12.8-0.7-20.5
                c0-14.2-1.7-13.8,1.4-18.4l-2.3-3.1c-0.9-1.4,0.2,0.1-1-1.5c-3.1-4.3,0.8-2.1,0.1-7.6l-2.5-12.5c-0.3-1.4-0.3-2.2-0.7-3.4
                c-1.2-3.1-0.3-0.9-1.5-2.1c-3.1,5.2,0.1,2.5-1.5,7.8c-1.4,4.8-1.6,3.7-0.2,8.9c2.2,8.6-2.2,14.1-1.8,16l-1.2,0.4
                c-7,2.2-3.9,3.3-11.8,3.3c-2-8.4-1.4-3.4-5-8.2c-4.8-6.3,4.2-0.1-6.7-6.7c-3.1-1.9-4.8-4.1-8-5.4c-3.3-1.4-6.5-2.6-7.7-5.7
                c-1.4,1.5-4.2,1.2-8,1.2c-1.6,0.4-1.2,1.5-2.9,3.2c-6.2,6.5,1.4,6.5-0.5,21.9c-1,8.4-5.1,1.8-1.3,14.1c-2.7,2-5.3-1.5-5.2,9.4
                l2.8,1.9l0.9,6.7c-2.2,2-2.7,1.7-3.2,5.7c-0.4,3.6,1,1.4,1,7c-3,1.6-3.6,1.5-6.3,3.6c-4.4-1.6-6.2-0.3-7.5-5.9
                c-8.3-0.7-7.8,0.2-11.2-2.2l-2.8-1.3c-2.8-1.5-2.7-4.5-11.1-6.5c0-0.3,0.3-2.2,0.3-2.2c-0.2-2,0-0.8-0.7-2c-5.8,0.1-2.9,0-6.2,2
                c-4.4,2.9-0.2-1.9-8.4,5c-5.5,4.6-5.6,1.9-6.7,6.4c-2.7,11.2-3.1,3-3.1,17.3c-2.9,2.4-5.8,8.7-4.9,10.7c1.1,2.2,0.9,1.4,4.1,1.5
                c6.5,0.2,13.6-0.1,20.2-0.1c2.6-0.3,1.7-1.2,4.2-2.2c2.2,1.2,1,0.9,2.6,1.9c1.7,1.2,0.3,0.3,2.3,1.2c7.4,3.3,4.1,6.7,10.2,10
                c0.5-0.7,0.5-0.5,1.1-1.8l3.1-10.2c0.7-4.3,1.9-9.3,2.2-13.8l26.6-0.1c0.5-3.1,0-6,0.7-8.4c0.9-3.1,2.1-2.6,2.6-6.8
                C1118.3,1751.6,1118.8,1746.6,1120.2,1741.6z"
                />
                <path
                  fillRule="evenodd"
                  fill="#C2C2C2"
                  d="M946.4,1730.4c0.8,0.3,3.4,0.1,1.1,3.7l-2.1,2.9
                c-0.2,0.1-0.3,0.3-0.5,0.4s-0.4,0.2-0.5,0.3l-2.5,0.7c-1.2,11.2-0.2,27.6-0.2,39.4c0,19.6,0.2,17.9,2.6,36.9
                c2.8,1.5,8.3,3.4,11.8,4c3-2.2,3.7-3.6,8.2-3.3c3.6,0.2,3.3-1.3,7.3-2c-1.1-3.4,3.5-5.4,5-6.8c1.1-1,2.2-2.7,3.3-3.6
                c1.6-1.4,2.6-1.2,3.8-2.7c2.2-3.1-2.1-13.9-2.1-20.8c3.5-3.1,1-1.5,0.2-5.3c-0.3-1.4,0-2.6-0.2-3.9c-1-8.5-3.4-9.4-3.9-10.5
                c-0.8-2,1.5-4.8-5.1-7c2.6-10.9-8-4.6-3.8-13.5c-5.4-0.7-2.2,0.1-6.3-2.9c-0.2-0.1-0.3-0.3-0.5-0.4c-2.6-1.7-2.8-1.1-5.7-1.2
                C944.2,1734,955.2,1729.9,946.4,1730.4z"
                />
                <path
                  fillRule="evenodd"
                  fill="#C2C2C2"
                  d="M1200,1873.3c-3.9,1.5-0.9,2-7,1.2c-3-0.4-6.1-0.2-9.2-0.2l-2.1-2.3
                l-6.4,1.9l-0.3,7.2c-2.9,0-3.8,0.1-5.8,1.6l-1.5,1c-1.1,0.7-1.3,0.8-2.3,1.9c-1.8,2-1.6,2.4-2.3,5.3l-0.8,4.2
                c0,0.2-0.1,0.5-0.2,0.7c-0.7,2.6-2.6,3.1-5,4.2c-2.6,1.2-4.5,0.7-7.6,0.7c-1.3,4.9-1.2,3.8-4.2,6.8l-6.8-0.1l-0.9-0.6
                c-3.9-0.6-4.3-1.5-6.4-3.8c-12.2,3.9-11.6-5.5-12.7-7.6l-5.5-0.3c1-3.3,0.4-3.2,3.4-5.2c0-6.4-0.2-9.2-4-12.7
                c-8.6-7.7-2.4-3.9-6.8-9.1c-2.7-3.2-1.4-1.9-1.5-4.8c-0.2-4-8-8.4-9.5-15.3c-6.3-1.6-4-0.8-6.5-7.7c-0.1-0.2-0.2-0.4-0.2-0.6
                c-3-6.8-7.5-7.7-9.7-20.6c-0.9-4.8-3.1-7.2-3.8-11.7c2.5-0.7,4.3-1.2,6-2.2c1.8-7.9-0.9-4.5,2.5-16.9c0.5-2.1,1.9-4,2.5-6.5
                c0.7-3.1,0.9-5.7,1.5-9.1l0.6-4c1.1-4.1-0.2-0.3,1.7-2.2h25.3l0.6-8.7l0.8-1.7l0.9-1.7l0.8-1.7l0.9-1.9l0.5-2.2l0.4-0.1l0.4-1.6
                l1.6-3.6h51.2c0,4.5-1.2,18.6,0.5,20.3c0.3,0.2,4.1,16.1,10.9,20.2l1.2,0.9c-0.4,4.8,1.4,5.3,4.6,6.5c-1.1,4.4-2.4,5.1-0.2,9.6
                c1.8,3.7,1.2,5.2,1,10.8l3.1,4.1c-1.6,3.5-2,7-0.3,11.3c2.7,6.7,0.5,5.1,4.7,9.4c0,5.1-0.7,11.1,1,15.3
                C1202.7,1861.5,1197.7,1863.3,1200,1873.3z"
                />
                <path
                  fillRule="evenodd"
                  fill="#C2C2C2"
                  d="M1058,1798.5c7.8-0.2,11,6.1,14.5,6.9c4.1-0.2,6.7-1.4,7.2-5.2
                c0.5-4.5,0.2-6.5-2-9.2l-5.3-7.2l-7.3-4.4c-2.2,2.1-2,1.9-5.8,1.9l-21,0.1c-1.2,2.9,0.8-1.5-0.2,2.1l-4.2,8.3
                c-2.1,2.4-8.2,4.5-11.8,4.7c-19.4,1-5.4-4.6-24.6,2.4c-1.1,0.4-4.2,2.7-5,3.5c-2.1,2.3-0.6,2.7-4.1,4.2
                c-15.2,6.1-7.4,2.9-19.3,14.3c-2.4,2.4-7.4,4-10.4,6c-0.5,6.1-0.4,12.1-4.7,15l-0.9,4.4c0.9,0.2,5.1,1,5.5,1.2
                c1.5,0.5,0.8,0.5,1.8,1.4c1.6,1.4-0.2,0.3,1.8,1.4c3.9,2.1,4.4,3.4,4.4,8.5c4.5-0.4,4.3,0,4.7,4.2c3.2-0.9,3.5,0.2,5.2-1.2
                c1.5-1.3,2.3-3.5,2.6-4.8c3.7,0.1,5.6,0.9,8.7,2.1l11.4,3.8l2.9-9.8c1-1.7,2.7-3,3.6-4.9c2.8-6.1-2.2-7.1-1.2-12.1
                c7.2,0,13.2,2.2,15.6-6.1c1.1-3.6-0.2-3.8-1-7.3c0.1-0.1,1.5-1.2,1.6-1.2c6.6-7.6,11.1-3.9,15-6l4.3-4.7c0-4.3,0-8.5,0-12.8
                c-0.1-7.5-0.3-6.1,7-6.1C1049.9,1795.6,1052,1797.6,1058,1798.5z M994.9,1847.8c0.8-2,0.4-1.4,2.2-2.1
                C996.5,1849.5,997.7,1847.2,994.9,1847.8z M1019.6,1818.1c-0.4,3.2-2.1,3.9-4.9,3.3l0.5-3.1L1019.6,1818.1z"
                />
              </g>
              <g id="region-xi" className="region pointer-events-[bounding-box]" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleOnClick}>
                <path
                  fillRule="evenodd"
                  fill="#A2A2A2"
                  d="
                M1217.7,2036.6c0.1-3.2,0.2-2.2,0.7-4.4c0.8-3.7,0.6-1.6-0.3-2.2c-3.4-2.2,0.2-1.7-2.9-4.9l-5.2,1.2c-1.4-2.2-0.9-3.3-2.4-4.8
                l-8-7.2c-1.3-1.1-0.7-0.8-1.7-1.6c-1.3-1-0.1-0.6-1.8-1c1.9,2.4,3.3,3.1,3.7,6.3c-6.3,0.4-2.8-2.3-8.6-2.8
                c-1.2-3.9,0.2-11.6-2.6-17.2c3.3-4.1,3.3-5.8,1.7-11.3c3.4-0.8,3-0.9,4.5-3.8s10-11.2,10.2-12.5c-0.7-4.4-1.5-6,1.6-10.1
                c2-2.6,4.8-5.3,7.6-7.3c2.6,0.8,1.6,0.1,3.2,2c1.4-1.9,1.2-1,3.3-2.3c2.2-1.3,6.5-7,7.5-9.3c2.6-6.3-3.5-7.9-0.7-17.3
                c-3.5,1.7-1.7,4.1-12,2.6l0.2-28.2c-4.1-1.2-4.1-2.4-5-6.9c-1.2-5.9-2.3-5-2.7-8.4c-3.1-0.9-19.5-0.3-24-0.4
                c-7-0.1-7.3-1.7-7.6,4.3c-0.2,2.9-1.4,5.4-2.2,14.3c-0.3,3.8-0.7,2-1.3,5.1c-0.9,4.8,1.2,5.2,1.4,10c0.3,7.5,0.7,13,0.7,20.8
                c12,9.2,3.7,6.3,6.8,13.2c1.3,2.9,1.7,2.9,2.1,6.5c-9.4,0.3-4,5-9.6,11.1l-11,9.1c-1.1,5.3-0.3,3.1-2.2,7l-5.5,1.1
                c2.8,10.8-0.5,5.5,3.6,10.9c-1.3,3.6-1.4-1.1-1.6,4.2c-0.1,3.6,0,2,1.4,3.9l4.4,6.5c3,7.4,1.7,10.2,1.7,18.3c4.4,0.3,3.5,2,6.5,3.7
                c6.8,3.8,11.3-9.1,15.8-11.9c2.1,1.8,4,3.8,5,6.1c2.9,6.3,2.2,2.2,5.1,5.9c4.1,5.2,0.6,11.2,0.6,17.8l4.8,4.4
                c2.3,2.6,1.6,3.3,3.4,5.9c3.5,5.1,2.3,7.1,2.3,14.8c1.9,4.7,4.3,2.7,3.8,10.1c-0.2,3.3-2,6.9-2.9,10c-2.6,9.7-3.9,9.2-3.9,21.8
                c-1.6,3.5-1-0.4-2.6,4.8c-2.7,9.4-8,11.2-9.4,19.5c-0.8,4.8-3.7,5.5-9.7,10.1c1.4,3.2-0.2,2.1,3.4,3.1c1.7,0.5,2.7,0.8,4.3,0.3
                l15.1-22.4c3.7-7.5,6.8-8.5,8.4-10.9c1.1-1.7,1.2-2.2,2.3-3.6c4.3-5.1,13.2-15.4,14.9-22c1.7-6.4,1-6.7,1.2-9.8
                c0.1-2.1,1.2-3.6,1.5-5c0.9-3.5-0.3,0.9-0.8-3.5c-0.2-2.1,1.3-9.9-1.9-15.8c-1.5-2.8,0.4,0.5-1.6-1.9c-4.9-5.8-1.6-6.7-6.1-15.5
                c-1.1-2.1-0.9-1.3-2-4.1C1221.2,2039.4,1219.8,2039.5,1217.7,2036.6z M1186.6,2182.4c5.3,3.5,2.5-0.1,6.3,0.5
                c1.4,0.2,0,0.7,3.7,1.2c0.2-7.7,1.5-8.4-5.9-8.3c-4.5,1.8-2.3,3.6-6.5,5.3C1185.1,2181.6,1185.8,2181.9,1186.6,2182.4z
                  M1205.8,2173.2c0.7-3.9,0.5-3.8-2-6.2c-1.4,2-0.4,0.8-1.2,2.5c-0.1,0.2-0.4,0.7-0.5,0.9l0.5,10.4
                C1204.9,2178.6,1205.1,2176.9,1205.8,2173.2z"
                />
                <path
                  fillRule="evenodd"
                  fill="#A2A2A2"
                  d="M1261.8,1886.7c-0.9,0.9-4.1-0.3-4.6,2.9
                c-1.8,9.2-4.6,7.6-5.1,9.8c0.9,5.6,1.9,2.3,0.7,9.8c1.7,1.5,3.1,1.7,2.2,4.3c-2,6-2.9,11.7,1,16.5c1.9,2.3,1.5,2.9,2.7,5.6
                c2.2,4.5,0.9,1.1,0.8,5.5c-0.2,5.6,4.5,5,7,8.6l1-1c3-3,7.2-4.9,11-6.8l15.2-8.3c3.6-1.8,19.9-9.5,21-11.9
                c0.1-0.2-0.2-26.5-0.8-26.8c-0.3-0.1-0.8-4.3-4.7-18.7l-10.1-34.5c-3.7-11.8-3.4-8.9-0.5-16.1c-4.1,2.7-8.4,5.8-12.6,8.2
                c-2.9-2.1-6.8-3.4-8.7-6.1c-1.3-1.9,0-1.2-2-2.1l-44.9,0.3c0.7,1.8,0.8,3.4,1.2,5.8c0.2,1.5,0.2,2.4,0.4,3.8
                c0.4,3.1,1.4,14,2.6,15.7c2.5,1.8,2.6,1.1,4,3.6c3,5.6-0.2,0.7,3.6,3.9c1.9,1.5,2.9,4.7,3,7.2l-0.5,2.8c3.9,0.5,3.1-1.8,5-5.1
                c2.3-4.2,9.3-15.2,13.9-16.2c5,4.9,4.6,12.1-0.2,16.2c1.2,5.9,4.2,4.7,3.1,10.7C1265.1,1883,1269,1886.3,1261.8,1886.7z"
                />
                <path
                  fillRule="evenodd"
                  fill="#A2A2A2"
                  d="
                M1246.2,1968.8c-0.3-2.9-0.4-4.3-0.7-7.5c-0.3-4.3-1.4-2.7-1.3-5.5c0.3-4.7,2.2-8.5,2.7-12.1c-1.7-2.9-3.2-5-5.5-6.1
                c-2.9-1.5-1.1,0.1-3.8-2.3c-6.4-5.7-2.2,2.3-8.6,10.9c0.7,1.5,1.2,3,2.1,4.6c2.7-0.8,0.7-0.8,4.1-1.4c2.7,5.9,2.4,8.1,2.3,14.6
                c0,0.3,1.6,4.9,1.6,4.9c1,1.8,0.4-1.8,2.2,5.1C1244.2,1972.9,1242.6,1974.7,1246.2,1968.8z M1236.3,1967.7c-1.4-3-2.6-3.3-5.4-1.8
                c0,0.2-0.3,0.5-0.3,0.6l-0.2,1.7c1,5,3.3,4.8,3.8,5C1234.3,1973.3,1238.9,1972.9,1236.3,1967.7z M1260.7,1885.4l2.3-0.8
                c0.3-4,2.2-10.5,2.2-11.8c0-1.7-3.2-4.6-4.3-8.4c3.4-3.3,5.6-6.9,3.6-11.8c-0.7-1.9-0.9-1.9-2.2-3.1c-4.8,5.5-4.9,6.6-8.7,12.1
                c-3.4,4.8-3.9,9.5-10.4,9.5c-0.2-2.4,0.7-3.2,0.3-5.2c0-0.3-0.3-0.9-0.4-1.1c-0.9-2.2-1.2-3.1-3.1-4.4c-2.6-1.9-1.8-2.5-3.7-4.8
                c-3.9-4.9-2.7,1-4.7-11.1l-1-6.9c-0.5-2.9-0.3-10.8-3.3-11.5l-31.6,1.8c0.4,1.4,0.5,3.9,1.2,5.2c0,0.1,2.3,2.8,2.6,3.1
                c0,5-0.7,11.1,1,15.1c2.5,6.1,2.4,6.1,2.4,13l-2.3,4c0,0.1,0,0.3,0,0.5c0,2.2,0.8,2.5,0.2,5l-0.9,1.9c0-0.1-0.2,0.4-0.3,0.6
                c-4.8,1.7-6.5,0.3-12.4,0.2c-6.9-0.1-0.9-1.4-10.8-0.8v8.2l32.3,0.4l0.9,2.6c4.4,10,0.9,11.3,8.7,13.6c-0.6,5-1.2,1.3-1.5,6.1
                l0.2,21.4c5.1,0.6,6.5-1,9.7-2.9c1.1-0.6,3.3-1.4,4.4-2.2c1-0.7,1.2-1.1,1.9-1.6c3.1-2.2,6.7-6.1,9.6-7.2c4.7-1.7,4.8-2.9,8.7-4.5
                c0-2.6,0.9-4.3,0.4-5.7c-0.2-0.6-2.7-1.5-0.5-6.1c2.6-5.2,4.2-2.3,3.8-10.2L1260.7,1885.4z"
                />
                <path
                  fillRule="evenodd"
                  fill="#A2A2A2"
                  d="M1316.3,1895.2c0-0.1-0.8-2.7-1-3.1c0.3-1.4-0.7-2.4-1.5-6.1
                c-2.9-13.6-7.6-26-11.3-39.3c-3.5-12.8-6.5-13.9-1.9-19.4c4.7-5.6,15-3.2,22-3.2c0.2,3.1-0.2,7.2,0.2,9.8c0.7,4.4,2,5,4.4,6.7
                c-2.9,6.8,0.5,3.8,5,6.8l0.9,0.7c3.1,2,2-0.1,4.6,3.8c4.4,6.7,4.4,5.8,10.6,6.9c2.2,0.4,1.4,1,4.3,1.9c-3.2,3.1-2.1,8.4-2.1,13
                l2.8,2c-2.4,1.9-1.4,0.2-2,4.2c3.9,4.4,3.7,3.7,5.6,10.7c1.8,6.7-0.9,7-6.3,8.4l-0.9,4.8c1.7,1.3,1.5,1.3,3.6,2.2
                c-1.7,1.5-1.9,1.5-2.4,3.8c-0.5,3.1,0.3,1.8,1.7,4.5c-1.7,1.2-3.4,2.6-1,5.1c1.5,1.7,3.4,0.6,5.8,0.8c-1.2,2-0.8,1.7-1.7,3.7
                c-1.9,3.9-0.9,0.5-2.6,3.4c-2.4,4,1.3,2.1-5.2,3.9c-0.1,4.1-0.9,3.9-1.6,7.3c-0.9,5-5.1,4.3-7,8.3l-0.9,3.3
                c-0.1,0.2-0.2,0.4-0.3,0.7c-1.2,2.8-1.2,0.3-2.1,4.3c-0.5,2.3,0.2,2.9,0.9,4.7c-6.7-0.7-2.2,0.2-7.7,0.7c-3.1,0.2-5.2-0.8-9.1-0.8
                c-2,2.8-3.2,4.6-3.2,9.4l-3.8,0.5c1,3.7,1,4.1,3.6,5.6c5.8,3.6,5.3,5.6,5.5,12.3c-6.7-0.4-9.4-1.7-6.1-7.9c-1-2-1.6-1.9-2.8-4.3
                c-1.5-3.2-0.7-4.5-3.4-5.6c-3.1-1.3-5.1-3.5-8.6-2.8c-1,2.2-0.6,3.5-1.5,5.3c-2.3,4.3-0.4,0-3.8,1.5c0.8,1.6,1.8,2.7,3.1,5
                c2.9,5.3,7.5,11,11.1,15.6c-2.2,2.6-5.3,16.4-5,20.8c0.3,5.4,1.7,6.6-0.9,11.7c-1.4,2.7,0.5,8.1,0.7,11.8c-5,4.3-2.4,7-3.8,12
                c-3.2-2.3-3.2-3.8-7.2-5.5c0.8-1.6,1.3-3.6,1.9-5.4c-12.9-13.3-7.2-16.6-8.4-23.6c-0.4-2.6-2.3-5.1-2.8-8.8l2.9-3
                c-0.5-3.4-0.2-4.9,0.8-7.9c-4.2-6.5-0.3-7.9-2.9-16.9c-2.7-1.2-5.8-1.5-7.7-2.9c-8.8-6.7-5-9.5-4.7-16.9c0.2-3.8-2.4-4.7-4.6-7.1
                c4.6-8.5,1-2.6,10.2-8.4l38.3-20.4C1316.7,1903.6,1316.5,1894.9,1316.3,1895.2z"
                />
              </g>
              <g id="region-xii" className="region pointer-events-[bounding-box]" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleOnClick}>
                <path
                  fillRule="evenodd"
                  fill="#737373"
                  d="M1165.2,2055.1l0.5,0.5l1,0.3l0.6,0.7l0.8,0.9l0.9,0.8l3.8,1.2l0.8,1.4
                c1.5,1.1,0.3,0.2,1.6,1.2c0.9,0.8,0.4,0.4,1.2,1.1c-0.5,11.8-4-3.7-3.8,20.3c2.4,1.7,3.5,1.4,3.6,4.8c0.1,2.9-0.2,2.8,1,6.8
                c2.7,8.5-3.8,6.5-1.7,13.9c-3.4-0.3-2.3-0.8-4.4,1.2c-1.7,1.7-0.8,1.1-3.1,2.7c0.5,6-0.5,3.7-1.8,8.1c-3.1-0.2-4.3-1.5-4.3,1.8
                c0,2.5,1.8,4,3.9,5.5l2.7,2.2c1,1.6,1,3.2,1.9,4.9c5.5,3.3,5.3-0.4,8.4,7.5c3.1,8,0.8,3.3-0.3,11l3.3,2.5c1.3-1.6,0.6,0.4,0.3-1.6
                c0-0.2-0.5-1.5-0.5-1.7c15.4-9.4,5.1-4.3,17-23c1.2-1.9,1.7-2.5,2.4-4.5c2.7-8,3.1-5.5,3.1-10.2c0-2-0.2-4.7,0-6.7l6.6-20.3
                c1-6.4-1.7-6.1-3.6-10c-0.1-0.5,2.4-12.5-6.2-21.3c-1.5-1.6-2.9-2.4-4.3-3.8c-1.7-4.2,4-9.9-0.1-16.7c-1.6-2.7-0.4-0.9-2.6-2.5
                c-5.3-3.8-0.2-5.2-6.6-8.7c-0.7,0.6-0.7,0.5-1.5,1.3c-2.4,2.5-3.1,6.3-6.6,8.4c-7.2,4.2-9.6-0.3-11.5-1.6
                c-8-5.7-15.9,10.7-17.4,15.8C1155.5,2051.6,1160.2,2053.6,1165.2,2055.1z M1069.9,2075.1l-1.3-0.9l-1.7-0.8l-2.1-0.4l-1.7-0.9
                l-2.4-0.9l-1.2-1l-2.2,0.3c-1.9,6.7-4.5,4.9-4.5,12c3.5,2.4,4.6,1,8,3.7c3.5,2.7,2.9,2.3,7.2,4.5c2.7,1.4,4.4,3.6,8,4.1
                c5.6,0.7,4.9-0.9,7.7,3.8c7.8,0,4.3,0,8.4,3.2l7.3,3.6c3.8,2,4.7,1,15,6.7c3,1.6,5.6,1.2,9.2,2.7c5.5,2.3,16.7,3.5,22.9,2
                c5.6-1.4,3.6-0.2,2.2-5.6c3.3-2.2,2.7-3.4,2.7-7.3c-3.5-0.1-2.4,0.1-5.4-0.9l-1.1-9.4l-3.8,4.3c-50.2,1-29.3-2.8-47.3-7.8l-0.1-7.6
                c-1.5,0.5-2.2,0.2-3.6,0.5c-2.9,0.5-5.3,2.9-9.7-0.6c-1.7-1.4-2.6-3.5-4.4-4.8C1074.5,2076.2,1072.3,2075.8,1069.9,2075.1z"
                />
                <path
                  fillRule="evenodd"
                  fill="#737373"
                  d="M1130.1,1906.2
                c-1,0-2.6-0.2-4.6-0.5l-3.6-1.3c-5.5-2-2.9-3.2-4.2-6.7c-1.2-3.4-2.7-0.5-6.5-0.2c0-9.1,9-10.1-0.8-20.2c-4.3-4.4-3.2-2-8.1-3.5
                c-2.8-0.9-1.7-1-4.6-1.7c-5.3,0-4.6,8.5-16.3-0.9c-10-8-17,2.2-17.3,2.9l-0.9,14.2c2.6,3.1,2.2,2.8,4,6.2c0.9,1.7,4.6,5.3,2,8.1
                c-2.4,2.5-1.7,3.3-3.7,7c-1.7,3-2.9,5.3-3,9.6c-1,3.9-2.6-2.7-7.8,8.2c-1.5,3-3.9,6.1-5,8.9c2.9,2.3,3.7,0.2,5.6-1.5
                c1.5-1.4,1.6-1,2.4-2.4c0.3-0.5,0.3-0.9,0.7-1.9c1.4-3.2,11.9-3,14.5-3c-1.2,6.5-7,13.8-9.7,19.5c2.4,4.4,4.7,10.5,12.6,8.3
                c3.1,4.1,1.3-0.2,7,8.9c10,0.3,6.5,1.6,13.3,3.1c0.2-4,1.5-4.1,3.7-6.1c-1.1-2.4-0.1-2.3-1.6-4.8c-1.2-2.2-2.9-2.6-3-3.1
                c-0.1-0.3-0.3-0.3-0.5-0.4c1.1-2.6,0.3-2.1,2.7-3.6c0.3-0.2,1.9-0.9,2.2-1c1.7-0.6,0.4-0.3,2.4-0.5c-0.2-6.3-11.1-8.7-3.6-14.2
                c3,0.6,6.9,5.6,10.4,8.8c2.4,2.2,2.6,3.4,4.3,5c2.5,2.4,3.2,0.5,3.2,5c-1.4,1.2-1,1.1-3.6,1.4c-0.5,8.7,0.9,4.4,1.4,9.1v27.6
                c8.5,2.6,6.6-0.4,11.7,0.3c12.2,1.7,5.7,12.4,25.1,2c2.6-1.4,1.8-2,4.2-0.9c-0.1-5-1.2,0.9-1.3-5.8c4-3.1,3.5-1.8,4.9-2.2
                c4.3-1.2,1.9,0,2.7-4.2c0.7-3.2,1.2-2.4,3.4-4.1c1.9-1.5,1.5-2,3.1-3.6c1.7-1.7,2.6-1.2,4.4-3.1c5.9-5.9,2-11.1,9.2-11.4
                c-0.6-4.4-1.6-3.5-2.2-5.9c-0.5-2,0.5-3.9,0.5-6.6c-8.5-5.7-6.2-5.3-6.5-14.1c-0.1-3.4-0.7-3.6-0.8-6.6c-0.1-2.9,0.3-5.5-0.3-8.2
                c-2.8-10.8-0.1-7.2,0.4-13.6c0.8-10.4,3.3-14.7,2.2-20c-1.2,0-1.3-0.2-2.4,0.2l-2.9,1.9c-1.9,1-2.9,0.9-4,2.9
                c-1.3,2.3-2,8.7-2.7,11.6c-1.2,0.6-3,1.2-4.6,1.9c-3.7,1.6-3.2,0.2-6,0.9c-3.8,0.9-0.6,0.4-2.9,3.6c-0.5,0.6-1.8,2.1-2.6,3.1
                C1137.3,1908.8,1135.3,1906.5,1130.1,1906.2z"
                />
                <path
                  fillRule="evenodd"
                  fill="#737373"
                  d="M1080.9,2052.6c-17.7-10.6-5.8-4.1-16.8-3.5l-0.6,3.6l-5.3,0.9
                c-0.7,5.6,0.4,11.1,1.3,15.4c1.4,0.5,8.2,2.6,7.2,2.6c6.8,4.1,8.2,1.5,13.4,7.9c4.1,5,9,1.5,15.2,1.2l0.2,7.9l8.9,4.3
                c4.3,2.1,3.6,3.6,10.1,3.6c8.7,0,17.5,0,26.3,0c1.5-2.3,2.7-3.7,4.8-5.8c0.9,1,0.3-0.2,1,1.5c2.9,6.7-3.8,10.4,7,10.4
                c1.4-3.8,3.5-6.3,4.6-10.5c1.6-6-0.1-6.3,4.3-9.7c1.9,1,1.9,0.3,3.6,1.3c0.9,0.5,0.9,1.1,1,1.2l4.2-1.9v-13.7
                c1.9-1.4,2.6-2,3.5-4.7c-3.8-5.4-4.1-3-7.6-5c-1.8-2.7-4.3-3-6.6-4.2l-12.3-5.3l5.8-12.2c3.6-6.8,8.5-4.5,9.7-8.8l-47.6-0.2
                c-1.4-2.9-9.3-16.4-10.9-17.8c-3.8,2.8-7.5,7.1-10.1,8.2c-2.2-1.6-0.8,0.2-2-3c-1.5,1.7-0.3-0.7-1.6,2.9c-3.1,8-5.4,9.8-3.2,14.5
                C1091.9,2041.1,1095.1,2061.2,1080.9,2052.6z"
                />
                <path
                  fillRule="evenodd"
                  fill="#737373"
                  d="M1089.1,2039.4c-1.4-4.1-2.9-6-4.2-10.3l4.9-9.5
                c0.8-2.6-0.7-5.1,2.1-5.6c2.7-0.5,1.1,0.2,3,1.9l1.1,0.7c1.5-1.9,8.1-7.3,10.1-7.9c15,22.6,3.6,18.7,35.2,18.7
                c16,0,22.2,2.1,22.7-4c0.8-11.2-7.2-15.3-7.7-18.5c-1.5-9,4.5-4.4-1.9-11.3c-4,1.2-5.6,2.6-8.6,4c-2.6,1.2-4.7,1.9-7.4,3.4
                c-10.2,5.5-12.5,4.4-12.8,9.1l-5.6,0.1l-2.9,4.6l-6.4-2.4c-0.7-1.9,0.4-1-1.7-4.4c-2.3-3.8-0.6-2.7-1.5-6.1c-1.2-4.1-3,0.2-4.3-9.7
                l-9.7-0.5c0-4.1,2.6-7.2,2.9-12.3c-12.8-0.2-2.9-0.7-16.5,1.5c0.2,6.9,1.1,2.7,2.5,7c1.7,5.3-9.9,11.6-10,11.6
                c-3,0.8-25.8,0.2-31,0.3l-1.4-3.1h-35c-0.5,11.1,8.1,11.6,2.1,23.3c1.7,2.8,1.1,0.3,3,3.9c-7.3,3.1-4.7-1.7-3,7.9
                c0.9,5.1-1,4.3,0.8,8.7l0.7,1.7c0.5,1.2-0.3,0.9,2.1,1.9c0.4,0.2,1.2,0.7,1.3,0.5s0.5,0.2,0.7,0.3c1.4,6,2.6,7.3,6.5,11
                c6.5,6.4,4.6,1.6,7.3,10.3c1.3,4.2,1,2.5,4.4,4.8c2.3,1.5,2.3,2.9,4.6,3.9c6.7,3.1-2.1-3.7,11.2,6.6c3.8-0.8,3.2-0.2,4.5-2.6
                l2.9-5.2c1.8-3.2,1.2-3.5,3.8-5.4l-1.5-7.1c-0.2-10.6,0.2-8.5,2.7-9.2c0.2,0,2.6-0.5,3.4-0.6v-3.7c4.7-0.7,8.2-3.8,12.5-0.7
                c2.7,1.9,8.4,4.9,9.9,6.7C1089.5,2051.2,1090.8,2044.2,1089.1,2039.4z"
                />
              </g>
              <g id="region-xiii" className="region pointer-events-[bounding-box]" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleOnClick}>
                <path
                  fillRule="evenodd"
                  fill="#737373"
                  d="M1328.6,1815.9l0.1,8.1c-6.3,0.1-4.5,1.2-4.5,7.2
                c1.7-1.1,1.3-1.5,3-2.4c1.6-0.9,2.4-0.7,3.6-1.5c0.6-0.4,1.9-1.7,1.9-2.6c0-1.9-2.5,0.3,0-10.6c0.3-1.3,0.8-1.9,1.4-2.7
                c1-1.3,1.1-1.2,1.7-1.7c-0.7-1.7-1.3-2.1-1.4-2.8l3.1-17.4l-7.4,3.8c-2.5,2.3-4.7,3-8.9,3.4c-0.6-1.7-0.8-2-1.6-3.6
                c-0.1-0.2-0.2-0.4-0.3-0.5l-1.1-2c3.6-2.6,8.1-5.2,9-10.5c-3.3-1.2-4.9,0.6-6.6-2.2c-2-3.4,0.5,0.1-0.1-2.2c-0.1-0.4-1-1.3-1.7-3.2
                c4.5-1.4,8-3.4,7.6-9l-2.9-0.7c0-4.1,0.5-3.3-1.3-6.5c1.7,0.4,4.1,0.7,5.9,1.1c1.4-2.8-0.4,0.9,0.3-2l0.9-2.2
                c-3.3-2.2-1-2.4-5.9-2.5c1.4-3.4,1.5-1.2,0.8-3.8c-0.3,0.1-1.4,1-1.7,1c-3.7,1.6-8.9,0.5-11.2-1.8c-5.4,0.4-5.3-0.7-10.2,0
                c3.2,1.8,3.5,0,5,3.2c-2.6,1.1-5.4-0.5-7.2-1.7c-1,0.9-2.1,1.6-3.4,2.2c-8.3-6.1,1.1-7.3-8.5-11.4c3.2-5.5,1.2-5,8.1-8.9
                c2.6-1.5,3.7-1.5,5.8-3.7l7.4,0.7c-2.8-1.5-3.5-1.6-3.6-6c7-3.3-1.2-1.4,9.8-5.7l5.1-7.9c0.3-0.8,0.5-1.1,0.9-2.1
                c-0.9-1.7-1.6-2.6-2.6-4.2c1.5-2.6,1.4-1,1.8-4.2c-2-1.6-1.4-1.3-4.4-1.5c1.9-4.2,1.3-0.1,2.2-4.8c-4-2.9-5.5-1.7-7.3-6.8l-4.3,1.8
                c-1.2-2-2.4-3.5-2.3-5.9c1.7,2.4,1.8,1.4,4,2.1c-2.1-3.4-4-4.5-4.5-8.5c-3.7-0.1-3.7-0.7-5.6-2.5c-0.2-4.5,1.5-5,1.9-7.8
                c0.5-3.4-0.4-0.4-0.2-3.7c0-0.5,0.6-3.1,0.8-4.2c0.5-2.6,0-2.3,0.1-3.8c0.2-3.9-0.1,0,1.2-3.1c0.9-2.1,0.3-1.9,1.1-4
                c1.2-3.2,0.5,0.3,1.1-2.1c-5.7-1.2-6.3,1.9-9.6,5.1c-2.2,2.2-8.2,5.5-11.6,4.5l-9.1-10.6c-0.1-0.3-0.3-0.3-0.5-0.5
                c0.6-8-1.2-2-2.3-8l-3.8,0.1c-2.4-5.2-4.6-2.9-5.9-7.9l5.9-2.2l-2-3.7c-0.2,0.1-0.4,0.3-0.5,0.3l-5.2,4.8
                c-3.6,3.5-12.1,13.2-15.8,15.4c1.2,15-0.1,11.1,4,14.5l5.8,6.7c6.1,7.3,10.8,14.3,10.7,24.4c-0.2,18.8,0.6,15.8,7,22.5
                c3.6,3.8,1.8,3.8,3.1,8.9c1.4,5.8,5.8,9.5,8.2,14.9c-4,4.2-2.5,5.2-2.5,12.7c6.8,1,6,8.1,6,15l8.9,0.3c-0.5,1.8-3.7,4.4-5.1,6.1
                c3.4,9.2,15.2,6.8,25.5,6.3c1.4-2,1.2-2.4,3.7-3.6c0.2,3.4,0.5,5.8-0.7,8.4l2.2,2.2c0,6.3,0.9,4.1-2.6,6.8c-1.3,1-1,0.9-2,2.2
                c-1.9,2.4-2.4,3.2-5.1,4.4l0.2,6.8c0-0.2,0.3,0.5,0.4,0.7c7.2-1,0-0.3,5.1-3.8c-0.2,1.9-0.2,1.2-0.8,2.4c-0.9,1.9-0.6,0-1,2.5
                l7.5,6.8l8-0.5C1325.9,1815.6,1321.5,1814.6,1328.6,1815.9z"
                />
                <path
                  fillRule="evenodd"
                  fill="#737373"
                  d="M1220.6,1621c0.9,0.1,1.6,0.5,3.6,0.5c0.3,0.3,4.8,2,8.4,1.5
                c0.4,1.7,1.1,1,2.5,0.9c8.8,3.7,7.2,8.4,7.7,13.4l20.8-20.4c-1.5-1.2,0.9-0.7-2.5-1.2c-0.9-0.1-1.5,0.1-3.2-0.2
                c-0.5-2.4,0.5-3.4-1.2-5.1c-2.4-2.4-10.6-2.9-13.2-3.4c-1.3-0.3-2.2-0.7-2.9-1.5l-1.3-2.7c-6.3,0.4-1.1,0.2-6.1-1.5
                c-0.9-0.3-10-1-12.1-6.6c-0.6-1.5-0.3-2.5-0.7-4.3c-0.2-0.9-0.7-2-1-2.9c2-0.9,1.7,1,2.8-3.8c-3.3-1-1.2-0.6-4.3,0l-2.8-4.6
                c-0.1-0.2-0.3-0.3-0.4-0.5c-0.5-0.7-0.4,0.1-0.7-2c-5.9-0.4-0.4,0.8-5.5,1.2c-2.3-2.7-0.2-3.1-4.5-4.1c-5.6-1.3-0.5-1-5.1-3.2
                l0.2,4.2c-2,0.8-4.3,2.9-5.7,4.1c-1,8.6-1.1,17,1.7,23.7c1.9,4.7,1.8,5,2.8,10.6l3.3,9.8l3.9-0.8l-1.5-10.3
                c1.4-0.9,1.9-1.3,3.1-2.5c8,0,4.9,1.4,10.4,3.5c-0.6,2.6-0.9,3.2-1.4,4.7c-0.9,2.4,0.3,3,0.3,2.9
                C1215.9,1620.5,1213.5,1620.2,1220.6,1621z M1208.1,1536.4c6.4,0.5,1.4,0.2,4.4-1.7c2.2-1.3,2.2,0,2.9,1l1.3-1.3
                c0.4-0.3,1-0.4,1.9-0.6c0.9,2.7,1.4,3.4,2,5.3c-5.3,2.6,1.1-0.9-3.7,4.1c0.5,3,0.7,1.8,0.1,4.6l4.1-0.6c0.6,0,0.5,0.4,0.5,0.5
                l-1.5,1.2c3.5,2.3,1.3,1.8,3,3.7c1.4,1.5,2.9,1,3.9,2.9s-0.1,4.1,0.1,5.3c0.3,2.6,1.2,0.2,1.9,4.5c3.3-1.2,1.2-1,5.3-0.9
                c0.5-9.7,2.2-2.6-2.9-7.5l-2.4-3.7c1.1-1.7-0.2-1.1,2.2-1.5c0-4.9-1-3.8,0.2-7.2c0.5-1.6,1.9-4.8,1.9-6.3c-0.1-5.1-3.3-7.5-4.1-9.5
                c-0.9-2.1,0.3-0.8-1-3c2-3.2,1.9-0.9,2.2-3.3c-1.9-1.2-1.3,0.6-3.4-1.3c0.4-2.8-0.5-0.6,1.9-3.2c-1.1-4.3-0.8-4.9-3.6-8l2.9,0.3
                c-0.7-3.8,0.5-2.5-1.4-6.5c1.7-3.7,4.9-8.3,4.1-13.3c-0.4-2.7-2.6-8-5-9.9c-2.7,3-3.2,3.6-3.5,7.2l-0.2,1.1c0,0.2-0.1,0.9-0.2,1.1
                c-0.1,0.6,0,0.7-0.2,1.5c-0.5,2.1-0.5,2.2-1.8,3.9c-3.8-0.1-5.4-2.4-5.4-2.5c-0.1-0.3-0.4-0.3-0.7-0.4c0.1,3.4,0.6,5.4,1.5,8.9
                l-5.8-0.5c0.1,0.7,0.1,2.6,0.2,3.1c0.4,2.9,1.7,0.5-0.4,9.1l3.7,3.9c-0.9,0.9-1.5,1.5-2.5,2.4c-1.5-1.4,0-1.6-3.3-2.5
                c2.1,4.8,1.4,1.3,0.3,4.6c-1.3,4.3-0.8,5.1-2.6,9.4C1209.8,1533.6,1205.4,1532,1208.1,1536.4z M1269.4,1567.6c0.5-4,0.5-3.9,3.8-3
                C1272.2,1567.4,1274.5,1566.4,1269.4,1567.6z M1272.6,1572.5c4.3,3.4,3.5,6.1,5.6,7.1c2.7,1.4,0.5,0.2,0.9-0.1
                c0.1-0.1,0.7-1.4,0.8-1.4c3.6,1.6,8.4,4,12.3,0.5c1.2-1-0.3-0.1,1.1-1.3l3.8-2.2c1.3-2.2-3.2-6.8-3.6-7c-0.5-0.3-3.5-0.9-5.3-2.2
                l2.9-2.5l-0.4-7c-0.3-1-1.7-4.1-2.4-6c-4.3-11.6-3.2-3.5-4.1-12.6c-7.5,2.8-0.2,6.6-9.7,16.5l-1.6,1.6c-0.1-0.1-0.2-0.3-0.2-0.3
                l-1.8-1.3c-5.4,5-8.8,5-2.9,12.3c2.3,2.9,1.4,4.3,6.5,2.9C1273.7,1571.5,1273.9,1570.5,1272.6,1572.5z M1269.5,1588.6
                c0-6.8,0.5-4.2,1.4-6.7l-3.5,0.3l-1.1-2.5l-2.5,0.5c0,2.5,0.2,2.1-0.2,3.5c-0.4,1.7-1.2-1.6-0.3,2.3c0.5,2,1.7,5.1,2.4,6.6
                c-1.7,1.9-0.2,0.2-1.6,1.2c-2.7,2-0.7-0.1-2.1,2.7l-1.4,2.3c5.9,1.7,0.7,0.2,3.6,3.2c1.8,1.9,0.7-0.6,3,2.8
                c0.1,0.1,0.2,0.6,0.3,0.5c0-0.1,0.2,0.3,0.3,0.5c6-3.1,1.3-4.4,4.3-9.7C1275.9,1588.9,1271.5,1589.9,1269.5,1588.6z M1225.3,1562.4
                c0.1-3.2,0.7-1.5,0.2-4.6l-4.4,1.1c-1.1-0.6-0.4-0.3-1.5-0.5c-1.4,3.7-1.8,2.4-1.8,7.2h0.5c0-3.8,1.4-4.4,4.7-5.1
                c-1.6,4.1-3.4,5.5-5.2,7.6c1.4,3.7,1-1,1.5,4.5h1.5c1-3.3-1.7-1.2,2.6-2.9c2.4-1,4.3,0.1,5.8-0.9l2.7-2.6
                C1225.6,1567.1,1229.9,1565.6,1225.3,1562.4z M1277.9,1588.4c1.9-4.6,2.5-2.4,6.6-2.2c-0.3-3.2-0.1-3.7-3.5-3.1
                c-4,0.7-1.9-0.4-4,2.5l-3.3-2.1C1268.2,1588.1,1272.3,1586.9,1277.9,1588.4z"
                />
                <path
                  fillRule="evenodd"
                  fill="#737373"
                  d="M1244,1658.6c-0.2-3.6-0.9-3.9-1.4-6.5
                c-2.4-14.1,0.7-18.9-4.8-24.5c-1.6-1.6-2.7-2.2-5-1.9c-1.4,0.5-1,0.7-1-0.9c-2.4-0.6-4.2-1-7.2-0.7c-1.5,0.5-1.1,0.7-1.1-0.9
                l-7.2-0.7l-1.7-0.4v1.2l0.6,1c1,0.7,1.4-0.1,0.2,1c0,2.9,0.2,1-1,1.6l0.3,2.1c1.6,0,1.4-0.5,1.4,0.9c0,2.5-0.2,1-1.5,2.9
                s-0.9,1.4-1.5,3.5c-2.7-0.6-0.4-0.7-3.4,0.1c-0.9-2.8-1.7-4.2-2.2-7c-0.6-3.4-0.3-3.2-2.4-5.8l-4.3,1.7c3.2,2.2,1.6,1.4,1.9,4.8
                c0.1,1,1.4,3.7,2,4.8c4.2,7.8,3.3,9.8,3.9,14.6c0.1,0.9,1.3,4,1.6,4.8c2.6,7.1,0.3,5.5,0.4,10.4l1,4c1.3,8.3,1.2,6.3-0.5,9.3
                c-1.4,2.4-0.7,2.6-2.4,4.4c-5.3,5.2-13.7,6.3-21.9,3.3c-0.1,0.1-1.1,1.2-1.2,1.3c-0.9,0.9-0.4,0.5-1.4,1.1
                c-0.9-2.1,0.8-2.3-4.1-2.4c-3.1,0-2.2,0.4-4.2-1.8l-6.7-8.3c1.6,12.1,4.6,13.6,1.4,20l3.1,3.8c0.1,0.2,0.2,0.4,0.2,0.6
                c0.1,0.2,0.2,0.4,0.3,0.6c1.9,4,0.6,2.2-0.3,4.9c-0.9,2.8-0.3,22.1-0.3,26.2l25.6,0.1c2.7-0.9,3.9-2.6,6.2-4
                c4.1-2.4,21.1-1.3,26.5-1.3c0-2.6-0.5-5.6-1.1-7.9c-0.6-2.2-2.4-5.3-2.4-7c-0.1-3,2.2-4.2,3.1-6.3c1.1-2.7,0.2-5.5,0.7-8.5
                c1.3-8,7.3-14.9,10.1-22.4l1-2.4c0.2-1.4,1.7-7.3,1.7-10.7C1244.5,1659.5,1244.2,1659.8,1244,1658.6z"
                />
                <path
                  fillRule="evenodd"
                  fill="#737373"
                  d="M1188.3,1783.5c0.9,0.7-1,1.7,0.2,3.2c0.7,0.9-0.1,0.1,1,1.4
                c4.5,5.3,0.4,4,1,8.3c0.7,5.1,3.6,2,2.1,14.7c4.4,3.1,2,4.4,1.7,8.1c-0.1,1.2,0.5,3.6,0.5,5.9l30.6-1.5c30.7,0,43,0,51.4,0.3
                c2.6,0.1-0.1,4.3,9.5,7.4c3.1-2.5,10.9-8,16.5-9.1c6.1-0.9,17.4,0.5,24.5,0.2l0.2-5.3l-4.4-0.9l-0.9-0.7l-0.5-2.4
                c0.9-0.7,1.7-1.4,2.6-2.3c1.9-2,1.2-0.4,1.5-2.8l-5.5,0.8c-7.1-7-6.4-8.2-12.1-8.2l0.9-10.1c8.7-2.9,3.2-7.1,9.7-7.9
                c-0.3-4.4-0.9-3.3-1.8-5.7c-0.7-1.8,0.2-2.3,0.2-5.2c-5.1,1.9-12.7,2-17.9,1.3c-9.4-1.2-7.7-2.6-11.9-7.7c1.8-3,2.7-2.5,4.4-5.2
                h-7.4c0-7.6,1.1-14.7-5.8-15l-0.9-11.4l2.9-3.1c-1.5-3.3-2.9-4.5-4.8-7.2c-7.3-10.8,2.2-9-12.3-21c0-5.9-0.8-10.1-0.8-15.4
                c0-6.5,0.7-9.1-2.1-13.8c-6.7-11.3-10.2-11.8-13.2-18.3c-0.1,0.1-2.7,0.7-0.6,2.2l0.8,6.2c-0.7,1.8-1.4,4.1-1.9,6.1
                c-0.7,2.5-0.7,4.5-1.4,6.7l-0.7,1l-0.9,1.1c-1.7,5-1.5,3.8-4.1,7.4c-5.6,8-1.9,19-8,24.4c0.4,2.7,4.5,12.5,4.2,17.7
                c-12.1,0.3-23.6-1.8-29.9,2.7c-7.9,5.6-16.2,1-29.9,2.9c0,12.3-2.7,36,7.4,44.1c0.7,0.6,0.5,0.4,1.2,1.3
                C1188,1784.9,1189,1778.1,1188.3,1783.5z"
                />
              </g>

              <g id="armm" className="region pointer-events-[bounding-box]" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={handleOnClick}>
                <path
                  fillRule="evenodd"
                  fill="#DADADA"
                  d="M487.5,2193.9c0-1.9-0.4-2.5-1-3.8c2.8-1.3,0.3,0.1,2.6-0.7l-3.8-4.6
                l1.5,4.6c-2.4-0.8-1.4-0.7-3.4-2.9c-11.3-0.2-8.9,5.6-17,8.4c-0.7,5.7,0.5,2.6-3.2,5.3l-4.1,3.5c-4.8,0-3.2-0.6-7-1.2l-3.3,5.1
                c-1.5,2,0.3,0.4-2.5,1.7c-6.3,2.9-4.5,3.6-7.9,4.5c-3.5,0.9-3.8-0.3-7.2,1.3c-0.7,3.9,0,1.3,0.4,3.2c0.6,3-0.7,2.7-1.1,3.2
                l-1.4-3.3c-8.8,3.5-8.1,10-8.7,14.9l4.5-0.9c-0.1-0.2-0.3-0.5-0.4-0.7s-0.3-0.5-0.3-0.6c-0.1-0.1-1.9-2.8,0.5-2.7l3.6,2.4l-1.9-3.6
                l2.9-0.3c0.1-0.2,0.2-0.5,0.3-0.7l0.7-2.7c1.9,2.1,0.8,1.6,2.2,4.4l3.1-0.1c1-2.1-1.9-0.7,2.7-2c1.3-0.3,2.2-0.3,3.5-0.7l5.9-1.7
                c3.7-0.3,3,2.3,5.6-4.4c1.5-3.8,1-6.1,9.3-9l1.2,2.5c-0.8,0.8-1.1,1.2-2,2c4.4-0.5,1.7,0.1,2.7-1.8l1.2,2.4
                c3.3-1.9,6.1-4.3,6.5-8.2c0-0.2,0.2-0.3,0.2-0.4c2.7,3.4,3.1,2.6,4.3,5.7l2.9-2.9c-0.7,6.2-0.9,0-1.3,5.6c3.5,3.7,1.2,1.4,4.2,2.3
                c4.6,1.4,2.7,3.6,3.2-1.5c0.3-4.3-0.2-0.4,0.7-2.9c1-2.9,0.4-2.6,1.2-4.8c0.2-0.6,2.1-4.2,2.3-5.2c0.5-2.7-0.3-2.2,0.1-5.5
                c-3.1-0.8-2.4-0.2-4.8-1.8C486.5,2193.7,482.6,2193.9,487.5,2193.9z M383.6,2249.6c-1.3-2.6-0.5-2-3.2-2.3
                c-0.7,1.7,2.6,14.5,2.8,19.5c0.2,3.3-1,6.1-0.9,9.5c0.3,8-1.8,3.1-0.2,6.6c3.2-1.4,2.4-3.1,4.3-8.9c1.4-4.1,2.3-4.8,1.3-9.3
                C386.5,2259.7,386.3,2254.9,383.6,2249.6z M433.8,2247.1c-2-0.6-0.8,0.6-2.3-0.4c-1.4-1,1.1-1.1-4.1-1.1
                C425.5,2258.6,438.7,2256.9,433.8,2247.1z M489.7,2209.8c3.7,1.4,1.1,1.5,4.1,0.9c2.1-0.4,3.7-1.7,4.1-3.3c0.7-2.9-1.4-2.2-3-3.6
                c-1.6-1.4,0.1-1.7-2-3.7C490.6,2202.4,490.7,2204.8,489.7,2209.8z M490.2,2225.9c0.9-0.6,6.2-3.9,7-4.5c0.8-0.7,0.9-1,1.6-1.7
                c4-3.7,4.5-0.9,3.7-7.6c-2.8,4.2-2.4-0.7-2.6,5.4c-5.5,2.4-4,2.5-6.8,4.8C490.4,2224.6,491,2222.1,490.2,2225.9z M455.8,2240.9
                c1.4-1.8,2.5-4.7,2.9-7.4c-2.9,0.2-2.9-0.7-3.6,2.6C454.5,2238.4,455,2239.8,455.8,2240.9z M429.7,2260.4c0.6,1.9,0.3,2.7,3.2,2.8
                l4.7-1.4C434.3,2260.9,432.6,2259.2,429.7,2260.4z"
                />
                <path
                  fillRule="evenodd"
                  fill="#DADADA"
                  d="M644,2106.2c11.5-1.6,5.7-7.9,2.8-9.1c-3.4-1.5-3.3-0.3-5,1.5
                c-1.9-1.7-1.7-1.8-4.5-1.7c-4.2,0.1-2.2-0.5-5.3-1.5c-4.8-1.6-8.8,3.5-10.3,3.3c-4.3-0.5-4.8-6.4-6-8.2c-0.5-0.8-0.4-0.5-1.1-1.3
                c-5.2-5.7-7.9-3.5-11.2-3.6c-10.5-0.2-7.4,1.4-10.4,3.9c-1.7,1.4-6.5,2.2-10.9,4.1c-1.7,0.7-12.5,10.7-4,15.9
                c8.4,5.2,2.9,2.4,15.7-1.4c3.8-1.1,5,3.6,7.7,5.6c5.2-1.7-3,0.2,6.1-2.9c5.8-2,3.2-3.6,9.9-5.4c2.7-0.8,1.5-0.2,5.9,0.6
                c3.4,0.6,1.7,4.3,0.9,5.9c3.9,2.2,3.4,0.8,6.5,5.3c1.2-0.9,0.2,0.2,1.4-1.2c0.5-0.6,0.3-0.7,0.9-1.6c1-1.4,0.6-1,2.1-2
                c3.1-2.1,2.5-0.9,4.5-3.9c3.9,1,1.6,1.4,4.9,1.9L644,2106.2z M526.3,2061.8c-1.7-0.2-4.2-1.2-5-0.9c-2.1,1-0.3,2,0.8,2.4
                c14.2,3.9,11.8-1.8,12.6-8.9c0.3-3.5,1.5-6.7,2.1-10.1c-8.2,1.5-5.9,7.6-8.4,12.8C527.5,2058.9,527,2059.9,526.3,2061.8z
                  M572.3,2167.6c5.3-1,4.1-3.9,7.1-6.5c-0.9-1.2-0.9-0.9-1.7-1.5c-3.6-2.9-1.6-2.1-4.1-4.8C566.4,2154.6,563.3,2161.1,572.3,2167.6z
                  M564.9,2143.7c10-1.7,1,2.7,10.2-2.7c0.2-0.1,0.4-0.2,0.6-0.3l1.2-0.6c10.2-4.3,5-8.7,1.5-9.2c-1.8,1.9-3.1,5-2.2,8.1l-10.8-0.2
                C564.5,2141.6,564.2,2140.2,564.9,2143.7z M612.6,2127.9c2.4-0.7,4.5-1.2,6.7-2.2c3.8-1.7,4-1.4,4.6-3.2l-4.5,0.9l-0.8-3.6
                l-6.7-1.5l-2.1,6.6C611.2,2125.9,611.6,2126.4,612.6,2127.9z M559.7,2166.8c3-0.8,0.3,0.7,2.9-1.5c3.5-3,2.7-5.4,2.2-8
                c-1.7,0.1-2.2-0.1-3.7,0.5c-1.7,0.7-0.9,0.3-2,1.6c-1.4,1.7-1.9,2.9-1.9,5.4L559.7,2166.8z M696.2,2085.2c0.5,1.4-0.8,0.2,0.8,2.7
                c0.4,0.7,1.3,1.4,1.8,1.7l3.2,2.7c1.3,1.5,1.8,1.4,3.2,2.4c2.2,1.6,3.2,4.1,8.4,1c0.2-0.1,0.3-0.2,0.5-0.3l2-1.2
                c2.9-1.7,3-1.7,5.1-3.6c-2.6,0.3-4.2,3.2-13,4.3c-2.6-3-1.1-0.3-4.8-3.2C694.2,2084.2,702,2086.2,696.2,2085.2z M708.1,2080.4
                c-0.6-2.7-0.4-3.7-3.1-2.1l-2-4.3c-0.4,0.4-1.3-0.5-1.7,2.3c-0.6,3.6-0.2,0.4,1.7,2.7l1.7,2.6L708.1,2080.4z M644.3,2094.6
                c7,0.9,5.4,0.2,6.1-0.9c0.5-2.5-0.6-2.9-2.7-4C645.8,2091.1,644.6,2091.4,644.3,2094.6z M590.8,2139.9c0.7,1.4-1.6-0.2,0.9,2.2
                c1.4,1.5,4.9,1.5,7.4,1.4c1.1-1.2,1.5-2,2.9-2.5c-1.6-1-5.4-0.3-7.9,1.3L590.8,2139.9z M516.4,2078.8c1.7-2,1.4-1.8,2.2-4.3
                c-2.8-0.9-3.6-0.3-5.8,1.7C514.2,2078.4,513,2077.7,516.4,2078.8z M682.5,2099.2c3.8-2.7,1.3,0.7,5-4.2c1.2-1.6,1.4-0.9,1.7-2.6
                c-3.8-0.7-3.5,2.9-7.5,5.1L682.5,2099.2z M552.5,2042.8l-0.3-4.3c-1.4,0.2-1.9,0.1-3.2,0.9c-1.9,1.1-1.2,0.4-1.9,2.7L552.5,2042.8z
                  M542.1,2062.9c2.2-1,2.1,0.5,3.5-4.6l-3.3-0.4c0,0.1-0.8,2.4-0.8,2.4C541,2064.9,541.2,2061.2,542.1,2062.9z M668.8,2106.1
                c3.9-0.1,1.8,0.2,4.4-1.9l-1.5-3.3C669.2,2103.4,669.4,2102.4,668.8,2106.1z"
                />
                <path
                  fillRule="evenodd"
                  fill="#DADADA"
                  d="M726.5,1998c-1.3-1.4,0.3-1.7-0.9-3.6c-2.7,1.6-2.6,0.8-4.3,2.9l1.8,4.2
                c-4.2,2.5-1.4,0.9-3.6,4.8c-3.9-0.5-3.3-1.4-6.1,1.4c-3.4-2.1-9.9-5.5-12,1.7c-0.8,2.8-1,5.9,2.2,7.3c5.2,2.3,0.3-3.2,8.5,3.7
                c-1.1,2.9-0.5,0.7-1,3.6c-0.2,1.5-0.2,1.8-0.5,3.4c7.2,7,2.6,2.6,6.5,7.5c2.2,2.8,2.8,1.2,4.5,3c1,1.1,1,2.4,1.9,4
                c5.3-1.4,7.6,0.1,13.5-2.1c23.6-8.8,14.9-0.3,19.3-17.5c2-7.9,3.4-6.3,13.5-6.4c1.5-1.7,1.4-1.5,2.9-3.7l-2.9-3h-6.4
                c-3.7-4.4-5.7-2.1-12.5-3.3c-5.3-1-2.6-1.4-3.8-5.4c-1-3.4-2-1.5-5.6-1c-1-1.4-2.5-3.1-3.6-4.5C732.1,1996,730.9,1995,726.5,1998z
                  M677.9,2007.9c-2.3-0.9-2.7-1.7-4.3-3.4c-1.9,1.8-3,4.4-3.4,7.1c1.9-0.4,2.9-1.2,3.2-2.3c0.1-0.4,0.3-0.5,0.5-0.7
                c0.1,5.6,1.2,3.1,2.5,5.8C676.7,2010.6,675.6,2011.2,677.9,2007.9z M724.1,2051.8c1.4,0.2,1.5-0.2,1.9-0.3c0.2-2.9,0.5-0.3-0.5-2.9
                c-2.8,1.3-1.7,0.2-3.3,2.4C723.4,2051.6,722.7,2051.4,724.1,2051.8z M727.5,2058.8c-0.8-3.5-1.7-4.7-4-2c3.3,1.9,2.2,3.2,3.2,1.7
                C726.9,2058.2,727.3,2058.8,727.5,2058.8z"
                />
                <path
                  fillRule="evenodd"
                  fill="#DADADA"
                  d="M1068.4,1898.9c-1-0.8-6.3-9-6.6-9.9c-1-3.8,0.9-9.7,0.4-14.7
                c-12.5,12.9-5.3,6.3-18.4,13c-6.5,3.3-4.2,2.6-8.2,7.7c-6.8,8.8-5.1,3.9-5.8,7.5c0,0.2,0.1,0.8,0.1,0.7c0-0.2,0.1,0.5,0.2,0.7
                c5.6,0.6-0.9-0.6,4.7-1l2.1,9.4c-8.5,1.4-1.2-0.3-6.7,0c0.1,0.1,0.2,0.3,0.2,0.3c0,0.1,0.2,0.3,0.2,0.4c0.7,2.6,1.4,6.6-0.7,9.7
                l1.5,2.7c0,0.1,0.1,0.3,0.2,0.5l1.6,3.3c0.9,1.8,1.1,2,2.4,3.4c1.7,1.8,0.9,1.2,2.2,2.8c4.4,5.4,11.4,1.9,8.2,10.8
                c-3.8-0.5-1.2,0.1-3.8-1l-1.1-0.6c-0.2-0.1-0.3-0.2-0.5-0.3c-0.2-0.1-0.4-0.2-0.6-0.3l-2.9-1.4c-0.2-0.1-0.5-0.2-0.7-0.2
                c-7.3-2.9-3.2-6.8-11.9-6.6c-5.3,0.1-6.2,2.9-11.2,4.1c-9.2,2.2-11.4,18.3-14.3,23.4c-2.2,3.7-0.6,1.8-1.5,6.1
                c-0.7,3.4-2.1,1.4-0.8,5.2c0.7,2.1,1.3-1,0.8,3.1c-0.4,3.2-4,4.9,1.3,12.4l0.9,1c1.6-1.8,0.5-1.6,3-3c3.5,1.7,3.9,1.8,3.9,6.7h33.8
                c1.9,0.8,0.3-0.2,1.5,1.4l1,1.6c7.5,0,15.1,0,22.6,0c5.3,0,5.3-0.2,8.6-2.2c2.9-1.8,3.3-2.7,5.9-5.3c-1.5-8.8-6.3-10.2,1.5-11.8
                c8.4-1.7,8-1.2,16.6-0.9c-0.4,3.6-2,10.1-3.7,12.3c4.6,0.9,8.4-1,9.7,2.1c2.1,4.8-1.6,4,4.5,7.3c0,8.4,1.1,5.1,2.5,8.9
                c0.9-1.7,2.4-5.9,3-6.7c3.5,0.6,5.3,3.5,5.8,6.7h3.8c0.9-5.3,7.6-4.7,13.8-9.6c-2.6-1.7-9.7-6.3-12.5-6.4c-0.3,0-11.1,3.6-12.5-1.9
                c0-6.4,0-12.9,0-19.3c0-15.3-1.4-5.1-1.5-13.3c-0.2-8.5,0.8-4,3.8-6.7c-1.7-2.4-1.2-1-2.2-1.8c-1.5-1-9.7-12-14.3-14.4
                c-1.9,8.2,6.8,5.5,5.3,12.8c-1.5,2.8-0.9,1.4-3.2,2.3l-1.9,0.9c-1.7,0.9-0.3-0.2-1.6,1c2.6,3.2,4,4.9,4.5,10.1
                c-0.8,0.8-1.9,1.5-2.7,2.6l-1.7,4.1c-8.3-0.1-2.4-2.3-15.5-3.2c-6-10.2-5.9-6.6-10.4-7.8c-5.2-1.4-9.2-8.7-9.4-10
                c-0.5-3.6,8.8-15,8.6-18.7c-12.5-0.5-3.2,2.5-10.7,1.6c-0.9,7.7-1.4,1.2-6.1,9.6c-5.2-0.5-3.6,0.3-6.1-3.1c2-7.2,8-12,9.7-17.9h3.7
                C1061.1,1910.9,1066.5,1905.8,1068.4,1898.9z"
                />
                <path
                  fillRule="evenodd"
                  fill="#DADADA"
                  d="M1045.7,1943.7c-0.7-2.9,1.4-0.7-2.1-2.9c-1.2-0.8-1.6-0.7-2.9-1.3
                c-2.9-1.5-7.8-7.6-8.6-9c-2.3-4.2,0.5-1.9-3.5-4.9c-7.7,7.6-1.4,6.4-5.1,8.5c1.5,0.3,6.5,1,6.6,1c3.7,1.7,0.9,3.9,7.2,6.2l4.5,2.2
                C1045.9,1945.6,1044.8,1944.2,1045.7,1943.7z"
                />
                <path
                  fillRule="evenodd"
                  fill="#DADADA"
                  d="M1059.8,1800.7c-10-2.3-13-5.8-17.7-7.9l-0.1,17.2
                c-1,2.8-4,5.7-6.6,6.8c-6.8,0-7.2,1.5-12.1,3c-0.3,4.7-0.4,10.4-3.1,14.3c0,0-0.9,1.2-1.1,1.4c-1.4,1.7-0.3,0.5-1.3,1.5h-11.5
                c2.6,8.5,1.4,10.1,2.9,11.6c0.2,0.1,0.3,0.3,0.5,0.4c1.7,1.8,1.5,1.9,1.6,4.4c-3.5-0.9-3.9,0-4.8-2.9c-1.4,2.9-3.4,3.2-3.4,6.2
                c0,3.8,2.5,2.6-1.5,6.5c-3.6,1.3-6.5-1-10.6-2.3c-1.9-0.6-6.1-2.3-10.1-2.8c-0.1,0.2,0.1,0.1-0.5,1.3l-0.9,1.8
                c-1.1,1.7-0.7,0.7-1.8,2c6.5,0,11.4-0.3,16.2,2.2c9.3,4.8,3.4,6.3,11.2,5.3c0.1,0.2,0.2,0.5,0.3,0.7c0.1,0.1,0.2,0.4,0.3,0.6
                l16.5,23.7l-1.4,2.5c-0.2,1,0.7,0.9,1.5,1.4c4,2,1.8,1.3,4.4,3.3c2.5-2.3-1.1,2.5,0.9-1c1.7-2.9,3.9-4.2,6.1-7.1
                c13.1-17.4,6.8-1.4,26.4-21.4l4.9-3.6c5.9-2.6,3.9-4.9,12.8-3.6c6,0.9,8.1,9.4,15.6,5.3c7.3-3.9,6.3,0.3,12.8,0.5
                c-0.7-5.1-1-2-2.9-5.6c-1.4-2.7-0.3-3.6-1.5-6c-0.7-1.4-5.6-6.8-6.7-8.5c-3.2-4.9-0.3-1.6-4.2-4.3c-2.9-1.9-3.4-6.2-4.8-8.5l-6-10
                c-2.7-5.3-3.2-11.6-5.4-17.2C1070.9,1802,1067.9,1804.8,1059.8,1800.7z M1048.8,1825.9c3.1,1.8,2.1,0.2,4.4,2.9
                c-0.5,1.4-1.1,2.5-2.3,3.4c-7,4.8-4.3,0.7-2.9,12.3c-2.1,0.2-2.5,0.3-3.7,1.2c0.8,2.4,1.5,3.2,2.2,5.6c-3.4,0-5.7-0.8-7.9-0.3
                c-11.1,2.4-7.2-1.3-14.2-2.5c-5-0.8-3.1-0.5-7.2-2c1.4-3.2,1.5,0,0-5c8.3-0.1,3.8-2,9.9-3.4c4.7-1,3.4-5.7,9.5-11
                c0.6-0.5,1-0.8,1.6-1.6c2-2.8-1.4,0.6,1-1.7c2.5-2.3,1.9-1,4.4-1.3s0.8-1.4,5.8-1L1048.8,1825.9z"
                />
            </g>
          </svg>
      </>
    )
}