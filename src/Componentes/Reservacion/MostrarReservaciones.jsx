import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Input,Tooltip, Modal, Text, } from '@nextui-org/react';
import buscarLupa from '../../img/buscar_lupa.png';
import lapizEditar from '../../img/lapiz_editar.png'
import moment from 'moment';

const endPointGetCliente          = 'http://127.0.0.1:8000/api/Cliente'
const endPointGetMesa             = 'http://127.0.0.1:8000/api/Mesa'
const endPointGetReservacion      = 'http://127.0.0.1:8000/api/Reservacion'
const endPointUpdateReservacion   = 'http://127.0.0.1:8000/api/updateReservacion'
const endPointGetReservacionMesa  = 'http://127.0.0.1:8000/api/ReservacionMesa'
function MostrarReservaciones() {
  const [clientes, setClientes]           = useState([])
  let idCliente                           = ''
  let nombreCliente                       = ''
  const [mesas, setMesas]                 = useState([])
  let numeroMesa                          = ''

  const [reservacionActual, setReservacionActual] = useState([])
  const [reservaciones, setReservaciones]           = useState([])
  const [reservacionesMesa, setReservacionesMesa]   = useState([])
  const [parametroBusqueda, setParametroBusqueda]   = useState('Seleccione')
  const [valorBusqueda, setValorBusqueda]           = useState('Seleccione')

  const navigate = useNavigate()
  const [mensajeModal, setMensajeModal]   = useState('')
  const [tituloModal, setTituloModal]     = useState('')
  const [visible, setVisible]             = useState(false)

  useEffect(() => {
    getAllReservaciones()
    getAllReservacionesMesa()
    getAllClientes()
    getAllMesas()
  },[])

  //
  const activarModal = (titulo, mensajeModal)=>{
    setTituloModal(titulo)
    setMensajeModal(mensajeModal)
    setVisible(true)
  }
  //
  const formatearClienteId = (id)=>{
    clientes.map((cliente)=>{
      if(cliente.id === id){
        nombreCliente = cliente.clienteNombre
      }
    })
  }
  //
  const formatearMesaId = (id)=>{
    mesas.map((mesa)=>{
      if(mesa.id === id){
        numeroMesa = mesa.numero
      }
    })
  }
  //
  const formataerClienteNombre = ()=>{
    clientes.map((cliente)=>{
      if(cliente.clienteNombre === valorBusqueda){
        idCliente = cliente.id
      }
    })
  }
  //
  const getByValorBusqueda = async (e)=>{
    e.preventDefault()
  
    if (parametroBusqueda.includes('Seleccione')){
      activarModal('Error', 'Seleccione un parametro de busqueda.')
    }else{
  
      if (parametroBusqueda == 'ID'){
        const response = await axios.get(`${endPointGetReservacion}/${valorBusqueda}`)
        //console.log(response.data)
                
        if (response.status != 200){
          activarModal('Error', `${response.data.Error}`)
        }else{
          const array = [response.data]
          setReservaciones(array)
        }
                
      }else{

        if (valorBusqueda.includes('Seleccione')){
          activarModal('Error', 'Seleccione un cliente para la busqueda.')
        }else{
          formataerClienteNombre()
          const response = await axios.get(`${endPointGetReservacion}C/${idCliente}`)
          const array = response.data
          
          if (array.length < 1){
            activarModal('Error', 'No hay reservaciones para el cliente ingresado.')
          }else{
          setReservaciones(array)
          }
        }

      }
    } 
  }
  //
  const cambioEstado = async ()=>{
    reservacionActual.estado = reservacionActual.estado === 1 ? 0 : 1

    const response = await axios.put(`${endPointUpdateReservacion}/${reservacionActual.id}`, reservacionActual)
    //console.log(response.data)

    getAllReservaciones()
    getAllReservacionesMesa()

  }
  //
  const getAllReservaciones = async () => {
    const response = await axios.get(endPointGetReservacion)
    setReservaciones(response.data)
  }
  //
  const getAllReservacionesMesa = async () => {
    const response = await axios.get(endPointGetReservacionMesa)
    setReservacionesMesa(response.data)
  }
  //
  const getAllClientes = async () => {
    const response = await axios.get(endPointGetCliente)
    setClientes(response.data)
  }
  //
  const getAllMesas = async () => {
    const response = await axios.get(endPointGetMesa)
    setMesas(response.data)
  }


  return (
    <div>
      <Modal
      closeButton
      blur
      preventClose
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
          {tituloModal.includes('Error')?     //IF ERROR
            mensajeModal
          :                                   //ELSE ELIMINAR
            <div>
              {mensajeModal}

              <div className='d-flex mt-3'>
                <Button
                className='me-3 ms-5'
                auto
                onClick={()=>{
                  setVisible(false)
                }}>
                  Cancelar
                </Button>

                <Button
                className='ms-5'
                auto
                onClick={()=>{
                  cambioEstado()
                  setVisible(false)
                }}>
                  Cambiar
                </Button>
              </div>
            </div>}
        </Modal.Body>
      </Modal>

      <div className='d-flex justify-content-start pt-2 pb-2' style={{backgroundColor: 'whitesmoke'}} >
        <h1 className='ms-4 me-4' >Reservaciones</h1>

        <select style={{height: '35px'}} 
        className='align-self-center me-2'
        onChange={(e)=>{
          setParametroBusqueda(e.target.value)
          setValorBusqueda('Seleccione')
          }}>   
          <option>Seleccione tipo busqueda</option>
          <option>ID</option>
          <option>Cliente</option>
        </select>

        {/*------Fomulario de busqueda*/}
        <form
        className='d-flex align-self-center'
        style={{left: '300px'}}
        onSubmit={getByValorBusqueda}>
          
          {parametroBusqueda == 'Cliente'?
            <select
            className='select'
            value={valorBusqueda}
            onChange={(e)=>setValorBusqueda(e.target.value)}>
              <option>Seleccione cliente</option>
              {clientes.map((cliente)=> 
                <option key={cliente.id}> {cliente.clienteNombre}</option>
              )}
            </select>
          :
            <input
            placeholder={parametroBusqueda.includes('Seleccione')? '': `${parametroBusqueda}`}
            aria-label='aria-describedby'
            onChange={(e)=>setValorBusqueda(e.target.value)}
            type={parametroBusqueda == 'ID'? 'number':'text'}
            className='form-control me-2'
            required={true}
            title=''/>
          }

          <Button
          auto
          className='ms-2'
          color={'gradient'}
          icon={<img src={buscarLupa}/>}
          type={'submit'}>
            Buscar
          </Button>
        </form>

        <Button 
        color={'gradient'}
        bordered
        className='align-self-center ms-2 me-2' 
        auto onClick={()=>navigate('/MenuPrincipal')}>
          Regresar
        </Button>

        <Button
        auto
        color={"gradient"}
        bordered
        className='align-self-center me-2'
        onClick={()=>getAllReservaciones()}>
          Llenar Tabla
        </Button>

        <Button 
        className='bg-dark text-light align-self-center'
        color={'dark'}
        bordered
        onClick={()=>navigate('/Reservaciones/addReservacion')}>
          Registrar  
        </Button>
      </div>

      <table className='table mt-2'> 
        <thead className='bg-dark text-white'> 
          <tr>
            <th>Id</th>
            <th>Cliente</th>
            <th>Mesa</th>
            <th>Fecha Reservación</th>
            <th>Hora Inicio</th>
            <th>Hora Final</th>
            <th>Estado</th>
            <th>Opciones</th>
          </tr>
        </thead>
                
        <tbody>
          {reservaciones.map(reservacion => {

            let reservacionMesaActual = {}

            reservacionesMesa.map(reservacionMesa => {
              if (reservacion.id == reservacionMesa.reservacionId){
                reservacionMesaActual = reservacionMesa
              }
            })

            formatearClienteId(reservacion.clienteId)
            formatearMesaId(reservacionMesaActual.mesaId)


            return(
              <tr key={reservacion.id}>
                <td>{reservacion.id}</td>
                <td>{nombreCliente}</td>
                <td>{numeroMesa}</td>
                <td>{reservacionMesaActual.fecha}</td>
                <td>{reservacionMesaActual.horaInicio}</td>
                <td>{reservacionMesaActual.horaFinal}</td>
                <td>{reservacion.estado == 1? 'Habilitado': 'Deshabilitado'}</td>
                <td>
                  <Button
                  className='mb-1'
                  color={'gradient'}
                  iconRight={<img src={lapizEditar}/>}
                  onClick={()=>navigate(`/Reservaciones/updateReservacion/${reservacion.id}`)}>
                    Editar
                  </Button>

                  <Button 
                  light
                  shadow
                  children={reservacion.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
                  color={'secondary'}
                  onClick={()=>{
                    setReservacionActual(reservacion)
                    activarModal('Cambiar', `¿Seguro que desea ${reservacion.estado == 1 ? 'deshabilitar' : 'habilitar'} este registro?`)
                  }}>
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>

      </table>

    </div>
  )
}

export default MostrarReservaciones