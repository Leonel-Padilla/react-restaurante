import {Routes, Route } from 'react-router-dom';
import AgregarProducto from './AgregarProducto';
import ActualizarProducto from './ActualizarProducto';
import MostrarProducto from './MostrarProducto';
import { useLayoutEffect, useState } from 'react';
import axios from 'axios';
import Advertencia from '../Permisos/Advertencia'

const endPointGetPantallas      = 'http://127.0.0.1:8000/api/Pantalla'
const endPointGetRolesPantallas = 'http://127.0.0.1:8000/api/RolPantallaR'

const Producto = () =>{
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
    
      
        getAcceso(data, 'producto')
      }
    
      const getAcceso = (permisos = [], nombre) => {
        permisos.map(permiso => {
          if(permiso.nombrePantalla === nombre){
    
            setAccesos({
              estado    : permiso.estado, 
              registrar : permiso.registrar,
              buscar    : permiso.buscar,
              actualizar: permiso.actualizar,
              imprimirReportes: permiso.imprimirReportes,
              detalles : permiso.detalles
            })
    
          }
        })
      }
    return (
        <div>
            <Routes>
                <Route path='/' element={Number(accesos.estado) === 0 ? <Advertencia/> : <MostrarProducto accesos={accesos}></MostrarProducto>}/>
                <Route path='/addProducto' element={Number(accesos.registrar) === 0 ? <Advertencia/> : <AgregarProducto></AgregarProducto>}/>
                <Route path='/updateProducto/:id' element={Number(accesos.actualizar) === 0 ? <Advertencia/> : <ActualizarProducto></ActualizarProducto>}/>
            </Routes>
        </div>
      )
}

export default Producto