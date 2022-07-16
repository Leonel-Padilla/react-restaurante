import React from 'react'
import {Routes, Route } from 'react-router-dom';
import ActualizarFactura from './ActualizarFactura';
import AgregarFactura from './AgregarFactura';
import MostrarFacturas from './MostrarFacturas';
import { useLayoutEffect, useState } from 'react';
import axios from 'axios';
import Advertencia from '../Permisos/Advertencia'


const endPointGetPantallas      = 'http://127.0.0.1:8000/api/Pantalla'
const endPointGetRolesPantallas = 'http://127.0.0.1:8000/api/RolPantallaR'

function Factura() {
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

  
    getAcceso(data, 'factura')
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
          detalles: permiso.detalles,
          reimprimir: permiso.reimprimir
        })

      }
    })
  }
  return (
    <div>
      <Routes>
        <Route path='/' element={Number(accesos.estado) === 0 ? <Advertencia/> : <MostrarFacturas accesos={accesos}></MostrarFacturas>}/>
        <Route path='/addFactura' element={Number(accesos.registrar) === 0 ? <Advertencia/> : <AgregarFactura></AgregarFactura>}/>
        <Route path='/updateFactura/:id' element={Number(accesos.actualizar) === 0 ? <Advertencia/> : <ActualizarFactura></ActualizarFactura>}/>
      </Routes>
    </div>
  )
}

export default Factura