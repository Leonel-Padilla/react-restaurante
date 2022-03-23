import React, {useState, useRef} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Modal, Text} from '@nextui-org/react'

const endPointRegistarProveedor = 'http://127.0.0.1:8000/api/addProveedor'

const AgregarProveedor = ()=>{
    const [proveedorNombre, setProveedorNombre] = useState('')
    const [proveedorNumero, setProveedorNumero] = useState('')
    const [proveedorCorreo, setProveedorCorreo] = useState('')
    const [proveedorEncargado, setProveedorEncagado] = useState('')
    const [proveedorRTN, setProveedorRTN] = useState('')
    const [proveedorEstado, setProveedorEstado] = useState(1)
    const navigate = useNavigate()

    const [mensajeModal, setMensajeModal] = useState('')
    const [tituloModal, setTituloModal] = useState('')
    const [visible, setVisible] = useState(false)
    const refButton = useRef()


    const registrar = async (e)=>{
        e.preventDefault()

        const datos = [proveedorNombre, proveedorCorreo, proveedorEncargado]
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
            const response = await axios.post(endPointRegistarProveedor, {proveedorNombre: proveedorNombre, 
                proveedorNumero: proveedorNumero, proveedorCorreo: proveedorCorreo,
                proveedorEncargado: proveedorEncargado,  proveedorRTN: proveedorRTN, 
                estado: proveedorEstado})
        
                if (response.status !== 200){
                    setTituloModal('Error')
                    setMensajeModal(response.data.Error)
                    setVisible(true)
                }else{
                    navigate('/Proveedores')
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
                <h1 className='text-white'>Registrar Proveedor</h1>
            </div>

            <form onSubmit={registrar} className='formulario'>

                <div className='atributo'>
                    <label>Nombre Proveedor:</label>
                    <input
                    placeholder='Nombre'
                    value={proveedorNombre}
                    onChange={(e)=>setProveedorNombre(e.target.value)}
                    type='text'
                    maxLength={50}
                    pattern='[A-Za-z ]{3,}'
                    title='Solo se aceptan letras, ejem: "Diunsa"'
                    className='form-control'
                    />
                </div>
                <div className='atributo'>
                    <label>Número Telefónico:</label>
                    <input
                    placeholder='Numero'
                    value={proveedorNumero}
                    onChange={(e)=> setProveedorNumero(e.target.value)}
                    type='text'
                    pattern='^[0-9]+$'
                    maxLength={8}
                    className='form-control'
                    />
                </div>
                <div className='atributo'>
                    <label>Correo electrónico:</label>
                    <input
                    placeholder='Correo'
                    value={proveedorCorreo}
                    onChange={(e)=> setProveedorCorreo(e.target.value)}
                    type='email'
                    maxLength={50}
                    className='form-control'
                    />
                </div>
                <div className='atributo'>
                    <label>Nombre Encargado:</label>
                    <input
                    placeholder='Encargado'
                    value={proveedorEncargado}
                    onChange={(e)=>setProveedorEncagado(e.target.value)}
                    type='text'
                    pattern='[A-Za-z ]{3,}'
                    maxLength={50}
                    title='Solo se aceptan letras, ejem: "Diunsa"'
                    className='form-control'
                    />
                </div>
                <div className='atributo'>
                    <label>RTN Proveedor:</label>
                    <input
                    placeholder='RTN'
                    value={proveedorRTN}
                    onChange={(e)=> setProveedorRTN(e.target.value)}
                    type='text'
                    pattern='^[0-9]+$'
                    maxLength={14}
                    className='form-control'
                    />
                </div>

                <div className='d-flex mt-2'>
                    <Button 
                    color={'gradient'}
                    className='align-self-end me-3' 
                    auto 
                    onClick={()=>navigate('/Proveedores')}
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

export default AgregarProveedor