import { useNavigate, useParams} from "react-router-dom";
import React, {useState, useEffect, useRef} from 'react'
import { Button, Input, Modal, Text} from '@nextui-org/react'
import axios from "axios";




const ActualizarProducto = () =>{


    const navigate = useNavigate()
    const [mensajeModal, setMensajeModal]   = useState('')
    const [tituloModal, setTituloModal]     = useState('')
    const [visible, setVisible]             = useState(false)

    const actualizar =  ()=>{
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
                <h1 className='text-white'>Actualizar Producto</h1>
            </div>


            <form onSubmit={actualizar} className='formulario'>
            <div className='atributo'>
                <label>Producto Nombre:</label>
                <input
                placeholder='Hamburguesa'
                pattern='[A-Za-z ]{3,}'
                maxLength={50}
                //value={empleadoNombre}
                //onChange={}
                type='text'
                className='form-control'
                />
                </div>


                <div className='atributo'>
                    <label>Descripción del Producto:</label>
                    <textarea
                    aria-label='aria-describedby'
                    placeholder='Hamburguesa con queso'
                    maxLength={100}
                    //value={}
                    //onChange={}
                    type='text'
                    className='form-control p-4'
                    />
                </div>

                <div className='atributo'>
                <label>Precio Producto:</label>
                <input
                placeholder='L. 100'
                //value={}
                //onChange={}
                type='text'
                pattern='^[0-9]+$'
                maxLength={8}
                className='form-control'
                />
                </div>

                <div className='d-flex'>
                    <Button 
                    color={'gradient'}
                    className='align-self-end me-2' 
                    auto 
                    onClick={()=>navigate('/Productos')}
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
    );

}
export default ActualizarProducto