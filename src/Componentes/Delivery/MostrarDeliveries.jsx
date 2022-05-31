import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Input,Tooltip, Modal, Text, } from '@nextui-org/react';
import buscarLupa from '../../img/buscar_lupa.png';
import lapizEditar from '../../img/lapiz_editar.png'
import moment from 'moment';

const endPointGetDeliveries        = 'http://127.0.0.1:8000/api/Delivery'
const endPointGetCliente           = 'http://127.0.0.1:8000/api/Cliente'
const endPointUpdateDeliveries     = 'http://127.0.0.1:8000/api/updateDelivery'
function MostrarDeliverys() {
  const [clientes, setClientes]             = useState([])
  let clienteNombre                         = ''
  let idCliente                             = 0
  const [deliveries, setDeliveries]         = useState([])
  const [deliveryActual, setDeliveryActual] = useState({})

  const [parametroBusqueda, setParametroBusqueda]   = useState('Seleccione')
  const [valorBusqueda, setValorBusqueda]           = useState('Seleccione')

  const navigate = useNavigate()
  const [mensajeModal, setMensajeModal]   = useState('')
  const [tituloModal, setTituloModal]     = useState('')
  const [visible, setVisible]             = useState(false)

  useEffect(() => {
    getAllDeliveries()
    getAllClientes()
  },[])

  //
  const activarModal = (titulo, mensajeModal)=>{
    setTituloModal(titulo)
    setMensajeModal(mensajeModal)
    setVisible(true)
  }
  //
  const getAllDeliveries = async () => {
    const response = await axios.get(endPointGetDeliveries)
    setDeliveries(response.data)
  }
  //
  const getAllClientes = async () => {
    const response = await axios.get(endPointGetCliente)
    //console.log(response.data)
    setClientes(response.data)
  }
  //
  const cambioEstado = async ()=>{
    deliveryActual.estado = deliveryActual.estado === 1 ? 0 : 1

    const response = await axios.put(`${endPointUpdateDeliveries}/${deliveryActual.id}`, deliveryActual)
    console.log(response.data)

    getAllDeliveries()

  }
  //
  const formatearClienteId = (id)=>{
    clientes.map((cliente)=>{
      if (cliente.id === id){
        clienteNombre = cliente.clienteNombre
      }
    })
  }
  //
  const formatearNombreCliente = ()=>{
    clientes.map((cliente)=>{
      if (cliente.clienteNombre === valorBusqueda){
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
          const response = await axios.get(`${endPointGetDeliveries}/${valorBusqueda}`)
          //console.log(response.data)
                
          if (response.status != 200){
            activarModal('Error', `${response.data.Error}`)
          }else{
            const array = [response.data]
            setDeliveries(array)
          }
                
        }else{

          formatearNombreCliente()
          const response = await axios.get(`${endPointGetDeliveries}C/${idCliente}`)
          const array = response.data

          //console.log(response.data)

          if (array.length < 1){
            activarModal('Error', 'No hay deliveries con el cliente ingresado.')
          }else{
          setDeliveries(array)
          }

        }
      } 
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
        <h1 className='ms-4 me-4' >Deliveries</h1>

        <select style={{height: '35px'}} 
        className='align-self-center me-2'
        onChange={(e)=>setParametroBusqueda(e.target.value)} 
        >   
          <option>Seleccione tipo búsqueda</option>
          <option>ID</option>
          <option>Cliente</option>
        </select>

        {/*------Fomulario de busqueda*/}
        <form
        className='d-flex align-self-center'
        style={{left: '300px'}}
        onSubmit={getByValorBusqueda}>
          <input
          placeholder={parametroBusqueda.includes('Seleccione')? '': `${parametroBusqueda}`}
          aria-label='aria-describedby'
          onChange={(e)=>setValorBusqueda(e.target.value)}
          type={parametroBusqueda == 'ID'? 'number':'text'}
          className='form-control me-2'
          required={true}
          title=''/>

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
        onClick={()=>getAllDeliveries()}>
          Llenar Tabla
        </Button>

        <Button 
        className='bg-dark text-light align-self-center'
        color={'dark'}
        bordered
        onClick={()=>navigate('/Deliveries/addDelivery')}>
          Registrar  
        </Button>
      </div>

      <table className='table mt-2'> 
        <thead className='bg-dark text-white'> 
          <tr>
            <th>Id</th>
            <th>Cliente</th>
            <th>Fecha Entrega</th>
            <th>Hora Despacho</th>
            <th>Hora Entrega</th>
            <th>Comentario</th>
            <th>Estado</th>
            <th>Opciones</th>
          </tr>
        </thead>
                
        <tbody>
          {deliveries.map(delivery => {
            
            formatearClienteId(delivery.clienteId)

            return(
              <tr key={delivery.id}>
                <td>{delivery.id}</td>
                <td>{clienteNombre}</td>
                <td>{moment(delivery.fechaEntrega).format("DD/MM/yy")}</td>
                <td>{delivery.horaDespacho == null? 'Pendiente': delivery.horaDespacho}</td>
                <td>{delivery.horaEntrega == null? 'Pendiente': delivery.horaEntrega}</td>
                <td>{delivery.comentario == null? 'Sin comentario': delivery.comentario}</td>
                <td>{delivery.estado == 1? 'Habilitado': 'Deshabilitado'}</td>
                <td>
                  <Button
                  className='mb-1'
                  color={'gradient'}
                  iconRight={<img src={lapizEditar}/>}
                  onClick={()=>navigate(`/Deliveries/updateDelivery/${delivery.id}`)}>
                    Editar
                  </Button>

                  <Button 
                  light
                  shadow
                  children={delivery.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
                  color={'secondary'}
                  onClick={()=>{
                    setDeliveryActual(delivery)
                    activarModal('Cambiar', `¿Seguro que desea ${delivery.estado == 1 ? 'deshabilitar' : 'habilitar'} este registro?`)
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

export default MostrarDeliverys