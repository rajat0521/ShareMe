import React from 'react'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { client } from '../client';
import { urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailQuery } from '../utils/data';
import { pinDetailMorePinQuery } from '../utils/data';
import Spinner from './Spinner';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';



const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null)
  const [pinDetail, setPinDetail] = useState(null)
  const [comment, setComment] = useState('')
  const [addingComment, setAddingComment] = useState(false)
  const { pinId } = useParams();
  const navigate = useNavigate();
  // console.log(pinId);
  // console.log(user);

 

  const fetchPinDetail = () => {
    const query = pinDetailQuery(pinId);
    if(query){
      client.fetch(query)
      .then((data) => {
        setPinDetail(data[0]);//bcz it return an array of pins
        // console.log(data[0]);
        if(data[0]){
          const q=pinDetailMorePinQuery(data[0]);
          client.fetch(q)
          .then((res) => {
            setPins(res);
            // console.log(res)
          })
        }
      })
    }
  }
  useEffect(() => {
    fetchPinDetail();
  }, [pinId])
  

  if(!pinDetail)return <Spinner message="Loading Post Details....."  />
  console.log(pinDetail);


  const addComment = () => {
    if(comment){
      // console.log(comment)
      setAddingComment(true);
      client
        .patch(pinId)
        .setIfMissing({ comments:[] })
        .insert('after', 'comments[-1]', [{
          comment,
          _key: uuidv4(),
          postedBy : {
            _type:'postedBy',
            _ref: user._id
          }
        }])
        .commit()
        .then(() => {
          fetchPinDetail();
          setComment('');
          setAddingComment(false);
          console.log(' sceesssfull')
        }) 
    }
  }

  return (
    <>
      <div className='flex xl-flex-row flex-col m-auto bg-white' style={{maxWidth:'1500px', borderRadius: '32px'}}>
        <div className='flex justify-center items-center md:items-start flex-initial '>
          <img 
            src={pinDetail?.image && urlFor(pinDetail?.image).url()} 
            // src={pinDetail?.image.asset.url} 
            // we can do it by either way using sanity's function for displaying images or direct provide url from pinDetail.image.asset.url
            alt="user-post" 
            className='rounded-3xl h-370 2xl:h-510'
          />
        </div>

        <div className='w-full p-5 flex-1 xl:min-w-620'>
          <div className='flex items-center justify-between'>
            <div className='flex gap-2 items-center'>
              {/* <a 
                href={`${pinDetail?.image?.asset?.url}?dl=`}
                download
                onClick={ (e) => e.stopPropagation()}
                className='bg-white opacity-60 hover:opacity-90  w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl outline-none transition-all duration-200'
              >
                <MdDownloadForOffline />
              </a> */}
            </div>
            {/* <a 
              href={pinDetail.destination}
              target='blank'
              rel='noreferrer'
            >
              <BsFillArrowUpRightCircleFill />
            </a> */}
          </div>
          <div>
            <h1 className='text-4xl font-bold break-words mt-3'>
              {pinDetail?.title}
            </h1>
            <p>
              {pinDetail?.about}
            </p>
          </div>

          <button
            className='flex gap-2 mt-2 items-center'
            onClick={() => navigate(`/home/user-profile/${pinDetail?.postedBy?._id}`)}
          >
            <img
              className='w-8 h-8 rounded-full object-cover' 
              src={pinDetail?.postedBy?.image} 
              alt="user-profile" 
            />
            <p className='font-semibold capitalize'>
              {pinDetail?.postedBy?.userName}
            </p>
          </button>
          {/* <Link
            to={`user-profile/${pinDetail?.postedBy?._id}`}   
            className='flex gap-2 mt-2 items-center'
          >
            <img
              className='w-8 h-8 rounded-full object-cover' 
              src={pinDetail?.postedBy?.image} 
              alt="user-profile" 
            />
            <p className='font-semibold capitalize'>
              {pinDetail?.postedBy?.userName}
            </p>
          </Link> */}

          <h2 className='mt-5 text-2xl'> Comments </h2>
          <div className='max-h-370 overflow-y-auto'>
            {pinDetail?.comments?.map( (comment, i) => (
              <div className='flex gap-2 mt-5 items-center bg-white rounded-lg ' key={i}>
                <img 
                  src={comment?.postedBy?.image} alt="user-profile" 
                  className='w-10 h-10 rounded-full cursor-pointer'
                  onClick={() => navigate(`/home/user-profile/${user?._id}`)} 
                />
                <div className='flex flex-col'>
                  <p className='font-bold'> {comment?.postedBy?.userName} </p>
                  <p className=''> {comment?.comment} </p>
                </div>
              </div>
            ))}
          </div>
          <div className='flex flex-wrap gap-3 mt-6'>

              {/* we can use either Link or button to show user profile image which will redirect us to user profile page */}
            <button
              className='flex gap-2 mt-2 items-center'
              onClick={() => navigate(`/home/user-profile/${user?._id}`)}
            >
              <img className='w-8 h-8 rounded-full object-cover' src={user?.image} alt="user-profile" />
            </button>
          {/* <Link className='flex gap-2 mt-2 items-center' onClick={() => navigate(`/home/user-profile/${pinDetail?.postedBy?._id}`)} >
            <img className='w-8 h-8 rounded-full object-cover' src={pinDetail?.postedBy?.image} alt="user-profile" />
          </Link> */}


          <input 
            type="text"
            placeholder='Add a Comment'
            value={comment} 
            className='flex-1 border-gray-00 outline-none border-2 p-2 focus:border-gray-00 border rounded-xl'
            onChange={ (e) => setComment(e.target.value) }
          />
          <button
            type='button'
            className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
            onClick={addComment}
          >
            {addingComment ? 'Posting the Comment': 'Post' }
          </button>
          </div>
        </div>
      </div>
      {
        pins ? 
        (
          <>
            <h2 className='text-center font-bold text-2xl mt-8 mb-4'>
              More Like This 
            </h2>
            <MasonryLayout pins={pins} />
          </>
        )
        : 
        (
          <>
          <Spinner message="Loading..." />
          </>
        )
      }
    </>
    
    
  )
}

export default PinDetail
