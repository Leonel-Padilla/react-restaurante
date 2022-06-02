import { useNavigate, useParams} from "react-router-dom";
import React, {useState, useEffect, useRef} from 'react'
import { Button, Modal, Text} from '@nextui-org/react'
import axios from "axios";


const endPointGetCargo = 'http://127.0.0.1:8000/api/Cargo'
const endPointUpdate = 'http://127.0.0.1:8000/api/updateCargo'

function ActualizarCargo() {

  const [cargoNombre, setCargoNombre] = useState('')
  const [cargoDescripcion, setCargoDescripcion] = useState('')
  const [cargoEstado, setCargoEstado] = useState(1)
  const navigate = useNavigate()
  const {id} = useParams()

  const [mensajeModal, setMensajeModal] = useState('')
  const [tituloModal, setTituloModal] = useState('')
  const [visible, setVisible] = useState(false)
  const refButton = useRef()

  useEffect(()=>{
    getCargo()
  }, [])

  //
    const validarTexto = (texto) =>{
        if(/([A-Z]{2}|[A-Z]\s)/.test(texto) || /\s\s/.test(texto) || /(.)\1\1/.test(texto) || /[0-9]/.test(texto)){
            setTituloModal('Error')
            setMensajeModal('No ingrese números, caracteres repetidos ni deje espacios de forma incorrecta.')
            setVisible(true)
        }else{
            return false
        }
    }
  //
  const getCargo = async ()=>{
      const response =  await axios.get(`${endPointGetCargo}/${id}`)

      setCargoNombre(response.data.cargoNombre)
      setCargoDescripcion(response.data.cargoDescripcion)
      
      //console.log(response.data)    //DEV
  }

  const actualizar = async (e)=>{
    e.preventDefault()

    const datos = [cargoNombre, cargoDescripcion]
    let contador = 0

    datos.map((dato)=>{
        if (/(.)\1\1/.test(dato)) {
            
            contador++
        
        }
    })


    if (contador > 0){
        setTituloModal('Error')
        setMensajeModal('La información ingresada contiene mas de dos caracteres repetidos seguidos.')
        setVisible(true)
    }else{
        const response = await axios.put(`${endPointUpdate}/${id}`, {cargoNombre: cargoNombre,
            cargoDescripcion: cargoDescripcion, estado: cargoEstado})
      
          if (response.status !== 200){
      
              setTituloModal('Error')
              setMensajeModal(response.data.Error)
              setVisible(true)
          }else(
            navigate('/Cargos')
          )
    }
    
}

const verificar = (setear = () => {}, cadenaTexto)=>{
    setear()
    if (/(.)\1\1/.test(cadenaTexto)) {
    refButton.current.disabled = "disabled"
    setTituloModal('Error')
    setMensajeModal('La informacion ingresada contiene tres caracteres repetidos seguidos. ' +
     'No podra guardar hasta solucionar el error.')
    setVisible(true)
    }
    else{
        refButton.current.disabled = false
    }
}

  return (
    <div>

            <Modal
            closeButton
            blur
            //preventClose
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
              <h1 className='text-white'>Actualizar Cargo</h1>
          </div>

            <form onSubmit={actualizar} className='formulario'>
                <div className='atributo'>
                    <label>Nombre del cargo:</label>
                    <input
                    value={cargoNombre}
                    onChange={(e)=>setCargoNombre(e.target.value)}
                    type='text'
                    pattern='[A-Za-z]{3,}'
                    maxLength={30}
                    title='Solo se aceptan letras, Ejemplo: "Cocinero"'
                    className='form-control'
                    />
                </div>
                
                <div className='atributo '>
                    <label>Descripción del cargo:</label>
                    <textarea
                    value={cargoDescripcion}
                    onChange={(e)=>{
                        if (validarTexto(e.target.value) == false){
                            setCargoDescripcion(e.target.value)
                        }
                    }}
                    aria-label='aria-describedby'
                    placeholder='Descripcion'
                    maxLength={100}
                    title='Solo se aceptan letras, Ejemplo: "Cocinero"'
                    type='text'
                    className='form-control p-4'
                    /> 
                </div>
                <div className='d-flex'>
                    <Button 
                    color={'gradient'}
                    className='align-self-end me-2' 
                    auto 
                    onClick={()=>navigate('/Cargos')}
                    ghost>
                        Regresar
                    </Button>

                    <Button 
                    ref={refButton}
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

export default ActualizarCargo