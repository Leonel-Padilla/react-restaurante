import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Input,Tooltip, Modal, Text, } from '@nextui-org/react';
import buscarLupa from '../../img/buscar_lupa.png';
import lapizEditar from '../../img/lapiz_editar.png'

const endPointGetComentarios        = 'http://127.0.0.1:8000/api/Comentario'
const endPointUpdateComentarios     = 'http://127.0.0.1:8000/api/updateComentario'
const endPointGetSucursales         = 'http://127.0.0.1:8000/api/Sucursal'

const MostrarComentario = () =>{
    const [comentarioActual, setComentarioActual]   = useState([])
    const [comentarios, setComentarios]             = useState([])
    const [sucursales, setSucursales]               = useState([])
    let nombreSucursal                              = ''
    let idSucursal                                  = 0

    const navigate = useNavigate()
    const [mensajeModal, setMensajeModal]   = useState('')
    const [tituloModal, setTituloModal]     = useState('')
    const [visible, setVisible]             = useState(false)

    const [parametroBusqueda, setParametroBusqueda]   = useState('Seleccione')
    const [valorBusqueda, setValorBusqueda]           = useState('Seleccione')
    
    useEffect(()=>{
        getAllComentarios()
        getAllSucursales()
    },[])

    //
    const activarModal = (titulo, mensajeModal)=>{
        setTituloModal(titulo)
        setMensajeModal(mensajeModal)
        setVisible(true)
    }
    //
    const getAllComentarios = async () =>{
        const response = await axios.get(endPointGetComentarios)
        setComentarios(response.data)
        //console.log(response.data)
    }
    //
    const getAllSucursales = async () =>{
        const response = await axios.get(endPointGetSucursales)
        setSucursales(response.data)
        //console.log(response.data)
    }
    //
    const formatearSucursalId = (sucursalId)=>{
        sucursales.map((sucursal)=>{
            if(sucursal.id == sucursalId){
                nombreSucursal = sucursal.sucursalNombre
            }
        })
    }
    //
    const formatearNombreSucursal = ()=>{
        sucursales.map((sucursal)=>{
            if(valorBusqueda == sucursal.sucursalNombre){
                idSucursal = sucursal.id
            }
        })
    }
    //
    const getByValorBusqueda = async (e)=>{
        e.preventDefault()
  
        if (parametroBusqueda.includes('Seleccione')){
            activarModal('Error', 'Seleccione un parametro de busqueda.')
        }else{
  
            if (parametroBusqueda == 'ID'){
                const response = await axios.get(`${endPointGetComentarios}/${valorBusqueda}`)
                console.log(response.data)
                
                if (response.status != 200){
                    activarModal('Error', `${response.data.Error}`)
                }else{
                    const array = [response.data]
                    setComentarios(array)
                }
                
            }else{
                formatearNombreSucursal()
                const response = await axios.get(`${endPointGetComentarios}S/${idSucursal}`)
                const array = response.data
        
                if (array.length < 1){
                    activarModal('Error', 'No hay Comentarios en la sucursal ingresada.')
                }else{
                    setComentarios(array)
                }
            }
        } 
    }
    //
    const cambioEstado = async ()=>{
        await axios.put(`${endPointUpdateComentarios}/${comentarioActual.id}`, {sucursalId: comentarioActual.sucursalId, 
            descripcion: comentarioActual.descripcion, telCliente: comentarioActual.telCliente, 
            correoCliente: comentarioActual.correoCliente, estado: comentarioActual.estado == 1 ? 0 : 1})

        getAllComentarios()

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
                            cambioEstado()
                            setVisible(false)
                        }}>
                            Cambiar
                        </Button>
                    </div>
                </div>
                }
                </Modal.Body>
            </Modal>

            <div className='d-flex justify-content-start pt-2 pb-2' style={{backgroundColor: 'whitesmoke'}} >
                <h1 className='ms-4 me-4' >Comentarios</h1>

                    <select style={{height: '35px'}} 
                        className='align-self-center me-2'
                        onChange={(e)=>setParametroBusqueda(e.target.value)} 
                        >   
                        <option>Seleccione tipo búsqueda</option>
                        <option>ID</option>
                        <option>Nombre Sucursal</option>
                    </select>

                    {/*------Fomulario de busqueda*/}
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
                        title=''
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
                        auto onClick={()=>navigate('/MenuPrincipal')}
                        >Regresar
                    </Button>

                    <Button
                        auto
                        color={"gradient"}
                        bordered
                        className='align-self-center me-2'
                        onClick={()=>getAllComentarios()}
                        >Llenar Tabla
                    </Button>

                    <Button 
                        className='bg-dark text-light align-self-center'
                        color={'dark'}
                        bordered
                        onClick={()=>navigate('/Comentarios/addComentario')}
                        >Registrar  
                    </Button>
            </div>
                
            <table className='table mt-2'> 
                <thead className='bg-dark text-white'> 
                    <tr>
                        <th>Id</th>
                        <th>Sucursal</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                
                <tbody>
                    {comentarios.map(comentario => {
                        formatearSucursalId(comentario.sucursalId)

                        return(
                        <tr key={comentario.id}>
                            <td>{comentario.id}</td>
                            <td>{nombreSucursal}</td>
                            <td>{comentario.descripcion}</td>
                            <td>{comentario.estado == 1? 'Habilitado': 'Deshabilitado'}</td>
                            <td>
                            <Button
                            className='mb-1'
                            color={'gradient'}
                            iconRight={<img src={lapizEditar}/>}
                            onClick={()=>navigate(`/Comentarios/updateComentario/${comentario.id}`)}
                                >Editar
                            </Button>

                            <Button 
                                light
                                shadow
                                children={comentario.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
                                color={'secondary'}
                                onClick={()=>{
                                    setComentarioActual(comentario)
                                    activarModal('Cambiar', `¿Seguro que desea ${comentario.estado == 1 ? 'deshabilitar' : 'habilitar'} este registro?`)
                                }}
                            ></Button>
                        </td>
                        </tr>)
                    })}
                </tbody>

            </table>
        </div>
    )
}
export default MostrarComentario