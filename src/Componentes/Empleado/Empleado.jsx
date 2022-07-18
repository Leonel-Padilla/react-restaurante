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
    if (!permisos.some(x => x.nombrePantalla === nombre)){
      setAccesos({
        estado    : 0, 
        registrar : 0,
        buscar    : 0,
        actualizar: 0,
        imprimirReportes: 0
      })
    }else{
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
  }

  return (
    <div>
      <Routes>
        <Route path='/' element={Number(accesos.estado) === 0 ? <Advertencia pagina={'Empleado'}/> : <MostrarEmpleados accesos={accesos} ></MostrarEmpleados>}/>
        <Route path='/addEmpleado' element={Number(accesos.registrar) === 0 ? <Advertencia pagina={'Empleado'}/> : <AgregarEmpleado></AgregarEmpleado>}/>
        <Route path='/updateEmpleado/:id' element={Number(accesos.actualizar) === 0 ? <Advertencia pagina={'Empleado'}/> : <ActualizarEmpleado></ActualizarEmpleado>}/>
      </Routes>
    </div>
  );

}
  
export default Empleado;