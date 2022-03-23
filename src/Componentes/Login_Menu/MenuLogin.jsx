import React, {useState} from 'react'
import { Link, Navigate, useNavigate, useNavigationType } from 'react-router-dom'
import { Row, Button, Modal, Text, Input } from '@nextui-org/react';
import FondoLogin from '../../img/FondoLogin.jpg'
import axios from 'axios';



const endPointGetEmpleado = 'http://127.0.0.1:8000/api/Empleado'
const endPointUpdateEmpleado = 'http://127.0.0.1:8000/api/updateEmpleado'
let contador = 0

function MenuLogin () {
    const navigate                      = useNavigate()
    const [nombreUsuario, setNombre]    = useState('')
    const [contrasenia, setcontrasenia] = useState('')
    const [empleado, setEmpleado]       = useState()


    const [mensajeModal, setMensajeModal]   = useState('')
    const [tituloModal, setTituloModal]     = useState('')
    const [visible, setVisible]             = useState(false)



    const validar = async ()=>{
        console.log(contador)

        if (nombreUsuario == '' || contrasenia == ''){
            setTituloModal('Error')
            setMensajeModal('Credenciales Invalidas. Ingrese Usuario y contraseña. Vacio')
            setVisible(true)
        }else{
            const response = await axios.get(`${endPointGetEmpleado}U/${nombreUsuario}`)

            const array = response.data
      
            if (array.length < 1){
                setTituloModal('Error')
                setMensajeModal('Credenciales Invalidas. Intente nuevamente. No esta')
                setVisible(true)
            }else{
                
                const response1 = await axios.get(`${endPointGetEmpleado}/${response.data[0].id}`)
                setEmpleado(response1.data)

                localStorage.setItem('usuario', `${response1.data.id}`)

                if (response1.data.estado != 1){
                    setTituloModal('Error')
                    setMensajeModal('Usuario Deshabilitado.')
                    setVisible(true)

                    contador = 0
                }else if (response1.data.empleadoUsuario === nombreUsuario && response1.data.empleadoContrasenia === contrasenia){
                    contador = 0
                    sessionStorage.setItem('userName', response1.data.empleadoUsuario)
                    sessionStorage.setItem('id', response1.data.id)
                    navigate('/MenuPrincipal')
                }else{
                    if (contador == 2){
                        setTituloModal('Error')
                        setMensajeModal('El usuario Se bloquerá, muchos intentos fallidos')
                        setVisible(true)
                            console.log(empleado)
                            const response2 = await axios.put(`${endPointUpdateEmpleado}/${localStorage.getItem('usuario')}`, {tipoDocumentoId:
                            empleado.tipoDocumentoId, numeroDocumento: empleado.numeroDocumento, empleadoNombre: empleado.empleadoNombre, empleadoNumero: empleado.empleadoNumero,
                            empleadoCorreo: empleado.empleadoCorreo, empleadoUsuario: empleado.empleadoUsuario,
                            empleadoContrasenia: empleado.empleadoContrasenia, empleadoDireccion: empleado.empleadoDireccion, 
                            empleadoSueldo: empleado.empleadoSueldo, cargoActualId: empleado.cargoActualId, fechaContratacion: empleado.fechaContratacion,
                            fechaNacimiento: empleado.fechaNacimiento, estado: empleado.estado = 0})

                            contador = 0
                            console.log(response2.data) //
                            localStorage.removeItem('usuario')
                    }else{
                        contador++
                        setTituloModal('Error')
                        setMensajeModal('Credenciales Invalidas. Intente nuevamente. Malas')
                        setVisible(true)
                        console.log(contador)
                    }
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
                    type="password"
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