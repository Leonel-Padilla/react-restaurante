import React from "react";
import { Collapse, Button, Avatar, Text} from '@nextui-org/react';
import Gerente from '../../img/gerente.png'
import Cargo from '../../img/headhunting.png'
import Proveedor1 from '../../img/paquetes.png'
import Sucursal from "../../img/tienda.png"
import Cliente from "../../img/cliente.png"
import User from "../../img/user.png"
import Background from '../../img/Restaurante.jpg'
import { useNavigate } from "react-router-dom";


function Sidebar () {
    const navigate = useNavigate()
    return(
        <div className='d-flex flex-row  fondo '>
            <div className="bg-dark overflow_sideBar" style={{width:"350px"}}>
                <Collapse.Group>
                <Collapse 
                title = {<Text h6 className="text-white">Usuario</Text>}
                subtitle={`${sessionStorage.getItem('userName')} ${sessionStorage.getItem('id')}`}
                contentLeft={
                <Avatar size="md" squared icon={<img src={User}/>} />}>
                    <Button light color={'default'} onClick={()=>{
                        sessionStorage.removeItem('userName')
                        sessionStorage.removeItem('id')
                        console.log(sessionStorage.getItem('userName'))
                        navigate("/")
                    }} className="text-white"> 
                        Cerrar Sesión</Button>
                </Collapse>
                <Collapse 
                title = {<Text h6 className="text-white">Cargo</Text>}
                contentLeft={
                <Avatar size="md" squared icon={<img src={Cargo}/>} />}>
                    <Button light color={'default'} onClick={()=>navigate('/Cargos')} className="text-white"> 
                        Mostrar Cargos</Button>
                    <Button light color={'default'} onClick={()=>navigate('/Cargos/addCargo')}className="text-white">
                        Registrar Cargo</Button>
                </Collapse>
                <Collapse 
                title = {<Text h6 className="text-white">Cliente</Text>}
                contentLeft={
                <Avatar size="md" squared icon={<img src={Cliente}/>} />}>
                    <Button light color={'default'} onClick={()=>navigate('/Clientes')} className="text-white"> 
                        Mostrar Clientes</Button>
                    <Button light color={'default'} onClick={()=>navigate('/Clientes/addCliente')}className="text-white">
                        Registrar Cliente</Button>
                </Collapse>
                <Collapse 
                title = {<Text h6 className="text-white">Empleado</Text>}
                contentLeft={
                <Avatar size="md" icon={<img src={Gerente}/>}/>}>
                    <Button light color={'default'} onClick={()=>navigate('/Empleados')}className="text-white"> 
                        Mostrar Empleados</Button>
                    <Button light color={'default'} onClick={()=>navigate('/Empleados/addEmpleado')}className="text-white"> 
                        Registrar Empleados</Button>
                </Collapse>
                <Collapse 
                title = {<Text h6 className="text-white">Proveedor</Text>}
                contentLeft={
                <Avatar size="md" icon={<img src={Proveedor1}/>}/>}> 
                    <Button light color={'default'} onClick={()=>navigate('/Proveedores')}className="text-white"> 
                        Mostrar Proveedores</Button>
                    <Button light color={'default'} onClick={()=>navigate('/Proveedores/addProveedor')}className="text-white"> 
                        Registrar Proveedor</Button>
                </Collapse>
                <Collapse 
                title = {<Text h6 className="text-white">Sucursal</Text>}
                contentLeft={
                <Avatar size="md" squared icon={<img src={Sucursal}/>} />}>
                    <Button light color={'default'} onClick={()=>navigate('/Sucursales')} className="text-white"> 
                        Mostrar Sucursales</Button>
                    <Button light color={'default'} onClick={()=>navigate('/Sucursales/addSucursal')}className="text-white">
                        Registrar Sucursal</Button>
                </Collapse>
                
                
        </Collapse.Group>
        </div>
        <img src={Background} style={{position:"relative", width:"100%"}}/>
    </div>
    )
}

export default Sidebar