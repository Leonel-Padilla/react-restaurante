import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Button, Modal, Switch, Tooltip } from '@nextui-org/react';


const endPoint = 'http://127.0.0.1:8000/api/Empleado'
const endPointUpdate = 'http://127.0.0.1:8000/api/updateEmpleado'

const MostrarEmpleados = ()=>{
    const [empleados, setEmpleados] = useState([])

    useEffect(()=>{
        getAllEmpleados()
    },[])

    const getAllEmpleados = async ()=>{
        
        const response = await axios.get(endPoint)
        
        /*const response = {
            data: [
                {empleadoId:1, empleadoNombre: 'Manuel', empleadoNumero: 89306904, empleadoCorreo: 'manu@gmail.com', 
                empleadoDireccion: 'Aqui cerca', empleadoEstado: 0, empleadoTipoDocumentacion: 2},
                {empleadoId:2, empleadoNombre: 'Juan', empleadoNumero: 89306904, empleadoCorreo: 'jaun@gmail.com', 
                empleadoDireccion: 'Aqui cerca', empleadoEstado: 1, empleadoTipoDocumentacion: 1},
                {empleadoId:3, empleadoNombre: 'Mario', empleadoNumero: 89306904, empleadoCorreo: 'Mario@gmail.com', 
                empleadoDireccion: 'Aqui cerca', empleadoEstado: 0, empleadoTipoDocumentacion: 2},
                {empleadoId:4, empleadoNombre: 'pedrito', empleadoNumero: 89306904, empleadoCorreo: 'pedrito@gmail.com', 
                empleadoDireccion: 'Aqui cerca', empleadoEstado: 1, empleadoTipoDocumentacion: 5},
            ],
        }*/

        setEmpleados(response.data)
    }

    const cambioEstado = async (empleado)=>{

        await axios.put(`${endPointUpdate}/${empleado.id}`, {tipoDocumentoId:empleado.tipoDocumentoId,
        empleadoNombre: empleado.empleadoNombre, empleadoNumero: empleado.empleadoNumero, empleadoCorreo: empleado.empleadoCorreo,
        empleadoDireccion: empleado.empleadoDireccion, estado: empleado.estado == 1? 0 : 1})

        getAllEmpleados()

        /*const copiaEmpleados = [...empleados]

        copiaEmpleados.map((empleado)=> empleado.empleadoId == empleadoId? 
        empleado.empleadoEstado == 1? 
        empleado.empleadoEstado = 0 : empleado.empleadoEstado = 1 : null)
    
        setEmpleados(copiaEmpleados)*/

    }


    return(
        <div>

            
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
                        <td>{empleado.estado == 1 ? 'Habilitado' : 'Desabilitado'}</td>
                        <td>{empleado.tipoDocumentoId}</td>
                        <td>
                            <Link to={`updateEmpleado/${empleado.id}`}><Button color={'gradient'} ghost>Editar</Button></Link>

                            <Tooltip
                            placement='left'
                            initialVisible={false}
                            trigger='click' 
                            content={<div>
                                        <p>Está seguro que desea cambiar este registro?</p> 
                                        <Button 
                                            color={'error'}
                                            children={empleado.estado == 1 ? 'Desabilitar' : 'Habilitar'}
                                            onClick={()=> cambioEstado(empleado)}
                                        ></Button>
                                        
                                    </div>}>
                                <Button 
                                children={empleado.estado == 1 ? 'Desabilitar' : 'Habilitar'}
                                color={'error'}
                                ></Button>
                            </Tooltip>

                        </td>
                    </tr>
                )}
            </tbody>
        </table>

        <Link to="addEmpleado"><Button color={'success'} ghost>Registrar</Button></Link>
        </div>
    )
}

export default MostrarEmpleados
