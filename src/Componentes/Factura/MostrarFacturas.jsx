import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Tooltip, Modal, Text } from '@nextui-org/react';
import buscarLupa from '../../img/buscar_lupa.png';
import lapizEditar from '../../img/lapiz_editar.png'
import moment from 'moment';

const endPointGetFactura          = 'http://127.0.0.1:8000/api/Factura'
const endPointGetCliente          = 'http://127.0.0.1:8000/api/Cliente'
const endPointGetOrdenEncabezado  = 'http://127.0.0.1:8000/api/OrdenEncabezado'
const endPointGetOrdenDetalle     = 'http://127.0.0.1:8000/api/OrdenDetalle'
const endPointGetProductos        = 'http://127.0.0.1:8000/api/Producto'
const endPointGetEmpleados        = 'http://127.0.0.1:8000/api/Empleado'
function MostrarFacturas() {

    const [facturas, setFacturas]           = useState([])
    const [clientes, setCliente]            = useState([])
    const [ordenes, setOrdenes]             = useState([])
    const [ordenDetalles, setOrdenDetalles] = useState([])
    const [productos, setProductos]         = useState([])
    let nombreProducto                      = ''
    const [empleados, setEmpleados]         = useState([])
    let idEmpleado                          = ''
    
  
    const [parametroBusqueda, setParametroBusqueda] = useState('Seleccione')
    const [valorBusqueda, setValorBusqueda] = useState('Seleccione')
    const [mensajeModal, setMensajeModal]   = useState('')
    const [tituloModal, setTituloModal]     = useState('')
    const [visible, setVisible]             = useState(false)
    const navigate                          = useNavigate()

    useEffect(()=>{
        getAllFacturas()
        getAllClientes()
        getAllOrdenes()
        getAllProductos()
        getAllEmpleados()
    }, [])

    //
    const activarModal = (titulo, mensajeModal)=>{
        setTituloModal(titulo)
        setMensajeModal(mensajeModal)
        setVisible(true)
    }
    //
    const getAllFacturas = async ()=>{
      const response = await axios.get(endPointGetFactura)
      setFacturas(response.data)
    }
    //
    const getAllClientes = async ()=>{
      const response = await axios.get(endPointGetCliente)
      setCliente(response.data)
    }
    //
    const getAllOrdenes = async ()=>{
      const response = await axios.get(endPointGetOrdenEncabezado)
      setOrdenes(response.data)
    }
    //
    const getAllEmpleados = async ()=>{
      const response = await axios.get(endPointGetEmpleados)
      setEmpleados(response.data)
    }
    //
    const getDetallesOrden = async (ordenEncabezadoId)=>{
      const response = await axios.get(`${endPointGetOrdenDetalle}E/${ordenEncabezadoId}`)
      setOrdenDetalles(response .data)
    }
    //
    const getAllProductos = async ()=>{
      const response = await axios.get(endPointGetProductos)
      setProductos(response.data)
    }
    //
    const formatearProductoId = (productoId)=>{
      productos.map((producto)=>{
        if (producto.id == productoId){
          nombreProducto = producto.productoNombre
        }
      })
    }
    //
    const formatearEmpleadoNombre = ()=>{
      empleados.map((empelado)=>{
        if (empelado.empleadoNombre == valorBusqueda){
          idEmpleado = empelado.id
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
                const response = await axios.get(`${endPointGetFactura}/${valorBusqueda}`)
              
                if (response.status != 200){
                    activarModal('Error', `${response.data.Error}`)
                }else{
                    const array = [response.data]
                    setFacturas(array)
                }
              
            }else{

              if (valorBusqueda.includes('Seleccione')){
                activarModal('Error', 'Debe seleccionar un estado de busqueda.')
              }else{
                formatearEmpleadoNombre()

                const response = await axios.get(`${endPointGetFactura}E/${idEmpleado}`)
                const array = response.data
                console.log(response.data)
      
                if (array.length < 1){
                  activarModal('Error', 'No hay facturas de este empleado.')
                  setVisible(true)
                }else{
                  setFacturas(array)
                }
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
                  <table className='table mt-2 text-white'>
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Precio Total</th>
                        <th>Cantidad</th>
                      </tr>
                    </thead>

                    <tbody> 
                      {ordenDetalles.map((ordenDetalle)=>{
                        formatearProductoId(ordenDetalle.productoId)
                        
                        return(
                          <tr key={ordenDetalle.id}>
                            <td>{nombreProducto}</td>
                            <td>{ordenDetalle.precio}</td>
                            <td>{ordenDetalle.cantidad}</td>
                          </tr>)
                      })}
                    </tbody>
                  </table>
                </div>
                }
            </Modal.Body>

        </Modal>


        <div className='d-flex justify-content-start pt-2 pb-2' style={{backgroundColor: 'whitesmoke'}} >
            <h1 className='ms-4 me-4' >Facturas</h1>

            <select style={{height: '35px'}} 
            className='align-self-center me-2'
            onChange={(e)=>setParametroBusqueda(e.target.value)} 
            >   
                <option>Seleccione tipo busqueda</option>
                <option>ID</option>
                <option>Cajero</option>
            </select>

            <form 
            className='d-flex align-self-center' 
            style={{left: '300px'}} 
            onSubmit={getByValorBusqueda}
            >
              {parametroBusqueda == 'Cajero'?
              <select className='select'
              value={valorBusqueda}
              onChange={(e)=>setValorBusqueda(e.target.value)}>
                <option>Seleccione un Empleado</option>

                {empleados.map((empleado)=>
                  <option key={empleado.id}>{empleado.empleadoNombre}</option>
                )}
              </select>
              
              :
              <input
              placeholder={parametroBusqueda.includes('Seleccione')? '': `${parametroBusqueda}`}
              aria-label='aria-describedby'
              onChange={(e)=>setValorBusqueda(e.target.value)}
              type={parametroBusqueda == 'ID'? 'number':'text'}
              className='form-control me-2'
              required={true}
              title=''
              />
              }
                
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
            onClick={()=>getAllFacturas()}
            >Llenar Tabla
            </Button>

            <Button 
            className='bg-dark text-light align-self-center'
            color={'dark'}
            bordered
            onClick={()=>navigate('/Facturas/addFactura')}>
                Registrar
            </Button>

        </div>



        <div>

            <table className='table mt-2'> 
                <thead className='bg-dark text-white'> 
                    <tr>
                        <th>Id Factura</th>
                        <th>Id Orden</th>
                        <th>Cliente</th>
                        <th>Total</th>
                        <th>Fecha</th>
                        <th>Número Factura</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                
                <tbody>
                {facturas.map((factura)=>{
                    let nombreClientre
                  
                    ordenes.map((orden)=>{
                      if (orden.id == factura.ordenEncabezadoId){
                        clientes.map((cliente)=>{
                          if (cliente.id == orden.clienteId){
                            nombreClientre = cliente.clienteNombre
                          }
                        })
                      }
                    })

                    return(
                    <tr key={factura.id}>
                        <td>{factura.id}</td>
                        <td>{factura.ordenEncabezadoId}</td>
                        <td>{nombreClientre}</td>
                        <td>{factura.total}</td>
                        <td>{moment(factura.fechaHora).format("DD/MM/yy, hh:mm")}</td>
                        <td>{factura.numeroFactura}</td>

                        <td>
                            <Button
                            className='mb-1'
                            color={'gradient'}
                            iconRight={<img src={lapizEditar}/>}
                            onClick={()=>navigate(`/Facturas/updateFactura/${factura.ordenEncabezadoId}`)}
                                >Editar
                            </Button> 

                            <Button 
                            light
                            shadow
                            color={'secondary'}
                            onClick={()=>{
                              getDetallesOrden(factura.ordenEncabezadoId)
                              activarModal('Detalles de orden', ``)
                            }}>
                              Ver Detalles
                            </Button>

                        </td>
                    </tr>
                    )
                    })}

                </tbody>

            </table>

        </div>

    </div>
  )
}

export default MostrarFacturas