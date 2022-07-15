import React from 'react'
import {Routes, Route } from 'react-router-dom';
import ActualizarReservacion from './ActualizarReservacion';
import AgregarReservacion from './AgregarReservacion'
import MostrarReservaciones from './MostrarReservaciones'
import { useLayoutEffect, useState } from 'react';
import axios from 'axios';
import Advertencia from '../Permisos/Advertencia'


const endPointGetPantallas      = 'http://127.0.0.1:8000/api/Pantalla'
const endPointGetRolesPantallas = 'http://127.0.0.1:8000/api/RolPantallaR'
function Reservacion() {
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

  
    getAcceso(data, 'reservacion')
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
        <Route path='/' element={Number(accesos.estado) === 0 ? <Advertencia/> : <MostrarReservaciones accesos={accesos}></MostrarReservaciones>}/>
        <Route path='/addReservacion' element={Number(accesos.registrar) === 0 ? <Advertencia/> : <AgregarReservacion></AgregarReservacion>}/>
        <Route path='/updateReservacion/:id' element={Number(accesos.actualizar) === 0 ? <Advertencia/> : <ActualizarReservacion></ActualizarReservacion>}/> 
      </Routes>
    </div>
  )
}

export default Reservacion