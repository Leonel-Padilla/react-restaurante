import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Button, Modal, Switch, Tooltip } from '@nextui-org/react';




const MostrarEmpleados = ()=>{
    const [empleados, setEmpleados] = useState([])

    useEffect(()=>{
        getAllEmpleados()
    },[])

    const getAllEmpleados = ()=>{
        const resposne = {
            data: [
                {empleadoId:1, empleadoNombre: 'Manuel', empleadoNumero: 89306904, empleadoCorreo: 'manu@gmail.com', 
                empleadoDireccion: 'Aqui cerca', empleadoEstado: 1, tipoDocumentacion: 2},
                {empleadoId:2, empleadoNombre: 'Juan', empleadoNumero: 89306904, empleadoCorreo: 'jaun@gmail.com', 
                empleadoDireccion: 'Aqui cerca', empleadoEstado: 1, tipoDocumentacion: 1},
                {empleadoId:3, empleadoNombre: 'Mario', empleadoNumero: 89306904, empleadoCorreo: 'Mario@gmail.com', 
                empleadoDireccion: 'Aqui cerca', empleadoEstado: 1, tipoDocumentacion: 2},
                {empleadoId:4, empleadoNombre: 'pedrito', empleadoNumero: 89306904, empleadoCorreo: 'pedrito@gmail.com', 
                empleadoDireccion: 'Aqui cerca', empleadoEstado: 1, tipoDocumentacion: 5},
            ],
        }

        setEmpleados(resposne.data)
    }

    return(
        <div>

            {/*<Link to="addempleado">*/<Button color={'success'} ghost>Registrar</Button>/*</Link>*/}
            <table className='table table-striped'>
            <thead className='bg-primary text-white'>
                <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Numero</th>
                    <th>Correo</th>
                    <th>Direccion</th>
                    <th>Estado</th>
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
                        <td>{empleado.empleadoEstado}</td>
                        <td>
                            {/*<Link to={`/updateempleado/${empleado.id}`}>*/<Button color={'gradient'} ghost>Editar</Button>/*</Link>*/}
                            
                            <Tooltip
                            placement='left'
                            initialVisible={false}
                            trigger='click' 
                            content={<div>
                                        <p>Está seguro que desea eliminar este registro?</p> 
                                        <Button color={'error'}>Desactivar</Button>
                                        
                                    </div>}>
                                    <Switch ></Switch>
                            </Tooltip>
                            
                            
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
        </div>
    )
}

export default MostrarEmpleados
