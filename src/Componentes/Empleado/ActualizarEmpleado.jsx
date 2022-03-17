import { useNavigate, useParams} from "react-router-dom";
import React, {useState, useEffect} from 'react'
import { Button, Input, Text, Modal} from '@nextui-org/react'
import axios from "axios";

import Datepicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import subDays from "date-fns/subDays"
import addDays from "date-fns/addDays"


const endpointGetEmpleado = 'http://127.0.0.1:8000/api/Empleado'
const endPointActualizarEmpleado = 'http://127.0.0.1:8000/api/updateEmpleado'
const endPointBuscarTodosCargos = 'http://127.0.0.1:8000/api/Cargo'
const endPointGetCargoById = 'http://127.0.0.1:8000/api/Cargo'
const endPointBuscarTodosDocumentos = 'http://127.0.0.1:8000/api/TipoDocumento'
const endPointGetDocumentoById = 'http://127.0.0.1:8000/api/TipoDocumento'

const ActualizarEmpleado = () =>{
    const [tipoDocumentoId, setTipoDocumentoId] = useState()
    const [numeroDocumento, setNumeroDocumento] = useState('')
    const [empleadoNombre, setEmpleadoNombre] = useState('')
    const [empleadoNumero, setEmpleadoNumero] = useState('')
    const [empleadoCorreo, setEmpleadoCorreo] = useState('')
    const [empleadoUsuario, setEmpleadoUsuario] = useState('')
    const [empleadoContrasenia, setEmpleadoContrasenia] = useState('')
    const [empleadoDireccion, setEmpleadoDireccion] = useState('')
    const [cargoActualId, setCargoActual] = useState()
    const [fechaContratacion, setFechaContratacion] = useState()
    const [fechaNacimiento, setFechaNacimiento] = useState()
    const [empleadoEstado, setEmpleadoEstado] = useState()
    let digitosNumero = 14
    let idDocumento = 1
    let idCargo = 1
    
    const [todosDocumentos, setTodosDocumentos] = useState([])
    const [todosCargos, setTodosCargos] = useState([])

    const navigate = useNavigate()

    const [startDate, setStartDate] = useState(new Date());
    const [mensajeModal, setMensajeModal] = useState('')
    const [tituloModal, setTituloModal] = useState('')
    const [visible, setVisible] = useState(false)

    const {id} = useParams()

    useEffect(()=>{
        getAllDocumentos()
        getAllCargos()
        getEmpleadoById()
        
    }, [])



    const getEmpleadoById = async ()=>{

        const response = await axios.get(`${endpointGetEmpleado}/${id}`)

        const response1 = await axios.get(`${endPointGetDocumentoById}/${response.data.tipoDocumentoId}`)

        const response2 = await axios.get(`${endPointGetCargoById}/${response.data.cargoActualId}`)

        setTipoDocumentoId(response1.data.nombreDocumento)
        setCargoActual(response2.data.cargoNombre)
        setNumeroDocumento(response.data.numeroDocumento)
        setEmpleadoNombre(response.data.empleadoNombre)
        setEmpleadoNumero(response.data.empleadoNumero)
        setEmpleadoCorreo(response.data.empleadoCorreo)
        setEmpleadoDireccion(response.data.empleadoDireccion)
        setEmpleadoEstado(response.data.estado)
        setEmpleadoUsuario(response.data.empleadoUsuario)
        setEmpleadoContrasenia(response.data.empleadoContrasenia)
        setFechaContratacion(response.data.fechaContratacion)
        setFechaNacimiento(response.data.fechaNacimiento)


        //console.log(response.data)   //DEV
    }



    const actualizar = async (e)=>{
        e.preventDefault()

        /*console.log(idDocumento)
        console.log(numeroDocumento)
        console.log(empleadoNombre)
        console.log(empleadoNumero)
        console.log(empleadoCorreo)
        console.log(empleadoUsuario)
        console.log(empleadoContrasenia)
        console.log(empleadoDireccion)
        console.log(idCargo)
        console.log(fechaContratacion)
        console.log(fechaNacimiento)
        console.log(empleadoEstado)*/

        formatearCargo()
        formatearIdDocumento()

        const response = await axios.put(`${endPointActualizarEmpleado}/${id}`, 
        {tipoDocumentoId: idDocumento, numeroDocumento: numeroDocumento, empleadoNombre: empleadoNombre, empleadoNumero: empleadoNumero,
        empleadoCorreo: empleadoCorreo, empleadoUsuario: empleadoUsuario, empleadoContrasenia: empleadoContrasenia,
        empleadoDireccion: empleadoDireccion, cargoActualId: idCargo, fechaContratacion: fechaContratacion, 
        fechaNacimiento: fechaNacimiento, estado: empleadoEstado})

        if (response.status !== 200){
            setTituloModal('Error')
            setMensajeModal(response.data.Error)
            setVisible(true)
        }else{
            navigate('/Empleados')
        }
    }

    const getAllDocumentos = async ()=>{
        const response = await axios.get(endPointBuscarTodosDocumentos)

        setTodosDocumentos(response.data)
    }

    const getAllCargos = async ()=>{
        const response = await axios.get(endPointBuscarTodosCargos)

        setTodosCargos(response.data)
    }
    
    const verificarTipoDocumento = ()=> {

        switch (tipoDocumentoId){
            case 'RTN': digitosNumero = 14 
                break
            case 'Identidad': digitosNumero = 13 
                break
            case 'Pasaporte': digitosNumero = 7 
                break
            case 'Visa': digitosNumero = 13
                break
            case 'Licencia Conducir': digitosNumero = 13 
                break
        }

    }

    const formatearCargo = ()=>{
        todosCargos.map((cargo)=>{
            if (cargo.cargoNombre == cargoActualId){
                idCargo = cargo.id
            }
        })
    }

    const formatearIdDocumento = ()=>{
        todosDocumentos.map((documento)=>{
            if(documento.nombreDocumento == tipoDocumentoId){
                idDocumento = documento.id
            }
        })
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
                pattern='[A-Za-z ]{3,}'
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
                <label>Tipo Documento</label>
                <select
                value={tipoDocumentoId}
                onChange={(e)=> setTipoDocumentoId(e.target.value)}
                type='number'
                className='select'
                >
                    {todosDocumentos.map((documento)=> {
                        verificarTipoDocumento()
                        return(<option key={documento.id}>{documento.nombreDocumento}</option>)
                    })
                    }
                </select>
                </div>

                <div className='atributo'>
                <label>Numero documento:</label>
                <input
                required={true}
                minLength={digitosNumero}
                maxLength={digitosNumero}
                placeholder='0801199110122'
                value={numeroDocumento}
                onChange={(e)=> setNumeroDocumento(e.target.value)}
                type='text'
                className='form-control'
                />
                </div>

                <div className='atributo'>
                <label>Nuevo usuario:</label>
                <input
                 placeholder='empleado1'
                 value={empleadoUsuario}
                 onChange={(e)=>setEmpleadoUsuario(e.target.value)}
                 type='text'
                 className='form-control'
                 />
                </div>

                <div className='atributo'>
                <label>Nueva contraseña:</label>
                <input
                 value={empleadoContrasenia}
                 onChange={(e)=>setEmpleadoContrasenia(e.target.value)}
                 type='password'
                 className='form-control'
                 />
                </div>


                {/* <div className='atributo'>
                <label>Confirmar nueva contraseña:</label>
                <input
                 //value={}
                 //onChange={}
                 type='password'
                 className='form-control'
                 />
                </div> */}
                
                <div className='atributo'>
                <label>Cargo actual</label>
                <select
                value={cargoActualId}
                onChange={(e)=>setCargoActual(e.target.value)}
                className='select'> 
                    {todosCargos.map((cargo)=><option key={cargo.id}>{cargo.cargoNombre}</option>)}
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