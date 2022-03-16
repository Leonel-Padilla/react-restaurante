import { useNavigate, useParams} from "react-router-dom";
import React, {useState, useEffect, useRef} from 'react'
import { Button, Input, Textarea, Modal, Text} from '@nextui-org/react'
import axios from "axios";


const endPointGetSucursal = 'http://127.0.0.1:8000/api/Sucursal'
const endPointUpdate = 'http://127.0.0.1:8000/api/updateSucursal'

function ActualizarSucursal() {


    const [sucursalDireccion, setSucursalDireccion] = useState('')
    const [sucursalEstado, setSucursalEstado] = useState(1)
    const [sucursalEmpleado, setSucursalEmpleado] = useState('')
    const navigate = useNavigate()
    const {id} = useParams()

    const [mensajeModal, setMensajeModal] = useState('')
    const [tituloModal, setTituloModal] = useState('')
    const [visible, setVisible] = useState(false)
    const refButton = useRef()

    useEffect(()=>{
        getSucursal()
    }, [])

  const getSucursal = async ()=>{
      const response =  await axios.get(`${endPointGetSucursal}/${id}`)

      setSucursalDireccion(response.data.sucursalDireccion)
      setSucursalEmpleado(response.data.sucursalEmpleado)
      
      //console.log(response.data)    //DEV
  }

  const actualizar = async (e)=>{
    e.preventDefault()

    const datos = [sucursalDireccion, sucursalEmpleado]
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
        const response = await axios.put(`${endPointUpdate}/${id}`, {sucursalDireccion: sucursalDireccion,
            sucursalEmpleado: sucursalEmpleado, estado: sucursalEstado})
      
          if (response.status !== 200){
      
              setTituloModal('Error')
              setMensajeModal(response.data.Error)
              setVisible(true)
          }else(
            navigate('/Sucursales')
          )
    }
    
}

const verificar = (setear = () => {}, cadenaTexto)=>{
    setear()
    if (/(.)\1\1/.test(cadenaTexto)) {
    refButton.current.disabled = "disabled"
    setTituloModal('Error')
    setMensajeModal('La informacion ingresada contiene tres caracteres repetidos seguidos. ' +
     'No podra guardar hasta solucionar el error.')
    setVisible(true)
    }
    else{
        refButton.current.disabled = false
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
              <h1 className='text-white'>Actualizar Sucursal</h1>
          </div>

            <form onSubmit={actualizar} className='formulario'>

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

export default ActualizarSucursal