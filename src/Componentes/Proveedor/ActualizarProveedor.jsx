import { useNavigate, useParams} from "react-router-dom";
import React, {useState, useEffect, useRef} from 'react'
import { Button, Input, Modal, Text} from '@nextui-org/react'
import axios from "axios";


const endPointGetProveedor = 'http://127.0.0.1:8000/api/Proveedor'
const endPointUpdate = 'http://127.0.0.1:8000/api/updateProveedor'


const ActualizarProveedor = ()=>{
    const [proveedorNombre, setProveedorNombre] = useState('')
    const [proveedorNumero, setProveedorNumero] = useState('')
    const [proveedorCorreo, setProveedorCorreo] = useState('')
    const [proveedorEncargado, setProveedorEncagado] = useState('')
    const [proveedorRTN, setProveedorRTN] = useState('')
    const [proveedorEstado, setProveedorEstado] = useState(1)
    const navigate = useNavigate()
    const {id} = useParams()

    const [mensajeModal, setMensajeModal] = useState('')
    const [tituloModal, setTituloModal] = useState('')
    const [visible, setVisible] = useState(false)
    const refButton = useRef()

    useEffect(()=>{
        getProveedor()
    }, [])

    const getProveedor = async ()=>{
        const response =  await axios.get(`${endPointGetProveedor}/${id}`)

        setProveedorNombre(response.data.proveedorNombre)
        setProveedorNumero(response.data.proveedorNumero)
        setProveedorCorreo(response.data.proveedorCorreo)
        setProveedorEncagado(response.data.proveedorEncargado)
        setProveedorRTN(response.data.proveedorRTN)

        //console.log(response.data)    //DEV
    }

    const actualizar = async (e)=>{
        e.preventDefault()
        const response = await axios.put(`${endPointUpdate}/${id}`, {proveedorNombre: proveedorNombre, 
            proveedorNumero: proveedorNumero, proveedorCorreo: proveedorCorreo,
            proveedorEncargado: proveedorEncargado,  proveedorRTN: proveedorRTN, 
            estado: proveedorEstado})

        if (response.status !== 200){
            /*console.log(response.data) //DEV
            alert(response.data.Error)*/
            setTituloModal('Error')
            setMensajeModal(response.data.Error)
            setVisible(true)
        }else{
            navigate('/Proveedores')
        }
    }

    const verificar = (setear = () => {}, cadenaTexto)=>{
        setear()
        if (/(.)\1\1/.test(cadenaTexto)) {
        refButton.current.disabled = "disabled"
        setTituloModal('Error')
        setMensajeModal('La información ingresada tiene caracteres repetidos al azar. ' +
         'No podrá guardar hasta solucionar el error.')
        setVisible(true)
        }
        else{
            refButton.current.disabled = false
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
                <h1 className='text-white'>Actualizar Proveedor</h1>
            </div>

            <form onSubmit={actualizar} className='formulario'>
            <div className='atributo'>
                    <label>Nombre Proveedor:</label>
                    <input
                    placeholder='Nombre'
                    value={proveedorNombre}
                    onChange={(e)=>verificar(setProveedorNombre(e.target.value), proveedorNombre)}
                    type='text'
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
                    type='number'
                    className='form-control'
                    />
                </div>
                <div className='atributo'>
                    <label>Correo Electrónico:</label>
                    <input
                    placeholder='Correo'
                    value={proveedorCorreo}
                    onChange={(e)=> setProveedorCorreo(e.target.value)}
                    type='email'
                    className='form-control'
                    />
                </div>
                <div className='atributo'>
                    <label>Nombre Encargado:</label>
                    <input
                    placeholder='Encargado'
                    value={proveedorEncargado}
                    onChange={(e)=> verificar(setProveedorEncagado(e.target.value), proveedorEncargado)}
                    type='text'
                    pattern='[A-Za-z ]{3,}'
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
                    type='number'
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

export default ActualizarProveedor