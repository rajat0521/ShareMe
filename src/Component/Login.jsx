import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png'
import jwt_decode from "jwt-decode";

import { GoogleLogin } from '@react-oauth/google';
import { client } from '../client';
import { GoogleOAuthProvider } from '@react-oauth/google';

// const USER = require('../../../server/models/user');


const Login = () => {
  const navigate = useNavigate();

  const responseGoogle= async (response) =>{
    localStorage.setItem('user',JSON.stringify(response.credential) );
    var decoded = await jwt_decode(response.credential);
    // console.log(decoded)
    const name = decoded.given_name;
    const googleId=decoded.sub;
    const imageUrl=decoded.picture;

    const doc ={
      _id:googleId,
      _type:'user',
      userName:name,
      image:imageUrl
    }

    await client.createIfNotExists(doc)
      .then(() => {
        navigate('/home', { replace:true})
      })
  }
  
  return (
    <div className="flex justify-start items-center flex-col h-screen" >
      <div className="relative h-full w-full">
        <video 
          src={ shareVideo }
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay '>
          <div className="p-5">
            <img src={logo} width="130px" alt="logo" />
            <div className='shadow-2xl mt-5'>
              <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}>
                <GoogleLogin
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy="single_host_origin"
                    hasAccess
                  />
              </GoogleOAuthProvider>
                
            </div>
          </div>

        </div>
  
      </div>

      

    </div>
  )
}

export default Login
