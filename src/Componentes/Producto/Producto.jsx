import {Routes, Route } from 'react-router-dom';
import AgregarProducto from './AgregarProducto';
import ActualizarProducto from './ActualizarProducto';
import MostrarProducto from './MostrarProducto';

const Producto = () =>{
    return (
        <div>
            <Routes>
                    <Route path='/' element={<MostrarProducto></MostrarProducto>}/>
                    <Route path='/addProducto' element={<AgregarProducto></AgregarProducto>}/>
                    <Route path='/updateProducto/:id' element={<ActualizarProducto></ActualizarProducto>}/>
            </Routes>
        </div>
      )
}

export default Producto