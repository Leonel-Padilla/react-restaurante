import './App.css';
import { Route, Routes, useNavigate} from 'react-router-dom';
import { Button} from '@nextui-org/react'
import Empleado from './Componentes/Empleado/Empleado'
import Proveedor from './Componentes/Proveedor/Proveedor'
import Cargo from './Componentes/Cargo/Cargo'
import Sidebar from './Componentes/Login_Menu/Sidebar';
import MenuLogin from './Componentes/Login_Menu/MenuLogin';



function App() {
  const navigate = useNavigate()
  return (

    <div>
      <section>
      <Routes>
          <Route path='/' element={<MenuLogin></MenuLogin>}></Route>
          <Route path='/MenuPrincipal' element={<Sidebar></Sidebar>}></Route>
          <Route path='/Empleados/*' element={<Empleado></Empleado>}></Route>
          <Route path='/Proveedores/*' element={<Proveedor></Proveedor>}></Route>
          <Route path='/Cargos/*' element={<Cargo></Cargo>}></Route>
      </Routes>
    </section>
    
    </div>   
  
  );
}

export default App;
