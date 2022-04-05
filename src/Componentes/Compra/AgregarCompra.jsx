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
const endPointGetEmpleado           = 'http://127.0.0.1:8000/api/Empleado'

const AgregarCompra = () => {
  const [insumos, setInsumos]                   = useState([])
  const [carroInsumos, setCarroInsumos]         = useState([])
  const [insumoActual, setInsumoActual]         = useState({})
  const [cantidadInsumo, setCantidadInsumo]     = useState(0)
  const [precioInsumo, setPrecioInsumo]         = useState(0)
  const [empleados, setEmpleados]               = useState([])
  const [proveedores, setProveedores]           = useState([])
  

  const [empleadoId, setEmpleadoId]         = useState('')
  const [nombreUsuario, setNombreUsuario]   = useState('')
  const [compraEstado, setCompraEstado]     = useState('Pendiente')
  const [cai, setCai]                       = useState('')
  const [numeroFactura, setNUmeroFactura]   = useState('')
  const [proveedorId, setProveedorId]       = useState('Seleccione')
  let   idProveedor                         = ''
  const [fechaSolicitud, setFechaSolicitud] = useState('')
  const [fechaEntrega, setFechaEntrega]     = useState('')
  const [fechaPago, setFechaPago]           = useState('')

  const [mensajeModal, setMensajeModal]   = useState('')
  const [tituloModal, setTituloModal]     = useState('')
  const [visible, setVisible]             = useState(false)
  const navigate                          = useNavigate()

  let date = new Date()
  let fechaHoy = `${date.getFullYear()}-${date.getMonth() < 9? '0':''}${date.getMonth()+1}-${date.getDate() < 10? '0':''}${date.getDate()}`

  let date2 = new Date()
  date2.setDate(date2.getDate()-3)
  let minFechaSolicitud = `${date2.getFullYear()}-${date2.getMonth() < 9? '0':''}${date2.getMonth()+1}-${date2.getDate() < 10? '0':''}${date2.getDate()}`

  let date3 = new Date(fechaSolicitud);
  date3.setDate(date3.getDate()+1);

  let date4 = new Date(fechaSolicitud);
  date4.setDate(date4.getDate()+30);

  let date5 = new Date(fechaEntrega);
  date5.setDate(date5.getDate()+1);

  let date6 = new Date(fechaEntrega);
  date6.setDate(date6.getDate()+90);
  

  useEffect(()=>{
    getAllEmpleados()
    getAllProveedores()
    setFechaSolicitud(fechaHoy)
    getEmpleado()
  }, [])


  //
  const getEmpleado = async () => {
    const response = await axios.get(`${endPointGetEmpleado}U/${sessionStorage.getItem('userName')}`)
    
    setEmpleadoId(response.data[0].id)
    setNombreUsuario(response.data[0].empleadoUsuario)
  }
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
  const agregarAlCarro = ()=>{

    if (parseInt(cantidadInsumo) < 1){
      setPrecioInsumo(0)
      setCantidadInsumo(0)
      activarModal('Error', 'La cantidad debe ser mayor a 0.')
    }else if ((parseInt(cantidadInsumo) + parseInt(insumoActual.cantidad)) > parseInt(insumoActual.cantidadMax)){
      setPrecioInsumo(0)
      setCantidadInsumo(0)
      activarModal('Error', `La compra sobrepasa la cantidad máxima de ${insumoActual.cantidadMax}.`)
    }else if(parseInt(precioInsumo) < 1 || parseInt(precioInsumo) > 50000){
      setPrecioInsumo(0)
      setCantidadInsumo(0)
      activarModal('Error', `El precio no debe ser menor a 1 ni mayor a 50,000.`)
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
    }else if(parseInt(precioInsumo) < 1 || parseInt(precioInsumo) > 50000){
      setPrecioInsumo(0)
      setCantidadInsumo(0)
      activarModal('Error', `El precio no debe ser menor a 1 ni mayor a 50,000.`)
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

    if (nombreUsuario.includes('Seleccione') || compraEstado.includes('Seleccione')){
      activarModal('Error','Debe seleccionar un empleado y estado de compra.')
    }else if(carroInsumos.length < 1){
      activarModal('Error', 'El carrito de compras está vacío.')
    }
    else{
      formatearProveedorId()
      //console.log(empleadoId)
      const caiNumFactura = `${cai}/${numeroFactura}`
      console.log(caiNumFactura)

      const response = await axios.post(endPointSaveCompraEncabezado, {proveedorId: idProveedor, empleadoId: empleadoId,
      fechaSolicitud: fechaSolicitud, fechaEntregaCompra: fechaEntrega, fechaPagoCompra: fechaPago, estadoCompra: compraEstado,
      numeroFactura: numeroFactura, cai: cai, numeroFacturaCai: caiNumFactura, estado: 1})
        
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
    navigate('/compras')

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
                  <h4>{nombreUsuario}</h4>
                  {/* <select
                  value={empleadoId}
                  onChange={(e)=>setEmpleadoId(e.target.value)}
                  className='select'> 
                      <option>Seleccione el Empleado</option>
                      {empleados.map((empleado)=> <option key={empleado.id}>{empleado.empleadoNombre}</option>)}
                  </select> */}
                </div>

                <div className='atributo'>
                  <label>Estado</label>
                  <h4>{compraEstado}</h4>
                  {/* <select
                  value={compraEstado}
                  onChange={(e)=>setCompraEstado(e.target.value)}
                  className='select'> 
                      <option>Seleccione un Estado</option>
                      <option>Pendiente</option>
                      <option>Recibida</option>
                  </select> */}
                </div>

                
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
                 value={numeroFactura}
                 onChange={(e)=>setNUmeroFactura(e.target.value)}
                 type='text'
                 maxLength={16}
                 className='form-control'
                 />
                </div>

                <Button
                auto
                size={'lg'}
                color={'gradient'}
                onClick={()=>navigate('/Compras')}
                ghost>
                  Cancelar
                </Button>

                <Button
                auto
                size={'lg'}
                color={'gradient'}
                ghost
                onClick={()=>registrarEncabezado()}>
                  Guardar
                </Button>

                <div className='atributo'>
                  <label>Fecha Solicitud</label> 
                  <input type="date" 
                  max={fechaHoy}
                  min={minFechaSolicitud}
                  value={fechaSolicitud}
                  onChange={(e)=>setFechaSolicitud(e.target.value)}
                  />
                </div>

                <div className='atributo'>
                  <label>Fecha Entrega</label>
                  <input type="date" 
                  min={`${date3.getFullYear()}-${date3.getMonth() < 9? '0':''}${date3.getMonth()+1}-${date3.getDate() < 10? '0':''}${date3.getDate()}`}
                  max={`${date4.getFullYear()}-${date4.getMonth() < 9? '0':''}${date4.getMonth()+1}-${date4.getDate() < 10? '0':''}${date4.getDate()}`}
                  onChange={(e)=>setFechaEntrega(e.target.value)}
                  />
                </div>

                <div className='atributo'>
                  <label>Fecha Pago</label>
                  <input type="date"
                  min={`${date5.getFullYear()}-${date5.getMonth() < 9? '0':''}${date5.getMonth()+1}-${date5.getDate() < 10? '0':''}${date5.getDate()}`}
                  max={`${date6.getFullYear()}-${date6.getMonth() < 9? '0':''}${date6.getMonth()+1}-${date6.getDate() < 10? '0':''}${date6.getDate()}`}
                  onChange={(e)=>setFechaPago(e.target.value)}
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
            </div>
    </div>
  )
}

export default AgregarCompra


