import React from 'react'
import {Routes, Route } from 'react-router-dom';
import ActualizarFactura from './ActualizarFactura';
import AgregarFactura from './AgregarFactura';
import MostrarFacturas from './MostrarFacturas';

function Factura() {
  return (
    <div>
        <Routes>
            <Route path='/' element={<MostrarFacturas></MostrarFacturas>}/>
            <Route path='/addFactura' element={<AgregarFactura></AgregarFactura>}/>
            <Route path='/updateFactura/:id' element={<ActualizarFactura></ActualizarFactura>}/>
        </Routes>
    </div>
  )
}

export default Factura