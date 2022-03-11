import React, {useState} from 'react'
import { Link, Navigate, useNavigate, useNavigationType } from 'react-router-dom'
import { Row, Button, Modal, Text, Input } from '@nextui-org/react';
import FondoLogin from '../../img/FondoLogin.jpg'


function MenuLogin () {
    const [visible, setVisible] = useState(true);
    const [nombre, setNombre] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const validar = ()=>{
        console.log(nombre, password)

        if (nombre == 'admin' || password == 'admin'){
            navigate('/MenuPrincipal')
        }else{
            alert('Credenciales Invalidas')
        }
    }

    return (
    <div>

        <img  src={FondoLogin}/>
        <Modal 
            preventClose
            blur
            aria-labelledby="modal-title"
            open={visible}
        >
            <Modal.Header>
                <Text id="Titulo" b size={18}>
                Bienvenido
                </Text>
            </Modal.Header>
            <Modal.Body>
                <Input
                    className='text-white'
                    clearable
                    bordered
                    fullWidth
                    onChange={(e)=>setNombre(e.target.value)}
                    size="lg"
                    placeholder="Usuario"
                    aria-label='aria-labelledby'
                    
                />
                <Input.Password
                    className='text-white'
                    clearable
                    bordered
                    onChange={(e)=>setPassword(e.target.value)}
                    fullWidth
                    size="lg"
                    placeholder="Contraseña"
                    aria-label='aria-labelledby'
                    
                />
            </Modal.Body>
            <Modal.Footer className='d-flex'>
                <Button 
                className='bg-dark'
                style={{right: '80px'}}
                onClick={()=>validar()} 
                
                
                >Ingresar</Button>
            </Modal.Footer>
        </Modal>
    </div>
    
    );    
    }

    export default MenuLogin