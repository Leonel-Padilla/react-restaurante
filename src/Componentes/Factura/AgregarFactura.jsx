import React, {useRef, useState, useEffect} from 'react'
import { Button, Input, Modal, Text, Textarea} from '@nextui-org/react'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'

const endPointGetProducto           = 'http://127.0.0.1:8000/api/Producto'
const endPointGetInsunmos           = 'http://127.0.0.1:8000/api/Insumo'
const endPointGetProductoInsumo     = 'http://127.0.0.1:8000/api/ProductoInsumo'
const endPointGetAllEmpleado        = 'http://127.0.0.1:8000/api/Empleado'
const endPointUpdateInsumo          = 'http://127.0.0.1:8000/api/updateInsumo'
const endPointGetEmpleado           = 'http://127.0.0.1:8000/api/Empleado'
const endPointGetCliente            = 'http://127.0.0.1:8000/api/Cliente'
const endPointGetAllTiposEntrega    = 'http://127.0.0.1:8000/api/TipoEntrega'
const endPointPostOrdenEncabezado   = 'http://127.0.0.1:8000/api/addOrdenEncabezado'
const endPointPostOrdenDetalle      = 'http://127.0.0.1:8000/api/addOrdenDetalle'


function AgregarFactura() {
  const [productos, setProductos]               = useState([])
  const [productoActual , setProductoActual]    = useState('')
  const [insumos, setInsumos]                   = useState([])
  const [carroProductos, setCarroProductos]     = useState([])
  const [cantidadProducto, setCantidadProducto] = useState(0)
  const [empleados, setEmpleados]               = useState([])
  const [clientes, setClientes]                 = useState([])
  const [tiposEntrega, setTiposEntrega]         = useState([])



  const [empleadoId, setEmpleadoId]           = useState('')
  const [nombreUsuario, setNombreUsuario]     = useState('')
  const [cocineroId, setCocineroId]           = useState('Seleccione')
  let   idCocinero                            = ''
  const [meseroId, setMeseroId]               = useState('Seleccione')
  let   idMesero                              = ''
  const [clienteId, setClienteId]             = useState('Seleccione')
  let   idCliente                             = ''
  const [tipoEntregaId, setTipoEntregaId]     = useState('Seleccione')
  let   idTipoEntrega                         = ''
  const [insumosDeOrdern, setInsumosDeOrdern] = useState([])
  const [subtotal, setSubtotal]               = useState(0)
  const [impuesto, setImpuesto]               = useState(0)
  const [total, setTotal]                     = useState(0)

  let date = new Date()
  let fechaActual = `${date.getFullYear()}-${date.getMonth() < 9? '0':''}${date.getMonth()+1}-${date.getDate() < 10? '0':''}${date.getDate()} ${date.getHours() < 10? '0':''}${date.getHours()}:${date.getMinutes() < 10? '0':''}${date.getMinutes()}`

  ///----

  const [mensajeModal, setMensajeModal]   = useState('')
  const [tituloModal, setTituloModal]     = useState('')
  const [visible, setVisible]             = useState(false)
  const navigate                          = useNavigate()

  useEffect(()=>{
    //console.log(fechaActual)
    getEmpleado()
    getAllProductos()
    getAllEmpleados()
    getAllClientes()
    getAllTiposEntrega()
    getAllInsumos()
  },[])

  //
  const activarModal = (titulo, mensajeModal)=>{
    setTituloModal(titulo)
    setMensajeModal(mensajeModal)
    setVisible(true)
  }
  //
  const getAllProductos = async ()=>{
    const response = await axios.get(endPointGetProducto)
    setProductos(response.data)
  }
  //
  const getAllInsumos = async ()=>{
    const response = await axios.get(endPointGetInsunmos)
    setInsumos(response.data)
  }
  //
  const getEmpleado = async () => {
    const response = await axios.get(`${endPointGetEmpleado}U/${sessionStorage.getItem('userName')}`)
    
    setEmpleadoId(response.data[0].id)
    setNombreUsuario(response.data[0].empleadoUsuario)
  }
  //
  const getAllClientes = async () => {
    const response = await axios.get(endPointGetCliente)
    setClientes(response.data)
  }
  //
  const getAllEmpleados = async ()=>{
    const response = await axios.get(endPointGetAllEmpleado)
    setEmpleados(response.data)
  }
  //
  const getAllTiposEntrega = async ()=>{
    const response = await axios.get(endPointGetAllTiposEntrega)
    setTiposEntrega(response.data)
  }
  //
  const formatearMeseoId = ()=>{
    empleados.map(empleado=>{
      if (empleado.empleadoNombre == meseroId){
        idMesero = empleado.id
      }
    })
  }
  //
  const formatearCocineroId = ()=>{
    empleados.map(empleado=>{
      if (empleado.empleadoNombre == cocineroId){
        idCocinero = empleado.id
      }
    })
  }
  //
  const formatearTipoEntregaId = ()=>{
    tiposEntrega.map(tipoEntrega=>{
      if (tipoEntrega.nombreTipoEntrega == tipoEntregaId){
        idTipoEntrega = tipoEntrega.id
      }
    })
  }
  //
  const formatearClienteId = ()=>{
    clientes.map(cliente=>{
      if (cliente.clienteNombre == clienteId){
        idCliente = cliente.id
      }
    })
  }
  //
  const agregarAlCarro = ()=>{

    if (parseInt(cantidadProducto) < 1){
      setCantidadProducto(0)
      activarModal('Error', 'La cantidad debe ser mayor a 0.')
    }else{

      let nuevoCarrito = [...carroProductos]
      let nuevoProducto = {...productoActual, cantidadDeCompra: cantidadProducto}
  
      nuevoCarrito.push(nuevoProducto)
      
      actualizarTotales(nuevoCarrito)
      setCarroProductos(nuevoCarrito)
      setCantidadProducto(0)
      setVisible(false)
    }

    
  }
  //
  const actualizarTotales = (nuevoCarrito)=>{
    let subtotal = 0

    nuevoCarrito.map((productoEnCarro)=>{
      subtotal += productoEnCarro.precio * productoEnCarro.cantidadDeCompra
    })

    let impuesto = subtotal * 0.15
    let total = subtotal + impuesto
    
    
    setSubtotal(subtotal)
    setImpuesto(impuesto)
    setTotal(total)
  }
  //
  const eliminarDelCarro = ()=>{
    let nuevoCarro = carroProductos.filter((producto)=> producto.productoNombre != productoActual.productoNombre)

    actualizarTotales(nuevoCarro)
    setCarroProductos(nuevoCarro)
    setCantidadProducto(0)
    setVisible(false)
  }

  //
  const editarCompra = ()=>{

    if (parseInt(cantidadProducto) < 1){
      setCantidadProducto(0)
      activarModal('Error', 'La cantidad debe ser mayor a 0.')
    }else{
      let nuevoCarro = [...carroProductos]

      if (nuevoCarro.find(producto => producto.productoNombre == productoActual.productoNombre)){
        productoActual.cantidadDeCompra = cantidadProducto
      }
      
      actualizarTotales(nuevoCarro)
      setCarroProductos(nuevoCarro)
      setCantidadProducto(0)
      setVisible(false)
    }

  }
  //
  const contarInsumosNecesarios = async ()=>{

    let insumosNecesarios = []

    carroProductos.map(async(producto)=>{
      //console.log(carroProductos)
      const response = await axios.get(`${endPointGetProductoInsumo}P/${producto.id}`)
      const productoInsumos = response.data

      productoInsumos.map((productoInsumo)=>{
        //console.log(productoInsumo)

        if(insumosNecesarios.find(insumoNecesario => productoInsumo.insumoId == insumoNecesario.insumoId)){
          insumosNecesarios.map((insumoNecesario)=>{

            if (productoInsumo.insumoId == insumoNecesario.insumoId){
              insumoNecesario.cantidad += (productoInsumo.cantidad * producto.cantidadDeCompra)
            }
          })
        }else{
          insumosNecesarios.push({insumoId: productoInsumo.insumoId, cantidad: (productoInsumo.cantidad * producto.cantidadDeCompra)})
        }

      })
      
    })

    setInsumosDeOrdern(insumosNecesarios)

  }

  //
  const verificarInventario = ()=>{
    //console.log('verificando')
    //console.log(insumosDeOrdern)
    let insumosNecesarios = insumosDeOrdern
    let insumosNoDisponibles = []

    insumosNecesarios.map((insumoNecesario)=>{
      insumos.map((insumo)=>{
        if (insumo.id == insumoNecesario.insumoId){
          if (insumo.cantidad < insumoNecesario.cantidad){
            insumosNoDisponibles.push(insumo.insumoNombre)
          }
        }
      })
    })

    if (insumosNoDisponibles.length > 0){
      console.log('no hay suficientes insumos')
      activarModal('Error', `No hay suficientes insumos para esta orden, faltan: ${insumosNoDisponibles.join(', ')}.`)
    }else{
      setVisible(false)
      registrarordenEncabezado()
    }
    
  }
  //
  const registrarordenEncabezado = async ()=>{
    if (cocineroId.includes('Seleccione') || meseroId.includes('Seleccione') || tipoEntregaId.includes('Seleccione')){
      activarModal('Error', 'Debe seleccionar un cocinero, un mesero y un tipo de entrega.')
    }else if (carroProductos.length == 0){
      activarModal('Error', 'Debe agregar al menos un producto a la orden.')
    }
    else{
      //console.log('registrando encabezado')

      formatearClienteId()
      formatearMeseoId()
      formatearCocineroId()
      formatearTipoEntregaId()

      const response = await axios.post(endPointPostOrdenEncabezado, {clienteId: idCliente, empleadoMeseroId: idMesero, 
      empleadoCocinaId: idCocinero, tipoEntregaId: idTipoEntrega, fechaHora: fechaActual, /*ESTO NO VA*/estadoOrden: 'Esto no va', 
      estado: 1})
      //console.log(response.data)
      
      if (response.status != 200){
        activarModal('Error', `${response.data.Error}`)
      }else{
        registrarOrdenDetalles(response.data.id)
      }

    }
  }
  //
  const registrarOrdenDetalles = async (encabezadoId)=>{
    carroProductos.map(async(producto)=>{

      const precioDeCompra = (producto.precio*producto.cantidadDeCompra)

      const response = await axios.post(endPointPostOrdenDetalle, {ordenEncabezadoId: encabezadoId,
      productoId: producto.id, precio: precioDeCompra, cantidad: producto.cantidadDeCompra, estado: 1})

      console.log(response.data)

    })

    registrarFactura(encabezadoId)
  }
  //
  const registrarFactura = async ()=>{
    
  }


  return (
    <div>
      <Modal
      closeButton
      blur
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
          {tituloModal.includes('Error')?   /*If*/ mensajeModal: //ERROR
          tituloModal.includes('Advertencia')?   /*ADVERTENCIA*/
            <div>
              {mensajeModal}

              <div className='botonesModal mt-4'>
                <Button
                className='me-4'
                onClick={()=>setVisible(false)}
                auto>
                  Cancelar
                </Button>

                <Button
                className='ms-4'
                onClick={()=>{
                  verificarInventario()
                }}
                auto>
                  Aceptar
                </Button>
              </div>

            </div>
          ://ADVERTENCIA
          tituloModal.includes('Eliminar')?  //ELSE IF Eliminar
            <div>
              {mensajeModal}

              <div className='botonesModal mt-4'>
                <Button
                className='me-4'
                onClick={()=>setVisible(false)}
                auto>
                  Cancelar
                </Button>

                <Button
                className='ms-4'
                onClick={()=>{
                  eliminarDelCarro()
                }}
                auto>
                  Eliminar
                </Button>
              </div>

            </div>
          : tituloModal.includes('Editar')?    //ELSE I EDITAR
                      
            <div>
              <label>Cantidad</label>
              <input
              type='number'
              className='form-control'
              value={cantidadProducto}
              onChange={(e)=>setCantidadProducto(e.target.value)}/>

              <div className='botonesModal mt-4'>
                <Button
                className='me-4'
                auto
                onClick={()=>setVisible(false)}
                >
                  Cancelar
                </Button>

                <Button
                className='ms-4'
                auto
                onClick={()=>editarCompra()}
                >
                  Aceptar
                </Button>
              </div>

            </div>

          : //ELSE AGREGAR

            <div>
              <label>Cantidad</label>
              <input
              type='number'
              className='form-control'
              value={cantidadProducto}
              onChange={(e)=>setCantidadProducto(e.target.value)}/>

              <div className='botonesModal mt-4'>
                <Button
                className='me-4'
                auto
                onClick={()=>setVisible(false)}
                >
                  Cancelar
                </Button>
                        
                <Button
                className='ms-4'
                auto
                onClick={()=>agregarAlCarro()}
                >
                  Agregar
                </Button>
              </div>

            </div>}
        </Modal.Body>

      </Modal>


      <div className='d-flex justify-content-center bg-dark mb-2'>
        <h1 className='text-white'>Registrar Factura</h1>
      </div>

      <div className='layoutCompra'>

        {/*Select e inputs de la compra*/}
        <div className='selectFactura'>
                
          <div className='atributo'>
            <label>Cajero</label>
            <h4>{nombreUsuario}</h4>
          </div>

          <div className='atributo'>
            <label>Cocinero</label>
            <select
            value={cocineroId}
            onChange={(e)=>setCocineroId(e.target.value)}
            className='select'> 
              <option>Seleccione un Cocinero</option>
              {empleados.map((empleado)=> <option key={empleado.id}>{empleado.empleadoNombre}</option>)}
            </select>
          </div>

          <div className='atributo'>
            <label>Mesero</label>
            <select
            value={meseroId}
            onChange={(e)=>setMeseroId(e.target.value)}
            className='select'> 
              <option>Seleccione un Mesero</option>
              {empleados.map((empleado)=> <option key={empleado.id}>{empleado.empleadoNombre}</option>)}
            </select>
          </div>

          <div className='atributo'>
            <label>Cliente</label>
            <select
            value={clienteId}
            onChange={(e)=>setClienteId(e.target.value)}
            className='select'> 
              <option>Seleccione un Cliente</option>
              {clientes.map((cliente)=> <option key={cliente.id}>{cliente.clienteNombre}</option>)}
            </select>
          </div>

          <div className='atributo'>
            <label>Tipo Entrega</label>
            <select
            value={tipoEntregaId}
            onChange={(e)=>setTipoEntregaId(e.target.value)}
            className='select'> 
              <option>Seleccione Tipo Entrega</option>
              {tiposEntrega.map((tipoEntrega)=> <option key={tipoEntrega.id}>{tipoEntrega.nombreTipoEntrega}</option>)}
            </select>
          </div>

          <div className='atributo'>
            <label>Parametros de CAI</label>
            <select
           /* value={tipoEntregaId}
            onChange={(e)=>setTipoEntregaId(e.target.value)}*/
            className='select'> 
              <option>Seleccione El parametro</option>
              {/* {tiposEntrega.map((tipoEntrega)=> <option key={tipoEntrega.id}>{tipoEntrega.nombreTipoEntrega}</option>)} */}
            </select>
          </div>

          <Button
          auto
          size={'lg'}
          color={'gradient'}
          onClick={()=>navigate('/Facturas')}
          ghost>
            Cancelar
          </Button>

          <Button
          auto
          size={'lg'}
          color={'gradient'}
          ghost
          onClick={()=>{
            //registrarFactura()
            contarInsumosNecesarios()
            activarModal('Advertencia', 'Al registrar la orden se creará una factura automaticamente')}}>
            Guardar
          </Button>

          <Button
          auto
          size={'lg'}
          color={'gradient'}
          ghost
          //onClick={()=>registrarEncabezado()}>
          >
            Imprimir
          </Button>

          <div className='atributo'>
            <label>Subtotal</label>
            <h4>{subtotal}</h4>
          </div>

          <div className='atributo'>
            <label>Impuesto 15%</label>
            <h4>{impuesto}</h4>
          </div>

          <div className='atributo'>
            <label>Total</label>
            <h4>{total}</h4>
          </div>

        </div>

        {/*Lista de los insumos*/}
        <div className='listaInsumos'>

          <div className='d-flex justify-content-center bg-dark mb-2'
          style={{borderRadius: '10px', height:'41.59px'}}>
            <h3 className='text-white'>Lista Productos</h3>
          </div>

          <div>
            {productos.map((producto)=>
              <div
              className='insumoCompra' 
              key={producto.id}
              onClick={()=>{
                    
                if(carroProductos.find(productoEnCarro => productoEnCarro.productoNombre == producto.productoNombre)){
                  activarModal('Error', 'No puede tener repetidos, si desea editar o elminar hagalo en el apartado del carrito.')
                }else{
                  setProductoActual(producto)
                  activarModal('Detalle de compra', '')
                      
              }}}>
                {producto.productoNombre}
                    
              </div>
            )}
          </div>

        </div>

        {/*Insumos en el carrito*/}
        <div className='insumosEnCarro'>

          <div className='d-flex justify-content-center bg-dark mb-2'
          style={{borderRadius: '10px', height:'41.59px'}}>
            <h3 className='text-white'>Carrito de compras</h3>
          </div>

          <div>
            <table className='table'>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Opciones</th>
                </tr>
              </thead>

              <tbody>

                {carroProductos.map((producto)=>
                  <tr key={producto.id}>
                    <td>{producto.productoNombre}</td>
                    <td>{producto.cantidadDeCompra}</td>
                    <td>{producto.precio}</td>
                    <td className='d-flex'>
                      <Button
                      className='d-flex'
                      color={'error'}
                      auto
                      onClick={()=>{
                        activarModal('Eliminar Compra', 'Seguro que desea eliminar este registro?')
                        setProductoActual(producto)
                      }}>
                        Eliminar
                      </Button>

                      <Button
                        onClick={()=>{
                          activarModal('Editar Compra', '')
                          setProductoActual(producto)
                          setCantidadProducto(producto.cantidadDeCompra)
                        }}
                        auto>
                          Editar
                      </Button>
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>

        </div>
        
      </div>

    </div>
  )
}

export default AgregarFactura