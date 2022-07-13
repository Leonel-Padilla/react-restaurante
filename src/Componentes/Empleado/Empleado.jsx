import {Routes, Route } from 'react-router-dom';
import MostrarEmpleados from './MostrarEmpleados';
import AgregarEmpleado from './AgregarEmpleados'
import ActualizarEmpleado from './ActualizarEmpleado';
import { useLayoutEffect, useState } from 'react';
import axios from 'axios';
import Advertencia from '../Permisos/Advertencia'

const endPointGetPantallas      = 'http://127.0.0.1:8000/api/Pantalla'
const endPointGetRolesPantallas = 'http://127.0.0.1:8000/api/RolPantallaR'
function Empleado() {
  const [accesos, setAccesos] = useState({})
  let pantallas = []

  useLayoutEffect(() => {
    getPantallas()
    getPermisos()
  }, [])

  const getPantallas = async () => {
    const response = await axios.get(endPointGetPantallas)
    pantallas = response.data
  }

  const getPermisos = async () => {
    const rolId = sessionStorage.getItem('rol')
    const response = await axios.get(`${endPointGetRolesPantallas}/${rolId}`)

    const data = response.data
    data.map(data => {
      pantallas.map(pantalla => {
        if(data.pantallaId === pantalla.id){
          data.nombrePantalla = pantalla.nombrePantalla
        }
      })
    })

  
    getAcceso(data, 'empleado')
  }

  const getAcceso = (permisos = [], nombre) => {
    permisos.map(permiso => {
      if(permiso.nombrePantalla === nombre){

        setAccesos({
          estado    : permiso.estado, 
          registrar : permiso.registrar,
          buscar    : permiso.buscar,
          actualizar: permiso.actualizar,
          imprimirReportes: permiso.imprimirReportes
        })

      }
    })
  }

  return (
    <div>
      <Routes>
        <Route path='/' element={Number(accesos.estado) === 0 ? <Advertencia/> : <MostrarEmpleados accesos={accesos} ></MostrarEmpleados>}/>
        <Route path='/addEmpleado' element={Number(accesos.registrar) === 0 ? <Advertencia/> : <AgregarEmpleado></AgregarEmpleado>}/>
        <Route path='/updateEmpleado/:id' element={Number(accesos.actualizar) === 0 ? <Advertencia/> : <ActualizarEmpleado></ActualizarEmpleado>}/>
      </Routes>
    </div>
  );

}
  
export default Empleado;