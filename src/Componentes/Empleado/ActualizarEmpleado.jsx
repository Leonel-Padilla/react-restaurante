import { useNavigate, useParams} from "react-router-dom";
import React, {useState, useEffect} from 'react'
import { Button, Input, Text, Modal} from '@nextui-org/react'
import axios from "axios";

import Datepicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import subDays from "date-fns/subDays"
import addDays from "date-fns/addDays"
import moment from 'moment';


const endpointGetEmpleado               = 'http://127.0.0.1:8000/api/Empleado'
const endPointActualizarEmpleado        = 'http://127.0.0.1:8000/api/updateEmpleado'
const endPointBuscarTodosCargos         = 'http://127.0.0.1:8000/api/Cargo'
const endPointGetCargoById              = 'http://127.0.0.1:8000/api/Cargo'
const endPointBuscarTodosDocumentos     = 'http://127.0.0.1:8000/api/TipoDocumento'
const endPointGetDocumentoById          = 'http://127.0.0.1:8000/api/TipoDocumento'
const endPointBuscarEmpleadoCargos      = 'http://127.0.0.1:8000/api/CargoHistorial'
const endPointActualizarEmpleadoCargos  = 'http://127.0.0.1:8000/api/updateCargoHistorial'
const endPointRegistrarCargoEmpleado    = 'http://127.0.0.1:8000/api/addCargoHistorial'
const endPointBuscarSueldoHistorico     = 'http://127.0.0.1:8000/api/SueldoHistorial'
const endPointActualizarSueldoHistorico = 'http://127.0.0.1:8000/api/updateSueldoHistorial'
const endPointRegistrarSueldoHistorico  = 'http://127.0.0.1:8000/api/addSueldoHistorial'
const endPointBuscarSucursales          = 'http://127.0.0.1:8000/api/Sucursal'

