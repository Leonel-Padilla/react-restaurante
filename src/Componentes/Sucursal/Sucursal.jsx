import {Routes, Route } from 'react-router-dom';
import MostrarSucursal from './MostrarSucursales'
import AgregarSucursal from './AgregarSucursal'
import ActualizarSucursal from './ActualizarSucursal'

const Sucursal = () => {
  return (
    <div>
        <Routes>
                <Route path='/' element={<MostrarSucursal></MostrarSucursal>}/>
                <Route path='/addSucursal' element={<AgregarSucursal></AgregarSucursal>}/>
                <Route path='/updateSucursal/:id' element={<ActualizarSucursal></ActualizarSucursal>}/>
        </Routes>
    </div>
  )
}

export default Sucursal

