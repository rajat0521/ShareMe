import React from 'react'
import { Hearts } from 'react-loader-spinner'

const Spinner = ({message}) => {
  return (
    <div className='flex flex-col justify-center items-center w-full h-full'>
      <Hearts 
        type="Circle"
        color="#00BFFF"
        height={50}
        width={200}
        className='m-5'
      />
      <p className='text-lg text-center px-20'>
        {message}
      </p>
    </div>
  )
}

export default Spinner



// Audio, BallTriangle, Bars, Blocks, Circles, CirclesWithBar, ColorRing, Comment, 
// Discuss, Dna, FallingLines, FidgetSpinner, Grid, Hearts, InfinitySpin, LineWave, MagnifyingGlass, 
// MutatingDots, Oval, ProgressBar, Puff, Radio, RevolvingDot, Rings, RotatingLines, RotatingSquare, 
// RotatingTriangles, TailSpin, ThreeCircles, ThreeDots, Triangle, Vortex, Watch