import React, {useRef, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, Text,} from '@nextui-org/react'
import Swal from 'sweetalert2'

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
            const response = await axios.post(endPointRegistarCargo, {cargoNombre: cargoNombre, 
            cargoDescripcion: cargoDescripcion, estado: cargoEstado})
        
            if (response.status !== 200){
                setTituloModal('Error')
                setMensajeModal(response.data.Error)
                setVisible(true)
            }else{

                (async ()=>{

                    const {value: confirmacion} = await Swal.fire({
                        title: 'Registro exitoso',
                        text: `El cargo ${cargoNombre} ha sido registrado con éxito.`,
                        width: '410px',
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#7109BF',
                        background: 'black',
                        color: 'white',
                    })
            
                    if (confirmacion){
                        navigate('/Cargos')
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
                    maxLength={30}
                    onChange={(e)=>setCargoNombre(e.target.value)}
                    type='text'
                    pattern='[A-Za-z ]{3,}'
                    title='Solo se aceptan letras, ejem: "Cajero"'
                    className='form-control'
                    />
                </div>

                <div className='atributo'>
                    <label>Descripción del cargo:</label>
                    <textarea
                    aria-label='aria-describedby'
                    placeholder='Responsable de caja'
                    maxLength={100}
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