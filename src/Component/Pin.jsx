import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { MdDownloadForOffline } from 'react-icons/md'
import { AiTwotoneDelete } from 'react-icons/ai'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'
import { urlFor, client } from '../client'
import { fetchUser } from '../utils/fetchUser'


const Pin = ({pin: {postedBy, _id, image, destination, save } }) => {

  const [postHovered, setPostHovered]=useState(false);
  const navigate = useNavigate();

  const userInfo=fetchUser();
  // console.log(userInfo);

  //as we know save is an array, so if we filter the array we get an array of itms in which item's id should be equal to user id
  //so we have to find the length of the filtered array to show if u have to save it or not
  //basically it will return 1 is our user is in the array of users who have saved this post, if not we will get 0
  //and the double exclamation mark will convert the value to boolean - 1 to true and 0 to false
  const tempAlreadySaved = !!(save?.filter((item) => item?.postedBy?._id===userInfo?.sub) )?.length
  // console.log(save);


  const deletePin = (id) => {
    client
      .delete(id)
      .then( () => {
        window.location.reload();
      })
  }

  const savePin = (id) => {
    //now we will update in the sanity database i.e. add the user id in the saved array of the post(pin)
    client
      .patch(id)          //  It is good practice to use patches when modifying Sanity documents through the API. 
                          //  Ideally, you make the smallest, most specific patch possible for your changes so that if multiple scripts or 
                          //  users are modifying the same documents at the same time, Sanity is able to merge those changes in a sensible way. 
      .setIfMissing( { save: [] } )    // setIfMissing is like set, except existing keys will be preserved and not overwritten.
      .insert("after", 'save[-1]' , [{            //  insert provides methods for modifying arrays, by inserting, appending and replacing elements via a JSONPath expression.
        _key: uuidv4(),
        userId : userInfo?.sub,
        postedBy : {
          _type : 'postedBy',
          _ref : userInfo?.sub
        }
      }])
      .commit()    //Commit the patch, returning a promise that resolves to the first patched document
      .then( () => {
        // window.location.reload();
      } )
      console.log(save)

  }
  

  return (
  
    <div  className='m-2'>
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/home/pin-detail/${_id}`) }
        className='relative cursor-zoom-in curson-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-200 ease-in-out  '
      >
        <img src={urlFor(image).width(250).url()} alt="user-post" className='rounded-lg w-full ' />
        {postHovered && (
          <div className='absolute top-0 h-full w-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-20' style={ {height:'100%'} }>
            <div className='flex items-center justify-between w-relative '>
              <div className='flex gap-2'>
                <a 
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={ (e) => e.stopPropagation()}
                  onMouseEnter={() => setPostHovered(true)}
                  onMouseLeave={() => setPostHovered(true)}
                  className='bg-white opacity-60 hover:opacity-90  w-9 h-9 rounded-full flex items-center justify-center text-dark text-xloutline-none transition-all duration-200'
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              { tempAlreadySaved ? 
                (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();}
                    }
                    type='button'  
                    className='bg-red-500 opacity-60 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none' 
                  >
                    {save?.length}Saved
                  </button>
                )
                :
                (
                  <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        savePin(_id);
                      } 
                    }
                    type='button'  
                    className='bg-red-500 opacity-60 hover:opacity-100 overflow-hidden text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none' 
                  >
                    Save
                  </button>  
                )
              }
            </div>
            <div className='flex items-center justify-between gap-2 w-full '>
              {destination && (
                <a 
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                      e.stopPropagation();
                    } 
                  }
                  className='bg-white flex items-center gap-2 hover:opacity-90 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-60 hover:shadow-md  '
                >
                  <BsFillArrowUpRightCircleFill />
    
                </a>
              )}
              {postedBy?._id === userInfo?.sub && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                    } 
                  }
                  type='button'  
                  className='bg-white opacity-70 hover:opacity-90 overflow-hidden font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'     
                >
                  <AiTwotoneDelete />
                </button>
              )
              }
            </div>            
          </div>
        )}
      </div>

      <Link
        to={`user-profile/${postedBy?._id}`}
        className='flex gap-2 mt-2 items-center'
      >
        <img
        className='w-8 h-8 rounded-full object-cover' 
          src={postedBy?.image} 
          alt="user-profile" 
        />
        <p className='font-semibold capitalize'>
          {postedBy?.userName}
        </p>
      </Link>

    </div>
  )
}

export default Pin
