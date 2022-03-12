import React from "react";
import { Collapse, Button, Avatar, Text} from '@nextui-org/react';
import Gerente from '../../img/gerente.png'
import Cargo from '../../img/headhunting.png'
import Proveedor1 from '../../img/paquetes.png'
import Background from '../../img/Restaurante.jpg'
import { useNavigate } from "react-router-dom";


function Sidebar () {
    const navigate = useNavigate()
    return(
        <div className='d-flex flex-row  fondo '>
            <div className="bg-dark overflow_sideBar" style={{width:"350px"}}>
                <Collapse.Group>
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
                title = {<Text h6 className="text-white">Cargo</Text>}
                contentLeft={
                <Avatar size="md" squared icon={<img src={Cargo}/>} />}>
                    <Button light color={'default'} onClick={()=>navigate('/Cargos')} className="text-white"> 
                        Mostrar Cargos</Button>
                    <Button light color={'default'} onClick={()=>navigate('/Cargos/addCargo')}className="text-white">
                        Registrar Cargo</Button>
                </Collapse>
                
        </Collapse.Group>
        </div>
        <img src={Background} style={{position:"relative", width:"100%"}}/>
    </div>
    )
}

export default Sidebar