import React from "react";
import { Collapse, Button, Avatar} from '@nextui-org/react';
import Empleado from '../../img/Empleado.png'
import Cargo from '../../img/Cargo.png'
import Proveedor from '../../img/Proveedor.png'
import Background from '../../img/Restaurante.jpg'
import { useNavigate } from "react-router-dom";


function Sidebar () {
    const navigate = useNavigate()


    return(
        <div className='d-flex flex-row'>
            <div>
                <Collapse.Group>
                <Collapse 
                title='Empleado'
                contentLeft={
                <Avatar size="md" squared icon={<img src={Empleado}/>} bordered />}>
                    <Button light color={'default'} onClick={()=>navigate('/Empleados')}> Mostrar Empleados</Button>
                    <Button light color={'default'} onClick={()=>navigate('/Empleados/addEmpleado')}> Registrar Empleados</Button>
                </Collapse>
                <Collapse 
                title='Proveedor'
                
                contentLeft={
                <Avatar size="md" squared icon={<img src={Proveedor}/>} bordered />}>
                        <Button light color={'default'} onClick={()=>navigate('/Proveedores')}> Mostrar Proveedores</Button>
                        <Button light color={'default'} onClick={()=>navigate('/Proveedores/addProveedor')}> Registrar Proveedor</Button>
                </Collapse>
                <Collapse 
                title='Cargo'
                
                contentLeft={
                <Avatar size="md" squared icon={<img src={Cargo}/>} bordered />}>
                        <Button light color={'default'} onClick={()=>navigate('/Cargos')}> Mostrar Cargos</Button>
                    <Button light color={'default'} onClick={()=>navigate('/Cargos/addCargo')}> Registrar Cargo</Button>
                </Collapse>
        </Collapse.Group>
        </div>
            <img style={{height:"800px", width:"1300px",}}src={Background}/>
        </div>
    )
}

export default Sidebar