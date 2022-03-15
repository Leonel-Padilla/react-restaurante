import React, {useRef, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Modal, Text, Textarea} from '@nextui-org/react'

const endPointRegistarCargo = 'http://127.0.0.1:8000/api/addCargo'

function AgregarCargo() {

    const [cargoNombre, setCargoNombre] = useState('')
    const [cargoDescripcion, setCargoDescripcion] = useState('')
    const [cargoEstado, setCargoEstado] = useState(1)
    const navigate = useNavigate()

    const [mensajeModal, setMensajeModal] = useState('')
    const [tituloModal, setTituloModal] = useState('')
    const [visible, setVisible] = useState(false)
    const refButton = useRef()

    const registrar = async (e)=>{
        e.preventDefault()
        const response = await axios.post(endPointRegistarCargo, {cargoNombre: cargoNombre, 
        cargoDescripcion: cargoDescripcion, estado: cargoEstado})

        if (response.status !== 200){
            setTituloModal('Error')
            setMensajeModal(response.data.Error)
            setVisible(true)
        }else{
            navigate('/Cargos')
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
              <h1 className='text-white'>Registrar Cargo</h1>
          </div>

            <form onSubmit={registrar} className='formulario'>

                <div className='atributo'>
                    <label>Nombre del cargo:</label>
                    <input
                    aria-label='aria-describedby'
                    value={cargoNombre}
                    placeholder='Cajero'
                    onChange={(e)=>verificar(setCargoNombre(e.target.value), cargoNombre)}
                    type='text'
                    pattern='[A-Za-z ]{3,}'
                    title='Solo se aceptan letras, ejem: "Cajero"'
                    className='form-control'
                    />
                </div>

                <div className='atributo'>
                    <label>Descripcion del cargo:</label>
                    <Textarea
                    aria-label='aria-describedby'
                    underlined
                    placeholder='Responsable de caja'
                    value={cargoDescripcion}
                    onChange={(e)=> setCargoDescripcion(e.target.value)}
                    type='text'
                    className='form-control p-4'
                    />
                </div>
                <div className='d-flex mt-2'>

                    <Button 
                    color={'gradient'}
                    className='align-self-end me-3 ' 
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

export default AgregarCargo