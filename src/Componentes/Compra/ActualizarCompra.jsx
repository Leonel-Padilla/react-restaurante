import React, {useRef, useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Input, Modal, Text, Textarea} from '@nextui-org/react'
import axios from 'axios'

const endPointGetEmpleado             = 'http://127.0.0.1:8000/api/Empleado'
const endPointGetProveedor            = 'http://127.0.0.1:8000/api/Proveedor'
const endPointGetCompraEncabezado     = 'http://127.0.0.1:8000/api/CompraEncabezado'
const endPointUpdateCompraEncabezado  = 'http://127.0.0.1:8000/api/updateCompraEncabezado'
const endPointGetCompraDetalles       = 'http://127.0.0.1:8000/api/CompraDetalle'
const endPointUpdateInsumo            = 'http://127.0.0.1:8000/api/updateInsumo'
const endPointGetInsumo               = 'http://127.0.0.1:8000/api/Insumo'
const ActualizarCompra = () =>{

  const [empleados, setEmpleados]               = useState([])
  const [nombreUsuario, setNombreUsuario]       = useState('')
  const [proveedores, setProveedores]           = useState([])
  const [compraDetalles, setCompraDetalles]     = useState([])
  const [insumos, setInsumos]                   = useState([])

  const [empleadoId, setEmpleadoId]         = useState('Seleccione')
  let   idEmpleado                          = ''
  const [compraEstado, setCompraEstado]     = useState('Seleccione')
  const [estadoEnCambio, setEstadoEnCambio] = useState()
  const [cai, setCai]                       = useState('')
  const [numeroFactura, setNUmeroFactura]   = useState('')
  const [caiNumFactura, setCaiNumFactura]   = useState('')
  const [proveedorId, setProveedorId]       = useState('Seleccione')
  let   idProveedor                         = ''
  const [fechaSolicitud, setFechaSolicitud] = useState('')
  const [fechaEntrega, setFechaEntrega]     = useState('')
  const [fechaPago, setFechaPago]           = useState('')

  const [mensajeModal, setMensajeModal]   = useState('')
  const [tituloModal, setTituloModal]     = useState('')
  const [visible, setVisible]             = useState(false)
  const navigate                          = useNavigate()
  const {id} = useParams()

  useEffect(()=>{
    getAllEmpleados()
    getAllProveedores()
    getCompra()
    getCompraDetalles()
    getInsumos()
  }, [])

  //
  const activarModal = (titulo, mensajeModal)=>{
    setTituloModal(titulo)
    setMensajeModal(mensajeModal)
    setVisible(true)
  }
  //
  const getCompra = async ()=>{
    const response = await axios.get(`${endPointGetCompraEncabezado}/${id}`)
    
    const response0 = await axios.get(`${endPointGetProveedor}/${response.data.proveedorId}`)
    //console.log(response0.data)

    const response1 = await axios.get(`${endPointGetEmpleado}/${response.data.empleadoId}`)
    //console.log(response1.data)
    
    setEmpleadoId(response1.data.id)
    setNombreUsuario(response1.data.empleadoNombre)
    setProveedorId(response0.data.proveedorNombre)
    setFechaSolicitud(response.data.fechaSolicitud)
    setFechaEntrega(response.data.fechaEntregaCompra)
    setFechaPago(response.data.fechaPagoCompra)
    setCai(response.data.cai)
    setNUmeroFactura(response.data.numeroFactura)
    setCaiNumFactura(response.data.numeroFacturaCai)
    setCompraEstado(response.data.estadoCompra)
    setEstadoEnCambio(response.data.estadoCompra)
  }
  //
  const getCompraDetalles = async () => {
    const response = await axios.get(`${endPointGetCompraDetalles}E/${id}`)
    //console.log(response.data)
    setCompraDetalles(response.data)
  }
  //
  const getInsumos = async () => {
    const response = await axios.get(`${endPointGetInsumo}`)
    setInsumos(response.data)
    //console.log(response.data)
  }
  //
  const getAllEmpleados = async ()=>{
    const response = await axios.get(endPointGetEmpleado)
    setEmpleados(response.data)
  }
  //
  const getAllProveedores = async()=>{
    const response = await axios.get(endPointGetProveedor)
    setProveedores(response.data)
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
    const cambiosEnInventario = async ()=>{
    let errores = []
       
      compraDetalles.map(async (insumoEnCarro)=>{

        insumos.map(async(insumo)=>{
          if (insumo.id == insumoEnCarro.insumoId){
            
            if ((parseInt(insumo.cantidad) + parseInt(insumoEnCarro.cantidad)) > insumo.cantidadMax){
              errores.push([insumo.insumoNombre])

            }

          }
        })
      })

      if (errores.length > 0){
        activarModal('Error', `No se puede realizar la compra, debido a que el inventario no tiene suficiente espacio para: ${errores.join(', ')}.`)

        setCompraEstado('Pendiente')


        const response = await axios.put(`${endPointUpdateCompraEncabezado}/${id}`, {proveedorId: idProveedor, empleadoId: empleadoId,
        fechaSolicitud: fechaSolicitud, fechaEntregaCompra: fechaEntrega, fechaPagoCompra: fechaPago, estadoCompra: compraEstado,
        numeroFactura: numeroFactura, cai: cai, numeroFacturaCai: caiNumFactura, estado: 1})

        //console.log(response.data)
      }else{
        compraDetalles.map(async (insumoEnCarro)=>{

          insumos.map(async(insumo)=>{
            if (insumo.id == insumoEnCarro.insumoId){
              
              const cantidadFinal = (parseInt(insumo.cantidad) + parseInt(insumoEnCarro.cantidad))
        
              const response = await axios.put(`${endPointUpdateInsumo}/${insumo.id}`, {proveedorId: insumo.proveedorId, 
              insumoNombre: insumo.insumoNombre, insumoDescripcion: insumo.insumoDescripcion, 
              cantidad: cantidadFinal, cantidadMin: insumo.cantidadMin, cantidadMax: insumo.cantidadMax, 
              estado: insumo.estado})

            }
          })  
  
        })

        
        navigate('/Compras')
      }

  }
  //
  const actualizar = async (e)=>{
    e.preventDefault()
    formatearProveedorId()
    //console.log(empleadoId)

    const response = await axios.put(`${endPointUpdateCompraEncabezado}/${id}`, {proveedorId: idProveedor, empleadoId: empleadoId,
    fechaSolicitud: fechaSolicitud, fechaEntregaCompra: fechaEntrega, fechaPagoCompra: fechaPago, estadoCompra: compraEstado,
    numeroFactura: numeroFactura, cai: cai, numeroFacturaCai: caiNumFactura, estado: 1})
    
    //console.log(response.data)

    if (compraEstado == 'Recibida' && estadoEnCambio != compraEstado){
      cambiosEnInventario()
    }else{
      navigate('/Compras')
    }
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
          {mensajeModal}
        </Modal.Body>
      </Modal>

      
      <div className='d-flex justify-content-center bg-dark mb-2'>
        <h1 className='text-white'>Actualizar Compra</h1>
      </div>

        <form onSubmit={actualizar} className='formulario'>

                <div className='atributo'>
                  <label>Proveedor</label>
                  <select
                  value={proveedorId}
                  onChange={(e)=>setProveedorId(e.target.value)}
                  className='select'> 
                      <option>{proveedorId}</option>
                  </select>
                </div>

                <div className='atributo'>
                  <label>Empleado</label>
                  <select
                  value={nombreUsuario}
                  onChange={(e)=>setNombreUsuario(e.target.value)}
                  className='select'> 
                      <option>{nombreUsuario}</option>
                  </select>
                </div>

                <div className='atributo'>
                  <label>Fecha Solicitud</label> 
                  <input type="date" 
                  value={fechaSolicitud}
                  onChange={(e)=>setFechaSolicitud(e.target.value)}
                  />
                </div>

                <div className='atributo'>
                  <label>Fecha Entrega</label>
                  <input type="date" 
                  value={fechaEntrega}
                  onChange={(e)=>setFechaEntrega(e.target.value)}
                  />
                </div>

                <div className='atributo'>
                  <label>Fecha Pago</label>
                  <input type="date"
                  value={fechaPago}
                  onChange={(e)=>setFechaPago(e.target.value)}
                  />
                </div>

                {compraEstado == 'Recibida'?    //IF Ya fue recibida
                <div className='atributo'>
                <label>Estado de compra</label>
                <select
                value={compraEstado}
                onChange={(e)=>setCompraEstado(e.target.value)}
                className='select'> 
                    <option>Recibida</option>
                </select>
              </div>
                :                           //ELSE
                <div className='atributo'>
                  <label>Estado de compra</label>
                  <select
                  value={compraEstado}
                  onChange={(e)=>setCompraEstado(e.target.value)}
                  className='select'> 
                      <option>Pendiente</option>
                      <option>Rechazada</option>
                      <option>Recibida</option>
                  </select>
                </div>}

                <div className='atributo'>
                  <label>CAI</label>
                  <input
                  value={cai}
                  onChange={(e)=>setCai(e.target.value)}
                  type='text'
                  maxLength={32}
                  className='form-control'
                  />
                </div>

                <div className='atributo'>
                <label>Numero Factura</label>
                <input
                 pattern='[0-9]{1,}'
                 title='Solo se permiten números.'
                 value={numeroFactura}
                 onChange={(e)=>setNUmeroFactura(e.target.value)}
                 type='text'
                 maxLength={16}
                 className='form-control'
                 />
                </div>
                <div className='d-flex mt-2'>

                    <Button 
                    color={'gradient'}
                    className='align-self-end me-3 ' 
                    auto 
                    onClick={()=>navigate('/Compras')}
                    ghost>
                        Regresar
                    </Button>

                    <Button
                    auto
                    type='submit'
                    color={'gradient'} 
                    ghost>
                        Guardar
                    </Button>

                </div>
            </form>
      
    </div>
  )
}

export default ActualizarCompra