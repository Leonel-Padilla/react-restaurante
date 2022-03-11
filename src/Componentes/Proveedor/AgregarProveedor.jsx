import React, {useState} from 'react'
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


    const registrar = async (e)=>{
        e.preventDefault()
        const response = await axios.post(endPointRegistarProveedor, {proveedorNombre: proveedorNombre, 
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

    return(
        <div>

            <Modal
            closeButton
            blur
            preventClose
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
                    <Input
                    underlined
                    labelPlaceholder='Nombre'
                    value={proveedorNombre}
                    onChange={(e)=> setProveedorNombre(e.target.value)}
                    type='text'
                    className='form-control'
                    />
                </div>
                <div className='atributo'>
                    <Input
                    underlined
                    labelPlaceholder='Numero'
                    value={proveedorNumero}
                    onChange={(e)=> setProveedorNumero(e.target.value)}
                    type='number'
                    className='form-control'
                    />
                </div>
                <div className='atributo'>
                    <Input
                    underlined
                    labelPlaceholder='Correo'
                    value={proveedorCorreo}
                    onChange={(e)=> setProveedorCorreo(e.target.value)}
                    type='email'
                    className='form-control'
                    />
                </div>
                <div className='atributo'>
                    <Input
                    underlined
                    labelPlaceholder='Encargado'
                    value={proveedorEncargado}
                    onChange={(e)=> setProveedorEncagado(e.target.value)}
                    type='text'
                    className='form-control'
                    />
                </div>
                <div className='atributo'>
                    <Input
                    underlined
                    labelPlaceholder='RTN'
                    value={proveedorRTN}
                    onChange={(e)=> setProveedorRTN(e.target.value)}
                    type='text'
                    className='form-control'
                    />
                </div>
                <div className='atributo'>
                    <label>Estado</label> <br/>
                    <select
                    value={proveedorEstado}
                    onChange={(e)=> setProveedorEstado(e.target.value)}
                    type='number'
                    className='select'
                    >
                    <option>Habilitado</option>
                    <option>Deshabilitado</option>
                    </select>
                </div>
                


                <div className='d-flex'>
                    <Button 
                    color={'gradient'}
                    className='align-self-end me-2' 
                    auto 
                    onClick={()=>navigate('/Proveedores')}
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

export default AgregarProveedor