import React from 'react'
import { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';


import { client } from '../client';
import Spinner from './Spinner'
import { categories } from '../utils/data';



const CreatePin = ({ user }) => {
  // console.log(user);
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState('other');
  const [imageAsset, setImageAsset] = useState(undefined);
  const [wrongImageType, setWrongImageType] = useState(false);

  const navigate = useNavigate();

  const uploadImage = (e) => {
    
    const { type , name } = e.target.files[0];
    // console.log(type);
    // console.log(name);
    // console.log(e.target.files[0]);
    if(type === 'image/png' || type === 'image/svg' || type === 'image/gif' || type === "image/jpeg" || type === 'image/tiff' || type === "image/jpg"){
      setWrongImageType(false);
      setLoading(true);
      client.assets
        .upload("image", e.target.files[0], { contentType: type , filename : name} )
        .then( (doc) => {
          // console.log(doc);
          setImageAsset(doc);
          setLoading(false);
        })
        .catch((error) => {
          // console.log("error in image uploading ", error);
        })
    }else{
      setWrongImageType(true);
    }
    
  }
  const imgasstset = () => {
    setImageAsset(undefined);
  }

  const savePin = () => {
    
    if(title && imageAsset?._id && destination){
      const doc = {
        _type:'pin',
        title,
        about,
        destination,
        image : {
          _type:'image',
          asset : {
            _type: 'reference',
            _ref : imageAsset?._id
          }
        },
        userId: user?._id,
        postedBy : {
          _type: 'postedBy',
          _ref : user?._id
        },
        category
      }

      client.create(doc)
        .then(() => {
          navigate('/home');
        })
    }else{
      setFields(true);
      setTimeout(() => {setFields(false);}, 5000)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center mt-5 md:h-4/5  '> 
      {fields && (
        <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in' > Please fill in all the fields </p>
      )}
      <div className='flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full'>
        <div className='bg-secondaryColor p-3 flex flex-0.7 w-full'>
          <div className='flex flex-col justify-center items-center border-2 border-dotted border-gray-300 p-3 w-full h-420'>
            {loading && <Spinner />}
            {loading && (<p className='mb-40 text-gray-400' >Loading...</p>)}
            {wrongImageType && <p>Wrong Image Type</p>}
            {loading===false && imageAsset===undefined && (
              <label>
                <div className='flex flex-col justify-center items-center h-full'>
                  <div className='flex flex-col justify-center items-center'>
                    <p className='font-bold text-2xl'>
                      <AiOutlineCloudUpload />
                    </p>
                    <p className='text-lg'>
                      Click to upload 
                    </p>
                    <p className='mt-32 text-gray-400' >
                      Recommendationn: Use high quality PNG, SVG, JPG, GIF images less than 20 MB
                    </p>
                  </div>
                </div>
                <input 
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className='w-0 h-0' 
                />
              </label>
            )}
            {loading===false && imageAsset && (
              <div className='relative h-full'>
                <img 
                  src={imageAsset?.url} 
                  alt="uploaded-pic" 
                  className='h-full w-full'
                />
                <button
                  type='button'
                  onClick={ imgasstset } 
                  className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out '
                >
                  <MdDelete />
                </button>
              </div>
            )}  

          </div>
        </div>
        <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
          <input 
            value={title}
            type="text" 
            required={true}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Add your title here'
            className='outline-none text-2xl md:text-3xl font-bold border-b-2 border-gray-200 p-2 '
          />
          <input 
            value={about}
            type="text" 
            onChange={(e) => setAbout(e.target.value)}
            placeholder='Add description/about'
            className='outline-none text-sm md:text-3xl border-b-2 border-gray-200 p-2 '
          />
          <input 
            value={destination}
            type="text" 
            onChange={(e) => setDestination(e.target.value)}
            placeholder='Add a destination link'
            className='outline-none text-sm md:text-3xl border-b-2 border-gray-200 p-2 '
          />
          <div className='flex flex-col'>
            <div>
              <p className='mb-2 font-semibold text-lg sm:text-xl'>Choose Category</p>
              <select 
                name="" 
                id=""
                onChange={(e) => setCategory(e.target.value)}
                className='outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer '
              >
                <option value="other" className='bg-white'>Select category</option>
                {categories.map((category,i) => (
                  <option key={i} value={category.name} className='text-base border-0 outline-none capitalize bg-white text-black'>{category.name}</option>
                ))}
              </select>
            </div>
            <div className='flex justify-end items-end mt-5'>
              <button 
                type='button'
                onClick={savePin}
                className='bg-gray-500 text-white font-bold p-2 rounded-full w-28 outline-none'
              >
                Save
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePin