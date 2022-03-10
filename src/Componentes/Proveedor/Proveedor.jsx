import {Routes, Route } from 'react-router-dom';
import ActualizarProveedor from './ActualizarProveedor';
import AgregarProveedor from './AgregarProveedor';
import MostrarProveedores from './MostrarProveedores'


const Proveedor = ()=>{
    return (
        <div>
            <Routes>
                <Route path='/' element={<MostrarProveedores></MostrarProveedores>}/>
                <Route path='/addProveedor' element={<AgregarProveedor></AgregarProveedor>}/>
                <Route path='/updateProveedor/:id' element={<ActualizarProveedor></ActualizarProveedor>}/>
            </Routes>
        </div>
      );
}

export default Proveedor