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
import Compra from './Componentes/Compra/Compra'
import Comentario from './Componentes/Comentario/Comentario';
import Producto from './Componentes/Producto/Producto';
import Factura from './Componentes/Factura/Factura';
import Impuesto from './Componentes/Impuesto/Impuesto';
import Delivery from './Componentes/Delivery/Delivery';
import Reservacion from './Componentes/Reservacion/Reservacion';




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
          <Route path='/Sucursales/*' element={<Sucursal></Sucursal>}></Route>
          <Route path='/Clientes/*' element={<Cliente></Cliente>}></Route>
          <Route path='/Insumos/*' element={<Insumo></Insumo>}></Route>
          <Route path='/Mesas/*' element={<Mesa></Mesa>}></Route>
          <Route path='/Compras/*' element={<Compra></Compra>}></Route>
          <Route path='/Comentarios/*' element={<Comentario></Comentario>}></Route>
          <Route path='/Productos/*' element={<Producto></Producto>}></Route>
          <Route path='/Facturas/*' element={<Factura></Factura>}></Route>
          <Route path='/Impuestos/*' element={<Impuesto></Impuesto>}></Route>
          <Route path='/Deliveries/*' element={<Delivery></Delivery>}></Route>
          <Route path='/Reservaciones/*' element={<Reservacion></Reservacion>}></Route>
        </Routes>
      </section>
    </div>
  );
}

export default App;
