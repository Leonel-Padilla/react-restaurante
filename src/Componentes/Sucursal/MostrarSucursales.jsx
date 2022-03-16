
import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Tooltip, Modal, Text } from '@nextui-org/react';
import buscarLupa from '../../img/buscar_lupa.png';
import lapizEditar from '../../img/lapiz_editar.png'

const endPoint = 'http://127.0.0.1:8000/api/Sucursal'
const endPointUpdate = 'http://127.0.0.1:8000/api/updateSucursal'
const endPointGet = 'http://127.0.0.1:8000/api/Sucursal'

function MostrarSucursales() { 

    const [sucursales, setSucursales] = useState([])
    const navigate = useNavigate()
    const [parametroBusqueda, setParametroBusqueda] = useState('ID')
    const [valorBusqueda, setValorBusqueda] = useState()
    const [mensajeModal, setMensajeModal] = useState('')
    const [tituloModal, setTituloModal] = useState('')
    const [visible, setVisible] = useState(false)
    const [valorTooltip, setValorToolTip] = useState(false)

    useEffect(()=>{

        getAllSucursales()    
    
      }, [])

    const getAllSucursales = async ()=>{
    
        const response = await axios.get(endPoint)
        setSucursales(response.data)
        //console.log(response.data) //DEV
    }

    const cambioEstado = async (sucursal)=>{

        await axios.put(`${endPointUpdate}/${sucursal.id}`, {sucursalDireccion: sucursal.sucursalDireccion, estado: sucursal.estado == 1? 0 : 1})
      
            getAllSucursales()
        }

    const getByValorBusqueda = async (e)=>{
    e.preventDefault()

    if (parametroBusqueda == 'ID'){
        const response = await axios.get(`${endPointGet}/${valorBusqueda}`)
        
        if (response.status != 200){
            setTituloModal('Error')
            setMensajeModal(response.data.Error)
            setVisible(true)
        }else{
            const array = [response.data]
            setSucursales(array)
        }

    }else{

        const response = await axios.get(`${endPointGet}N/${valorBusqueda}`)
        console.log(response.data)
        
        const array = response.data

        if (array.length < 1){
            setTituloModal('Error')
            setMensajeModal('No hay sucursales con el encargado que ingresó.')
            setVisible(true)
        }else{
            setSucursales(array)
        }
    }
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

        <div className='d-flex justify-content-start pt-2 pb-2'
        style={{backgroundColor: 'whitesmoke'}} >
           
            <h1 className='ms-4 me-4' >Sucursales</h1>

            <select style={{height: '35px'}}
            className='align-self-center me-2'
            onChange={(e)=>setParametroBusqueda(e.target.value)}>
                <option value="ID">ID</option>
                <option value="Encargado">Encargado</option>
            </select>

            <form 
            className='d-flex align-self-center' 
            style={{left: '300px'}} 
            onSubmit={getByValorBusqueda}>
                <input
                placeholder={`ingrese ${parametroBusqueda}`}
                aria-label='aria-describedby'
                onChange={(e)=>setValorBusqueda(e.target.value)}
                type={parametroBusqueda == 'ID'? 'number':'text'}
                className='form-control'
                required={true}
                pattern={parametroBusqueda == 'Encargado'? '[A-Za-z ]{3,}':''}
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
            onClick={()=>getAllSucursales()}>
                Llenar Tabla
            </Button>

            <Button 
            className='bg-dark text-light align-self-center'
            color={'dark'}
            bordered
            onClick={()=>navigate('/Sucursales/addSucursal')}>
                Registrar
            </Button>
        </div>


            <table className='table mt-2'> 
                <thead className='bg-dark text-white'> 
                    <tr>
                        <th>Id</th>
                        <th>Dirección</th>
                        <th>Encargado</th>
                    </tr>
                </thead>

                <tbody>
                    {sucursales.map(sucursal => 
                        
                        <tr key={sucursal.id}>
                            <td>{sucursal.id}</td>
                            <td>{sucursal.sucursalDireccion}</td>
                            <td>{sucursal.estado == 1 ? 'Habilitado' : 'Deshabilitado'}</td>
                            <td>
                                <Button
                                className='mb-1'
                                color={'gradient'}
                                iconRight={<img src={lapizEditar}/>}
                                onClick={()=>navigate(`/Sucursales/updateSucursal/${sucursal.id}`)}
                                    >Editar
                                </Button>

                                <Tooltip
                                placement='left'
                                initialVisible={false}
                                trigger='hover' 
                                visible = {valorTooltip}
                                content={<div>
                                            <p>Está seguro que desea cambiar este registro?</p> 

                                            <div style={{display: 'flex'}}>
                                            <Button 
                                            auto
                                            className='bg-dark text-light '
                                            color={'dark'}
                                            children={sucursal.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
                                            onClick={()=>cambioEstado(sucursal)}>
                                            </Button>


                                            </div>
                                            
                                        </div>}>
                                    <Button 
                                    light
                                    shadow
                                    children={sucursal.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
                                    color={'secondary'}
                                    ></Button>

                                    
                                </Tooltip>

                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            
        </div>
  )
}

export default MostrarSucursales