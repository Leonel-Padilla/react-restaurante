import {Routes, Route } from 'react-router-dom';
import Permisos from './Permisos'
import AgregarPermiso from './AgregarPermiso'

const Permiso = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Permisos></Permisos>}/>
        <Route path='/addPermiso' element={<AgregarPermiso></AgregarPermiso>}/>
      </Routes>
    </div>
  )
}

export default Permiso