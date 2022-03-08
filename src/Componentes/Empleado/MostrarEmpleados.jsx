import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Button, Modal, Switch, Tooltip } from '@nextui-org/react';


const endPoint = 'http://localhost:8000/api'

const MostrarEmpleados = ()=>{
    const [empleados, setEmpleados] = useState([])

    useEffect(()=>{
        getAllEmpleados()
    },[])

    const getAllEmpleados = ()=>{
        const response = {
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
        }

        setEmpleados(response.data)
    }

    const deleteEmpleado = (id)=>{
        /*await axios.delete(`${endPoint}/deleteEmpleado/${id}`)
        getAllBooks()*/
    }

    const cambioEstado = (empleadoId)=>{

        const copiaEmpleados = [...empleados]

        copiaEmpleados.map((empleado)=> empleado.empleadoId == empleadoId? 
        empleado.empleadoEstado == 1? 
        empleado.empleadoEstado = 0 : empleado.empleadoEstado = 1 : null)
        
        setEmpleados(copiaEmpleados)

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
                    
                    <tr key={empleado.empleadoId}>
                        <td>{empleado.empleadoId}</td>
                        <td>{empleado.empleadoNombre}</td>
                        <td>{empleado.empleadoNumero}</td>
                        <td>{empleado.empleadoCorreo}</td>
                        <td>{empleado.empleadoDireccion}</td>
                        <td>{empleado.empleadoEstado == 1 ? 'Habilitado' : 'Desabilitado'}</td>
                        <td>{empleado.empleadoTipoDocumentacion}</td>
                        <td>
                            <Link to={`updateEmpleado/${empleado.empleadoId}`}><Button color={'gradient'} ghost>Editar</Button></Link>

                            <Tooltip
                            placement='left'
                            initialVisible={false}
                            trigger='click' 
                            content={<div>
                                        <p>Está seguro que desea cambiar este registro?</p> 
                                        <Button 
                                            color={'error'}
                                            children={empleado.empleadoEstado == 1 ? 'Desabilitar' : 'Habilitar'}
                                            onClick={()=> cambioEstado(empleado.empleadoId)}
                                        ></Button>
                                        
                                    </div>}>
                                <Button 
                                children={empleado.empleadoEstado == 1 ? 'Desabilitar' : 'Habilitar'}
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
