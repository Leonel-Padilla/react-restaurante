import { Button } from '@nextui-org/react'
import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Advertencia.css'
import axios from 'axios'

const endPointAddLog = 'http://127.0.0.1:8000/api/Log'
const Advertencia = ({ pagina }) => {
  const navigate = useNavigate()

  useEffect(() => {
    addLog()
  }, [])

  const addLog = async () => {
    const response = await axios.post(endPointAddLog, {pagina, usuario: sessionStorage.getItem('userName')})
  }

  return (
    <div className='container'>
      <div className='text'>¡No tiene permisos para acceder a esta página!</div>
      <Button onClick={() => navigate(-1)}>Regresar</Button>
    </div>
  )
}

export default Advertencia