import React, {useRef, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Modal, Text, Textarea} from '@nextui-org/react'


const endPointRegistarCliente = 'http://127.0.0.1:8000/api/addCliente'

const AgregarCliente =()=>{
    const [clienteNombre, setClienteNombre] = useState('')
    const [clienteNumero, setClienteNumero] = useState('')
    const [clienteCorreo, setClienteCorreo]  = useState('')
    const [clienteRTN, setClienteRTN]       = useState('')
    const [clienteEstado, setClienteEstado] = useState(1)


    const navigate                          = useNavigate()
    const [mensajeModal, setMensajeModal]   = useState('')
    const [tituloModal, setTituloModal]     = useState('')
    const [visible, setVisible]             = useState(false)

    const registrar = async (e)=>{ 
        e.preventDefault()
        
        const datos = [clienteNombre, clienteCorreo]
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
            const response = await axios.post(endPointRegistarCliente, {clienteNombre: clienteNombre, 
            clienteNumero: clienteNumero, clienteCorreo: clienteCorreo, clienteRTN: clienteRTN, estado: clienteEstado})
        
                if (response.status !== 200){
                    setTituloModal('Error')
                    setMensajeModal(response.data.Error)
                    setVisible(true)
                }else{
                    navigate('/Clientes')
                }
        }
    }

    return(
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
                <h1 className='text-white'>Registrar Cliente</h1>
            </div>

            <form onSubmit={registrar} className='formulario'>

                <div className='atributo'>
                    <label>Nombre:</label>
                    <input
                    aria-label='aria-describedby'
                    value={clienteNombre}
                    placeholder='Juan Perez'
                    onChange={(e)=>setClienteNombre(e.target.value)}
                    type='text'
                    pattern='[A-Za-z ]{3,}'
                    title='Solo se aceptan letras, ejem: "Juan"'
                    className='form-control'
                    />
                </div>

                <div className='atributo'>
                <label>Número telefónico:</label>
                <input
                placeholder='88922711'
                value={clienteNumero}
                onChange={(e)=>setClienteNumero(e.target.value)}
                type='number'
                className='form-control'
                />
                </div>

                <div className='atributo'>
                <label>Correo electrónico:</label>
                <input
                placeholder='ejem@gmail.com'
                value={clienteCorreo}
                onChange={(e)=>setClienteCorreo(e.target.value)}
                type='email'
                className='form-control'
                />
                </div>

                <div className='atributo'>
                <label>RTN:</label>
                <input
                maxLength={14}
                value={clienteRTN}
                onChange={(e)=>setClienteRTN(e.target.value)}
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


export default AgregarCliente