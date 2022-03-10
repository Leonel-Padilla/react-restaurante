import {Routes, Route } from 'react-router-dom';
import MostrarEmpleados from './MostrarEmpleados';
import AgregarEmpleado from './AgregarEmpleados'
import ActualizarEmpleado from './ActualizarEmpleado';


function Empleado() {

    return (
      <div>
          <Routes>
              <Route path='/' element={<MostrarEmpleados ></MostrarEmpleados>}/>
              <Route path='/addEmpleado' element={<AgregarEmpleado></AgregarEmpleado>}/>
              <Route path='/updateEmpleado/:id' element={<ActualizarEmpleado></ActualizarEmpleado>}/>
          </Routes>
      </div>
    );

  }
  
  export default Empleado;