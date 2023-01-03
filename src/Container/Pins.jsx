import React, {useState, useEffect} from 'react'
import { Routes, Route } from 'react-router-dom'

import {Navbar, Feed, PinDetail, CreatePin, Search} from '../Component' 


const Pins = ({ user }) => {

  // console.log(user)
  
  const [searchTerm, setSearchTerm] = useState('');
  if(user==null){return null;}

  return (
    <div className='px-2 md:px-5'>
      <div className='bg-grey-50'>
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user} />
      </div>
      <div className='h-full '>
        <Routes>
          <Route path='/home' element={<Feed />} />
          <Route path='/home/category/:categoryId' element={<Feed />} />
          <Route path='/home/pin-detail/:pinId' element={<PinDetail user={user} />} />
          <Route path='/home/create-pin' element={<CreatePin user={user} />} />
          <Route path='/home/search' element={<Search  searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />

        </Routes>
      </div>
    </div>
  )
}

export default Pins