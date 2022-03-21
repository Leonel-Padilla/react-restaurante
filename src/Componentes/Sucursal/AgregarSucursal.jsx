import React, {useEffect, useRef, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, Text, Textarea} from '@nextui-org/react'

const endPointRegistrarSucursal = 'http://127.0.0.1:8000/api/addSucursal'
const endPointGetAllEmpleados   = 'http://127.0.0.1:8000/api/Empleado'

function AgregarSucursal() {


    const [empleados, setEmpleados]                 = useState([])
    const [sucursalNombre, setSucursalNombre]       = useState('')
    const [sucursalDireccion, setSucursalDireccion] = useState('')
    const [sucursalEncargado, setSucursalEncargado] = useState('Seleccione')
    let   empleadoId                                = 0
    const [sucursalEstado, setSucursalEstado]       = useState(1)
    const navigate                                  = useNavigate()

    const [mensajeModal, setMensajeModal]           = useState('')
    const [tituloModal, setTituloModal]             = useState('')
    const [visible, setVisible]                     = useState(false)
    const refButton                                 = useRef()


    useEffect(()=>{
        getAllEmpleados()
    },[])


    //
    const registrar = async (e)=>{
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

                console.log(empleadoId, sucursalNombre, sucursalDireccion, sucursalEstado)
    
                const response = await axios.post(endPointRegistrarSucursal, {empleadoId: empleadoId, sucursalNombre: sucursalNombre,
                sucursalDireccion: sucursalDireccion, estado: sucursalEstado})


            
                if (response.status !== 200){
                    setTituloModal('Error')
                    setMensajeModal(response.data.Error)
                    setVisible(true)


                }else{
                    navigate('/Sucursales')
                }
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
              <h1 className='text-white'>Registrar Sucursal</h1>
          </div>

            <form onSubmit={registrar} className='formulario'>
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
                    onChange={(e)=> setSucursalEncargado(e.target.value)}
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

export default AgregarSucursal