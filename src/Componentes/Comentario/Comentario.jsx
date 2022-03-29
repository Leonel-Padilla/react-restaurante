import {Routes, Route } from 'react-router-dom';
import AgregarComentario from './AgregarComentario';
import ActualizarComentario from './ActualizarComentario';
import MostrarComentario from './MostrarComentario';

const Comentario = () =>{
    return (
        <div>
            <Routes>
                    <Route path='/' element={<MostrarComentario></MostrarComentario>}/>
                    <Route path='/addComentario' element={<AgregarComentario></AgregarComentario>}/>
                    <Route path='/updateComentario/:id' element={<ActualizarComentario></ActualizarComentario>}/>
            </Routes>
        </div>
      )
}

export default Comentario