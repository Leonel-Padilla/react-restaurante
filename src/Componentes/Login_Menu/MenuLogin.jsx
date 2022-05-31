import React, {useState} from 'react'
import { Link, Navigate, useNavigate, useNavigationType } from 'react-router-dom'
import { Row, Button, Modal, Text, Input } from '@nextui-org/react';
import FondoLogin from '../../img/FondoLogin.jpg'
import axios from 'axios';



const endPointGetEmpleado = 'http://127.0.0.1:8000/api/Empleado'
const endPointUpdateEmpleado = 'http://127.0.0.1:8000/api/updateEmpleado'
//let contador = 0

function MenuLogin () {
    const navigate                      = useNavigate()
    const [nombreUsuario, setNombre]    = useState('')
    const [contrasenia, setcontrasenia] = useState('')
    const [empleado, setEmpleado]       = useState()
    const [empleados, setEmpleados]     = useState([])
    let empleadoActual = {}

    const [mensajeModal, setMensajeModal]   = useState('')
    const [tituloModal, setTituloModal]     = useState('')
    const [visible, setVisible]             = useState(false)

    let fechaHoy = new Date()
    /*let valor = fechaHoy.getDate()
    fechaHoy.setDate(valor+1)*/
    let valor = fechaHoy.getMinutes()
    fechaHoy.setMinutes(valor+1)

    let fechaBloqueoU = `${fechaHoy.getFullYear()}-${fechaHoy.getMonth() < 9? '0':''}${fechaHoy.getMonth()+1}-${fechaHoy.getDate() < 10? '0':''}${fechaHoy.getDate()} ${fechaHoy.getHours() < 10? '0':''}${fechaHoy.getHours()}:${fechaHoy.getMinutes() < 10? '0':''}${fechaHoy.getMinutes()}`

    //console.log(fechaBloqueoU)

    let fechaAhorita = new Date()
    let fechaActual = `${fechaAhorita.getFullYear()}-${fechaAhorita.getMonth() < 9? '0':''}${fechaAhorita.getMonth()+1}-${fechaAhorita.getDate() < 10? '0':''}${fechaAhorita.getDate()} ${fechaAhorita.getHours() < 10? '0':''}${fechaAhorita.getHours()}:${fechaAhorita.getMinutes() < 10? '0':''}${fechaAhorita.getMinutes()}`


    const validar = async ()=>{

        if (nombreUsuario == '' || contrasenia == ''){
            setTituloModal('Error')
            setMensajeModal('Credenciales Inválidas. Ingrese Usuario y contraseña.')
            setVisible(true)
        }else{
            const response = await axios.get(`${endPointGetEmpleado}U/${nombreUsuario}`)

            const array = response.data
      
            if (array.length < 1){
                setTituloModal('Error')
                setMensajeModal('Credenciales Inválidas. Intente nuevamente.')
                setVisible(true)
            }else{
                
                const response1 = await axios.get(`${endPointGetEmpleado}/${response.data[0].id}`)
                setEmpleado(response1.data)

                localStorage.setItem('usuario', `${response1.data.id}`)
                let contadorRep = 0

                empleados.map((empleadoI)=>{
                    if (empleadoI.id == response1.data.id){
                        //console.log(empleadoI.id, response1.data.id)
                        contadorRep++
                    }
                })

                if (contadorRep == 0){
                    empleados.push({id: response1.data.id, contador: 0})
                }
               
                empleados.map((empeladoI)=>{
                    if (empeladoI.id == response1.data.id){
                        empleadoActual = empeladoI
                    }
                })
                //console.log(fechaActual, response1.data.fechaBloqueo)
                if (fechaActual < response1.data.fechaBloqueo){
                    setTituloModal('Error')
                    setMensajeModal('El usuario ha sido deshabilitado')
                    setVisible(true)
                }else
                
                if (response1.data.empleadoUsuario === nombreUsuario && response1.data.empleadoContrasenia === contrasenia){
                    empleadoActual.contador = 0
                    let nuevos = empleados.filter((empleado)=> empleado.id != empleadoActual.id)
                    nuevos.push(empleadoActual)

                    sessionStorage.setItem('userName', response1.data.empleadoUsuario)
                    sessionStorage.setItem('id', response1.data.id)
                    navigate('/MenuPrincipal')
                }else{
                    if (empleadoActual.contador == 2){
                        setTituloModal('Error')
                        setMensajeModal('Usuario deshabilitado debido a muchos intentos fallidos.')
                        setVisible(true)
                            //console.log(empleado)
                            /*const response2 = await axios.put(`${endPointUpdateEmpleado}/${empleadoActual.id}`, {tipoDocumentoId:
                            empleado.tipoDocumentoId, numeroDocumento: empleado.numeroDocumento, empleadoNombre: empleado.empleadoNombre, empleadoNumero: empleado.empleadoNumero,
                            empleadoCorreo: empleado.empleadoCorreo, empleadoUsuario: empleado.empleadoUsuario,
                            empleadoContrasenia: empleado.empleadoContrasenia, empleadoDireccion: empleado.empleadoDireccion, 
                            empleadoSueldo: empleado.empleadoSueldo, cargoActualId: empleado.cargoActualId, fechaContratacion: empleado.fechaContratacion,
                            fechaNacimiento: empleado.fechaNacimiento, estado: empleado.estado = 1, fechaBloqueo: fechaBloqueoU})*/

                            const response2 = await axios.put(`${endPointUpdateEmpleado}/${empleadoActual.id}`, {...empleado, 
                            fechaBloqueo: fechaBloqueoU})

                            empleadoActual.contador = 0
                            let nuevos = empleados.filter((empleado)=> empleado.id != empleadoActual.id)
                            nuevos.push(empleadoActual)

                            console.log(response2.data) 
                            localStorage.removeItem('usuario')
                    }else{
                        empleadoActual.contador++
                        let nuevos = empleados.filter((empleado)=> empleado.id != empleadoActual.id)
                        nuevos.push(empleadoActual)
                        
                        setTituloModal('Error')
                        setMensajeModal('Credenciales Inválidas. Intente nuevamente. Intentos restantes: ' + (3-empleadoActual.contador))
                        setVisible(true)
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