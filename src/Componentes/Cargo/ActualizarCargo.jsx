import { useNavigate, useParams} from "react-router-dom";
import React, {useState, useEffect} from 'react'
import { Button, Input, Textarea, Modal, Text} from '@nextui-org/react'
import axios from "axios";


const endPointGetCargo = 'http://127.0.0.1:8000/api/Cargo'
const endPointUpdate = 'http://127.0.0.1:8000/api/updateCargo'

function ActualizarCargo() {

  const [cargoNombre, setCargoNombre] = useState('')
  const [cargoDescripcion, setCargoDescripcion] = useState('')
  const [cargoEstado, setCargoEstado] = useState(1)
  const navigate = useNavigate()
  const {id} = useParams()

  const [mensajeModal, setMensajeModal] = useState('')
  const [tituloModal, setTituloModal] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(()=>{
    getCargo()
  }, [])

  const getCargo = async ()=>{
      const response =  await axios.get(`${endPointGetCargo}/${id}`)

      setCargoNombre(response.data.cargoNombre)
      setCargoDescripcion(response.data.cargoDescripcion)
      
      //console.log(response.data)    //DEV
  }

  const actualizar = async (e)=>{
    e.preventDefault()
    const response = await axios.put(`${endPointUpdate}/${id}`, {cargoNombre: cargoNombre,
      cargoDescripcion: cargoDescripcion, estado: cargoEstado})

    if (response.status !== 200){
        /*console.log(response.data) //DEV
        alert(response.data.Error)*/

        setTituloModal('Error')
        setMensajeModal(response.data.Error)
        setVisible(true)
    }else(
      navigate('/Cargos')
    )
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
              <h1 className='text-white'>Actualizar Cargo</h1>
          </div>

            <form onSubmit={actualizar} className='formulario'>
                <div className='atributo'>
                    <Input
                    underlined
                    labelPlaceholder='Nombre'
                    value={cargoNombre}
                    onChange={(e)=> setCargoNombre(e.target.value)}
                    type='text'
                    className='form-control'
                    />
                </div>
                <div className='atributo '>
                    <Textarea
                    underlined
                    labelPlaceholder='Descripcion'
                    value={cargoDescripcion}
                    onChange={(e)=> setCargoDescripcion(e.target.value)}
                    type='text'
                    className='form-control me-2 mb-3'
                    /> 
                </div>
                <div className='d-flex'>
                    <Button 
                    color={'gradient'}
                    className='align-self-end me-2' 
                    auto 
                    onClick={()=>navigate('/Cargos')}
                    ghost>
                        Regresar
                    </Button>

                    <Button 
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

export default ActualizarCargo