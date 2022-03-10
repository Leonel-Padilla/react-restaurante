import {Routes, Route } from 'react-router-dom';
import MostrarCargos from './MostrarCargos'
import AgregarCargo from './AgregarCargo'
import ActualizarCargo from './ActualizarCargo'

const Cargo = () => {
  return (
    <div>
        <Routes>
                <Route path='/' element={<MostrarCargos></MostrarCargos>}/>
                <Route path='/addCargo' element={<AgregarCargo></AgregarCargo>}/>
                <Route path='/updateCargo/:id' element={<ActualizarCargo></ActualizarCargo>}/>
        </Routes>
    </div>
  )
}

export default Cargo

