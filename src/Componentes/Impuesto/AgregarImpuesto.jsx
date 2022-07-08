import React, {useEffect, useRef, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, Text,} from '@nextui-org/react'
import Swal from 'sweetalert2'


const endPointAddImpuesto           = 'http://127.0.0.1:8000/api/addImpuesto'
const endPointAddImpuestoHistorial  = 'http://127.0.0.1:8000/api/addImpuestoHistorial'
function AgregarImpuesto() {
  const [valorImpuesto, setValorImpuesto]   = useState(0)
  const [nombreImpuesto, setNombreImpuesto] = useState('')

  const [mensajeModal, setMensajeModal]   = useState('')
  const [tituloModal, setTituloModal]     = useState('')
  const [visible, setVisible]             = useState(false)
  const navigate                          = useNavigate()

  //
  const activarModal = (titulo, mensajeModal)=>{
    setTituloModal(titulo)
    setMensajeModal(mensajeModal)
    setVisible(true)
  }
  //
  const registrar = async (e) =>{
    e.preventDefault()
        
    const datos = [nombreImpuesto]
    let contador = 0

    datos.map((dato)=>{
        if (/(.)\1\1/.test(dato)) {
            contador++
        }
    })

    if (contador > 0){
      activarModal('Error', 'No se permiten caracteres repetidos.')
    }else{
      const response = await axios.post(endPointAddImpuesto, {valorImpuesto: valorImpuesto, nombreImpuesto: nombreImpuesto,
      estado: 1})
      

      if (response.status !== 200){
        console.log(response.data)
        activarModal('Error', `${response.data.Error}`)
      }else{
        registrarImpuestoHistorial(response.data.id)
      }

    }

  }
  //
  const registrarImpuestoHistorial = async (impuestoId) =>{
    const date = new Date()
    const fechaHoy = `${date.getFullYear()}-${date.getMonth() < 9? '0':''}${date.getMonth()+1}-${date.getDate() < 10? '0':''}${date.getDate()}`

    const response = await axios.post(endPointAddImpuestoHistorial, {impuestoId: impuestoId, valorImpuesto: valorImpuesto,
    fechaInicio: fechaHoy, estado: 1})

    //console.log(response.data)

    const {value: confirmacion} = await Swal.fire({
      title: 'Registro exitoso',
      text: `El impuesto ${nombreImpuesto} ha sido registrado con éxito.`,
      width: '410px',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#7109BF',
      background: 'black',
      color: 'white',
    })

    if (confirmacion){
      navigate('/Impuestos')
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
        <h1 className='text-white'>Registrar Impuesto</h1>
      </div>


      <form onSubmit={registrar} className='formulario'>

        <div className='atributo'>
          <label htmlFor='valorImpuesto'>Valor Impuesto:</label>
          <input
          id='valorImpuesto'
          aria-label='aria-describedby'
          placeholder='15%'
          value={valorImpuesto}
          onChange={(e)=>setValorImpuesto(e.target.value)}
          type='number'
          className='form-control'/>
        </div>

        <div className='atributo'>
          <label htmlFor='nombreImpuesto'>Nombre Impuesto:</label>
          <input
          id='nombreImpuesto'
          aria-label='aria-describedby'
          placeholder='Gravado'
          value={nombreImpuesto}
          onChange={(e)=>setNombreImpuesto(e.target.value)}
          type='text'
          className='form-control'/>
        </div>

        <div className='d-flex mt-2'>

          <Button
          color={'gradient'}
          className='align-self-end me-3 '
          auto
          onClick={()=>navigate('/Impuestos')}
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

export default AgregarImpuesto