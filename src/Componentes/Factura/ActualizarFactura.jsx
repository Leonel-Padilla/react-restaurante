import React, {useRef, useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Input, Modal, Text, Textarea} from '@nextui-org/react'
import axios from 'axios'

const endPointUpdateOrden     = 'http://127.0.0.1:8000/api/updateOrdenEncabezado'
const endPointGetOrden        = 'http://127.0.0.1:8000/api/OrdenEncabezado'
const endPointGetEmpleado     = 'http://127.0.0.1:8000/api/Empleado'
const endPointGetTipoEntrega  = 'http://127.0.0.1:8000/api/TipoEntrega'
function ActualizarFactura() {

  const [mensajeModal, setMensajeModal]   = useState('')
  const [tituloModal, setTituloModal]     = useState('')
  const [visible, setVisible]             = useState(false)
  const navigate                          = useNavigate()
  
  const [meseroId, setMeseroId]           = useState('')
  let idMesero                                = ''
  const [cocineroId, setCocineroId]       = useState('')
  let idCocinero                              = ''
  const [tipoEntregaId, setTipoEntregaId] = useState('')
  let idTipoEntrega                           = ''


  const [empleados, setEmpleados]         = useState([])
  const [tiposEntrega, setTiposEntrega]   = useState([])
  const [ordenActual, setOrdenActual] = useState({})
  
  const {id} = useParams()
  
  useEffect(()=>{
    getAllTiposEntrega()
    getOrden()
  }, [])


  //
  const activarModal = (titulo, mensajeModal)=>{
    setTituloModal(titulo)
    setMensajeModal(mensajeModal)
    setVisible(true)
  }
  //
  const getAllTiposEntrega = async ()=>{
    const response = await axios.get(endPointGetTipoEntrega)
    setTiposEntrega(response.data)
  }
  //
  const getOrden = async ()=>{
    const response = await axios.get(`${endPointGetOrden}/${id}`)

    const response1 = await axios.get(endPointGetEmpleado)
    setEmpleados(response1.data)
    let empleados = response1.data


    let meseroActual = ''
    empleados.map((empleado)=>{
      if (empleado.id == response.data.empleadoMeseroId){
        meseroActual = empleado.empleadoNombre
      }
    })

    let cocineroActual = ''
    empleados.map((empleado)=>{
      if (empleado.id == response.data.empleadoCocinaId){
        cocineroActual = empleado.empleadoNombre
      }
    })

    const response3 = await axios.get(`${endPointGetTipoEntrega}/${response.data.tipoEntregaId}`)

    setMeseroId(meseroActual)
    setCocineroId(cocineroActual)
    setTipoEntregaId(response3.data.nombreTipoEntrega)

    setOrdenActual(response.data)

  }
  //
  const formatearCocineroId = ()=>{
    empleados.map((empleado)=>{
      if (empleado.empleadoNombre == cocineroId){
        idCocinero = empleado.id
      }
    })
  }
  //
  const formatearMeseroId = ()=>{
    empleados.map((empleado)=>{
      if (empleado.empleadoNombre == meseroId){
        idMesero = empleado.id
      }
    })
  }
  //
  const formatearTipoEntregaId = ()=>{
    tiposEntrega.map((tipoEntrega)=>{
      if (tipoEntrega.nombreTipoEntrega == tipoEntregaId){
        idTipoEntrega= tipoEntrega.id
      }
    })
  }
  //
  const actualizar = async (e)=>{
    e.preventDefault()
    if (meseroId.includes('Seleccione') || cocineroId.includes('Seleccione') || tipoEntregaId.includes('Seleccione')){
      activarModal('Error', 'Debe selecionar un mesero, un cocinero y un tipo de entrega.')
    }else{
      formatearMeseroId()
      formatearCocineroId()
      formatearTipoEntregaId()


      ordenActual.empleadoMeseroId = idMesero
      ordenActual.empleadoCocinaId = idCocinero
      ordenActual.tipoEntregaId    = idTipoEntrega

      //console.log(ordenActual)

      const response = await axios.put(`${endPointUpdateOrden}/${id}`, ordenActual)
      //console.log(response.data)
      
      if (response.status !== 200){
        activarModal('Error', `${response.data.Error}`)
      }else{
        navigate('/Facturas')
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

      <div className='d-flex justify-content-center bg-dark mb-2'>
        <h1 className='text-white'>Actualizar Orden</h1>
      </div>

      <form onSubmit={actualizar} className='formulario'>
        
        <div className='atributo'>
          <label>Cocinero Id</label>
          <select
          value={cocineroId}
          onChange={(e)=>setCocineroId(e.target.value)}
          className='select'> 
              <option> Seleccione el Cocinero </option>
              {empleados.map((empleado)=>
                <option key={empleado.id}>{empleado.empleadoNombre}</option>
              )}
          </select>
        </div>

        <div className='atributo'>
          <label>Mesero</label>
          <select
          value={meseroId}
          onChange={(e)=>setMeseroId(e.target.value)}
          className='select'> 
            <option> Seleccione un Mesero </option>
            {empleados.map((empleado)=>
              <option key={empleado.id}>{empleado.empleadoNombre}</option>
            )}
          </select>
        </div>

        <div className='atributo'>
          <label>Tipo Entrega</label>
          <select
          value={tipoEntregaId}
          onChange={(e)=>setTipoEntregaId(e.target.value)}
          className='select'> 
            <option> Seleccione Tipo Entrega </option>

            {tiposEntrega.map((tipoEntrega)=>
              <option key={tipoEntrega.id}>{tipoEntrega.nombreTipoEntrega}</option>
            )}
          </select>
        </div>


        <div className='d-flex mt-2'>

          <Button 
          color={'gradient'}
          className='align-self-end me-3 ' 
          auto 
          onClick={()=>navigate('/Facturas')}
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

export default ActualizarFactura