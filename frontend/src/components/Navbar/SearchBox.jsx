import React, { useState } from 'react'
import { CiSearch } from "react-icons/ci";

const SearchBox = ({searchVal, setSearchVal}) => {
  // const [searchVal, setSearchVal] = useState('');
  // const handleSubmit = (e) => {
  //   setSearchVal(e.target.value);
  //   console.log('clicked: ',searchVal);
  //   searchMeeting(searchVal);
  // }
  return (
    
        <input
          type="text"
          placeholder="search meetings..."
          className="border-2 border-[#044c69] w-64 rounded-lg px-4 py-2"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
        />
       
     
        
  )
}

export default SearchBox