import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Modal, Text} from '@nextui-org/react'
import Swal from 'sweetalert2'

const endPointRegistrarEmpleado         = 'http://127.0.0.1:8000/api/addEmpleado'
const endPointBuscarTodosCargos         = 'http://127.0.0.1:8000/api/Cargo'
const endPointBuscarSucursales          = 'http://127.0.0.1:8000/api/Sucursal'
const endPointBuscarTodosDocumentos     = 'http://127.0.0.1:8000/api/TipoDocumento'
const endPointBuscarEmpleado            = 'http://127.0.0.1:8000/api/Empleado'
const endPointRegistrarCargoEmpleado    = 'http://127.0.0.1:8000/api/addCargoHistorial' 
const endPointRegistrarSueldoHistorico  = 'http://127.0.0.1:8000/api/addSueldoHistorial'

const AgregarEmpleado = () =>{
    const [tipoDocumentoId, setTipoDocumentoId]             = useState('Seleccione')
    const [sucursalId, setSucursalId]                       = useState('Seleccione')
    const [numeroDocumento, setNumeroDocumento]             = useState('')
    const [empleadoNombre, setEmpleadoNombre]               = useState('')
    const [empleadoNumero, setEmpleadoNumero]               = useState('')
    const [empleadoCorreo, setEmpleadoCorreo]               = useState('')
    const [empleadoUsuario, setEmpleadoUsuario]             = useState('')
    const [empleadoContrasenia, setEmpleadoContrasenia]     = useState('')
    const [empleadoContrasenia2, setEmpleadoContrasenia2]   = useState('')
    const [empleadoDireccion, setEmpleadoDireccion]         = useState('')
    const [cargoActualId, setCargoActual]                   = useState('Seleccione')
    const [fechaContratacion, setFechaContratacion]         = useState()
    const [fechaNacimiento, setFechaNacimiento]             = useState()
    const [empleadoSueldo, setEmpleadoSueldo]               = useState(0)
    const [empleadoEstado, setEmpleadoEstado]               = useState(1)
    let digitosNumero   = 14
    let idDocumento     = 1
    let idCargo         = 1
    let idSucursal      = 1

    let fechaHoy = new Date()

    let fechaMin = new Date()
    let valor = fechaMin.getDate()
    fechaMin.setDate(valor-10)

    let fechaEdad = new Date()
    let valor2 = fechaEdad.getFullYear()
    fechaEdad.setFullYear(valor2-18)

    
    const [todosDocumentos, setTodosDocumentos] = useState([])
    const [todosCargos, setTodosCargos]         = useState([])
    const [todasSucursales, setTodasSucursales] = useState([])
    const navigate                              = useNavigate()

    const [startDate, setStartDate]         = useState(new Date());
    const [mensajeModal, setMensajeModal]   = useState('')
    const [tituloModal, setTituloModal]     = useState('')
    const [visible, setVisible]             = useState(false)

    /*if (sessionStorage.getItem('userName') == null){
        navigate('/')
    }*/


    useEffect(()=>{
        getAllDocumentos()
        getAllCargos()
        getAllSucursales()
    },[])
    
    const registrar = async (e)=>{
        e.preventDefault()

        if (tipoDocumentoId.includes('Seleccione') || cargoActualId.includes('Seleccion') || sucursalId.includes('Seleccione')){
            setTituloModal('Error')
            setMensajeModal('Debe seleccionar un Cargo Actual, un Tipo Documento, y una Sucursal')
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
                    setMensajeModal('Las contraseñas no coinciden')
                    setVisible(true)
                }else{
                    formatearCargo()
                    formatearIdDocumento()
                    formatearSucursalId()
        
                    const response = await axios.post(endPointRegistrarEmpleado, {tipoDocumentoId: idDocumento, sucursalId: idSucursal,
                        numeroDocumento: numeroDocumento, empleadoNombre: empleadoNombre, empleadoNumero: empleadoNumero,
                        empleadoCorreo: empleadoCorreo, empleadoUsuario: empleadoUsuario, empleadoContrasenia: empleadoContrasenia, 
                        empleadoDireccion: empleadoDireccion, empleadoSueldo: empleadoSueldo, cargoActualId: idCargo,
                        fechaContratacion: fechaContratacion, fechaNacimiento: fechaNacimiento, estado: empleadoEstado})

                
                    if (response.status !== 200){
                        setTituloModal('Error')
                        setMensajeModal(response.data.Error)
                        setVisible(true)
        
                    }else{
                        const response1 = await axios.get(`${endPointBuscarEmpleado}ND/${numeroDocumento}`)

                        const response2 = await axios.post(endPointRegistrarCargoEmpleado, {empleadoId: response1.data[0].id,
                        cargoId: idCargo, fechaInicio: fechaContratacion, estado: 1})

                            
                        const response3 = await axios.post(endPointRegistrarSueldoHistorico, {empleadoId: response1.data[0].id,
                        sueldo: empleadoSueldo, fechaInicio: fechaContratacion, estado: 1})

                        

                        const {value: confirmacion} = await Swal.fire({
                            title: 'Registro exitoso',
                            text: `El Empleado ${empleadoNombre} ha sido registrado con éxito.`,
                            width: '410px',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#7109BF',
                            background: 'black',
                            color: 'white',
                        })
                    
                        if (confirmacion){
                            navigate('/Empleados')
                        }

                        

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
    const formatearCargo = ()=>{
        todosCargos.map((cargo)=>{
            if (cargo.cargoNombre == cargoActualId){
                idCargo = cargo.id
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
            if(sucursal.nombreSucursal == sucursalId){
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
            onOpen={() =>{console.log(mensajeModal)}}
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
                <h1 className='text-white'>Registrar Empleado</h1>
            </div>

            <form onSubmit={registrar} className='formulario'>

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
                        const response = await axios.get(`${endPointBuscarEmpleado}Num/${e.target.value}`)

                        if (response.data.length > 0){
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
                onChange={(e)=> {setEmpleadoCorreo(e.target.value.toLocaleLowerCase())}}
                type='email'
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
                    <option>Seleccione una sucursal</option>
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
                onChange={(e)=> setTipoDocumentoId(e.target.value)}
                type='number'
                className='select'
                >   
                    <option>Seleccione Tipo Documento</option>
                    {todosDocumentos.map((documento)=>{
                        verificarTipoDocumento()
                        return( <option key={documento.id}>{documento.nombreDocumento}</option>)
                    })}

                </select>
                </div>

                <div className='atributo'>
                <label>Número documento:</label>
                <input
                required={true}
                placeholder='1234567890123'
                minLength={digitosNumero}
                maxLength={digitosNumero}
                value={numeroDocumento}
                pattern={tipoDocumentoId == 'Visa' || tipoDocumentoId == 'Pasaporte'? '^[A-Z][0-9]+$':
                tipoDocumentoId == 'RTN' || tipoDocumentoId == 'Identidad'? '^[0-1][0-9]+$': '^[1][0-9]+$'}
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
                <label htmlFor='fechaNacimiento'>Fecha Nacimiento:</label>
                <input
                id='fechaNacimiento'
                max={`${fechaEdad.getFullYear()}-${fechaEdad.getMonth() < 9? '0':''}${fechaEdad.getMonth()+1}-${fechaEdad.getDate() < 10? '0':''}${fechaEdad.getDate()}`}
                type={'date'}
                onChange={(e)=> setFechaNacimiento(e.target.value)}
                ></input>
                </div>

                <div className='atributo'>
                <label htmlFor='fechaContrato'>Fecha Contrato:</label>
                <input
                id='fechaContrato'
                max={`${fechaHoy.getFullYear()}-${fechaHoy.getMonth() < 9? '0':''}${fechaHoy.getMonth()+1}-${fechaHoy.getDate() < 10? '0':''}${fechaHoy.getDate()}`}
                min={`${fechaMin.getFullYear()}-${fechaMin.getMonth() < 9? '0':''}${fechaMin.getMonth()+1}-${fechaMin.getDate() < 10? '0':''}${fechaMin.getDate()}`}
                type={'date'}
                onChange={(e)=> setFechaContratacion(e.target.value)}
                ></input>
                </div>
                
                <div className='atributo'>
                <label>Sueldo:</label>
                <input
                value={empleadoSueldo}
                placeholder='5000'
                onChange={(e)=> setEmpleadoSueldo(e.target.value)}
                type='number'
                pattern='^[0-9]+$'
                maxLength={8}
                className='form-control'
                />
                </div>

                <div className='atributo'>
                <label>Usuario:</label>
                <input
                 placeholder='empleado1'
                 value={empleadoUsuario}
                 onChange={(e)=>setEmpleadoUsuario(e.target.value)}
                 onBlur={async (e)=>{
                    if (e.target.value != ''){
                        const response = await axios.get(`${endPointBuscarEmpleado}U/${e.target.value}`)
                        
                        response.data.map((empleado)=>{
                            if (empleado.empleadoUsuario == e.target.value){
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
                <label htmlFor='contrasenia'>Contraseña:</label>
                <input
                id='contrasenia'
                 value={empleadoContrasenia}
                 placeholder='Admin1'
                 onChange={(e)=>setEmpleadoContrasenia(e.target.value)}
                 type='password'
                 maxLength={16}
                 pattern='^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{5,16}$'
                 className='form-control'
                 title='Debe incluir al menos una letra mayúscula, una letra minúscula y un número, máximo 16 y mínimo de 5.'
                 />
                </div>

                <div className='atributo'>
                <label htmlFor='confirmasContrania'>Confirmar contraseña:</label>
                <input
                id='confirmasContrania'
                 value={empleadoContrasenia2}
                 placeholder='Admin1'
                 onChange={(e)=>setEmpleadoContrasenia2(e.target.value)}
                 type='password'
                 maxLength={16}
                 pattern='^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{5,16}$'
                 title='Debe incluir al menos una letra mayúscula, una letra minúscula y un número, máximo 16 y mínimo de 5.'
                 className='form-control'
                 />
                </div>

                <div className='atributo'>
                <label>Cargo actual</label>
                <select
                value={cargoActualId}
                onChange={(e)=>setCargoActual(e.target.value)}
                className='select'> 
                    <option>Seleccione Cargo Actual</option>
                    {todosCargos.map((cargo)=> <option key={cargo.id}>{cargo.cargoNombre}</option>)}
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