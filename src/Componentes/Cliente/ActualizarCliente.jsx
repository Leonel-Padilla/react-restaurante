import React, {useRef, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Modal, Text, Textarea} from '@nextui-org/react'

const ActualizarCliente = () =>{
    const navigate = useNavigate()
    const [mensajeModal, setMensajeModal] = useState('')
    const [tituloModal, setTituloModal] = useState('')
    const [visible, setVisible] = useState(false)
    const Actualizar =(e)=>{ 
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
                <h1 className='text-white'>Actualizar Cliente</h1>
            </div>

            <form onSubmit={Actualizar} className='formulario'>

                <div className='atributo'>
                    <label>Nombre:</label>
                    <input
                    aria-label='aria-describedby'
                    //value={cargoNombre}
                    placeholder='Juan Perez'
                    //onChange={(e)=>setCargoNombre(e.target.value)}
                    type='text'
                    pattern='[A-Za-z ]{3,}'
                    title='Solo se aceptan letras, ejem: "Cajero"'
                    className='form-control'
                    />
                </div>

                <div className='atributo'>
                <label>Numero telefónico:</label>
                <input
                placeholder='88922711'
                //value={}
                //onChange={}
                type='number'
                className='form-control'
                />
                </div>

                <div className='atributo'>
                <label>Correo electronico:</label>
                <input
                placeholder='ejem@gmail.com'
                //value={}
                //onChange={}
                type='email'
                className='form-control'
                />
                </div>

                <div className='atributo'>
                <label>RTN:</label>
                <input
                maxLength={14}
                //value={}
                //onChange={}
                placeholder='08019999176681'
                type='text'
                className='form-control'
                />
                </div>


                <div className='d-flex mt-2'>

                    <Button 
                    color={'gradient'}
                    className='align-self-end me-3 ' 
                    auto 
                    onClick={()=>navigate('/Clientes')}
                    ghost>
                        Regresar
                    </Button>

                    <Button
                    //ref={refButton}
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
export default ActualizarCliente