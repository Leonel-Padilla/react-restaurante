import React, {useState} from 'react'
import { Link, Navigate, useNavigate, useNavigationType } from 'react-router-dom'
import { Row, Button, Modal, Text, Input } from '@nextui-org/react';
import FondoLogin from '../../img/FondoLogin.jpg'


function MenuLogin () {
    //const [visible, setVisible] = useState(true);
    const [nombre, setNombre] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()



    const validar = ()=>{
        console.log(nombre, password)

        if (nombre == 'admin' && password == 'admin'){
            navigate('/MenuPrincipal')
        }else{
            alert('Credenciales Invalidas')
        }
    }

    return (
        
            <div className="container">
                <div className='container border-style col-sm-6 col-md-4 col-lg-3'>
                    <form className='form'>
                        <h2 className="mt-5 mb-4 ms-5 ">Bienvenidos</h2>
                        <div className="mb-3">
                        <Input
                        className='text-white mt-3 ms-4 form-control'
                        underlined
                        placeholder='Usuario'
                        onChange={(e)=>setNombre(e.target.value)}
                        aria-label='aria-labelledby'
                        />
                        </div>
                        <div className="mb-3">
                        <Input
                        className='text-white mt-3 ms-4 form-control' 
                        underlined
                        placeholder='contraseña'
                        type='password'
                        onChange={(e)=>setPassword(e.target.value)}
                        aria-label='aria-labelledby'/>
                        </div>
                        <Button 
                        className='bg-dark mt-4 ms-5'
                        onClick={()=>validar()} 
                        >Ingresar</Button>
                    </form>
                </div>
            </div>    
        
        
    );    
    }

    export default MenuLogin