const ActualizarEmpleado = () =>{
    const [tipoDocumentoId, setTipoDocumentoId]             = useState()
    const [sucursalId, setSucursalId]                       = useState('')
    const [numeroDocumento, setNumeroDocumento]             = useState('')
    const [empleadoNombre, setEmpleadoNombre]               = useState('')
    const [empleadoNumero, setEmpleadoNumero]               = useState('')
    const [empleadoCorreo, setEmpleadoCorreo]               = useState('')
    const [empleadoUsuario, setEmpleadoUsuario]             = useState('')
    const [empleadoContrasenia, setEmpleadoContrasenia]     = useState('')
    const [empleadoContrasenia2, setEmpleadoContrasenia2]   = useState('')
    const [empleadoDireccion, setEmpleadoDireccion]         = useState('')
    const [cargoActualId, setCargoActual]                   = useState()
    const [fechaContratacion, setFechaContratacion]         = useState()
    const [fechaNacimiento, setFechaNacimiento]             = useState()
    const [empleadoSueldo, setEmpleadoSueldo]               = useState(0)
    const [sueldoEnCambio, setSueldoEnCambio]               = useState(0)
    const [empleadoEstado, setEmpleadoEstado]               = useState(1)
    const [cargoEnCambio, setCargoEnCambio]                 = useState('')
    let digitosNumero   = 14
    let idDocumento     = 1
    let idCargo         = 1
    let idSucursal      = 1
    
    const [todosDocumentos, setTodosDocumentos] = useState([])
    const [todosCargos, setTodosCargos]         = useState([])
    const [todasSucursales, setTodasSucursales] = useState([])
    const [empleadosCargos, setEmpleadosCargos] = useState([])
    const [sueldoHistorico, setSueldoHistorico] = useState([])
    let empleadoCargoNombre                     = ''

    const navigate = useNavigate()

    const [mensajeModal, setMensajeModal]   = useState('')
    const [tituloModal, setTituloModal]     = useState('')
    const [visible, setVisible]             = useState(false)
    const [tituloModal2, setTituloModal2]     = useState('')
    const [visible2, setVisible2]             = useState(false)

    let date = new Date()
    let valor = date.getDate()
    date.setDate(valor-1)

    let fechaFin = `${date.getFullYear()}-${date.getMonth() < 9? '0':''}${date.getMonth()+1}-${date.getDate()}`

    const {id} = useParams()

    useEffect(()=>{
        getAllDocumentos()
        getAllCargos()
        getEmpleadoById()
        getEmpleadosCargos()
        getSueldoHistorico()
        getAllSucursales()
        
    }, [])

    //
    const getEmpleadoById = async ()=>{

        const response = await axios.get(`${endpointGetEmpleado}/${id}`)

        const response1 = await axios.get(`${endPointGetDocumentoById}/${response.data.tipoDocumentoId}`)

        const response2 = await axios.get(`${endPointGetCargoById}/${response.data.cargoActualId}`)

        const response3 = await axios.get(`${endPointBuscarSucursales}/${response.data.sucursalId}`)

        setTipoDocumentoId(response1.data.nombreDocumento)
        setSucursalId(response3.data.sucursalNombre)
        setCargoEnCambio(response2.data.cargoNombre)
        setCargoActual(response2.data.cargoNombre)
        setNumeroDocumento(response.data.numeroDocumento)
        setEmpleadoNombre(response.data.empleadoNombre)
        setEmpleadoNumero(response.data.empleadoNumero)
        setEmpleadoCorreo(response.data.empleadoCorreo)
        setEmpleadoDireccion(response.data.empleadoDireccion)
        setEmpleadoEstado(response.data.estado)
        setEmpleadoUsuario(response.data.empleadoUsuario)
        setEmpleadoContrasenia(response.data.empleadoContrasenia)
        setEmpleadoContrasenia2(response.data.empleadoContrasenia)
        setFechaContratacion(response.data.fechaContratacion)
        setFechaNacimiento(response.data.fechaNacimiento)
        setEmpleadoSueldo(response.data.empleadoSueldo)
        setSueldoEnCambio(response.data.empleadoSueldo)


        //console.log(response.data)   //DEV
    }

    //
    const actualizar = async (e)=>{
        e.preventDefault()

        if (tipoDocumentoId.includes('Seleccione') || cargoActualId.includes('Seleccion')){
            setTituloModal('Error')
            setMensajeModal('Debe seleccionar un Cargo Actual y un Tipo Documento')
            setVisible(true)
        }else{
            const datos = [empleadoNombre, empleadoUsuario]
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
                if (empleadoContrasenia != empleadoContrasenia2){
                    setTituloModal('Error')
                    setMensajeModal('Las contraseñas no coinciden.')
                    setVisible(true)
                }else{
                    formatearCargo()
                    formatearIdDocumento()
                    formatearSucursalId()
            
                    const response = await axios.put(`${endPointActualizarEmpleado}/${id}`, 
                    {tipoDocumentoId: idDocumento, sucursalId: idSucursal, numeroDocumento: numeroDocumento, empleadoNombre: empleadoNombre, 
                    empleadoNumero: empleadoNumero, empleadoCorreo: empleadoCorreo, empleadoUsuario: empleadoUsuario,
                    empleadoContrasenia: empleadoContrasenia, empleadoDireccion: empleadoDireccion, empleadoSueldo: empleadoSueldo,
                    cargoActualId: idCargo, fechaContratacion: fechaContratacion, fechaNacimiento: fechaNacimiento,
                    estado: empleadoEstado})
            
                    if (response.status !== 200){
                        setTituloModal('Error')
                        setMensajeModal(response.data.Error)
                        setVisible(true)
                    }else{
                        
                        if (cargoEnCambio != cargoActualId){

                            empleadosCargos.map(async(cargoEmpleado)=>{
                                if (cargoEmpleado.fechaFinal == null){

                                    if(cargoEmpleado.fechaInicio > fechaFin){
                                        fechaFin = cargoEmpleado.fechaInicio
                                    }

                                    const response2 = await axios.put(`${endPointActualizarEmpleadoCargos}/${cargoEmpleado.id}`,
                                    {empleadoId: cargoEmpleado.empleadoId, cargoId: cargoEmpleado.cargoId,
                                    fechaInicio: cargoEmpleado.fechaInicio, fechaFinal: fechaFin, estado: 1})
                                }
                            })

                            let dateHoy = new Date()
                        
                            let fechaHoy = `${dateHoy.getFullYear()}-${dateHoy.getMonth() < 9? '0':''}${dateHoy.getMonth()+1}-${dateHoy.getDate()}`
                            const response3 = await axios.post(endPointRegistrarCargoEmpleado, {empleadoId: id, cargoId: idCargo, 
                            fechaInicio: fechaHoy, estado: 1})
                        }


                        if (sueldoEnCambio != empleadoSueldo){

                            sueldoHistorico.map(async(sueldo)=>{
                                if (sueldo.fechaFinal == null){

                                    if(sueldo.fechaInicio > fechaFin){
                                        fechaFin = sueldo.fechaInicio
                                    }

                                    const response2 = await axios.put(`${endPointActualizarSueldoHistorico}/${sueldo.id}`,
                                    {empleadoId: sueldo.empleadoId, sueldo: sueldo.sueldo,
                                    fechaInicio: sueldo.fechaInicio ,fechaFinal: fechaFin, estado: 1})

                                }
                            })

                            let dateHoy = new Date()
                        
                            let fechaHoy = `${dateHoy.getFullYear()}-${dateHoy.getMonth() < 9? '0':''}${dateHoy.getMonth()+1}-${dateHoy.getDate()}`

                            const response2 = await axios.post(endPointRegistrarSueldoHistorico, {empleadoId: id, 
                            sueldo: empleadoSueldo, fechaInicio: fechaHoy, estado: 1})

                        }
                        navigate('/Empleados')
                    }
                }
            }
        }

    }
    //
    const getAllSucursales = async ()=>{
        const response = await axios.get(endPointBuscarSucursales)
        setTodasSucursales(response.data)
    }
    //
    const getAllDocumentos = async ()=>{
        const response = await axios.get(endPointBuscarTodosDocumentos)

        setTodosDocumentos(response.data)
    }
    //
    const getAllCargos = async ()=>{
        const response = await axios.get(endPointBuscarTodosCargos)

        setTodosCargos(response.data)
    }
    //
    const verificarTipoDocumento = ()=> {

        switch (tipoDocumentoId){
            case 'RTN': digitosNumero = 14 
                break
            case 'Identidad': digitosNumero = 13 
                break
            case 'Pasaporte': digitosNumero = 7 
                break
            case 'Visa': digitosNumero = 9
                break
            case 'Licencia Conducir': digitosNumero = 9
                break
        }

    }
    //
    const getEmpleadosCargos = async ()=>{
        const response = await axios.get(`${endPointBuscarEmpleadoCargos}E/${id}`)
        setEmpleadosCargos(response.data)
    }

    //
    const getSueldoHistorico = async ()=>{
        const response = await axios.get(`${endPointBuscarSueldoHistorico}E/${id}`)
        setSueldoHistorico(response.data)
    }
    //
    const formatearCargo = ()=>{
        todosCargos.map((cargo)=>{
            if (cargo.cargoNombre == cargoActualId){
                idCargo = cargo.id
            }
        })
    }
        //
    const formatearCargoNombre = (empleadoCargo)=>{
        todosCargos.map((cargo)=>{
            if (cargo.id == empleadoCargo.cargoId){
                empleadoCargoNombre = cargo.cargoNombre
            }
        })
    }
    //
    const formatearIdDocumento = ()=>{
        todosDocumentos.map((documento)=>{
            if(documento.nombreDocumento == tipoDocumentoId){
                idDocumento = documento.id
            }
        })
    }
    //
    const formatearSucursalId = ()=>{
        todasSucursales.map((sucursal)=>{
            if(sucursal.sucursalNombre == sucursalId){
                idSucursal = sucursal.id
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

            <Modal
            closeButton
            blur
            preventClose
            className='bg-dark text-white'
            open={visible2}
            onClose={()=>setVisible2(false)}>
                <Modal.Header>
                    <Text 
                    h4
                    className='text-white'>
                        {tituloModal2}
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    
                {tituloModal2.includes('Cargos')?  //IF
                <div className="Cargos">
                    <table className="table mt-2 text-white">
                        <thead>
                            <tr>
                                <th>Cargo</th>
                                <th>Fecha Inicio</th>
                                <th>Fecha Final</th>
                            </tr>
                        </thead>
                        <tbody>
                            {empleadosCargos.map((empleadoCargo)=>{
                                
                                if(empleadoCargo.fechaFinal != null){
                                    formatearCargoNombre(empleadoCargo)
                                    
                                    return(
                                    <tr key={empleadoCargo.id}>
                                        <td>{empleadoCargoNombre}</td>
                                        <td>{moment(empleadoCargo.fechaInicio).format("DD/MM/yy") }</td>
                                        <td>{moment(empleadoCargo.fechaFinal).format("DD/MM/yy")}</td>
                                    </tr>)
                                }

                            })}
                        </tbody>
                    </table>
                </div>
                :                               //ELSE
                <div className="Sueldos">
                    <table className="table mt-2 text-white">
                        <thead>
                            <tr>
                                <th>Sueldo</th>
                                <th>Fecha Inicio</th>
                                <th>Fecha Final</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sueldoHistorico.map((sueldo)=>{
                                
                                if(sueldo.fechaFinal != null){
                                    //formatearCargoNombre(sue)
                                    
                                    return(
                                    <tr key={sueldo.id}>
                                        <td>{sueldo.sueldo}</td>
                                        <td>{moment(sueldo.fechaInicio).format("DD/MM/yy")}</td>
                                        <td>{moment(sueldo.fechaFinal).format("DD/MM/yy")}</td>
                                    </tr>)
                                }

                            })}
                        </tbody>
                    </table>
                </div>}

                </Modal.Body>

            </Modal>



            <div className='d-flex justify-content-center bg-dark mb-2'
            style={{backgroundColor: 'whitesmoke'}}>
                <Button 
                color={'gradient'}
                className='align-self-center me-2' 
                auto 
                onClick={()=>{
                    setVisible2(true)
                    setTituloModal2('Historial Cargos')
                }}
                ghost>
                    Historial Cargos
                </Button>

                <h1 className='text-white'>Actualizar Empleado</h1>

                <Button 
                color={'gradient'}
                className='align-self-center ms-2' 
                auto 
                onClick={()=>{
                    setVisible2(true)
                    setTituloModal2('Historial Sueldos')
                }}
                ghost>
                    Historial Sueldos
                </Button>
            </div>

            <form onSubmit={actualizar} className='formulario'>
                <div className='atributo'>
                <label>Nombre:</label>
                <input
                placeholder='Jose Perez'
                pattern='[A-Za-z ]{3,}'
                maxLength={50}
                value={empleadoNombre}
                onChange={(e)=> setEmpleadoNombre(e.target.value)}
                type='text'
                className='form-control'
                />
                </div>

                <div className='atributo'>
                <label>Número telefónico:</label>
                <input
                placeholder='88922711'
                value={empleadoNumero}
                onChange={(e)=> setEmpleadoNumero(e.target.value)}
                onBlur={async (e)=>{
                    if (e.target.value.length == 8){
                        const response = await axios.get(`${endpointGetEmpleado}Num/${e.target.value}`)

                        if (response.data.length > 0 && response.data[0].id != id){
                            setTituloModal('Error')
                            setMensajeModal('El número telefónico ya está registrado.')
                            setVisible(true)

                            setEmpleadoNumero('')
                        }


                    }else if (e.target.value != ''){
                        setTituloModal('Error')
                        setMensajeModal('El número telefónico debe tener 8 dígitos.')
                        setVisible(true)
                    }
                }}
                type='text'
                pattern='^[0-9]+$'
                maxLength={8}
                className='form-control'
                />
                </div>

                <div className='atributo'>
                <label>Correo electrónico:</label>
                <input
                placeholder='ejem@gmail.com'
                value={empleadoCorreo}
                onChange={(e)=> setEmpleadoCorreo(e.target.value.toLocaleLowerCase())}
                type='email'
                maxLength={50}
                className='form-control'
                />
                </div>

                <div className='atributo'>
                <label>Dirección:</label>
                <input
                placeholder='Res. Las uvas'
                value={empleadoDireccion}
                onChange={(e)=> setEmpleadoDireccion(e.target.value)}
                type='text'
                maxLength={100}
                className='form-control'/>
                </div>

                <div className='atributo'>
                <label>Sucursal</label>
                <select
                value={sucursalId}
                onChange={(e)=> setSucursalId(e.target.value)}
                type='number'
                className='select'
                >   
                    {todasSucursales.map((sucursal)=>{
                        verificarTipoDocumento()
                        return( <option key={sucursal.id}>{sucursal.sucursalNombre}</option>)
                    })}

                </select>
                </div>

                <div className='atributo'>
                <label>Tipo Documento</label>
                <select
                value={tipoDocumentoId}
                onChange={(e)=>setTipoDocumentoId(e.target.value)}
                type='number'
                className='select'
                >
                    {todosDocumentos.map((documento)=> {

                        return(<option key={documento.id}>{documento.nombreDocumento}</option>)
                    })
                    }
                </select>
                </div>

                <div className='atributo'>
                <label>Número documento:</label>
                <input
                required={true}
                value={numeroDocumento}
                minLength={digitosNumero}
                maxLength={digitosNumero}
                pattern={tipoDocumentoId == 'Visa' || tipoDocumentoId == 'Pasaporte'? '^[A-Z][0-9]+$':
                    tipoDocumentoId == 'RTN' || tipoDocumentoId == 'Identidad'? '^[0-1][0-9]+$': '^[1][0-9]+$'}

                title = {tipoDocumentoId == 'Visa' || tipoDocumentoId == 'Pasaporte'? 'ejem: A12345678':
                tipoDocumentoId == 'Identidad'? 'ejem: 0801456789123': tipoDocumentoId == 'RTN'?'01234567891234': 'ejem: 191234569'}
                onChange={(e)=> setNumeroDocumento(e.target.value)}
                onBlur={(e)=>{
                    if (tipoDocumentoId == 'Identidad'){
                        if (e.target.value[0] != 1 && e.target.value[0] != 0 || e.target.value.length != 13){
                            setTituloModal('Error')
                            setMensajeModal('El número de identidad debe ser de 13 dígitos y empezar con 1 o 0.')
                            setVisible(true)

                            setNumeroDocumento('')
                        }
                    }
                }}
                type='text'
                className='form-control'
                />
                </div>

                <div className='atributo'>
                <label>Sueldo:</label>
                <input
                value={empleadoSueldo}
                onChange={(e)=> setEmpleadoSueldo(e.target.value)}
                type='number'
                pattern='^[0-9]+$'
                maxLength={8}
                className='form-control'
                />
                </div>   
                
                <div className='atributo'>
                <label>Nuevo usuario:</label>
                <input
                 placeholder='empleado1'
                 value={empleadoUsuario}
                 onChange={(e)=>setEmpleadoUsuario(e.target.value)}
                 onBlur={async (e)=>{
                    if (e.target.value != ''){
                        const response = await axios.get(`${endpointGetEmpleado}U/${e.target.value}`)
                        
                        response.data.map((empleado)=>{
                            if (empleado.empleadoUsuario == e.target.value && id != empleado.id){
                                setTituloModal('Error')
                                setMensajeModal(`El nombre de usuario ${e.target.value} ya está en uso.`)
                                setVisible(true)

                                setEmpleadoUsuario('')
                            }
                        })

                    }
                 }}
                 type='text'
                 maxLength={20}
                 className='form-control'
                 />
                </div>

                <div className='atributo'>
                <label>Nueva contraseña:</label>
                <input
                 value={empleadoContrasenia}
                 onChange={(e)=>setEmpleadoContrasenia(e.target.value)}
                 type='password'
                 maxLength={50}
                 className='form-control'
                 />
                </div>

                <div className='atributo'>
                <label>Confirmar nueva contraseña:</label>
                <input
                 value={empleadoContrasenia2}
                 onChange={(e)=>setEmpleadoContrasenia2(e.target.value)}
                 type='password'
                 maxLength={50}
                 className='form-control'
                 />
                </div>
                
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