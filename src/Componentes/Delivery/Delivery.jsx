import React from 'react'
import {Routes, Route } from 'react-router-dom';
import ActualizarDelivery from './ActualizarDelivery';
import AgregarDelivery from './AgregarDelivery'
import MostrarDeliveries from './MostrarDeliveries'

function Delivery() {
  return (
    <div>
        <Routes>
            <Route path='/' element={<MostrarDeliveries></MostrarDeliveries>}/>
            <Route path='/addDelivery' element={<AgregarDelivery></AgregarDelivery>}/>
            <Route path='/updateDelivery/:id' element={<ActualizarDelivery></ActualizarDelivery>}/> 
        </Routes>
    </div>
  )
}

export default Delivery