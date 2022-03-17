import {Routes, Route } from 'react-router-dom';
import MostrarClientes from './MostrarClientes'
import AgregarCliente from './AgregarCliente'
import ActualizarCliente from './ActualizarCliente'

const Cliente = () => {
  return (
    <div>
        <Routes>
                <Route path='/' element={<MostrarClientes></MostrarClientes>}/>
                <Route path='/addCliente' element={<AgregarCliente></AgregarCliente>}/>
                <Route path='/updateCliente/:id' element={<ActualizarCliente></ActualizarCliente>}/>
        </Routes>
    </div>
  )
}

export default Cliente

