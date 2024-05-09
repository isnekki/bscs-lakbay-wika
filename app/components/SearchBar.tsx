import React from 'react'
import Image from 'next/image';
import Search from '../../assets/icons/search.png';
const SearchBar = () => {
  return (
    
    <Image
      className='icon'
      src = {Search}
      alt='search icon'
      height={25}
      width={25}
    />

  )
}

export default SearchBar;