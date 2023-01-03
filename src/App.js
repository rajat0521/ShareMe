import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Home from './Container/Home'
import Login from './Component/Login'

const App = () => {

  return (
      <Routes>
        <Route  path='/' element={<Login />} />
        <Route  path='/*' element={<Home />} />
      </Routes>
    
  )
}

export default App