import React from 'react'
import {Routes, Route } from 'react-router-dom';
import AgregarCompra from './AgregarCompra'
import MostrarCompras from './MostrarCompras'


const Compra = () => {
  return (
    <div>
        <Routes>
                <Route path='/' element={<MostrarCompras></MostrarCompras>}/>
                <Route path='/addCompra' element={<AgregarCompra></AgregarCompra>}/>
                {/* <Route path='/updateCliente/:id' element={<ActualizarCliente></ActualizarCliente>}/> */}
        </Routes>
    </div>
  )
}

export default Compra