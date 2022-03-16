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
    const [usuario, setUsuario] = useState({})
    const navigate = useNavigate()



    const validar = async ()=>{
        const response = await axios.get(`${endPointGetEmpleadoByUN}U/${nombreUsuario}`)

        setUsuario(response.data)

        console.log(nombreUsuario)
        console.log(usuario)
    }

    return (
            
        <div className='body'>
            <div className='login-box'>
                <h1>Bienvenido</h1>
                <label className='ms-2'>Usuiario</label>
                <Input 
                    className='ms-4'
                    placeholder='Usuario'
                    onChange={(e)=>setNombre(e.target.value)}
                    aria-label='aria-labelledby'
                    />
                <label className='ms-2'>Contraseña</label>
                <Input 
                    className='ms-4'
                    placeholder='Contraseña'
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