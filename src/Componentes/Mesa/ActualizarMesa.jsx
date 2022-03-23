import { useNavigate, useParams} from "react-router-dom";
import React, {useState, useEffect, useRef} from 'react'
import { Button, Input, Modal, Text} from '@nextui-org/react'
import axios from "axios";

const ActualizarMesa = ()=>{

    const navigate = useNavigate()
    const [mensajeModal, setMensajeModal] = useState('')
    const [tituloModal, setTituloModal] = useState('')
    const [visible, setVisible] = useState(false)

    const Actualizar = () =>{
    }

    return (
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
                <h1 className='text-white'>Actualizar Mesas</h1>
            </div>

            <form onSubmit={Actualizar} className='formulario'>
                
                <div className='atributo'>
                <label>Id de sucursales</label>
                <select
                //value={cargoActualId}
                //onChange={(e)=>setCargoActual(e.target.value)}
                className='select'> 
                </select>

                </div>
                <div className='atributo'>
                    <label>Cantidad de asientos:</label>
                    <input
                    aria-label='aria-describedby'
                    //value={cargoNombre}
                    placeholder='numeros del 0-9'
                    //onChange={(e)=>setCargoNombre(e.target.value)}
                    type='text'
                    maxLength={3}
                    pattern='[0-9]{1,}'
                    title='numeros del 0-9"'
                    className='form-control'
                    />
                </div>
                <div className='d-flex mt-2'>
                    <Button 
                    color={'gradient'}
                    className='align-self-end me-3 ' 
                    auto 
                    onClick={()=>navigate('/Mesas')}
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

export default ActualizarMesa
