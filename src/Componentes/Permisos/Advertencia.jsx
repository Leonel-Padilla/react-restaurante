import { Button } from '@nextui-org/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Advertencia.css'


const Advertencia = () => {
  const navigate = useNavigate()
  return (
    <div className='container'>
      <div className='text'>¡No tiene permisos para acceder a esta página!</div>
      <Button onClick={() => navigate(-1)}>Regresar</Button>
    </div>
  )
}

export default Advertencia