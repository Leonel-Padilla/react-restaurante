import React, {useState} from 'react'
import { Link, Navigate, useNavigate, useNavigationType } from 'react-router-dom'
import { Row, Button, Modal, Text, Input } from '@nextui-org/react';
import FondoLogin from '../../img/FondoLogin.jpg'
import axios from 'axios';



const endPointGetEmpleadoByUN = 'http://127.0.0.1:8000/api/Empleado'

function MenuLogin () {
    //const [visible, setVisible] = useState(true);
    const [nombreUsuario, setNombre] = useState('')
    const [contrasenia, setcontrasenia] = useState('')
    const navigate = useNavigate()

    const [mensajeModal, setMensajeModal] = useState('')
    const [tituloModal, setTituloModal] = useState('')
    const [visible, setVisible] = useState(false)



    const validar = async ()=>{

        if (nombreUsuario == '' || contrasenia == ''){
            setTituloModal('Error')
            setMensajeModal('Credenciales Invalidas. Ingrese Usuario y contraseña.')
            setVisible(true)
        }else{
            const response = await axios.get(`${endPointGetEmpleadoByUN}U/${nombreUsuario}`)

            const array = response.data
            //console.log(response.data)
      
            if (array.length < 1){
                setTituloModal('Error')
                setMensajeModal('Credenciales Invalidas. Intente nuevamente.')
                setVisible(true)
            }else{
                /*setUsuario(response.data[0])
                console.log(usuario)*/
                // console.log(response.data[0].empleadoUsuario)
                // console.log(response.data[0].empleadoContrasenia)
                // console.log('////'+nombreUsuario)
                // console.log(contrasenia)

                sessionStorage.setItem('userName', response.data[0].empleadoUsuario)
                sessionStorage.setItem('id', response.data[0].id)
                

                if (response.data[0].empleadoUsuario === nombreUsuario && response.data[0].empleadoContrasenia === contrasenia){
                    navigate('/MenuPrincipal')
                }else{
                    setTituloModal('Error')
                    setMensajeModal('Credenciales Invalidas. Intente nuevamente 22.')
                    setVisible(true)
                }
            }
        }
    }

    return (

            
        <div className='body'>

            
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
            

            <div className='login-box'>
                <h1>Bienvenido</h1>
                <label className='ms-2'>Usuiario</label>
                <Input 
                    className='ms-4'
                    placeholder='Usuario'
                    value={nombreUsuario}
                    onChange={(e)=>setNombre(e.target.value)}
                    aria-label='aria-labelledby'
                    />
                <label className='ms-2'>Contraseña</label>
                <Input 
                    className='ms-4'
                    placeholder='Contraseña'
                    value={contrasenia}
                    type="contrasenia"
                    onChange={(e)=>setcontrasenia(e.target.value)}
                    aria-label='aria-labelledby'
                    />
                <Button 
                    className='bg-light mt-5 ms-4 text-dark ' 
                    onClick={()=>validar()} 
                    >Ingresar</Button>
            </div>
        </div>
        
        
    );    
    }

    export default MenuLogin