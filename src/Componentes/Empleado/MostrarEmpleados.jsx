import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Tooltip, Modal, Text } from '@nextui-org/react';
import buscarLupa from '../../img/buscar_lupa.png';
import lapizEditar from '../../img/lapiz_editar.png'
import moment from 'moment';

const endPoint                      = 'http://127.0.0.1:8000/api/Empleado'
const endPointUpdate                = 'http://127.0.0.1:8000/api/updateEmpleado'
const endPointGetEmpleados          = 'http://127.0.0.1:8000/api/Empleado'
const endPointBuscarTodosDocumentos = 'http://127.0.0.1:8000/api/TipoDocumento'

const MostrarEmpleados = ()=>{
    const [empleados, setEmpleados]                 = useState([])
    const [empleadoActual, setEmpleadoActual]       = useState()
    const navigate                                  = useNavigate()
    const [todosDocumentos, setTodosDocumentos]     = useState([])
    const [parametroBusqueda, setParametroBusqueda] = useState('Seleccione')
    const [valorBusqueda, setValorBusqueda]         = useState()
    const [mensajeModal, setMensajeModal]           = useState('')
    const [tituloModal, setTituloModal]             = useState('')
    const [visible, setVisible]                     = useState(false)
    let tipoDocumento = ''

    useEffect(()=>{
        getAllEmpleados()
        getAllDocumentos()
    },[])

    //
    const activarModal = (titulo, mensajeModal)=>{
        setTituloModal(titulo)
        setMensajeModal(mensajeModal)
        setVisible(true)
    }
    //
    const getAllEmpleados = async ()=>{
    
        const response = await axios.get(endPoint)
        setEmpleados(response.data)
        
    }
    //
    const cambioEstado = async (empleado)=>{

        await axios.put(`${endPointUpdate}/${empleado.id}`, {tipoDocumentoId:empleado.tipoDocumentoId,
        numeroDocumento: empleado.numeroDocumento, empleadoNombre: empleado.empleadoNombre, empleadoNumero: empleado.empleadoNumero,
        empleadoCorreo: empleado.empleadoCorreo, empleadoUsuario: empleado.empleadoUsuario,
        empleadoContrasenia: empleado.empleadoContrasenia, empleadoDireccion: empleado.empleadoDireccion, 
        empleadoSueldo: empleado.empleadoSueldo, cargoActualId: empleado.cargoActualId, fechaContratacion: empleado.fechaContratacion,
        fechaNacimiento: empleado.fechaNacimiento, estado: empleado.estado == 1? 0 : 1})

        getAllEmpleados()
    }
    //
    const GetByValorBusqueda = async (e)=>{
        e.preventDefault()

        if (parametroBusqueda.includes('Seleccione')){
            setTituloModal('Error')
            setMensajeModal('Seleccione un parametro de busqueda.')
            setVisible(true)
        }else{
            if (parametroBusqueda == 'ID'){
                const response = await axios.get(`${endPointGetEmpleados}/${valorBusqueda}`)
                //console.log(response.data)
                
                if (response.status != 200){
                    setTituloModal('Error')
                    setMensajeModal(response.data.Error)
                    setVisible(true)
                }else{
                    const array = [response.data]
                    setEmpleados(array)
                }
                
            }else if (parametroBusqueda == 'Nombre'){
                const response = await axios.get(`${endPointGetEmpleados}N/${valorBusqueda}`)
                //console.log(response.data)
                
                const array = response.data
        
                if (array.length < 1){
                    setTituloModal('Error')
                    setMensajeModal('No hay Empleados con el nombre que ingresó.')
                    setVisible(true)
                }else{
                    setEmpleados(array)
                }
            }else{
                const response = await axios.get(`${endPointGetEmpleados}ND/${valorBusqueda}`)
                //console.log(response.data)
                
                const array = response.data
        
                if (array.length < 1){
                    setTituloModal('Error')
                    setMensajeModal('No hay Empleados con el numero de documento que ingresó.')
                    setVisible(true)
                }else{
                    setEmpleados(array)
                }

            }
        }
    }

    const getNumeroDocumento = (empleado)=>{
        todosDocumentos.map((documento)=>{
            if (documento.id == empleado.tipoDocumentoId){
                tipoDocumento = documento.nombreDocumento
            }
        })
    }

    const getAllDocumentos = async ()=>{
        const response = await axios.get(endPointBuscarTodosDocumentos)
        setTodosDocumentos(response.data)

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
            {tituloModal.includes('Error')?     //IF ERROR
                mensajeModal
                :                                   //ELSE ELIMINAR
                <div>
                    {mensajeModal}

                    <div className='d-flex mt-3'>
                        <Button
                        className='me-3 ms-5'
                        auto
                        onClick={()=>{
                            setVisible(false)
                        }}>
                            Cancelar
                        </Button>

                        <Button
                        className='ms-5'
                        auto
                        onClick={()=>{
                            cambioEstado(empleadoActual)
                            setVisible(false)
                            }}>
                            Cambiar
                        </Button>
                    </div>
                </div>}
            </Modal.Body>

        </Modal>
        
        <div className='d-flex justify-content-start pt-2 pb-2'
        style={{backgroundColor: 'whitesmoke'}} >
            
            <h1 className='ms-4 me-4' >Empleado</h1>

            <select style={{height: '35px'}}
            className='align-self-center me-2'
            onChange={(e)=>setParametroBusqueda(e.target.value)}>
                <option>Seleccione Tipo Busqueda</option>
                <option value="ID">ID</option>
                <option value="Nombre">Nombre</option>
                <option value="Numero Documento">Numero Documento</option>
            </select>

            <form 
            className='d-flex align-self-center' 
            style={{left: '300px'}} 
            onSubmit={GetByValorBusqueda}>
                <input
                placeholder={parametroBusqueda.includes('Seleccione')? '': 
                parametroBusqueda == 'ID'? 'ID': parametroBusqueda == 'Nombre'? 'Nombre': 'Numero Documento'}
                aria-label='aria-describedby'
                onChange={(e)=>setValorBusqueda(e.target.value)}
                type={parametroBusqueda == 'ID'? 'number': 'text'}
                className='form-control me-2'
                required={true}
                //pattern={parametroBusqueda == 'Nombre'? '[A-Za-z ]{3,}':''}
                />
                <Button
                auto
                className='ms-2'
                color={'gradient'}
                icon={<img src={buscarLupa}/>}
                type={'submit'}>
                    Buscar
                </Button>
            </form>
            <Button 
            color={'gradient'}
            bordered
            className='align-self-center ms-2 me-2' 
            auto onClick={()=>navigate('/MenuPrincipal')}>
                Regresar
            </Button>

            <Button
            auto
            color={"gradient"}
            bordered
            className='align-self-center me-2'
            onClick={()=>getAllEmpleados()}>
                Llenar Tabla
            </Button>

            <Button 
            className='bg-dark text-light align-self-center'
            color={'dark'}
            bordered
            onClick={()=>navigate('/Empleados/addEmpleado')}>
            Registrar
            </Button>
        </div>

            
        <table className='table mt-2'> 
            <thead className='bg-dark text-white'> 
                <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Usuario</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Fecha contratación</th>
                    <th>Tipo documento</th>
                    <th>Número Documento</th>
                    <th>Estado</th>
                    <th>Opciones</th>
                </tr>
            </thead>

            <tbody>
                {empleados.map(empleado =>{
                    
                    getNumeroDocumento(empleado)

                    return(
                    <tr key={empleado.id}>
                        <td>{empleado.id}</td>
                        <td>{empleado.empleadoNombre}</td>
                        <td>{empleado.empleadoUsuario}</td>
                        <td>{empleado.empleadoNumero}</td>
                        <td>{empleado.empleadoCorreo}</td>
                        <td>{moment(empleado.fechaContratacion).format("DD/MM/yy")}</td>
                        <td>{tipoDocumento}</td>
                        <td>{empleado.numeroDocumento}</td>
                        <td>{empleado.estado == 1 ? 'Habilitado' : 'Deshabilitado'}</td>
                        
                        <td>
                            <Button
                            className='mb-1'
                            color={'gradient'}
                            iconRight={<img src={lapizEditar}/>}
                            onClick={()=>navigate(`/Empleados/updateEmpleado/${empleado.id}`)}
                                >Editar
                            </Button>

                            <Button 
                            light
                            shadow
                            children={empleado.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
                            color={'secondary'}
                            onClick={()=>{
                                setEmpleadoActual(empleado)
                                activarModal('Cambiar', `¿Seguro que desea ${empleado.estado == 1 ? 'deshabilitar' : 'habilitar'} este registro?`)
                            }}
                            ></Button>


                        </td>
                    </tr>)})}
            </tbody>
        </table>

        

        </div>
    )
}

export default MostrarEmpleados
