import React, {useEffect, useRef, useState} from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Modal, Text,} from '@nextui-org/react'

const endPointGetDelivery         = 'http://127.0.0.1:8000/api/Delivery'
const endPointGetCliente          = 'http://127.0.0.1:8000/api/Cliente'
const endPointGetEmpleado         = 'http://127.0.0.1:8000/api/Empleado'
const endPointGetOrdenEncabezado  = 'http://127.0.0.1:8000/api/OrdenEncabezado'
const endPointAddDelivaery        = 'http://127.0.0.1:8000/api/addDelivery'

function ActualizarDelivery() {
  const { id } = useParams()
  const [clienteId, setClienteId]                 = useState('Seleccione')
  let idCliente                                   = ''
  const [empleadoId, setEmpleadoId]               = useState('Seleccione')
  let idEmpleado                                  = ''
  const [ordenEncabezadoId, setOrdenEncabezadoId] = useState('Seleccione')
  let idOrdenEncabezado                           = ''
  const [fechaEntrega, setFechaEntrega]           = useState('')
  const [horaDespacho, setHoraDespacho]           = useState('')
  const [comentario, setComentario]               = useState('')
  const [horaEntrega, setHoraEntrega]             = useState('')

  const [clientes, setClientes]   = useState([])
  const [empleados, setEmpleados] = useState([])
  const [ordenes, setOrdenes]     = useState([])

  const navigate                          = useNavigate()
  const [mensajeModal, setMensajeModal]   = useState('')
  const [tituloModal, setTituloModal]     = useState('')
  const [visible, setVisible]             = useState(false)

  useEffect(()=>{
    getDelivery()
  },[])

  //
  const activarModal = (titulo, mensajeModal)=>{
    setTituloModal(titulo)
    setMensajeModal(mensajeModal)
    setVisible(true)
  }
  //
  const getDelivery = async () =>{
    const response = await axios.get(`${endPointGetDelivery}/${id}`)

    const response1 = await axios.get(endPointGetCliente)
    setClientes(response1.data)

    response1.data.map(cliente => {
      if(cliente.id == response.data.clienteId){
        setClienteId(cliente.clienteNombre)
      }
    })

    const response2 = await axios.get(endPointGetEmpleado)
    setEmpleados(response2.data)

    response2.data.map(empleado => {
      if(empleado.id == response.data.empleadoId){
        setEmpleadoId(empleado.empleadoNombre)
      }
    })

    const response3 = await axios.get(endPointGetOrdenEncabezado)
    setOrdenes(response3.data)

    /*response3.data.map(orden => {
      if(orden.id == response.data.ordenEncabezadoId){
        setOrdenEncabezadoId(orden.id)
      }
    })*/

    setOrdenEncabezadoId(response.data.ordenEncabezadoId)
    setComentario(response.data.comentario)
    setHoraDespacho(response.data.horaDespacho)
    setHoraEntrega(response.data.horaEntrega)
  }
  //
  const actualizar = async () =>{

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
        <h1 className='text-white'>Registrar Delivery</h1>
      </div>

      <form onSubmit={actualizar} className='formulario'>

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
          <label>Repartidor</label>
          <select
          value={empleadoId}
          onChange={(e)=>setEmpleadoId(e.target.value)}
          className='select'> 
            <option>Seleccione un Repartidor</option>

            {empleados.map(empleado=>
              <option key={empleado.id}>{empleado.empleadoNombre}</option>)}
          </select>
        </div>

        <div className='atributo'>
          <label>Orden</label>
          <select
          value={ordenEncabezadoId}
          onChange={(e)=>setOrdenEncabezadoId(e.target.value)}
          className='select'> 
            <option>Seleccione una orden</option>

            {ordenes.map(orden=>
              <option key={orden.id}>{orden.id}</option>)}
          </select>
        </div>

        <div className='atributo'>
          <label>Comentario</label>
          <input
          value={comentario == null? '': comentario}
          onChange={(e)=>setComentario(e.target.value)}
          className='form-control'> 
          </input>
        </div>
        
        <div className='atributo'>
          <label>Hora Despacho</label>
          <input
          value={horaDespacho == null? '': horaDespacho}
          onChange={(e)=>setHoraDespacho(e.target.value)}
          className='form-control'
          type='time'> 
          </input>
        </div>

        <div className='atributo'>
          <label>Hora Entrega</label>
          <input
          value={horaEntrega == null? '': horaEntrega}
          onChange={(e)=>setHoraEntrega(e.target.value)}
          className='form-control'
          type='time'> 
          </input>
        </div>


        <div className='d-flex mt-2'>

          <Button 
          color={'gradient'}
          className='align-self-end me-3 ' 
          auto 
          onClick={()=>navigate('/Deliveries')}
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

export default ActualizarDelivery