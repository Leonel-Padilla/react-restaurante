import React from 'react'
import {Routes, Route } from 'react-router-dom';
import AgregarImpuesto from './AgregarImpuesto';
import MostrarImpuestos from './MostrarImpuestos';
import ActualizarImpuesto from './ActualizarImpuesto';

function Impuesto() {
  return (
    <div>
    <Routes>
        <Route path='/' element={<MostrarImpuestos></MostrarImpuestos>}/>
        <Route path='/addImpuesto' element={<AgregarImpuesto></AgregarImpuesto>}/>
        <Route path='/updateImpuesto/:id' element={<ActualizarImpuesto></ActualizarImpuesto>}/>
    </Routes>
</div>
  )
}

export default Impuesto