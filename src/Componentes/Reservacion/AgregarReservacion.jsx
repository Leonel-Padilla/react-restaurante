import React, {useEffect, useRef, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, Text,} from '@nextui-org/react'
import Swal from 'sweetalert2'

const endPointGetCliente          = 'http://127.0.0.1:8000/api/Cliente'
const endPointGetSucursal         = 'http://127.0.0.1:8000/api/Sucursal'
const endPointGetMesa             = 'http://127.0.0.1:8000/api/Mesa'
const endPointAddReservacion      = 'http://127.0.0.1:8000/api/addReservacion'
const endPointDeleteReservacion   = 'http://127.0.0.1:8000/api/deleteReservacion'
const endPointAddReservacionMesa  = 'http://127.0.0.1:8000/api/addReservacionMesa'
const endPointGetReservacionMesa  = 'http://127.0.0.1:8000/api/ReservacionMesa'
function AgregarReservacion() {
  const [clienteId, setClienteId]         = useState('Seleccione')
  let idCliente                           = ''
  const [sucursalId, setSucursalId]       = useState('Seleccione')
  let idSucursal                          = ''
  const [mesaId, setMesaId]               = useState('Seleccione')
  let idMesa                              = ''
  const [fecha, setFecha]                 = useState('')
  const [horaInicio, setHoraInicio]       = useState('')
  const [horaFinal, setHoraFinal]         = useState('')

  const [clientes, setClientes]           = useState([])
  const [sucursales, setSucursales]       = useState([])
  const [mesas, setMesas]                 = useState([])

  const [reservacionesMesa, setReservacionesMesa] = useState([])

  const navigate                          = useNavigate()
  const [mensajeModal, setMensajeModal]   = useState('')
  const [tituloModal, setTituloModal]     = useState('')
  const [visible, setVisible]             = useState(false)

  useEffect(()=>{
    getAllClientes()
    getAllSucursales()
  }, [])

  const date = new Date()
  const fechaHoy = `${date.getFullYear()}-${date.getMonth() < 9? '0':''}${date.getMonth()+1}-${date.getDate() < 10? '0':''}${date.getDate()}`

  //
  const activarModal = (titulo, mensajeModal)=>{
    setTituloModal(titulo)
    setMensajeModal(mensajeModal)
    setVisible(true)
  }
  //
  const getAllClientes = async () =>{
    const response = await axios.get(endPointGetCliente)
    
    const array = response.data.filter(cliente => cliente.clienteNombre != 'Consumidor Final')
    setClientes(array)
  }
  //
  const getAllSucursales = async () =>{
    const response = await axios.get(endPointGetSucursal)
    setSucursales(response.data)
    //console.log(response.data)
  }
  //
  const getAllMesas = async (id) =>{
    formatearSucursalId(id)

    const response = await axios.get(`${endPointGetMesa}N/${idSucursal}`)
    setMesas(response.data)
    //console.log(response.data)
  }
  //
  const getReservacionesMesa = async (id) =>{
    formatearMesaId(id)

    const response = await axios.get(`${endPointGetReservacionMesa}M/${idMesa}`)
    //console.log(response.data)
    setReservacionesMesa(response.data)
  }
  //
  const formatearSucursalId = (id)=>{
    sucursales.map(sucursal=>{
      if(sucursal.sucursalNombre === id){
        idSucursal = sucursal.id
      }
    })
  }
  //
  const formatearClienteId = ()=>{
    clientes.map(cliente=>{
      if(cliente.clienteNombre == clienteId){
        idCliente = cliente.id
      }
    })
  }
  //
  const formatearMesaId = (id)=>{
    mesas.map(mesa=>{
      if(mesa.numero == id){
        idMesa = mesa.id
      }
    })
  }
  //
  const registrar = async (e) =>{
    e.preventDefault()
    let horas = []

    reservacionesMesa.map(reservacionMesa=>{
      if(reservacionMesa.fecha == fecha){
        const date1 = new Date(`${reservacionMesa.fecha} ${reservacionMesa.horaInicio}`)
        const date2 = new Date(`${reservacionMesa.fecha} ${reservacionMesa.horaFinal}`)
        const horario = {horaInicio: date1.getHours(), horaFinal: date2.getHours()}
        horas.push(horario)
      }
    })

    const date1 = new Date(`${fechaHoy} ${horaInicio}`)
    const date2 = new Date(`${fechaHoy} ${horaFinal}`)

    const horaInicioActual = date1.getHours()
    const horaFinalActual = date2.getHours()


    /*console.log(horas)
    console.log(horaInicioActual, horaFinalActual)*/

    let contador = 0
    horas.map(horario=>{
      if (horaInicioActual >= horario.horaInicio && horaInicioActual < horario.horaFinal || 
        horaFinalActual > horario.horaInicio && horaFinalActual <= horario.horaFinal){
        contador++
      }

      if (horario.horaInicio >= horaInicioActual && horario.horaFinal < horaFinalActual|| 
        horario.horaInicio > horaInicioActual && horario.horaFinal <= horaFinalActual){
        contador++
      }

    })

    console.log(contador)

    if (clienteId.includes('Seleccione') || sucursalId.includes('Seleccione') || mesaId.includes('Seleccione')) {
      activarModal('Error', 'Debe seleccionar un cliente, un sucursal y una mesa')
    }else if(contador > 0){
      activarModal('Error', 'La mesa seleccionada está reservada en ese horario.')
    }else{
      formatearClienteId()
      formatearSucursalId(sucursalId)

      const response = await axios.post(endPointAddReservacion, {clienteId: idCliente, sucursalId: idSucursal,
      estado: 1})

      if (response.status != 200) {
        activarModal('Error', `${response.data.Error}`)
      }else{
        registrarReservacionMesa(response.data.id)
      }

    }

  }
  //
  const registrarReservacionMesa = async (id) =>{
    formatearMesaId(mesaId)
    const response = await axios.post(endPointAddReservacionMesa, {reservacionId: id, mesaId: idMesa, fecha: fecha,
    horaInicio: horaInicio, horaFinal: horaFinal, estado: 1})

    if (response.status != 200) {
      activarModal('Error', `${response.data.Error}`)

      const response1 = await axios.delete(`${endPointDeleteReservacion}/${id}`)
      console.log(response1.data)
    }else{
      (async ()=>{

        const {value: confirmacion} = await Swal.fire({
            title: 'Registro exitoso',
            text: `La reservacion ha sido registrado con éxito.`,
            width: '410px',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#7109BF',
            background: 'black',
            color: 'white',
        })

        if (confirmacion){
          navigate('/Reservaciones')
        }
      })()

      
    }
  }

  return (
    <div>
      <Modal
      closeButton
      blur
      className='bg-dark text-white'
      open={visible}
      onClose={()=>setVisible(false)}>
        <Modal.Header>
          <Text 
          h4
          className='text-white'>
            {tituloModal}
          </Text>
        </Modal.Header>
        <Modal.Body>
          {mensajeModal}
        </Modal.Body>

      </Modal>

      <div className='d-flex justify-content-center bg-dark mb-2'
      style={{backgroundColor: 'whitesmoke'}}>
        <h1 className='text-white'>Registrar Reservación</h1>
      </div>

      <form onSubmit={registrar} className='formulario'>

        <div className='atributo'>
          <label>Cliente</label>
          <select
          value={clienteId}
          onChange={(e)=>setClienteId(e.target.value)}
          className='select'> 
            <option>Seleccione un Cliente</option>

            {clientes.map(cliente=>
              <option key={cliente.id}>{cliente.clienteNombre}</option>)}
          </select>
        </div>

        <div className='atributo'>
          <label>Sucursal</label>
          <select
          value={sucursalId}
          onChange={(e)=>{
            getAllMesas(e.target.value)
            setSucursalId(e.target.value)
          }}
          className='select'> 
            <option>Seleccione una Sucursal</option>

            {sucursales.map(sucursal=>
              <option key={sucursal.id}>{sucursal.sucursalNombre}</option>)}
          </select>
        </div>
        
        {!sucursalId.includes('Seleccione')?
        <div className='atributo'>
          <label>Mesa</label>
          <select
          value={mesaId}
          onChange={(e)=>{
            getReservacionesMesa(e.target.value)
            setMesaId(e.target.value)
          }}
          className='select'> 
            <option>Seleccione una Mesa</option>

            {mesas.map(mesa=>
              <option key={mesa.id}>{mesa.numero}</option>)}
          </select>
        </div>
        :
        <div className='atributo'>
          <label>Mesa</label>
          <label
          className='form-control'>
            Debe elegir una Sucursal
          </label>
        </div>}

        <div className='atributo'>
          <label>Fecha Reservación</label>
          <input
          value={fecha}
          onChange={(e)=>setFecha(e.target.value)}
          className='form-control'
          min={fechaHoy}
          type='date'> 
          </input>
        </div>

        <div className='atributo'>
          <label>Hora Inicio</label>
          <input
          value={horaInicio}
          onChange={(e)=>{

            if (e.target.value.split(':')[1] > 0){
              activarModal('Error', 'Solo puede seleccionar horas en punto.')
            }else{
              setHoraInicio(e.target.value)
            }

          }}
          className='form-control'
          type='time'> 
          </input>
        </div>

        <div className='atributo'>
          <label>Hora Final</label>
          <input
          value={horaFinal}
          onChange={(e)=>{

            if (e.target.value.split(':')[1] > 0){
              activarModal('Error', 'Solo puede seleccionar horas en punto.')
            }else{
              setHoraFinal(e.target.value)
            }
            
          }}
          className='form-control'
          type='time'> 
          </input>
        </div>

        <div className='d-flex mt-2'>

          <Button 
          color={'gradient'}
          className='align-self-end me-3 ' 
          auto 
          onClick={()=>navigate('/Reservaciones')}
          ghost>
            Regresar
          </Button>

          <Button
          auto
          type='submit'
          color={'gradient'} 
          ghost>
            Guardar
          </Button>

        </div>
      </form>

    </div>
  )
}

export default AgregarReservacion