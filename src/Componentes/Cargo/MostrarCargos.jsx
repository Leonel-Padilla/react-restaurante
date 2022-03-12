
import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Input,Tooltip } from '@nextui-org/react';
import buscarLupa from '../../img/buscar_lupa.png';
import lapizEditar from '../../img/lapiz_editar.png'


const endPoint = 'http://127.0.0.1:8000/api/Cargo'
const endPointUpdate = 'http://127.0.0.1:8000/api/updateCargo'
const endPointgetByNombre = 'http://127.0.0.1:8000/api/CargoN'


function MostrarCargos() {

  const [cargos, setCargos] = useState([])
  const [nombreBusqueda, setNombreBusqueda] = useState('')
  const navigate = useNavigate()

  useEffect(()=>{

    let suscrito = true

    if (suscrito){
    getAllCargos()
    }

    return()=> suscrito = false 
  }, [])

const getAllCargos = async ()=>{
    
    const response = await axios.get(endPoint)
    setCargos(response.data)
    //console.log(response.data) //DEV
}

const cambioEstado = async (cargo)=>{

  await axios.put(`${endPointUpdate}/${cargo.id}`, {cargoNombre: cargo.cargoNombre,
      cargoDescripcion: cargo.cargoDescripcion, estado: cargo.estado == 1? 0 : 1})

      getAllCargos()
  }

  const getByNombre = async (e)=>{
      e.preventDefault()

      const response = await axios.get(`${endPointgetByNombre}/${nombreBusqueda}`)

      setCargos(response.data)
  }


  return (
    <div>
        <div className='d-flex justify-content-start pt-2 pb-2'
        style={{backgroundColor: 'whitesmoke'}} >
           
            <h1 className='ms-4 me-4' >Cargos</h1>

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
            style={{right: '0px'}}
            className='align-self-center ms-2 me-2' 
            auto onClick={()=>navigate('/MenuPrincipal')}>
                Regresar
            </Button>

            <Button
            auto
            color={"gradient"}
            bordered
            className='align-self-center me-2'
            onClick={()=>getAllCargos()}>
                Llenar Tabla
            </Button>

        </div>


            <table className='table mt-2'> 
                <thead className='bg-dark text-white'> 
                    <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Descripcion</th>
                        <th>Estado</th>
                        <th>Opciones</th>
                    </tr>
                </thead>

                <tbody>
                    {cargos.map(cargo => 
                        
                        <tr key={cargo.id}>
                            <td>{cargo.id}</td>
                            <td>{cargo.cargoNombre}</td>
                            <td>{cargo.cargoDescripcion}</td>
                            <td>{cargo.estado == 1 ? 'Habilitado' : 'Deshabilitado'}</td>
                            <td>
                                <Button
                                className='mb-1'
                                color={'gradient'}
                                iconRight={<img src={lapizEditar}/>}
                                onClick={()=>navigate(`/Cargos/updateCargo/${cargo.id}`)}
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
                                            children={cargo.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
                                            onClick={()=>cambioEstado(cargo)}
                                            ></Button>
                                            
                                        </div>}>
                                    <Button 
                                    light
                                    shadow
                                    children={cargo.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
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
            onClick={()=>navigate('/Cargos/addCargo')}>
                Registrar
            </Button>
        </div>
  )
}

export default MostrarCargos