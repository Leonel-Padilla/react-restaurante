import {Routes, Route } from 'react-router-dom';
import AgregarMesa from './AgregarMesa';
import MostrarMesas from './MostrarMesas';
import ActualizarMesa from './ActualizarMesa';
import { useLayoutEffect, useState } from 'react';
import axios from 'axios';
import Advertencia from '../Permisos/Advertencia'

const endPointGetPantallas      = 'http://127.0.0.1:8000/api/Pantalla'
const endPointGetRolesPantallas = 'http://127.0.0.1:8000/api/RolPantallaR'

const Mesa = ()=>{
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
    
      
        getAcceso(data, 'mesa')
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

    return(
        <div>
             <Routes>
                <Route path='/' element={Number(accesos.estado) === 0 ? <Advertencia/> : <MostrarMesas accesos={accesos}></MostrarMesas>}/>
                <Route path='/addMesa' element={Number(accesos.registrar) === 0 ? <Advertencia/> : <AgregarMesa></AgregarMesa>}/>
                <Route path='/updateMesa/:id' element={Number(accesos.actualizar) === 0 ? <Advertencia/> : <ActualizarMesa></ActualizarMesa>}/>
            </Routes>
        </div>
    );
}
export default Mesa