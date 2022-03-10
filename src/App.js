import './App.css';
import { Route, Routes, useNavigate} from 'react-router-dom';
import { Button} from '@nextui-org/react'
import Empleado from './Componentes/Empleado/Empleado'
import Proveedor from './Componentes/Proveedor/Proveedor'
import Cargo from './Componentes/Cargo/Cargo'



function App() {
  const navigate = useNavigate()
  return (
    <div>
      {<div className='d-flex'>
        <Button onClick={()=>navigate('/Empleados')}>Empleado</Button>
        <Button onClick={()=>navigate('/Proveedores')}>Proveedor</Button>
        <Button onClick={()=>navigate('/Cargos')}>Cargo</Button>
        </div>  }

      <section>
        <Routes>
          <Route path='/' element={<h1>Aqui va el login</h1>}></Route>
          <Route path='/Empleados/*' element={<Empleado></Empleado>}></Route>
          <Route path='/Proveedores/*' element={<Proveedor></Proveedor>}></Route>
          <Route path='/Cargos/*' element={<Cargo></Cargo>}></Route>
        </Routes>
      </section>
    </div>
  );
}

export default App;
