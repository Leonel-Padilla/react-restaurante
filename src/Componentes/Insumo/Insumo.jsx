import {Routes, Route } from 'react-router-dom';
import AgregarInsumo from './AgregarInsumo';
import ActualizarInsumo from './ActualizarInsumo';
import MostrarInsumo from './MostrarInsumo';

const Insumo = () =>{
    return (
        <div>
            <Routes>
                <Route path='/' element={<MostrarInsumo></MostrarInsumo>}/>
                <Route path='/addInsumo' element={<AgregarInsumo></AgregarInsumo>}/>
                <Route path='/updateInsumo/:id' element={<ActualizarInsumo></ActualizarInsumo>}/>
            </Routes>
        </div>
    );
}

export default Insumo