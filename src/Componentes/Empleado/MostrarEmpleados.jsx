import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, getTokenValue, Input,Tooltip } from '@nextui-org/react';
import buscarLupa from '../../img/buscar_lupa.png';
import lapizEditar from '../../img/lapiz_editar.png'

const endPoint = 'http://127.0.0.1:8000/api/Empleado'
const endPointUpdate = 'http://127.0.0.1:8000/api/updateEmpleado'
const endPointGetEmpleadosNombre = 'http://127.0.0.1:8000/api/EmpleadoN'
const endPointGetTipoDocumento = 'http://127.0.0.1:8000/api/TipoDocumento'
const endPointBuscarTodosDocumentos = 'http://127.0.0.1:8000/api/TipoDocumento'

const MostrarEmpleados = (props)=>{
    const [empleados, setEmpleados] = useState([])
    const [nombreBusqueda, setNombreBusqueda] = useState('')
    const navigate = useNavigate()
    const [todosDocumentos, setTodosDocumentos] = useState([])
    let numeroDocumento = ''



    useEffect(()=>{
        getAllEmpleados()
        getAllDocumentos()

        return function cleanup(){
            setEmpleados(0)
            setTodosDocumentos(0)
        }
    },[])

    
    

    const getAllEmpleados = async ()=>{
        
        const response = await axios.get(endPoint)
        setEmpleados(response.data)
        
    }

    const cambioEstado = async (empleado)=>{

        await axios.put(`${endPointUpdate}/${empleado.id}`, {tipoDocumentoId:empleado.tipoDocumentoId,
        empleadoNombre: empleado.empleadoNombre, empleadoNumero: empleado.empleadoNumero, 
        empleadoCorreo: empleado.empleadoCorreo, empleadoDireccion: empleado.empleadoDireccion,
        estado: empleado.estado == 1? 0 : 1})

        getAllEmpleados()
    }

    const GetByNombre = async (e)=>{
        e.preventDefault()
        
        const response = await axios.get(`${endPointGetEmpleadosNombre}/${nombreBusqueda}`)
            
        
        setEmpleados(response.data)
    }


    const getNumeroDocumento = (empleado)=>{
        todosDocumentos.map((documento)=>{
            if (documento.id == empleado.tipoDocumentoId){
                //console.log(documento.numeroDocumento) //DEV
                //return documento.numeroDocumento
                numeroDocumento = documento.numeroDocumento
            }
        })
    }

    const getAllDocumentos = async ()=>{

        const response = await axios.get(endPointBuscarTodosDocumentos)
        setTodosDocumentos(response.data)
        

        //console.log(response.data) //DEV
    }


    return(
        <div>
        
        <div className='d-flex justify-content-start pt-2 pb-2'
        style={{backgroundColor: 'whitesmoke'}} >
            
            <h1 className='ms-4 me-4' >Empleado</h1>

            <form 
            className='d-flex align-self-center' 
            style={{left: '300px'}} 
            onSubmit={GetByNombre}>
                <Input
                    underlined
                    placeholder='nombre'
                    aria-label='aria-describedby'
                    onChange={(e)=>setNombreBusqueda(e.target.value)}
                    type='text'
                    className='form-control me-2'
                    required={true}
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
        </div>

            
        <table className='table mt-2'> 
            <thead className='bg-dark text-white'> 
                <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Numero</th>
                    <th>Correo</th>
                    <th>Direccion</th>
                    <th>Estado</th>
                    <th>Numero Documento</th>
                    <th>Opciones</th>
                </tr>
            </thead>

            <tbody>
                {empleados.map(empleado =>{
                    
                    getNumeroDocumento(empleado)
                    //console.log(numeroDocumento)

                    return(
                    <tr key={empleado.id}>
                        <td>{empleado.id}</td>
                        <td>{empleado.empleadoNombre}</td>
                        <td>{empleado.empleadoNumero}</td>
                        <td>{empleado.empleadoCorreo}</td>
                        <td>{empleado.empleadoDireccion}</td>
                        <td>{empleado.estado == 1 ? 'Habilitado' : 'Deshabilitado'}</td>
                        <td>{numeroDocumento}</td>
                        <td>
                            <Button
                            className='mb-1'
                            color={'gradient'}
                            iconRight={<img src={lapizEditar}/>}
                            onClick={()=>navigate(`/Empleados/updateEmpleado/${empleado.id}`)}
                                >Editar
                            </Button>

                            <Tooltip
                            placement='left'
                            initialVisible={false}
                            trigger='click' 
                            content={<div>
                                        <p>Está seguro que desea cambiar este registro?</p> 

                                        <Button 
                                        className='bg-dark text-light'
                                        color={'dark'}
                                        children={empleado.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
                                        onClick={()=> cambioEstado(empleado)}
                                        ></Button>
                                        
                                    </div>}>
                                <Button 
                                light
                                shadow
                                children={empleado.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
                                color={'secondary'}
                                ></Button>
                            </Tooltip>

                        </td>
                    </tr>)})}
            </tbody>
        </table>

        <Button 
        className='bg-dark text-light'
        color={'dark'}
        bordered
        onClick={()=>navigate('/Empleados/addEmpleado')}>
            Registrar
        </Button>

        </div>
    )
}

export default MostrarEmpleados
