import React, {useEffect, useRef, useState} from 'react'
import axios from 'axios'
import { useNavigate, useParams} from 'react-router-dom'
import { Button, Modal, Text,} from '@nextui-org/react'
import { CONNECTING } from 'ws'

const endPointGetImpuesto               = 'http://127.0.0.1:8000/api/Impuesto'
const endPointUpdateImpuesto            = 'http://127.0.0.1:8000/api/updateImpuesto'
const endPointGetImpuestoHistorial      = 'http://127.0.0.1:8000/api/ImpuestoHistorial'
const endPointUpdateImpuestoHistorial   = 'http://127.0.0.1:8000/api/updateImpuestoHistorial'
const endPointAddImpuestoHistorial      = 'http://127.0.0.1:8000/api/addImpuestoHistorial'

function ActualizarFactura() {
  const [valorImpuesto, setValorImpuesto]   = useState(0)
  const [valorEnCambio, setValorEnCambio]   = useState(0)
  const [nombreImpuesto, setNombreImpuesto] = useState('')
  const [estado, setEstado]                 = useState(0)
  
  const [historialImpuesto, setHistorialImpuesto] = useState([])

  const [mensajeModal, setMensajeModal]   = useState('')
  const [tituloModal, setTituloModal]     = useState('')
  const [visible, setVisible]             = useState(false)
  const navigate                          = useNavigate()
  const {id}                              = useParams()

  const date = new Date()
  const fechaHoy = `${date.getFullYear()}-${date.getMonth() < 9? '0':''}${date.getMonth()+1}-${date.getDate() < 10? '0':''}${date.getDate()}`

  const date2 = new Date()
  let valor = date2.getDate()
  date2.setDate(valor-1)

  let fechaFin = `${date2.getFullYear()}-${date2.getMonth() < 9? '0':''}${date2.getMonth()+1}-${date2.getDate() < 10? '0':''}${date2.getDate()}`

  useEffect(() => {
    getImpuesto()
    getHistorialImpuesto()
  }, [])

  //
  const activarModal = (titulo, mensajeModal)=>{
    setTituloModal(titulo)
    setMensajeModal(mensajeModal)
    setVisible(true)
  }
  //
  const getImpuesto = async () =>{
    const response = await axios.get(`${endPointGetImpuesto}/${id}`)

    setValorImpuesto(response.data.valorImpuesto)
    setValorEnCambio(response.data.valorImpuesto)
    setNombreImpuesto(response.data.nombreImpuesto)
    setEstado(response.data.estado)
  }
  //
  const getHistorialImpuesto = async () =>{
    const response = await axios.get(`${endPointGetImpuestoHistorial}I/${id}`)
    setHistorialImpuesto(response.data)
  }
  //
  const actualizar = async (e) =>{
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
      const response = await axios.put(`${endPointUpdateImpuesto}/${id}`, {valorImpuesto: valorImpuesto, nombreImpuesto: nombreImpuesto,
      estado: estado})

      console.log(response.data)

      if (response.status !== 200){
        activarModal('Error', `${response.data.Error}`)
      }else{
        actualizarImpuestoHistorial()
      }

    }
  }

  const actualizarImpuestoHistorial = async () =>{
    if (valorEnCambio != valorImpuesto){

      historialImpuesto.map(async(historialImpuesto)=>{
        if (historialImpuesto.fechaFinal == null){
          
          if (historialImpuesto.fechaInicio > fechaFin){
            date2.setDate(date2.getDate()+2)
            fechaFin = `${date2.getFullYear()}-${date2.getMonth() < 9? '0':''}${date2.getMonth()+1}-${date2.getDate() < 10? '0':''}${date2.getDate()}`
            
          }

          historialImpuesto.fechaFinal = fechaFin

          const response = await axios.put(`${endPointUpdateImpuestoHistorial}/${historialImpuesto.id}`, historialImpuesto)
          console.log(response.data)
        }
      })


      const response1 = await axios.post(endPointAddImpuestoHistorial, {impuestoId: id, valorImpuesto: valorImpuesto,
      fechaInicio: fechaHoy, estado: 1})
      
      console.log(response1.data)
      navigate('/Impuestos')
    }else{
      navigate('/Impuesto')
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
          {tituloModal.includes('Error')?     //IF
            mensajeModal
          :                                   //ELSE           
            <div className="Historial">
              <table className="table mt-2 text-white">
                <thead>
                  <tr>
                    <th>Valor Impuesto</th>
                    <th>Fecha Inicio</th>
                    <th>Fecha Final</th>
                  </tr>
                </thead>
                <tbody>
                  {historialImpuesto.map((historialImpuesto)=>{
                                
                    if(historialImpuesto.fechaFinal != null){
                                    
                      return(
                        <tr key={historialImpuesto.id}>
                          <td>{historialImpuesto.valorImpuesto}</td>
                          <td>{historialImpuesto.fechaInicio}</td>
                          <td>{historialImpuesto.fechaFinal}</td>
                        </tr>)
                    }

                  })}
                </tbody>
              </table>
            </div>
          }
        </Modal.Body>

      </Modal>

      <div className='d-flex justify-content-center bg-dark mb-2'
      style={{backgroundColor: 'whitesmoke'}}>
        <h1 className='text-white'>Registrar Impuesto</h1>

        <Button
        className='align-self-center ms-1'
        ghost
        auto
        color={'gradient'}
        onClick={()=>{
          activarModal('Historial Impuestos','')
          }}>
            Historial Impuesto
        </Button>
      </div>


      <form onSubmit={actualizar} className='formulario'>

        <div className='atributo'>
          <label>Valor Impuesto:</label>
          <input
          aria-label='aria-describedby'
          placeholder='15%'
          value={valorImpuesto}
          onChange={(e)=>setValorImpuesto(e.target.value)}
          type='number'
          className='form-control'/>
        </div>

        <div className='atributo'>
          <label>Nombre Impuesto:</label>
          <input
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

export default ActualizarFactura