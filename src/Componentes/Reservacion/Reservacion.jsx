import React from 'react'
import {Routes, Route } from 'react-router-dom';
import ActualizarReservacion from './ActualizarReservacion';
import AgregarReservacion from './AgregarReservacion'
import MostrarReservaciones from './MostrarReservaciones'

function Reservacion() {
  return (
    <div>
        <Routes>
            <Route path='/' element={<MostrarReservaciones></MostrarReservaciones>}/>
            <Route path='/addReservacion' element={<AgregarReservacion></AgregarReservacion>}/>
            <Route path='/updateReservacion/:id' element={<ActualizarReservacion></ActualizarReservacion>}/> 
        </Routes>
    </div>
  )
}

export default Reservacion