import React, {useRef, useState, useEffect} from 'react'
import { Button, Input, Modal, Text, Textarea} from '@nextui-org/react'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'


const endPointGetInsunmos           = 'http://127.0.0.1:8000/api/Insumo'
const endPointGetAllEmpleado        = 'http://127.0.0.1:8000/api/Empleado'
const endPointGetAllProveedores     = 'http://127.0.0.1:8000/api/Proveedor'
const endPointSaveCompraEncabezado  = 'http://127.0.0.1:8000/api/addCompraEncabezado'
const endPointSaveCompraDetalle     = 'http://127.0.0.1:8000/api/addCompraDetalle'
const endPointGetCompraEncabezado   = 'http://127.0.0.1:8000/api/CompraEncabezado'
const endPointUpdateInsumo          = 'http://127.0.0.1:8000/api/updateInsumo'

const AgregarCompra = () => {
  const [insumos, setInsumos]                   = useState([])
  const [carroInsumos, setCarroInsumos]         = useState([])
  const [insumoActual, setInsumoActual]         = useState({})
  const [cantidadInsumo, setCantidadInsumo]     = useState(0)
  const [precioInsumo, setPrecioInsumo]         = useState(0)
  const [empleados, setEmpleados]               = useState([])
  const [proveedores, setProveedores]           = useState([])
  

  const [empleadoId, setEmpleadoId]         = useState('Seleccione')
  let   idEmpleado                          = ''
  const [compraEstado, setCompraEstado]     = useState('Seleccione')
  const [cai, setCai]                       = useState('')
  const [numeroFactura, setNUmeroFactura]   = useState('')
  const [proveedorId, setProveedorId]       = useState('Seleccione')
  let   idProveedor                         = ''
  const [fechaSolicitud, setFechaSolicitud] = useState()
  const [fechaEntrega, setFechaEntrega]     = useState()
  const [fechaPago, setFechaPago]           = useState()

  const [mensajeModal, setMensajeModal]   = useState('')
  const [tituloModal, setTituloModal]     = useState('')
  const [visible, setVisible]             = useState(false)
  const navigate                          = useNavigate()

  useEffect(()=>{
    getAllEmpleados()
    getAllProveedores()
  }, [])

  //
  const getInsumos = async ()=>{

    if (proveedorId.includes('Seleccione')){
      activarModal('Error', 'Debe de seleccionar un proveedor para realizar una compra.')
    }else{
      formatearProveedorId()

      const response = await axios.get(`${endPointGetInsunmos}P/${idProveedor}`)
      setInsumos(response.data)
  
      setCarroInsumos([])
    }

  }
  //
  const getAllEmpleados = async ()=>{
    const response = await axios.get(endPointGetAllEmpleado)
    setEmpleados(response.data)
  }
  //
  const getAllProveedores = async()=>{
    const response = await axios.get(endPointGetAllProveedores)
    setProveedores(response.data)
  }
  //
  const activarModal = (titulo, mensajeModal)=>{
    setTituloModal(titulo)
    setMensajeModal(mensajeModal)
    setVisible(true)
  }
  //
  const formatearProveedorId = ()=>{
    proveedores.map((proveedor)=>{
      if (proveedor.proveedorNombre == proveedorId){
        idProveedor = proveedor.id

        //console.log(`${idProveedor} ${proveedor.id}`)
      }
    })
  }
  //
  const formatearEmpleadoId = ()=>{
    empleados.map((empleado)=>{
      if (empleado.empleadoNombre == empleadoId){
        idEmpleado = empleado.id
      }
    })
  }

  //
  const agregarAlCarro = ()=>{

    if (parseInt(cantidadInsumo) < 1){
      setPrecioInsumo(0)
      setCantidadInsumo(0)
      activarModal('Error', 'La cantidad debe ser mayor a 0.')
    }else if ((parseInt(cantidadInsumo) + parseInt(insumoActual.cantidad)) > parseInt(insumoActual.cantidadMax)){
      setPrecioInsumo(0)
      setCantidadInsumo(0)
      activarModal('Error', `La compra sobrepasa la cantidad máxima de ${insumoActual.cantidadMax}.`)
    }else if(parseInt(precioInsumo) < 100 || parseInt(precioInsumo) > 50000){
      setPrecioInsumo(0)
      setCantidadInsumo(0)
      activarModal('Error', `El precio no debe ser menor a 100 ni mayor a 50,000.`)
    }else{

      let nuevoCarrito = [...carroInsumos]
      let nuevoInsumo = {...insumoActual, cantidadDeCompra: cantidadInsumo, precioDeCompra: precioInsumo}
  
      nuevoCarrito.push(nuevoInsumo)
  
      setCarroInsumos(nuevoCarrito)
      setCantidadInsumo(0)
      setPrecioInsumo(0)
      setVisible(false)
    }
  }
  
  //
  const eliminarDelCarro = ()=>{
    let nuevoCarro = carroInsumos.filter((insumo)=> insumo.insumoNombre != insumoActual.insumoNombre)
    setCarroInsumos(nuevoCarro)
    setCantidadInsumo(0)
    setPrecioInsumo(0)
    setVisible(false)
  }

  //
  const editarCompra = ()=>{

    if (parseInt(cantidadInsumo) < 1){
      setPrecioInsumo(0)
      setCantidadInsumo(0)
      activarModal('Error', 'La cantidad debe ser mayor a 0.')
    }else if ((parseInt(cantidadInsumo) + parseInt(insumoActual.cantidad)) > parseInt(insumoActual.cantidadMax)){
      setPrecioInsumo(0)
      setCantidadInsumo(0)
      activarModal('Error', `La compra sobrepasa la cantidad máxima de ${insumoActual.cantidadMax}.`)
    }else if(parseInt(precioInsumo) < 100 || parseInt(precioInsumo) > 50000){
      setPrecioInsumo(0)
      setCantidadInsumo(0)
      activarModal('Error', `El precio no debe ser menor a 100 ni mayor a 50,000.`)
    }else{
      let nuevoCarro = [...carroInsumos]

      if (nuevoCarro.find(insumo => insumo.insumoNombre == insumoActual.insumoNombre)){
        insumoActual.cantidadDeCompra = cantidadInsumo
        insumoActual.precioDeCompra   = precioInsumo
      }
  
      setCarroInsumos(nuevoCarro)
      setCantidadInsumo(0)
      setPrecioInsumo(0)
      setVisible(false)
    }

  }


  //
  const registrarEncabezado = async ()=>{

    if (empleadoId.includes('Seleccione') || compraEstado.includes('Seleccione')){
      activarModal('Error','Debe seleccionar un empleado y estado de compra.')
    }else if(carroInsumos.length < 1){
      activarModal('Error', 'El carrito de compras está vacío.')
    }
    else{
      formatearProveedorId()
      formatearEmpleadoId()

      const response = await axios.post(endPointSaveCompraEncabezado, {proveedorId: idProveedor, empleadoId: idEmpleado,
        fechaSolicitud: fechaSolicitud, fechaEntregaCompra: fechaEntrega, fechaPagoCompra: fechaPago, estadoCompra: compraEstado,
        numeroFactura: numeroFactura, cai: cai, estado: 1})
      //console.log(response.data)  
    
      if (response.status != 200){
        activarModal('Error', `${response.data.Error}`)
      }else{
        registrarDetalles()
      }

    }
  }

  //
  const registrarDetalles =  async ()=>{
    const response = await axios.get(`${endPointGetCompraEncabezado}P/${idProveedor}`)
    const encabezadoActual =  response.data[response.data.length - 1].id
    

    carroInsumos.map(async(insumoEnCarro)=>{
      const response1 = await axios.post(endPointSaveCompraDetalle, {insumoId: insumoEnCarro.id, compraEncabezadoId: encabezadoActual,
      precio: insumoEnCarro.precioDeCompra, cantidad: insumoEnCarro.cantidadDeCompra, estado:1})

      //console.log(response1.data)
    })

    cambiosEnInventario()
  }
  
  //
  const cambiosEnInventario = async ()=>{    
    carroInsumos.map(async (insumoEnCarro)=>{
      const cantidadFinal = (parseInt(insumoEnCarro.cantidad) + parseInt(insumoEnCarro.cantidadDeCompra))
      //console.log(cantidadFinal)

      const response = await axios.put(`${endPointUpdateInsumo}/${insumoEnCarro.id}`, {proveedorId: insumoEnCarro.proveedorId, 
        insumoNombre: insumoEnCarro.insumoNombre, insumoDescripcion: insumoEnCarro.insumoDescripcion, 
        cantidad: cantidadFinal, cantidadMin: insumoEnCarro.cantidadMin,
        cantidadMax: insumoEnCarro.cantidadMax, estado: insumoEnCarro.estado})
        //console.log(response.data)
    })

    navigate('/Compras')
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
                    {tituloModal.includes('Error')? /*If*/ mensajeModal: //ERROR
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
                      value={cantidadInsumo}
                      onChange={(e)=>setCantidadInsumo(e.target.value)}/>

                      <label>Precio Total</label>
                      <input
                      type='number'
                      className='form-control'
                      value={precioInsumo}
                      onChange={(e)=>setPrecioInsumo(e.target.value)}/>

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
                      value={cantidadInsumo}
                      onChange={(e)=>setCantidadInsumo(e.target.value)}/>

                      <label>Precio Total</label>
                      <input
                      type='number'
                      className='form-control'
                      value={precioInsumo}
                      onChange={(e)=>setPrecioInsumo(e.target.value)}/>

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
                <h1 className='text-white'>Registrar Compra</h1>
            </div>

            <div className='layoutCompra'>

              {/*Select e inputs de la compra*/}
              <div className='selectCompra'>
                
                <div className='atributo'>
                  <label>Proveedor</label>
                  <select
                  value={proveedorId}
                  onChange={(e)=>setProveedorId(e.target.value)}
                  className='select'> 
                      <option>Seleccione un Proveedor</option>
                      {proveedores.map((proveedor)=> <option key={proveedor.id}>{proveedor.proveedorNombre}</option>)}
                  </select>

                  <Button 
                  color={'gradient'}
                  ghost
                  size={'xs'}
                  onClick={()=>getInsumos()}>
                    Buscar
                  </Button>
                </div>

                <div className='atributo'>
                  <label>Empleado</label>
                  <select
                  value={empleadoId}
                  onChange={(e)=>setEmpleadoId(e.target.value)}
                  className='select'> 
                      <option>Seleccione el Empleado</option>
                      {empleados.map((empleado)=> <option key={empleado.id}>{empleado.empleadoNombre}</option>)}
                  </select>
                </div>

                <div className='atributo'>
                  <label>Estado</label>
                  <select
                  value={compraEstado}
                  onChange={(e)=>setCompraEstado(e.target.value)}
                  className='select'> 
                      <option>Seleccione un Estado</option>
                      <option>Pendiente</option>
                      <option>Recibida</option>
                  </select>
                </div>

                
                <div className='atributo'>
                  <label>CAI</label>
                  <input
                  value={cai}
                  onChange={(e)=>setCai(e.target.value)}
                  type='text'
                  maxLength={50}
                  className='form-control'
                  />
                </div>

                <div className='atributo'>
                <label>Numero Factura</label>
                <input
                 value={numeroFactura}
                 onChange={(e)=>setNUmeroFactura(e.target.value)}
                 type='text'
                 maxLength={50}
                 className='form-control'
                 />
                </div>

              </div>

              
              
              {/*Lista de los insumos*/}
              <div className='listaInsumos'>
                <div className='d-flex justify-content-center bg-dark mb-2'
                style={{borderRadius: '10px', height:'41.59px'}}>
                  <h3 className='text-white'>Lista Insumos</h3>
                </div>

                <div>
                  {insumos.map((insumo)=>
                  <div
                  className='insumoCompra' 
                  key={insumo.id}
                  onClick={()=>{
                    
                    if(carroInsumos.find(insumoEnCarro => insumoEnCarro.insumoNombre == insumo.insumoNombre)){
                      activarModal('Error', 'No puede tener repetidos, si desea editar o elminar hagalo en el apartado del carrito.')
                    }else{
                      setInsumoActual(insumo)
                      activarModal('Detalle de compra', '')
                      
                    }}}>
                    {insumo.insumoNombre}
                    
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
                          <th>Precio Total</th>
                          <th>Opciones</th>
                        </tr>
                      </thead>

                      <tbody>

                        {carroInsumos.map((insumo)=>
                        <tr key={insumo.id}>
                          <td>{insumo.insumoNombre}</td>
                          <td>{insumo.cantidadDeCompra}</td>
                          <td>{insumo.precioDeCompra}</td>
                          <td className='d-flex'>
                            <Button
                            className='d-flex'
                            color={'error'}
                            auto
                            onClick={()=>{
                              activarModal('Eliminar Compra', 'Seguro que desea eliminar este registro?')
                              setInsumoActual(insumo)
                            }}
                            >
                              Eliminar
                            </Button>

                            <Button
                            onClick={()=>{
                              activarModal('Editar Compra', '')
                              setInsumoActual(insumo)
                              setCantidadInsumo(insumo.cantidadDeCompra)
                              setPrecioInsumo(insumo.precioDeCompra)
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

              {/*Botones de la compra*/}
              <div className='botonesCompra'>                
              <Button
                auto
                color={'gradient'}
                onClick={()=>navigate('/Compras')}
                ghost>
                  Cancelar
                </Button>

                <Button
                auto
                color={'gradient'}
                ghost
                onClick={()=>registrarEncabezado()}>
                  Guardar
                </Button>
              </div>
              

              {/*Fechas de la compra*/}
              <div className='fechasCompra'>
                
                <div className='atributo'>
                  <label>Fecha Solicitud</label> 
                  <input type="date" 
                  onChange={(e)=>setFechaSolicitud(e.target.value)}
                  />
                </div>

                <div className='atributo'>
                  <label>Fecha Entrega</label>
                  <input type="date" 
                  onChange={(e)=>setFechaEntrega(e.target.value)}
                  />
                </div>

                <div className='atributo'>
                  <label>Fecha Pago</label>
                  <input type="date"
                  onChange={(e)=>setFechaPago(e.target.value)}
                  />
                </div>

              </div>

            </div>
    </div>
  )
}

export default AgregarCompra


