import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Modal, Text} from '@nextui-org/react'
import { toHaveDisplayValue } from '@testing-library/jest-dom/dist/matchers'

import Datepicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import subDays from "date-fns/subDays"
import addDays from "date-fns/addDays"

const endPointRegistrarEmpleado = 'http://127.0.0.1:8000/api/addEmpleado'
const endPointRegistrarTipoDocumento = 'http://127.0.0.1:8000/api/addTipoDocumento'
const endPointBuscarTipoDocumento = 'http://127.0.0.1:8000/api/TipoDocumentoND'
const endPointBuscarTodosDocumentos = 'http://127.0.0.1:8000/api/TipoDocumento'
const endPointEliminarTipoDocumento = 'http://127.0.0.1:8000/api/deleteTipoDocumento'

const AgregarEmpleado = () =>{
    const [empleadoNombre, setEmpleadoNombre] = useState('')
    const [empleadoNumero, setEmpleadoNumero] = useState('')
    const [empleadoCorreo, setEmpleadoCorreo] = useState('')
    const [empleadoDireccion, setEmpleadoDireccion] = useState('')
    const [empleadoEstado, setEmpleadoEstado] = useState(1)

    const [todosDocumentos, setTodosDocumentos] = useState([])
    const [empleadoNombreDocumento, setEmpleadoNombreDocumento] = useState('RTN')
    const [empleadoNumeroDocumento, setEmpleadoNumeroDocumento] = useState('')
    const [documentoEstado, setDocumentoEstado] = useState(1)
    const navigate = useNavigate()
    const [startDate, setStartDate] = useState(new Date());

    const [mensajeModal, setMensajeModal] = useState('')
    const [tituloModal, setTituloModal] = useState('')
    const [visible, setVisible] = useState(false)


    useEffect(()=>{

        getAllDocumentos()
    },[])
    
    const registrar = async (e)=>{
        e.preventDefault()
        //getAllDocumentos()

        let igualdad = false
        todosDocumentos.map((documento)=>{
            if (documento.numeroDocumento == empleadoNumeroDocumento){
                igualdad = true
            }
        })

        if (igualdad){
                setTituloModal('Error')
                setMensajeModal('Ya hay un registro con ese numero de documento')
                setVisible(true)
        }else{
            const response = await axios.post(endPointRegistrarTipoDocumento, {nombreDocumento: empleadoNombreDocumento,
                numeroDocumento: empleadoNumeroDocumento, estado: documentoEstado})
    
            if (response.status !== 200){
                //console.log(response.data) //DEV
                setTituloModal('Error')
                setMensajeModal(response.data.Error)
                setVisible(true)
                
            }else{
                
                const responseDocumento = await axios.get(`${endPointBuscarTipoDocumento}/${empleadoNumeroDocumento}`)
    
                const response1 = await axios.post(endPointRegistrarEmpleado, {tipoDocumentoId: responseDocumento.data.id,
                    empleadoNombre: empleadoNombre, empleadoNumero: empleadoNumero, empleadoCorreo: empleadoCorreo,
                    empleadoDireccion: empleadoDireccion, estado: empleadoEstado})
    
                if (response1.status !== 200){
                    const response = await axios.delete(`${endPointEliminarTipoDocumento}/${responseDocumento.data.id}`)

                    setTituloModal('Error')
                    setMensajeModal(response1.data.Error)
                    setVisible(true)

                }else{
                    /*setTituloModal('Exito')
                    setMensajeModal('Registrado con Exito')
                    setVisible(true)
                    console.log(response.status)
                    console.log(tituloModal)
                    console.log(mensajeModal)
                    console.log(visible)*/

                    navigate('/Empleados')

                }
            }
        }
    }

    const getAllDocumentos = async ()=>{
        const response = await axios.get(endPointBuscarTodosDocumentos)

        setTodosDocumentos(response.data)

        //console.log(response.data) //DEV
    }

    const onClose = ()=>{
        if (tituloModal == 'Error'){
            setVisible(false)
        }else{
            setVisible(false)
            navigate('/Empleados')
        }
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
            {/*onClose={()=>onClose()}>*/}
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
                <h1 className='text-white'>Registrar Empleado</h1>
            </div>

            <form onSubmit={registrar} className='formulario'>

                <div className='atributo'>
                <label>Nombre:</label>
                <input
                placeholder='Jose Perez'
                pattern='[A-Za-z]{3,}'
                maxLength={10}
                value={empleadoNombre}
                onChange={(e)=> setEmpleadoNombre(e.target.value)}
                type='text'
                className='form-control'
                />
                </div>

                <div className='atributo'>
                <label>Numero telefonico:</label>
                <input
                placeholder='88922711'
                value={empleadoNumero}
                onChange={(e)=> setEmpleadoNumero(e.target.value)}
                type='number'
                className='form-control'
                />
                </div>

                <div className='atributo'>
                <label>Correo electronico:</label>
                <input
                placeholder='ejem@gmail.com'
                value={empleadoCorreo}
                onChange={(e)=> setEmpleadoCorreo(e.target.value)}
                type='email'
                className='form-control'
                />
                </div>

                <div className='atributo'>
                <label>Direccion:</label>
                <input
                placeholder='Res. Las uvas'
                value={empleadoDireccion}
                onChange={(e)=> setEmpleadoDireccion(e.target.value)}
                type='text'
                className='form-control'/>
                </div>

                <div className='atributo'>
                <label>Tipo Documentacion</label>
                <select
                value={empleadoNombreDocumento}
                onChange={(e)=> setEmpleadoNombreDocumento(e.target.value)}
                type='number'
                className='select'
                >
                </select>
                </div>

                <div className='atributo'>
                <label>Numero documento:</label>
                <input
                maxLength={14}
                value={empleadoNumeroDocumento}
                onChange={(e)=> setEmpleadoNumeroDocumento(e.target.value)}
                type='text'
                className='form-control'
                />
                </div>

                <div className='atributo'>
                <label>Fecha Nacimiento:</label>
                <Datepicker
                 selected={startDate}
                 onChange={(date) => setStartDate(date)}
                 minDate={subDays(new Date(), 365)}
                  />
                </div>

                <div className='atributo'>
                <label>Fecha Contrato:</label>
                <Datepicker
                 selected={startDate}
                 onChange={(date) => setStartDate(date)}
                 maxDate={addDays(new Date(), 10)}
                 />
                </div>

                <div className='atributo'>
                <label>Usuario:</label>
                <input
                 placeholder='empleado1'
                 //value={}
                 //onChange={}
                 type='text'
                 className='form-control'
                 />
                </div>

                <div className='atributo'>
                <label>Contraseña:</label>
                <input
                 //value={}
                 //onChange={}
                 type='password'
                 className='form-control'
                 />
                </div>

                <div className='atributo'>
                <label>Confirmar contraseña:</label>
                <input
                 //value={}
                 //onChange={}
                 type='password'
                 className='form-control'
                 />
                </div>

                <div className='atributo'>
                <label>Cargo actual</label>
                <select
                //value={}
                //onChange={}
                className='select'> 
                </select>
                </div>

                <div className='d-flex'>
                    <Button 
                    color={'gradient'}
                    className='align-self-end me-2 mt-2' 
                    auto 
                    onClick={()=>navigate('/Empleados')}
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

export default AgregarEmpleado