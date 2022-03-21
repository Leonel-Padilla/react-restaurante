import { useNavigate, useParams} from "react-router-dom";
import React, {useState, useEffect, useRef} from 'react'
import { Button, Input, Textarea, Modal, Text} from '@nextui-org/react'
import axios from "axios";


const endPointGetSucursal       = 'http://127.0.0.1:8000/api/Sucursal'
const endPointUpdate            = 'http://127.0.0.1:8000/api/updateSucursal'
const endPointGetAllEmpleados   = 'http://127.0.0.1:8000/api/Empleado'
const endPointGetAllEmpleado    = 'http://127.0.0.1:8000/api/Empleado'

function ActualizarSucursal() {


    const [empleados, setEmpleados]                 = useState([])
    const [sucursalNombre, setSucursalNombre]       = useState('')
    const [sucursalDireccion, setSucursalDireccion] = useState('')
    const [sucursalEstado, setSucursalEstado]       = useState(1)
    let   empleadoId                                = 0
    const [sucursalEncargado, setSucursalEncargado] = useState('')
    const navigate                                  = useNavigate()
    const {id}                                      = useParams()
    

    const [mensajeModal, setMensajeModal]   = useState('')
    const [tituloModal, setTituloModal]     = useState('')
    const [visible, setVisible]             = useState(false)
    const refButton                         = useRef()

    useEffect(()=>{
        getAllEmpleados()
        getSucursal()
        
    }, [])


    //
    const getSucursal = async ()=>{
        const response =  await axios.get(`${endPointGetSucursal}/${id}`)
        const response1 = await axios.get(`${endPointGetAllEmpleado}/${response.data.empleadoId}`)


        setSucursalEncargado(response1.data.empleadoNombre)
        setSucursalNombre(response.data.sucursalNombre)
        setSucursalDireccion(response.data.sucursalDireccion)
    }

    //
    const actualizar = async (e)=>{
        e.preventDefault()


        if (sucursalEncargado.includes('Seleccione')){
            setTituloModal('Error')
            setMensajeModal('Debe seleccionar un Encargado.')
            setVisible(true)
        }else{
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
    
            formatearEmpleadoId()
            const response = await axios.put(`${endPointUpdate}/${id}`, {empleadoId: empleadoId, sucursalNombre: sucursalNombre,
                sucursalDireccion: sucursalDireccion, estado: sucursalEstado})
          
            if (response.status !== 200){
          
                setTituloModal('Error')
                setMensajeModal(response.data.Error)
                setVisible(true)
            }else(
            navigate('/Sucursales')
            )
        }
        }
    
    }

    // 
    const getAllEmpleados = async ()=>{
        const respose = await axios.get(endPointGetAllEmpleados)
        setEmpleados(respose.data)
    }

    //
    const formatearEmpleadoId = ()=>{
        empleados.map((empleado)=>{
            if(empleado.empleadoNombre == sucursalEncargado){
                empleadoId = empleado.id
            }
        })
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
                    <label>Nombre Sucursal:</label>
                    <input
                    placeholder='Sucursal de las uvas'
                    value={sucursalNombre}
                    onChange={(e)=>setSucursalNombre(e.target.value)}
                    type='text'
                    pattern='[A-Za-z ]{3,}'
                    title='Solo se aceptan letras'
                    className='form-control'
                    />
                </div>
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
                    value={sucursalEncargado}
                    onChange={(e)=>setSucursalEncargado(e.target.value)}
                    className='select'
                    >
                        <option>Seleccione un Encargado</option>
                        
                        {empleados.map((empleado)=>
                            <option key={empleado.id}>{empleado.empleadoNombre}</option>
                        )}

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