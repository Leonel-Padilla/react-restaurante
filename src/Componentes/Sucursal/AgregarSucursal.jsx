import React, {useRef, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, Text, Textarea} from '@nextui-org/react'

const endPointRegistrarSucursal = 'http://127.0.0.1:8000/api/addSucursal'

function AgregarSucursal() {

    const [sucursalDireccion, setSucursalDireccion] = useState('')
    const [sucursalEstado, setSucursalEstado] = useState(1)
    const navigate = useNavigate()

    const [mensajeModal, setMensajeModal] = useState('')
    const [tituloModal, setTituloModal] = useState('')
    const [visible, setVisible] = useState(false)
    const refButton = useRef()

    const registrar = async (e)=>{
        e.preventDefault()
        
        const datos = [sucursalDireccion]
        let contador = 0

        datos.map((dato)=>{
            if (/(.)\1\1/.test(dato)) {
                
                contador++
            
            }
        })


        if (contador > 0){
            setTituloModal('Error')
            setMensajeModal('La información ingresada contiene mas de dos caracteres repetidos seguidos.')
            setVisible(true)
        }else{
            const response = await axios.post(endPointRegistrarSucursal, {sucursalDireccion: sucursalDireccion, 
            estado: sucursalEstado})
        
                if (response.status !== 200){
                    setTituloModal('Error')
                    setMensajeModal(response.data.Error)
                    setVisible(true)
                }else{
                    navigate('/Sucursales')
                }
        }

        
    }

  return (
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
              <h1 className='text-white'>Registrar Sucursal</h1>
          </div>

            <form onSubmit={registrar} className='formulario'>

                <div className='atributo'>
                    <label>Dirección Sucursal</label>
                    <Textarea
                    aria-label='aria-describedby'
                    underlined
                    placeholder='Colonia Las Uvas'
                    value={sucursalDireccion}
                    onChange={(e)=> setSucursalDireccion(e.target.value)}
                    type='text'
                    className='form-control p-4'
                    />
                </div>
                <div className='atributo'>
                    <label>Encargado Sucursal</label>
                    <select
                    // value={sucursalEmpleado}
                    // onChange={(e)=> (e.target.value)}
                    className='select'
                    >
                    </select>
                </div>
                <div className='d-flex mt-2'>

                    <Button 
                    color={'gradient'}
                    className='align-self-end me-3 ' 
                    auto 
                    onClick={()=>navigate('/Sucursales')}
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

export default AgregarSucursal