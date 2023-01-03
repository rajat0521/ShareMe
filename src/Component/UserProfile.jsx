import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { googleLogout } from '@react-oauth/google'
import GoogleLogout from 'react-google-login';



import { userCreatedPinsQuery } from '../utils/data'
import { userQuery } from '../utils/data'
import { userSavedPinsQuery } from '../utils/data'
import { client } from '../client'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'

const randomImage = 'https://source.unsplash.com/1600x900/?nature,photography,technology';

const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none ';
const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none ';

const UserProfile = () => {

  const [user, setUser] = useState(null)
  const [pins, setPins] = useState(null)
  const [text, setText] = useState('created') //will switch between two values created or saved
  const [activeBtn, setActiveBtn] = useState('created')
  const navigate = useNavigate();
  const { userId } = useParams();
  // console.log(userId)

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query)
    .then((data) => {
      setUser(data[0]);
    })
  }, [userId])

  useEffect(() => {
    if(text === 'created'){
      const createdPinsQuery = userCreatedPinsQuery(userId);
      client.fetch(createdPinsQuery)
      .then((data) => {
        setPins(data);
      })
    }else{
      const savedPinsQuery = userSavedPinsQuery(userId);
      client.fetch(savedPinsQuery)
      .then((data) => {
        setPins(data);
      })
    }
  }, [text, userId])
  
  

  if(!user)return <Spinner message='Loading...' />
  // console.log(user)

  const logout = () => {
    localStorage.clear();
    // console.log('successfully loged out');
    navigate('/login');
   }

  return (
    <div className='relative pb-2 h-full justify-center items-center '>
      <div className='flex flex-col pb-5 '>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col justify-center items-center '>
            <img 
              src={randomImage}
              className='w-full h-370 2xl:h-510 shadow-lg object-cover '
              alt="banner-pic" 
            /> 
            <a href={user?.image} className="cursor-pointer">
              <img 
                src={user?.image}
                alt="user-pic"
                className='rounded-full w-20 h-20 -mt-10 shadow-2xl object-cover' 
              />
            </a>
            
            <h1 className='font-bold text-3xl text-center mt-3'> { user?.userName } </h1>
            <div className='absolute top-0 z-1 r-0 p-2 '>
              {/* {userId === user?._id && (
                <GoogleLogout
                  clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                  buttonText="Logout"
                  onSuccess={logout}
                  // onLogoutSuccess={logout}
                >
                </GoogleLogout>
              ) } */}
            </div>
          </div>
            <div className='text-center mb-7'>
              <button
                type='button'
                onClick={(e) => {
                  setText(e.target.textContent)
                  setActiveBtn('created')
                }}
                className={`${activeBtn === 'created'  ? activeBtnStyles : notActiveBtnStyles}`}
              >
                created
              </button>
              <button
                type='button'
                onClick={(e) => {
                  setText(e.target.textContent)
                  setActiveBtn('saved')
                }}
                className={`${activeBtn === 'saved'  ? activeBtnStyles : notActiveBtnStyles}`}
              >
                Saved
              </button>
            </div>
            {pins ? (
              <div className='px-2'>
                <MasonryLayout pins={pins} />
              </div>
            ):(
              <div className='flex fustify-center font-bold items-center w-full text-xl mt-2'>
                No Posts Yet
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile
