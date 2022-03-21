import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Modal, Text} from '@nextui-org/react'
import { toHaveDisplayValue } from '@testing-library/jest-dom/dist/matchers'

const endPointRegistrarEmpleado = 'http://127.0.0.1:8000/api/addEmpleado'
const endPointBuscarTodosCargos = 'http://127.0.0.1:8000/api/Cargo'
const endPointBuscarTodosDocumentos = 'http://127.0.0.1:8000/api/TipoDocumento'

const AgregarEmpleado = () =>{
    const [tipoDocumentoId, setTipoDocumentoId]         = useState('Seleccione')
    const [numeroDocumento, setNumeroDocumento]         = useState('')
    const [empleadoNombre, setEmpleadoNombre]           = useState('')
    const [empleadoNumero, setEmpleadoNumero]           = useState('')
    const [empleadoCorreo, setEmpleadoCorreo]           = useState('')
    const [empleadoUsuario, setEmpleadoUsuario]         = useState('')
    const [empleadoContrasenia, setEmpleadoContrasenia] = useState('')
    const [empleadoDireccion, setEmpleadoDireccion]     = useState('')
    const [cargoActualId, setCargoActual]               = useState('Seleccione')
    const [fechaContratacion, setFechaContratacion]     = useState()
    const [fechaNacimiento, setFechaNacimiento]         = useState()
    const [empleadoEstado, setEmpleadoEstado]           = useState(1)
    let digitosNumero = 14
    let idDocumento = 1
    let idCargo = 1
    let fechaHoy = new Date()

    let valor = fechaHoy.getDate()
    fechaHoy.setDate(valor+10)

    let fechaEdad = new Date()
    let valor2 = fechaEdad.getFullYear()
    fechaEdad.setFullYear(valor2-18)
    
    const [todosDocumentos, setTodosDocumentos] = useState([])
    const [todosCargos, setTodosCargos]         = useState([])
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
    },[])
    
    const registrar = async (e)=>{
        e.preventDefault()

        if (tipoDocumentoId.includes('Seleccione') || cargoActualId.includes('Seleccion')){
            setTituloModal('Error')
            setMensajeModal('Debe seleccionar un Cargo Actual y un Tipo Documento')
            setVisible(true)
        }else{
                    
            formatearCargo()
            formatearIdDocumento()

            const response1 = await axios.post(endPointRegistrarEmpleado, {tipoDocumentoId: idDocumento,
                numeroDocumento: numeroDocumento, empleadoNombre: empleadoNombre, empleadoNumero: empleadoNumero,
                empleadoCorreo: empleadoCorreo, empleadoUsuario: empleadoUsuario,
                empleadoContrasenia: empleadoContrasenia, empleadoDireccion: empleadoDireccion, 
                cargoActualId: idCargo, fechaContratacion: fechaContratacion,
                fechaNacimiento: fechaNacimiento, estado: empleadoEstado})
        
            if (response1.status !== 200){
                setTituloModal('Error')
                setMensajeModal(response1.data.Error)
                setVisible(true)

            }else{
                navigate('/Empleados')
            }
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
                <h1 className='text-white'>Registrar Empleado</h1>
            </div>

            <form onSubmit={registrar} className='formulario'>

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
                type='text'
                pattern='^[0-9]+$'
                maxLength={8}
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
                    <option>Seleccione Tipo Documento</option>
                    {todosDocumentos.map((documento)=>{
                        verificarTipoDocumento()
                        return( <option key={documento.id}>{documento.nombreDocumento}</option>)
                    })}

                </select>
                </div>

                <div className='atributo'>
                <label>Numero documento:</label>
                <input
                required={true}
                minLength={digitosNumero}
                maxLength={digitosNumero}
                value={numeroDocumento}
                onChange={(e)=> setNumeroDocumento(e.target.value)}
                type='text'
                className='form-control'
                />
                </div>

                <div className='atributo'>
                <label>Fecha Nacimiento:</label>
                <input
                max={`${fechaEdad.getFullYear()}-${fechaEdad.getMonth() < 9? '0':''}${fechaEdad.getMonth()+1}-${fechaEdad.getDate()}`}
                type={'date'}
                onChange={(e)=> setFechaNacimiento(e.target.value)}
                ></input>
                </div>

                <div className='atributo'>
                <label>Fecha Contrato:</label>
                <input
                max={`${fechaHoy.getFullYear()}-${fechaHoy.getMonth() < 9? '0':''}${fechaHoy.getMonth()+1}-${fechaHoy.getDate()}`}
                type={'date'}
                //value={fechaContratacion}
                onChange={(e)=> setFechaContratacion(e.target.value)}
                ></input>
                </div>

                <div className='atributo'>
                <label>Usuario:</label>
                <input
                 placeholder='empleado1'
                 value={empleadoUsuario}
                 onChange={(e)=>setEmpleadoUsuario(e.target.value)}
                 type='text'
                 className='form-control'
                 />
                </div>

                <div className='atributo'>
                <label>Contraseña:</label>
                <input
                 value={empleadoContrasenia}
                 onChange={(e)=>setEmpleadoContrasenia(e.target.value)}
                 type='password'
                 className='form-control'
                 />
                </div>

                {/* <div className='atributo'>
                <label>Confirmar contraseña:</label>
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