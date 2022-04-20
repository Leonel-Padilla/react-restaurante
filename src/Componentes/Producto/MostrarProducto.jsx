import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Input,Tooltip, Modal, Text } from '@nextui-org/react';
import buscarLupa from '../../img/buscar_lupa.png';
import lapizEditar from '../../img/lapiz_editar.png'


const endPointGetProductos          = 'http://127.0.0.1:8000/api/Producto'
const endPointUpdateComentarios     = 'http://127.0.0.1:8000/api/updateProducto'
const endPointGetSucursales         = 'http://127.0.0.1:8000/api/Sucursal'
const endPointGetImpuesto           = 'http://127.0.0.1:8000/api/Impuesto'
const MostrarProducto = () =>{
    const [productos, setProductos]             = useState([])
    const [productoActual, setProductoActual]   = useState()
    const [impuestos, setImpuestos]             = useState([])
    let impuestoNombre                          = ''

    const navigate = useNavigate()
    const [mensajeModal, setMensajeModal]   = useState('')
    const [tituloModal, setTituloModal]     = useState('')
    const [visible, setVisible]             = useState(false)

    const [parametroBusqueda, setParametroBusqueda]   = useState('Seleccione')
    const [valorBusqueda, setValorBusqueda]           = useState('Seleccione')

    useEffect(()=>{
        getAllProductos()
        getAllImpuestos()
    },[])

    //
    const activarModal = (titulo, mensajeModal)=>{
        setTituloModal(titulo)
        setMensajeModal(mensajeModal)
        setVisible(true)
    }
    //
    const getAllProductos = async () =>{
        const response = await axios.get(endPointGetProductos)
        setProductos(response.data)
    }
    //
    const getAllImpuestos = async () =>{
        const response = await axios.get(endPointGetImpuesto)
        setImpuestos(response.data)
    }
    //
    const cambioEstado = async ()=>{
        const response = await axios.put(`${endPointUpdateComentarios}/${productoActual.id}`, {impuestoId: productoActual.impuestoId,
        productoNombre: productoActual.productoNombre, productoDescripcion: productoActual.productoDescripcion,
        precio: productoActual.precio, estado: productoActual.estado == 1 ? 0 : 1})
        //console.log(response.data)

        getAllProductos()
    }
    //
    const formatearImpuestoId = (impuestoId)=>{
        impuestos.map((impuesto)=>{
            if(impuesto.id == impuestoId){
                impuestoNombre = impuesto.nombreImpuesto
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
                const response = await axios.get(`${endPointGetProductos}/${valorBusqueda}`)
                
                if (response.status != 200){
                    activarModal('Error', `${response.data.Error}`)
                }else{
                    const array = [response.data]
                    setProductos(array)
                }
                
            }else{
                const response = await axios.get(`${endPointGetProductos}N/${valorBusqueda}`)
                const array = response.data

                if (array.length < 1){
                    activarModal('Error', 'No hay Productos con ese nombre.')
                }else{
                    setProductos(array)
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
                            cambioEstado()
                            setVisible(false)
                            }}>
                            Cambiar
                        </Button>
                    </div>
                </div>}
                </Modal.Body>
            </Modal>

            <div className='d-flex justify-content-start pt-2 pb-2' style={{backgroundColor: 'whitesmoke'}} >
                <h1 className='ms-4 me-4' >Productos</h1>

                    <select style={{height: '35px'}} 
                        className='align-self-center me-2'
                        onChange={(e)=>setParametroBusqueda(e.target.value)} 
                        >   
                        <option>Seleccione tipo busqueda</option>
                        <option>ID</option>
                        <option>Nombre</option>
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
                        onClick={()=>getAllProductos()}
                        >Llenar Tabla
                    </Button>

                    <Button 
                        className='bg-dark text-light align-self-center'
                        color={'dark'}
                        bordered
                        onClick={()=>navigate('/Productos/addProducto')}
                        >Registrar  
                    </Button>
            </div>
                
            <table className='table mt-2'> 
                <thead className='bg-dark text-white'> 
                    <tr>
                        <th>ID</th>
                        <th>Producto Nombre</th>
                        <th>Producto Precio</th>
                        <td>Descripcion</td>
                        <td>Impuesto</td>
                        <th>Estado</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map(producto =>{
                        formatearImpuestoId(producto.impuestoId)
                        return(
                        <tr key={producto.id}>
                            <td>{producto.id}</td>
                            <td>{producto.productoNombre}</td>
                            <td>{producto.precio}</td>
                            <td>{producto.productoDescripcion}</td>
                            <td>{impuestoNombre}</td>
                            <td>{producto.estado == 1 ? 'Habilitado' : 'Deshabilitado'}</td>
                            <td>
                                <Button
                                className='mb-1'
                                color={'gradient'}
                                iconRight={<img src={lapizEditar}/>}
                                onClick={()=>navigate(`/Productos/updateProducto/${producto.id}`)}
                                    >Editar
                                </Button>        

                                <Button 
                                    light
                                    shadow
                                    children={producto.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
                                    color={'secondary'}
                                    onClick={()=>{
                                        setProductoActual(producto)
                                        activarModal('Cambiar', `¿Seguro que desea ${producto.estado == 1 ? 'deshabilitar' : 'habilitar'} este registro?`)
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
export default MostrarProducto