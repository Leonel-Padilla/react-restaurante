
import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Tooltip, Modal, Text } from '@nextui-org/react';
import buscarLupa from '../../img/buscar_lupa.png';
import lapizEditar from '../../img/lapiz_editar.png'


const endPoint = 'http://127.0.0.1:8000/api/Cliente'
const endPointUpdate = 'http://127.0.0.1:8000/api/updateCliente'
const endPointGet = 'http://127.0.0.1:8000/api/Cliente'


function MostrarClientes() {

  const [clientes, setClientes]                     = useState([])
  const [clienteActual, setClienteActual]           = useState()
  const navigate                                    = useNavigate()
  const [parametroBusqueda, setParametroBusqueda]   = useState('Seleccione')
  const [valorBusqueda, setValorBusqueda]           = useState()
  const [mensajeModal, setMensajeModal]             = useState('')
  const [tituloModal, setTituloModal]               = useState('')
  const [visible, setVisible]                       = useState(false)
  const [valorTooltip, setValorToolTip]             = useState(false)
  

  useEffect(()=>{

    getAllClientes()    

  }, [])

//
const activarModal = (titulo, mensajeModal)=>{
    setTituloModal(titulo)
    setMensajeModal(mensajeModal)
    setVisible(true)
}

const getAllClientes = async ()=>{
    
    const response = await axios.get(endPoint)
    setClientes(response.data)
    //console.log(response.data) //DEV
}

//
const cambioEstado = async (cliente)=>{

    const response = await axios.put(`${endPointUpdate}/${cliente.id}`, {tipoDocumentoId: cliente.tipoDocumentoId,
    numeroDocumento: cliente.numeroDocumento, clienteNombre: cliente.clienteNombre, clienteNumero: cliente.clienteNumero, 
    clienteCorreo: cliente.clienteCorreo, clienteRTN: cliente.clienteRTN, estado: cliente.estado == 1? 0 : 1})

    getAllClientes()
    
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
                setClientes(array)
            }
            
          }else{
            const response = await axios.get(`${endPointGet}N/${valorBusqueda}`)
            console.log(response.data)
            
            const array = response.data
    
            if (array.length < 1){
                setTituloModal('Error')
                setMensajeModal('No hay clientes con el nombre que ingresó.')
                setVisible(true)
            }else{
                setClientes(array)
            }
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
                            cambioEstado(clienteActual)
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
           
            <h1 className='ms-4 me-4' >Clientes</h1>

            <select style={{height: '35px'}}
            className='align-self-center me-2'
            onChange={(e)=>setParametroBusqueda(e.target.value)}>
                <option>Seleccione tipo búsqueda</option>
                <option>ID</option>
                <option>Nombre</option>
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
            onClick={()=>getAllClientes()}>
                Llenar Tabla
            </Button>

            <Button 
            className='bg-dark text-light align-self-center'
            color={'dark'}
            bordered
            onClick={()=>navigate('/Clientes/addCliente')}>
                Registrar
            </Button>
        </div>


            <table className='table mt-2'> 
                <thead className='bg-dark text-white'> 
                    <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Número</th>
                        <th>Correo</th>
                        <th>RTN</th>
                        <th>Estado</th>
                        <th>Opciones</th>
                    </tr>
                </thead>

                <tbody>
                    {clientes.map(cliente => 
                        
                        <tr key={cliente.id}>
                            <td>{cliente.id}</td>
                            <td>{cliente.clienteNombre}</td>
                            <td>{cliente.clienteNumero}</td>
                            <td>{cliente.clienteCorreo}</td>
                            <td>{cliente.clienteRTN}</td>
                            <td>{cliente.estado == 1 ? 'Habilitado' : 'Deshabilitado'}</td>
                            <td>
                                <Button
                                className='mb-1'
                                color={'gradient'}
                                iconRight={<img src={lapizEditar}/>}
                                onClick={()=>navigate(`/Clientes/updateCliente/${cliente.id}`)}
                                    >Editar
                                </Button>

                                <Button 
                                light
                                shadow
                                children={cliente.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
                                color={'secondary'}
                                onClick={()=>{
                                    setClienteActual(cliente)
                                    activarModal('Cambiar', `¿Seguro que desea ${cliente.estado == 1 ? 'deshabilitar' : 'habilitar'} este registro?`)
                                }}
                                ></Button>

                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            
        </div>
  )
}

export default MostrarClientes