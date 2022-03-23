import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Tooltip, Modal, Text } from '@nextui-org/react';
import buscarLupa from '../../img/buscar_lupa.png';
import lapizEditar from '../../img/lapiz_editar.png'



const endPointGetMesas      = 'http://127.0.0.1:8000/api/Mesa'
const endPointUpdateMesa   = 'http://127.0.0.1:8000/api/updateMesa'
const endPointGetSucursal      = 'http://127.0.0.1:8000/api/Sucursal'

const MostrarMesas = ()=>{

    const [parametroBusqueda, setParametroBusqueda]   = useState('Seleccione')
    const [valorBusqueda, setValorBusqueda]           = useState('')
    const [sucursales, setSucursales]                 = useState([]) 
    let sucursalNombre                                = ''
    let sucursalId                                    = 0 

    const [mesas, setMesas]                 = useState([])
    const [mensajeModal, setMensajeModal]   = useState('')
    const [tituloModal, setTituloModal]     = useState('')
    const [visible, setVisible]             = useState(false)
    const navigate                          = useNavigate()

    useEffect(()=>{
        getAllMesas()
        getAllSucursales()
    }, [])


    //
    const getAllMesas = async ()=>{
        const response = await axios.get(endPointGetMesas)
        setMesas(response.data)
    }

    //
    const cambioEstado = async (mesa)=>{
        await axios.put(`${endPointUpdateMesa}/${mesa.id}`, {sucursalId: mesa.sucursalId, 
        cantidadAsientos: mesa.cantidadAsientos, estado: mesa.estado == 1? 0 : 1})

        getAllMesas()
    }

    const formatearSucursalNombre = (nombreSucursal)=>{
        sucursales.map((sucursal)=>{
            if (sucursal.sucursalNombre == nombreSucursal){
                sucursalId = sucursal.id
            }
        })
    }

  //
  const getByValorBusqueda = async (e)=>{
    e.preventDefault()
  
    if (parametroBusqueda.includes('Seleccione')){
        setTituloModal('Error')
        setMensajeModal('Seleccione un parametro de busqueda.')
        setVisible(true)
    }else{
        if (parametroBusqueda == 'ID'){
            const response = await axios.get(`${endPointGetMesas}/${valorBusqueda}`)
            
            if (response.status != 200){
                setTituloModal('Error')
                setMensajeModal(response.data.Error)
                setVisible(true)
            }else{
                const array = [response.data]
                setMesas(array)
            }
            
          }else{
            formatearSucursalNombre(valorBusqueda)
            const response = await axios.get(`${endPointGetMesas}N/${sucursalId}`)
            console.log(response.data)

            const array = response.data

            if (array.length < 1){
                setTituloModal('Error')
                setMensajeModal('No hay sucursales con el nombre que ingresó.')
                setVisible(true)
            }else{
                setMesas(array)
            }
          }
    }
      
  }    

    //
    const getAllSucursales = async()=>{
        const response = await axios.get(endPointGetSucursal)
        setSucursales(response.data)
    }

    //
    const formatearSucursalId = (mesa)=>{
        sucursales.map((sucursal)=>{
            if (sucursal.id == mesa.sucursalId){
                sucursalNombre = sucursal.sucursalNombre
            }
        })
    }

    return (
        <div>

            <Modal
            closeButton
            blur
            preventClose
            className='bg-dark text-white'
            open={visible}
            onClose={()=>setVisible(false)}>
                <Modal.Header>
                    <Text 
                    h4
                    className='text-white'>
                        {tituloModal}
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    {mensajeModal}
                </Modal.Body>

            </Modal>


            <div className='d-flex justify-content-start pt-2 pb-2' style={{backgroundColor: 'whitesmoke'}} >
                <h1 className='ms-4 me-4' >Mesas</h1>

                <select style={{height: '35px'}} 
                    className='align-self-center me-2'
                    onChange={(e)=>setParametroBusqueda(e.target.value)} 
                >
                    <option>Seleccione tipo busqueda</option>
                    <option>ID</option>                
                    <option>Sucursal Nombre</option>
                </select>

            <form 
            className='d-flex align-self-center' 
            style={{left: '300px'}} 
            onSubmit={getByValorBusqueda}
            >
                <input
                    placeholder={parametroBusqueda.includes('Seleccione')? '': `${parametroBusqueda}`}
                    aria-label='aria-describedby'
                    onChange={(e)=>setValorBusqueda(e.target.value)}
                    type={parametroBusqueda == 'ID'? 'number':'text'}
                    className='form-control me-2'
                    required={true}
                    title='Solo se aceptan letras, ejem: "La Colonia"'
                    //pattern={parametroBusqueda == 'Nombre'? '[A-Za-z ]{3,}':''}
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
            onClick={()=>getAllMesas()}
            >Llenar Tabla
            </Button>

            <Button 
            className='bg-dark text-light align-self-center'
            color={'dark'}
            bordered
            onClick={()=>navigate('/Mesas/addMesa')}>
                Registrar
            </Button>
            
        </div>

            <table className='table mt-2'> 
                <thead className='bg-dark text-white'> 
                    <tr>
                        <th>Id Mesa</th>
                        <th>Cantidad de asientos</th>
                        <th>Sucursal nombre</th>
                        <th>Estado</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                
                <tbody>

                    {mesas.map((mesa)=>{

                        formatearSucursalId(mesa)

                     return(   
                    <tr key={mesa.id}>
                        <td>{mesa.id}</td>
                        <td>{mesa.cantidadAsientos}</td>
                        <td>{sucursalNombre}</td>
                        <td>{mesa.estado == 1 ? 'Habilitado' : 'Deshabilitado'}</td>

                        <td>
                            <Button
                            className='mb-1'
                            color={'gradient'}
                            iconRight={<img src={lapizEditar}/>}
                            onClick={()=>navigate(`/Mesas/updateMesa/${mesa.id}`)}
                                >Editar
                            </Button>

                            <Tooltip
                            placement='left'
                            initialVisible={false}
                            trigger='hover' 
                            content={<div>
                                        <p>Está seguro que desea cambiar este registro?</p> 

                                        <Button 
                                        auto
                                        className='bg-dark text-light'
                                        color={'dark'}
                                        children={mesa.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
                                        onClick={()=> cambioEstado(mesa)}
                                        ></Button>
                                        
                                    </div>}>
                                <Button 
                                light
                                shadow
                                children={mesa.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
                                color={'secondary'}
                                ></Button>
                            </Tooltip>

                        </td>
                    </tr>)
                    })}

                </tbody>

            </table>
        </div>
    );
}

export default MostrarMesas
