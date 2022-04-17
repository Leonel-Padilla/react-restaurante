import React, {useRef, useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Input, Modal, Text, Textarea} from '@nextui-org/react'
import axios from 'axios'


const endPointGetFactura      = 'http://127.0.0.1:8000/api/Factura'
const endPointUpdateFactura   = 'http://127.0.0.1:8000/api/updateFactura'
function ActualizarFactura() {

  const [mensajeModal, setMensajeModal]   = useState('')
  const [tituloModal, setTituloModal]     = useState('')
  const [visible, setVisible]             = useState(false)
  const navigate                          = useNavigate()

  const [justificacion, setJustificacion] = useState('')
  const [estado, setEstado]               = useState('')

  const [factura, setFactura]             = useState({})

  
  const {id} = useParams()
  
  useEffect(()=>{
    getFactura()
  }, [])


  //
  const activarModal = (titulo, mensajeModal)=>{
    setTituloModal(titulo)
    setMensajeModal(mensajeModal)
    setVisible(true)
  }
  //
  const getFactura = async ()=>{
    const response = await axios.get(`${endPointGetFactura}/${id}`)
    setFactura(response.data)

    response.data.estado == 1? setEstado('Habilitado'): setEstado('Deshabilitado')
  }
  //
  const actualizar = async (e)=>{
    e.preventDefault()
    
    if (estado.includes('Seleccione')){
      activarModal('Error', 'Debe seleccionar un estado')
    }else{
      factura.estado = estado == 'Habilitado'? 1: 0
      factura.descripcion = justificacion

      console.log(factura)
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
        <h1 className='text-white'>Actualizar Factura</h1>
      </div>

      <form onSubmit={actualizar} className='formulario'>
        
        <div className='atributo'>
          <label>Estado de la Factura</label>
          <select
          value={estado}
          onChange={(e)=>setEstado(e.target.value)}
          className='select'>
            <option>Seleccione CAI</option>
            <option>Habilitado</option>
            <option>Deshabilitado</option>
            
          </select>
        </div>

        <div className='atributo'>
          <label>Justificación</label>
          <textarea
          style={{width: '210px'}}
          type='textArea'
          maxLength={300}
          value={justificacion}
          onChange={(e)=>setJustificacion(e.target.value)}/>
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