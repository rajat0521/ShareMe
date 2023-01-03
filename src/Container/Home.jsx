import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { HiMenu } from 'react-icons/hi'
import { AiFillCloseCircle } from 'react-icons/ai'
import { Link, Route, Routes } from 'react-router-dom'

import { SideBar } from '../Component'
import { UserProfile } from '../Component'
import { client } from '../client'
import logo from '../assets/logo.png'
import Pins from './Pins'
import { userQuery } from '../utils/data'
import { fetchUser } from '../utils/fetchUser'


const Home = () =>  {
  

  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);
 
  //we are getting decoded user info from our utility function fetchUser
  const decoded = fetchUser();
  


   useEffect(() => {
    const query = userQuery(decoded.sub);

    client.fetch(query)
      .then( (data) => {
        setUser(data[0])
      })

  } ,  [] )

  // console.log(user);

  useEffect(() => {
    // in the start we should be in the start of the page so setting it to the start
    scrollRef.current.scrollTo(0, 0)
  } ,  [] )

  // console.log('user' , user);

  return (
    <div className='flex bg-grey-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out'>
      <div className='hidden md:flex h-screen flex-initial rounded-lg shadow-lg'>
        <SideBar user={user && user} />   {/* mobile sidebar */}
      </div>

      
      <div className='flex md:hidden flex-row'>

        <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
          {/* showing logo and user profile image */}
          <HiMenu  fontSize={40} className="cursor-pointer" onClick={ () => setToggleSidebar(true) } />
          <Link to="/home">
            <img src={logo} alt="logo" className='w-28'  />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt="logo" className='w-28 rounded-full'  />
          </Link>
        </div>

        {toggleSidebar && (
          <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
            <div className='absolute w-full flex justify-end items-center p-2 '>
              <AiFillCloseCircle fontSize={40}  className='cursor-pointer ' onClick={ () => setToggleSidebar(false) } />
            </div>
            <SideBar user={user && user} closeToggle={toggleSidebar}  />        {/* desktop sidebar */}
          </div>
        )}
      </div>

      <div className='pb-2 flex-1 h-screen overflow-y-scroll ' ref={scrollRef} >
        <Routes>
          <Route path='/home/user-profile/:userId' element={<UserProfile />} />
          <Route path='/*' element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  )
}

export default Home
