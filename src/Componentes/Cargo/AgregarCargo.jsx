import React, {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Modal, Text, Textarea} from '@nextui-org/react'

const endPointRegistarCargo = 'http://127.0.0.1:8000/api/addCargo'

function AgregarCargo() {

    const [cargoNombre, setCargoNombre] = useState('')
    const [cargoDescripcion, setCargoDescripcion] = useState('')
    const [cargoEstado, setCargoEstado] = useState(1)
    const navigate = useNavigate()

    const [mensajeModal, setMensajeModal] = useState('')
    const [tituloModal, setTituloModal] = useState('')
    const [visible, setVisible] = useState(false)

    const registrar = async (e)=>{
        e.preventDefault()
        const response = await axios.post(endPointRegistarCargo, {cargoNombre: cargoNombre, 
        cargoDescripcion: cargoDescripcion, estado: cargoEstado})

        if (response.status !== 200){
            /*console.log(response.data) //DEV
            alert(response.data.Error)*/

            setTituloModal('Error')
            setMensajeModal(response.data.Error)
            setVisible(true)
        }else{
            navigate('/Cargos')
        }
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
              <h1 className='text-white'>Registrar Cargo</h1>
          </div>

            <form onSubmit={registrar} className='formulario'>
                <div className='atributo'>
                    <input
                    placeholder='Nombre'
                    value={cargoNombre}
                    onChange={(e)=> setCargoNombre(e.target.value)}
                    type='text'
                    pattern='[A-Za-z]{3,}'
                    title='Solo se aceptan letras, Ejemplo: "Cocinero"'
                    className='form-control'
                    />
                </div>

                <div className='atributo'>
                    <Textarea
                    underlined
                    labelPlaceholder='Descripcion'
                    value={cargoDescripcion}
                    onChange={(e)=> setCargoDescripcion(e.target.value)}
                    type='text'
                    className='form-control p-3'
                    />
                </div>

                <div className='atributo'>
                    <label>Estado</label> <br/>
                    <select
                    value={cargoEstado}
                    onChange={(e)=> setCargoEstado(e.target.value)}
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
                    className='align-self-end me-2 mt-2' 
                    auto 
                    onClick={()=>navigate('/Cargos')}
                    ghost>
                        Regresar
                    </Button>

                    <Button 
                    auto
                    className='align-self-end me-2 mt-2' 
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

export default AgregarCargo