import {Routes, Route } from 'react-router-dom';
import AgregarMesa from './AgregarMesa';
import MostrarMesas from './MostrarMesas';
import ActualizarMesa from './ActualizarMesa';


const Mesa = ()=>{
    return(
        <div>
             <Routes>
                <Route path='/' element={<MostrarMesas></MostrarMesas>}/>
                <Route path='/addMesa' element={<AgregarMesa></AgregarMesa>}/>
                <Route path='/updateMesa/:id' element={<ActualizarMesa></ActualizarMesa>}/>
            </Routes>
        </div>
    );
}
export default Mesa