
import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Tooltip, Modal, Text } from '@nextui-org/react';
import buscarLupa from '../../img/buscar_lupa.png';
import lapizEditar from '../../img/lapiz_editar.png'

const endPoint                  = 'http://127.0.0.1:8000/api/Sucursal'
const endPointUpdate            = 'http://127.0.0.1:8000/api/updateSucursal'
const endPointGet               = 'http://127.0.0.1:8000/api/Sucursal'
const endPointGetAllEmpleados   = 'http://127.0.0.1:8000/api/Empleado'

function MostrarSucursales() { 

    const [sucursales, setSucursales]               = useState([])
    const [sucursalActual, setSucursalActual]       = useState()
    const [empleados, setEmpleados]                 = useState([])
    const navigate                                  = useNavigate()
    const [parametroBusqueda, setParametroBusqueda] = useState('Seleccione')
    const [valorBusqueda, setValorBusqueda]         = useState()
    const [mensajeModal, setMensajeModal]           = useState('')
    const [tituloModal, setTituloModal]             = useState('')
    const [visible, setVisible]                     = useState(false)
    const [valorTooltip, setValorToolTip]           = useState(false)
    let encargado = ''

    useEffect(()=>{

        getAllSucursales()    
        getAllEmpleados()
    
      }, [])


    //
    const activarModal = (titulo, mensajeModal)=>{
        setTituloModal(titulo)
        setMensajeModal(mensajeModal)
        setVisible(true)
    }
    //
    const getAllSucursales = async ()=>{
        const response = await axios.get(endPoint)
        setSucursales(response.data)
    }
    //
    const cambioEstado = async (sucursal)=>{

        await axios.put(`${endPointUpdate}/${sucursal.id}`, {empleadoId: sucursal.empleadoId, sucursalNombre: sucursal.sucursalNombre,
            sucursalDireccion: sucursal.sucursalDireccion, estado: sucursal.estado == 1? 0 : 1})
      
            getAllSucursales()
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
            //console.log(response.data)
            
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

    }

    //
    const getAllEmpleados = async ()=>{
        const resposne = await axios.get(endPointGetAllEmpleados)
        setEmpleados(resposne.data)
    }

    //
    const getEncargado = (sucursal)=>{
        empleados.map((empleado)=>{
            if (sucursal.empleadoId == empleado.id){
                encargado = empleado.empleadoNombre
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
            {tituloModal.includes('Error')?     //IF ERROR
                mensajeModal
                :                                   //ELSE ELIMINAR
                <div>
                    {mensajeModal}

                    <div className='d-flex mt-3'>
                        <Button
                        className='me-3 ms-5'
                        auto
                        onClick={()=>{
                            setVisible(false)
                        }}>
                            Cancelar
                        </Button>

                        <Button
                        className='ms-5'
                        auto
                        onClick={()=>{
                            cambioEstado(sucursalActual)
                            setVisible(false)
                            }}>
                            Cambiar
                        </Button>
                    </div>
                </div>}
            </Modal.Body>

        </Modal>

        <div className='d-flex justify-content-start pt-2 pb-2'
        style={{backgroundColor: 'whitesmoke'}} >
           
            <h1 className='ms-4 me-4' >Sucursales</h1>

            <select style={{height: '35px'}}
            className='align-self-center me-2'
            onChange={(e)=>setParametroBusqueda(e.target.value)}
            >
                <option>Seleccione tipo busqueda</option>
                <option>ID</option>
                <option>Nombre Sucursal</option>
            </select>

            <form 
            className='d-flex align-self-center' 
            style={{left: '300px'}} 
            onSubmit={getByValorBusqueda}>
                <input
                    placeholder={parametroBusqueda.includes('Seleccione')? '': `${parametroBusqueda}`}
                aria-label='aria-describedby'
                onChange={(e)=>setValorBusqueda(e.target.value)}
                type={parametroBusqueda == 'ID'? 'number':'text'}
                className='form-control'
                required={true}
                //pattern={parametroBusqueda == 'Encargado'? '[A-Za-z ]{3,}':''}
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
                        <th>Nombre Sucursal</th>
                        <th>Dirección</th>
                        <th>Encargado</th>
                        <th>Estado</th>
                        <th>Opciones</th>
                    </tr>
                </thead>

                <tbody>
                    {sucursales.map(sucursal =>{

                        getEncargado(sucursal)
                        

                        return(
                        
                        <tr key={sucursal.id}>
                            <td>{sucursal.id}</td>
                            <td>{sucursal.sucursalNombre}</td>
                            <td>{sucursal.sucursalDireccion}</td>
                            {/* <td>{sucursal.empleadoId}</td> */}
                            <td>{encargado}</td>
                            <td>{sucursal.estado == 1 ? 'Habilitado' : 'Deshabilitado'}</td>
                            <td>
                                <Button
                                className='mb-1'
                                color={'gradient'}
                                iconRight={<img src={lapizEditar}/>}
                                onClick={()=>navigate(`/Sucursales/updateSucursal/${sucursal.id}`)}
                                    >Editar
                                </Button>

                                <Button 
                                light
                                shadow
                                children={sucursal.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
                                color={'secondary'}
                                onClick={()=>{
                                    setSucursalActual(sucursal)
                                    activarModal('Cambiar', `¿Seguro que desea ${sucursal.estado == 1 ? 'deshabilitar' : 'habilitar'} este registro?`)
                                }}
                                ></Button>

                            </td>
                        </tr>
                    )})}
                </tbody>
            </table>

            
        </div>
  )
}

export default MostrarSucursales