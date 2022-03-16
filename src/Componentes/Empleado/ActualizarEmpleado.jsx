import { useNavigate, useParams} from "react-router-dom";
import React, {useState, useEffect} from 'react'
import { Button, Input, Text, Modal} from '@nextui-org/react'
import axios from "axios";

import Datepicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import subDays from "date-fns/subDays"
import addDays from "date-fns/addDays"

const ActualizarEmpleado = () =>{
    const [empleadoNombre, setEmpleadoNombre] = useState('')
    const [empleadoNumero, setEmpleadoNumero] = useState('')
    const [empleadoCorreo, setEmpleadoCorreo] = useState('')
    const [empleadoDireccion, setEmpleadoDireccion] = useState('')
    const [empleadoEstado, setEmpleadoEstado] = useState(1)

    const [mensajeModal, setMensajeModal] = useState('')
    const [tituloModal, setTituloModal] = useState('')
    const [visible, setVisible] = useState(false)
    const [startDate, setStartDate] = useState(new Date());

    const [empleadoIdDocumento, setEmpleadoIdDocumento] = useState(0)
    const [empleadoNombreDocumento, setEmpleadoNombreDocumento] = useState('RTN')
    const [empleadoNumeroDocumento, setEmpleadoNumeroDocumento] = useState('')
    const [documentoEstado, setDocumentoEstado] = useState(1)
    const {id} = useParams()
    const navigate = useNavigate()

    useEffect(()=>{
        getEmpleadoById()
    }, [])

    const endpointGetEmpleado = 'http://127.0.0.1:8000/api/Empleado'
    const endpointGetTipoDocumento = 'http://127.0.0.1:8000/api/TipoDocumento'
    const endPointActualizarTipoDocumento = 'http://127.0.0.1:8000/api/updateTipoDocumento'
    const endPointActualizarEmpleado = 'http://127.0.0.1:8000/api/updateEmpleado'

    const getEmpleadoById = async ()=>{

        const response = await axios.get(`${endpointGetEmpleado}/${id}`)

        setEmpleadoNombre(response.data.empleadoNombre)
        setEmpleadoNumero(response.data.empleadoNumero)
        setEmpleadoCorreo(response.data.empleadoCorreo)
        setEmpleadoDireccion(response.data.empleadoDireccion)
        setEmpleadoEstado(response.data.estado)

        getTipoDocumentoById(response.data.tipoDocumentoId)

        //console.log(response.data)   //DEV
    }

    const getTipoDocumentoById = async (id) =>{
        const response = await axios.get(`${endpointGetTipoDocumento}/${id}`)

        setEmpleadoIdDocumento(response.data.id)
        setEmpleadoNombreDocumento(response.data.nombreDocumento)
        setEmpleadoNumeroDocumento(response.data.numeroDocumento)
    }


    const actualizar = async (e)=>{
        e.preventDefault()

        const response = await axios.put(`${endPointActualizarEmpleado}/${id}`, 
            {tipoDocumentoId: empleadoIdDocumento, empleadoNombre: empleadoNombre, empleadoNumero: empleadoNumero, 
            empleadoCorreo: empleadoCorreo, empleadoDireccion: empleadoDireccion, estado: empleadoEstado})

        if (response.status !== 200){
            /*console.log(response.data) //DEV
            alert(response.data.Error)*/
            setTituloModal('Error')
            setMensajeModal(response.data.Error)
            setVisible(true)
        }else{
            const response1 = await axios.put(`${endPointActualizarTipoDocumento}/${empleadoIdDocumento}`, 
            {nombreDocumento: empleadoNombreDocumento, numeroDocumento: empleadoNumeroDocumento, estado: documentoEstado})

            if (response1.status !== 200){
                setTituloModal('Error')
                setMensajeModal(response1.data.Error)
                setVisible(true)
                /*console.log(response1.data)
                alert(response1.data.Error)*/
            }else{
                navigate('/Empleados')
            }
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
                <h1 className='text-white'>Actualizar Empleado</h1>
            </div>

            <form onSubmit={actualizar} className='formulario'>
                <div className='atributo'>
                <label>Nombre:</label>
                <input
                placeholder='Jose Perez'
                pattern='[A-Za-z]{3,}'
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
                placeholder='0801199110122'
                //value={empleadoNumeroDocumento}
                //onChange={(e)=> setEmpleadoNumeroDocumento(e.target.value)}
                type='text'
                className='form-control'
                />
                </div>

                <div className='atributo'>
                <label>Nuevo usuario:</label>
                <input
                 placeholder='empleado1'
                 //value={}
                 //onChange={}
                 type='text'
                 className='form-control'
                 />
                </div>

                <div className='atributo'>
                <label>Nueva contraseña:</label>
                <input
                 //value={}
                 //onChange={}
                 type='password'
                 className='form-control'
                 />
                </div>


                <div className='atributo'>
                <label>Confirmar nueva contraseña:</label>
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
                

                

               

               



                <div className="d-flex">
                    <Button 
                    color={'gradient'}
                    className='align-self-end me-2' 
                    auto 
                    onClick={()=>navigate('/Empleados')}
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

export default ActualizarEmpleado