import React, { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IoMdAdd, IoMdSearch } from 'react-icons/io'


const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  
  // console.log(searchTerm)
  // console.log(setSearchTerm)
  // console.log(user)
  const navigate= useNavigate();
  if(user==null) return null;

  return (
    <div className='flex gap-2 md:gap-5 w-full mt-5 pb-7'>
      <div className='flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm '>
        <IoMdSearch fontSize={21} className='ml-1' />
        <input 
          type="text"
          onChange={(e) => {
            setSearchTerm(e.target.value)
          }}
          placeholder="Search"
          value={searchTerm}
          onFocus={ () => navigate('/home/search')}
          className='p-2 w-full bg-white rounded-md outline-none border-b-2 border-black'
          
        />
      </div>
      <div className='flex gap-3'>
        <Link to={`/home/user-profile/${user._id}`} className='shadow-2xl rounded-full hidden md:block w-12 h-12 md:w-14 md:h-12 md:rounded-full' >
          <img src={user.image} alt="user" className='rounded-full' />
        </Link>
        <Link to='/home/create-pin' className='bg-black text-white rounded-lg  w-10 h-10 md:w-14 md:h-12 flex justify-center items-center' >
          <IoMdAdd />
        </Link>
      </div>

    </div>
  )
}

export default Navbar
