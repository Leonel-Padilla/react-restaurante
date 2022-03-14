import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Input,Tooltip } from '@nextui-org/react';
import buscarLupa from '../../img/buscar_lupa.png';
import lapizEditar from '../../img/lapiz_editar.png'

const endPoint = 'http://127.0.0.1:8000/api/Proveedor'
const endPointUpdate = 'http://127.0.0.1:8000/api/updateProveedor'
const endPointgetByNombre = 'http://127.0.0.1:8000/api/ProveedorN'

const MostrarProveedores = (props)=>{
    const [proveedores, setProveedores] = useState([])
    const [nombreBusqueda, setNombreBusqueda] = useState('')
    const navigate = useNavigate()

    useEffect(()=>{

        getAllProveedores()

    }, [])

    const getAllProveedores = async ()=>{
        
        const response = await axios.get(endPoint)
        setProveedores(response.data)

        console.log(sessionStorage.getItem('userName'))
        console.log(sessionStorage.getItem('contrasenia'))
        //console.log(response.data) //DEV
    }

    const cambioEstado = async (proveedor)=>{

    await axios.put(`${endPointUpdate}/${proveedor.id}`, {proveedorNombre: proveedor.proveedorNombre, 
        proveedorNumero: proveedor.proveedorNumero, proveedorCorreo: proveedor.proveedorCorreo,
        proveedorEncargado: proveedor.proveedorEncargado,  proveedorRTN: proveedor.proveedorRTN, 
        estado: proveedor.estado == 1? 0 : 1})

        getAllProveedores()
    }

    const getByNombre = async (e)=>{
        e.preventDefault()

        const response = await axios.get(`${endPointgetByNombre}/${nombreBusqueda}`)

        setProveedores(response.data)
    }

    return(
        <div>

        <div className='d-flex justify-content-start pt-2 pb-2'
        style={{backgroundColor: 'whitesmoke'}} >
           
            <h1 className='ms-4 me-4' >Proveedor</h1>

            <form 
            className='d-flex align-self-center' 
            style={{left: '300px'}} 
            onSubmit={getByNombre}>
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
            onClick={()=>getAllProveedores()}>
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
                        <th>Encargado</th>
                        <th>Estado</th>
                        <th>RTN</th>
                        <th>Opciones</th>
                    </tr>
                </thead>

                <tbody>
                    {proveedores.map(proveedor => 
                        
                        <tr key={proveedor.id}>
                            <td>{proveedor.id}</td>
                            <td>{proveedor.proveedorNombre}</td>
                            <td>{proveedor.proveedorNumero}</td>
                            <td>{proveedor.proveedorCorreo}</td>
                            <td>{proveedor.proveedorEncargado}</td>
                            <td>{proveedor.estado == 1 ? 'Habilitado' : 'Deshabilitado'}</td>
                            <td>{proveedor.proveedorRTN}</td>
                            <td>
                                <Button
                                className='mb-1'
                                color={'gradient'}
                                iconRight={<img src={lapizEditar}/>}
                                onClick={()=>navigate(`/Proveedores/updateProveedor/${proveedor.id}`)}
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
                                            children={proveedor.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
                                            onClick={()=>cambioEstado(proveedor)}
                                            ></Button>
                                            
                                        </div>}>
                                    <Button 
                                    light
                                    shadow
                                    children={proveedor.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
                                    color={'secondary'}
                                    ></Button>
                                </Tooltip>

                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <Button 
            className='bg-dark text-light'
            color={'dark'}
            bordered
            onClick={()=>navigate('/Proveedores/addProveedor')}>
                Registrar
            </Button>
        </div>
    )
}

export default MostrarProveedores