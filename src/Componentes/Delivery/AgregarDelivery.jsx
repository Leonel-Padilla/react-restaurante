import React, {useEffect, useRef, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, Text,} from '@nextui-org/react'
import Swal from 'sweetalert2'
import moment from 'moment';

const endPointGetCliente          = 'http://127.0.0.1:8000/api/Cliente'
const endPointGetEmpleado         = 'http://127.0.0.1:8000/api/Empleado'
const endPointGetTipoEntrega      = 'http://127.0.0.1:8000/api/TipoEntrega'
const endPointGetOrdenEncabezado  = 'http://127.0.0.1:8000/api/OrdenEncabezado'
const endPointAddDelivaery        = 'http://127.0.0.1:8000/api/addDelivery'

function AgregarDelivery() {
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
    getAllClientes()
    getAllEmpleados()
    //getAllOrdenes()
  },[])

  
  //
  const activarModal = (titulo, mensajeModal)=>{
    setTituloModal(titulo)
    setMensajeModal(mensajeModal)
    setVisible(true)
  }
  //
  const getAllClientes = async () =>{
    const response = await axios.get(endPointGetCliente)

    const array = response.data.filter(cliente=> cliente.clienteNombre != 'Consumidor Final' )
    setClientes(array)
  }
  //
  const getAllEmpleados = async () =>{
    const response = await axios.get(endPointGetEmpleado)
    setEmpleados(response.data)
  }
  //
  const getAllOrdenes = async (id) =>{
    const response = await axios.get(endPointGetTipoEntrega)
    let entregaId = 0
    response.data.map(tipoEntrega=>{
      if (tipoEntrega.nombreTipoEntrega === 'Delivery'){
        entregaId = tipoEntrega.id
      }
    })

    const response1 = await axios.get(`${endPointGetOrdenEncabezado}E/${entregaId}`)

    const date2 = new Date()
    formatearClienteId(id)
    const array1 = response1.data.filter(orden => orden.clienteId == idCliente && (moment(orden.fechaHora).format("DD/MM/yy")) == moment(date2).format("DD/MM/yy"))
    
    setOrdenes(array1)
  }
  //
  const formatearClienteId = (id)=>{
    clientes.map(cliente=>{
      if(cliente.clienteNombre === id){
        idCliente = cliente.id
      }
    })
  }
  //
  const formatearEmpleadoId = ()=>{
    empleados.map(empleado=>{
      if(empleado.empleadoNombre === empleadoId){
        idEmpleado = empleado.id
      }
    })
  }
  //
  const registrar = async (e) =>{
    e.preventDefault()
    
    if (clienteId.includes('Seleccione') || empleadoId.includes('Seleccione') || ordenEncabezadoId.includes('Seleccione')){
      activarModal('Error', 'Debe seleccionar un cliente, un repartidor y la orden del delivery.')
    }else if (horaDespacho === '' || horaEntrega === '') {
      activarModal('Error', 'Debe seleccionar hora de entrega y hora de despacho.')
    }else{
      formatearClienteId(clienteId)
      formatearEmpleadoId()
      
      const date = new Date()
      const fechaHoy = `${date.getFullYear()}-${date.getMonth() < 9? '0':''}${date.getMonth()+1}-${date.getDate() < 10? '0':''}${date.getDate()}`

      const datos = ordenEncabezadoId.split(' ')

      const response = await axios.post(endPointAddDelivaery, {clienteId: idCliente, empleadoId: idEmpleado, 
      ordenEncabezadoId: datos[0], fechaEntrega: fechaHoy,  comentario: comentario, horaDespacho: horaDespacho, 
      horaEntrega: horaEntrega, estado: 1})

      //console.log(response.data)

      if(response.status != 200){
        activarModal('Error', response.data.Error)
      }else{
        (async ()=>{

          const {value: confirmacion} = await Swal.fire({
              title: 'Registro exitoso',
              text: `El delivery ha sido registrado con éxito.`,
              width: '410px',
              height: '800px',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#7109BF',
              background: 'black',
              color: 'white',
          })
  
          if (confirmacion){
            navigate('/Deliveries')
          }
      })()
        
      }
    }
  }

  return (
    <div>
      <Modal
      closeButton
      blur
      className='bg-dark text-white'
      open={visible}
      onOpen={()=>{console.log(mensajeModal)}}
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

      <form onSubmit={registrar} className='formulario'>

        <div className='atributo'>
          <label>Cliente</label>
          <select
          value={clienteId}
          onChange={(e)=>{
            setClienteId(e.target.value)
            getAllOrdenes(e.target.value)
          }}
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
          
          {ordenes.length < 1? 
            <input 
              readOnly
              value='Cliente sin ordenes'
              className='form-control'
            ></input>
          :
            <select
            value={ordenEncabezadoId}
            onChange={(e)=>{
              
              setOrdenEncabezadoId(e.target.value)
            }}
            className='select'> 
              <option>Seleccione una orden</option>

              {ordenes.map(orden=>
                <option key={orden.id}>{orden.id} - {orden.fechaHora}</option>)}
            </select>
          }


        </div>

        <div className='atributo'>
          <label>Comentario</label>
          <input
          value={comentario}
          placeholder='Al llegar toque el timbre.'
          onChange={(e)=>setComentario(e.target.value)}
          className='form-control'> 
          </input>
        </div>
        
        <div className='atributo'>
          <label htmlFor='horaDespacho'>Hora Despacho</label>
          <input
          id='horaDespacho'
          value={horaDespacho}
          onChange={(e)=>setHoraDespacho(e.target.value)}
          className='form-control'
          type='time'> 
          </input>
        </div>

        <div className='atributo'>
          <label htmlFor='horaEntrega'>Hora Entrega</label>
          <input
          id='horaEntrega'
          value={horaEntrega}
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

export default AgregarDelivery