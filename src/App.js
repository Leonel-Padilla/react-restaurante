import './App.css';
import { Route, Routes, useNavigate} from 'react-router-dom';
import { Button} from '@nextui-org/react'
import Empleado from './Componentes/Empleado/Empleado'
import Proveedor from './Componentes/Proveedor/Proveedor'
import Cargo from './Componentes/Cargo/Cargo'
import Sidebar from './Componentes/Login_Menu/Sidebar';
import MenuLogin from './Componentes/Login_Menu/MenuLogin';
import Sucursal from './Componentes/Sucursal/Sucursal';
import Cliente from './Componentes/Cliente/Cliente';
import Insumo from './Componentes/Insumo/Insumo'
import Mesa from './Componentes/Mesa/Mesa'




function App() {
  const navigate = useNavigate()
  return (

    <div>
      
      {/*<div className='d-flex'>
        <Button onClick={()=>navigate('/Empleados')}>Empleado</Button>
        <Button onClick={()=>navigate('/Proveedores')}>Proveedor</Button>
        <Button onClick={()=>navigate('/Cargos')}>Cargo</Button>
        <Button onClick={()=>navigate('/MenuPrincipal')}>Menu</Button>
  </div>  */}

      <section>
        <Routes>
          <Route path='/' element={<MenuLogin></MenuLogin>}></Route>
          <Route path='/MenuPrincipal' element={<Sidebar></Sidebar>}></Route>
          <Route path='/Empleados/*' element={<Empleado></Empleado>}></Route>
          <Route path='/Proveedores/*' element={<Proveedor></Proveedor>}></Route>
          <Route path='/Cargos/*' element={<Cargo></Cargo>}></Route>
          <Route path='/Sucursales/*' element={<Sucursal></Sucursal>}></Route>
          <Route path='/Clientes/*' element={<Cliente></Cliente>}></Route>
          <Route path='/Insumos/*' element={<Insumo></Insumo>}></Route>
          <Route path='/Mesas/*' element={<Mesa></Mesa>}></Route>
        </Routes>
      </section>
    </div>
  );
}

export default App;
