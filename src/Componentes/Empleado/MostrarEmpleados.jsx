import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Button, Input, Modal, Switch, Tooltip } from '@nextui-org/react';
import buscarLupa from '../../img/buscar_lupa.png'
import { Search } from 'react-iconly';

const endPoint = 'http://127.0.0.1:8000/api/Empleado'
const endPointUpdate = 'http://127.0.0.1:8000/api/updateEmpleado'
const endPointGetEmpleadosNombre = 'http://127.0.0.1:8000/api/EmpleadoN'

const MostrarEmpleados = ()=>{
    const [empleados, setEmpleados] = useState([])
    const [nombreBusqueda, setNombreBusqueda] = useState('')

    useEffect(()=>{
        getAllEmpleados()
    },[])

    const getAllEmpleados = async ()=>{
        
        const response = await axios.get(endPoint)
        setEmpleados(response.data)
    }

    const cambioEstado = async (empleado)=>{

        await axios.put(`${endPointUpdate}/${empleado.id}`, {tipoDocumentoId:empleado.tipoDocumentoId,
        empleadoNombre: empleado.empleadoNombre, empleadoNumero: empleado.empleadoNumero, empleadoCorreo: empleado.empleadoCorreo,
        empleadoDireccion: empleado.empleadoDireccion, estado: empleado.estado == 1? 0 : 1})

        getAllEmpleados()
    }

    const buscarPorNombre = async (e)=>{
        e.preventDefault()
        
        const response = await axios.get(`${endPointGetEmpleadosNombre}/${nombreBusqueda}`)
            
        setEmpleados(response.data)
    }


    return(
        <div>

        <form className='d-flex align-items-start justify-content-end' onSubmit={buscarPorNombre}>
            <Input
                underlined
                placeholder='nombre'
                onChange={(e)=>setNombreBusqueda(e.target.value)}
                type='text'
                className='form-control me-2'
                required={true}
                />
            <Button
            className='me-2 ms-2'
            color={'primary'}
            bordered
            icon={<img src={buscarLupa}></img>}
            type={'submit'}>
                Buscar
            </Button>
        </form>
            
        <table className='table table-bordeless mt-2'> 
            <thead className='bg-primary text-white'> 
                <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Numero</th>
                    <th>Correo</th>
                    <th>Direccion</th>
                    <th>Estado</th>
                    <th>TipoDocumentacion</th>
                    <th>Opciones</th>
                </tr>
            </thead>

            <tbody>
                {empleados.map(empleado => 
                    
                    <tr key={empleado.id}>
                        <td>{empleado.id}</td>
                        <td>{empleado.empleadoNombre}</td>
                        <td>{empleado.empleadoNumero}</td>
                        <td>{empleado.empleadoCorreo}</td>
                        <td>{empleado.empleadoDireccion}</td>
                        <td>{empleado.estado == 1 ? 'Habilitado' : 'Deshabilitado'}</td>
                        <td>{empleado.tipoDocumentoId}</td>
                        <td>
                            <Link to={`updateEmpleado/${empleado.id}`}><Button className='mb-1'
                                                                        color={'gradient'} bordered>Editar</Button></Link>

                            <Tooltip
                            placement='left'
                            initialVisible={false}
                            trigger='click' 
                            content={<div>
                                        <p>Está seguro que desea cambiar este registro?</p> 
                                        <Button 
                                            color={'warning'}
                                            children={empleado.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
                                            onClick={()=> cambioEstado(empleado)}
                                        ></Button>
                                        
                                    </div>}>
                                <Button 
                                children={empleado.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
                                bordered
                                color={'warning'}
                                ></Button>
                            </Tooltip>

                        </td>
                    </tr>
                )}
            </tbody>
        </table>

        <Link className='link' style={{margin: 0}} to="addEmpleado">
            <Button style={{margin: 0}} color={'success'} ghost>
                Registrar
                
            </Button>
        </Link>
        </div>
    )
}

export default MostrarEmpleados
