import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const ActualizarCompra = () =>{
    const navigate = useNavigate()
    const {id} = useParams()

  return (
    <div>ActualizarCompra {id}</div>
  )
}

export default ActualizarCompra