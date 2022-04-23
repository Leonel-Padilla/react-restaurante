import React, {useRef, useState, useEffect} from 'react'
import { Button, Input, Modal, Text, Textarea} from '@nextui-org/react'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'
import jsPDF from 'jspdf'
import Logo from '../../img/LOGO.png'
import moment from 'moment';
import Swal from 'sweetalert2'

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
const endPointGetAllParametrosCAI   = 'http://127.0.0.1:8000/api/ParametrosFactura'
const endPointUpdateParametroCAI    = 'http://127.0.0.1:8000/api/updateParametrosFactura'
const endPointGetFormasPago         = 'http://127.0.0.1:8000/api/FormaPago'
const endPointPostFactura           = 'http://127.0.0.1:8000/api/addFactura'
const endPointGetImpuesto           = 'http://127.0.0.1:8000/api/Impuesto'

function AgregarFactura() {
  const [productos, setProductos]               = useState([])
  const [productoActual , setProductoActual]    = useState('')
  const [insumos, setInsumos]                   = useState([])
  const [carroProductos, setCarroProductos]     = useState([])
  const [cantidadProducto, setCantidadProducto] = useState(0)
  const [empleados, setEmpleados]               = useState([])
  const [clientes, setClientes]                 = useState([])
  const [tiposEntrega, setTiposEntrega]         = useState([])
  const [parametrosCai, setParametrosCai]       = useState([])
  const [formasPago, setFormasPago]             = useState([])
  const [descuentoGlobal, setDescuentoGlobal]   = useState(0)

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
  const [formaPagoId, setFormaPagoId]         = useState('Seleccione')
  let   idFormaPago                           = ''
  const [parametroCAIId, setParametroCAIId]   = useState('')
  let   idParametroCAI                        = ''
  const [efectivo, setEfectivo]               = useState('')
  const [numeroTarjeta, setNumeroTarjeta]     = useState('')

  const [contraseniaGerente, setContraseniaGerente] = useState('')
  const [totalConDescuento, setTotalConDescuento]   = useState(0)


  const [sucursalId, setSucursalId] = useState('')
  /*INFORMACION DEL CAI*/
  let puntoEmision                            = ''
  let establecimiento                         = ''
  let tipoDocumento                           = ''
  let numeroFactura                           = ''
  let fechaEmision                            = ''
  let fechaLimiteEmision                      = ''
  /*INFORMACION DEL CAI*/


  let date = new Date()
  let fechaActual = `${date.getFullYear()}-${date.getMonth() < 9? '0':''}${date.getMonth()+1}-${date.getDate() < 10? '0':''}${date.getDate()} ${date.getHours() < 10? '0':''}${date.getHours()}:${date.getMinutes() < 10? '0':''}${date.getMinutes()}`

  ///----

  const [mensajeModal, setMensajeModal]   = useState('')
  const [tituloModal, setTituloModal]     = useState('')
  const [visible, setVisible]             = useState(false)
  const navigate                          = useNavigate()

  useEffect(()=>{
    getEmpleado()
    getAllProductos()
    getAllEmpleados()
    getAllClientes()
    getAllTiposEntrega()
    getAllInsumos()
    getAllFormasPago()
    //getAllCAI()
  },[])

  //
  const activarModal = (titulo, mensajeModal)=>{
    setTituloModal(titulo)
    setMensajeModal(mensajeModal)
    setVisible(true)
  }
  //
  const getAllFormasPago = async ()=>{
    const response = await axios.get(endPointGetFormasPago)
    setFormasPago(response.data)
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
    //setSucursalId(response.data[0].sucursalId)

    //////
    const response1 = await axios.get(`${endPointGetAllParametrosCAI}I/${response.data[0].sucursalId}`)

    const array = response1.data.filter(parametro => parametro.fechaDesde < fechaActual && parametro.fechaHasta > fechaActual
    && parseInt(parametro.rangoFinal) > parseInt(parametro.numeroFacturaActual))

    //console.log(array)
    setParametrosCai(array)
    setParametroCAIId(array[0].numeroCAI)
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
  const formatearFormaPagoId = ()=>{
    formasPago.map(formaPago=>{
      if (formaPago.nombreFormaPago == formaPagoId){
        idFormaPago = formaPago.id
      }
    })
  }
  //
  const formatearParametroCAI = ()=>{
    parametrosCai.map(parametroCAI=>{
      if (parametroCAI.numeroCAI == parametroCAIId){
        idParametroCAI = parametroCAI.id
      }
    })
  }
  //
  const buscarParametroCAI = ()=>{
    parametrosCai.map(parametroCAI=>{
      if (parametroCAI.numeroCAI == parametroCAIId){

        puntoEmision        = parametroCAI.puntoEmision
        establecimiento     = parametroCAI.establecimiento
        tipoDocumento       = parametroCAI.tipoDocumento
        numeroFactura       = parametroCAI.numeroFacturaActual
        fechaEmision        = parametroCAI.fechaDesde 
        fechaLimiteEmision  = parametroCAI.fechaHasta
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
  const actualizarTotales = async (nuevoCarrito)=>{
    let subtotal    = 0
    let impuestoTotal = 0

    const response = await axios.get(endPointGetImpuesto)
    const impuestos = response.data

    nuevoCarrito.map((productoEnCarro)=>{
      if (parseInt(productoEnCarro.descuento) > 0){
        const descuento = parseFloat('0.'+productoEnCarro.descuento)

        subtotal += ((productoEnCarro.precio-(productoEnCarro.precio*descuento)) * productoEnCarro.cantidadDeCompra)

        impuestos.map((impuesto)=>{
          if (impuesto.id == productoEnCarro.impuestoId){
            const impuestoActual = parseFloat('0.'+impuesto.valorImpuesto) 
            
            impuestoTotal += ((productoEnCarro.precio-productoEnCarro.precio*descuento) * impuestoActual) * productoEnCarro.cantidadDeCompra
          }
        })

      }else{
        subtotal += productoEnCarro.precio * productoEnCarro.cantidadDeCompra

        impuestos.map((impuesto)=>{
          if (impuesto.id == productoEnCarro.impuestoId){
            const impuestoActual = parseFloat('0.'+impuesto.valorImpuesto) 
            
            impuestoTotal += (productoEnCarro.precio * impuestoActual) * productoEnCarro.cantidadDeCompra
          }
        })

      }
    })

    
    let total = subtotal + impuestoTotal
    
    
    setSubtotal(subtotal)
    setImpuesto(impuestoTotal)
    setTotal(total)
    setTotalConDescuento(total - (total * parseFloat(descuentoGlobal/100)))

    //console.log(descuentoGlobal)
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
    let insumosNecesarios = insumosDeOrdern
    let insumosNoDisponibles = []

    insumosNecesarios.map((insumoNecesario)=>{
      insumos.map((insumo)=>{
        if (insumo.id == insumoNecesario.insumoId){
          if ((insumo.cantidad-insumo.cantidadMin) < insumoNecesario.cantidad){
            insumosNoDisponibles.push(insumo.insumoNombre)
          }
        }
      })
    })

    if (insumosNoDisponibles.length > 0){
      //console.log('no hay suficientes insumos')
      activarModal('Error', `No hay suficientes insumos para esta orden, faltan: ${insumosNoDisponibles.join(', ')}.`)
    }else{
      setVisible(false)
      registrarOrdenEncabezado()
    }
    
  }
  //
  const registrarOrdenEncabezado = async ()=>{
    console.log(descuentoGlobal)
    if (cocineroId.includes('Seleccione') || meseroId.includes('Seleccione') || tipoEntregaId.includes('Seleccione') || formaPagoId.includes('Seleccione') || parametroCAIId.includes('Seleccione')){
      activarModal('Error', 'Debe seleccionar un cocinero, un mesero, tipo de entrega, forma de pago y un CAI.')
    }else if (carroProductos.length == 0){
      activarModal('Error', 'Debe agregar al menos un producto a la orden.')
    }else if(tipoEntregaId == 'Delivery' && clienteId == 'Consumidor Final'){
      activarModal('Error', 'Para entregar la orden por delivery debe seleccionar un cliente registrado.')
    }else if(descuentoGlobal > 0 && contraseniaGerente != '123'){         ///SE COMPARARÁ CON EL VALOR DE LA VARIABLE GLOBAL CONTRASENIA GERENTE
      setContraseniaGerente('')
      activarModal('Verificación de Descuento', 'Se ha detectado un descuento, se necesita la contraseña del gerente.')
    }else if (formaPagoId == 'Efectivo' && efectivo < totalConDescuento){
      activarModal('Error', 'El efectivo no es suficiente para pagar la cuenta.')
    }else{
      buscarParametroCAI()
      formatearClienteId()
      formatearMeseoId()
      formatearCocineroId()
      formatearTipoEntregaId()

      const response = await axios.post(endPointPostOrdenEncabezado, {clienteId: idCliente, empleadoMeseroId: idMesero, 
      empleadoCocinaId: idCocinero, tipoEntregaId: idTipoEntrega, fechaHora: fechaActual, estado: 1})
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
    const response1 = await axios.get(endPointGetImpuesto)
    const impuestos = response1.data

    carroProductos.map(async(producto)=>{

      let productoImpuesto = 0
      impuestos.map((impuesto)=>{
        if(producto.impuestoId == impuesto.id){
          productoImpuesto = impuesto.valorImpuesto
        }
      })

      const descuentoProducto = producto.descuento
      const precioDeCompra = (producto.precio*producto.cantidadDeCompra)

      console.log(producto.productoNombre, descuentoProducto, productoImpuesto)

      const response = await axios.post(endPointPostOrdenDetalle, {ordenEncabezadoId: encabezadoId,
      productoId: producto.id, precio: precioDeCompra, descuentoProducto: descuentoProducto, impuestoProducto: productoImpuesto,
      cantidad: producto.cantidadDeCompra, estado: 1})

      console.log(response.data)

    })

    cambiosEnInventario()
    registrarFactura(encabezadoId)
  }
  //
  const cambiosEnInventario = async ()=>{
    //console.log(insumosDeOrdern)
    insumosDeOrdern.map(async(insumoDeOrden)=>{
      insumos.map(async(insumo)=>{
        if (insumo.id == insumoDeOrden.insumoId){
          const nuevaCantidad = (insumo.cantidad - insumoDeOrden.cantidad)
          //console.log(nuevaCantidad)

          const response = await axios.put(`${endPointUpdateInsumo}/${insumo.id}`, {proveedorId: insumo.proveedorId, 
          insumoNombre: insumo.insumoNombre, insumoDescripcion: insumo.insumoDescripcion, cantidad: nuevaCantidad,
          cantidadMin: insumo.cantidadMin, cantidadMax: insumo.cantidadMax, estado: insumo.estado})

          //console.log(response.data)
        }
      })
    })
    
  }
  //
  const registrarFactura = async (encabezadoId)=>{
    
    // let ultimosDigitos = (parseInt(numeroFactura)+1)
    let ultimosDigitos = (parseInt(numeroFactura)+1)
    const cerosNecesarios = (8-ultimosDigitos.toString().length)

    for (let i = 0; i < cerosNecesarios; i++){
      ultimosDigitos = '0' + ultimosDigitos
    }

    const numeroFacturaActual = `${puntoEmision}${establecimiento}${tipoDocumento}${ultimosDigitos}`
    console.log(numeroFacturaActual)

    formatearFormaPagoId()
    formatearParametroCAI()

    const response = await axios.post(endPointPostFactura, {ordenEncabezadoId: encabezadoId, empleadoCajeroId: empleadoId, 
    parametroFacturaId: idParametroCAI, formaPagosId: idFormaPago, fechaHora: fechaActual, numeroFactura: numeroFacturaActual,
    impuesto: impuesto, subTotal: subtotal, total: total, informacionPago: `${efectivo}/${numeroTarjeta}`, 
    descuentoPorcentaje: descuentoGlobal, descuentoCantidad: (total*(descuentoGlobal/100)) ,estado: 1})

    console.log(response.data)


    const response1 = await axios.get(`${endPointGetAllParametrosCAI}/${idParametroCAI}`)
    const parametroActual = response1.data
    console.log(`Buscando parametro `)
    console.log(response1.data)

    const nuevoNumeroFactura = (parseInt(parametroActual.numeroFacturaActual)+1)

    const response2 = await axios.put(`${endPointUpdateParametroCAI}/${idParametroCAI}`, 
    {sucursalId :parametroActual.sucursalId, numeroCAI: parametroActual.numeroCAI, fechaDesde: parametroActual.fechaDesde,
    fechaHasta: parametroActual.fechaHasta, rangoInicial: parametroActual.rangoInicial, rangoFinal: parametroActual.rangoFinal,
    numeroFacturaActual: nuevoNumeroFactura, puntoEmision: parametroActual.puntoEmision, 
    establecimiento: parametroActual.establecimiento, tipoDocumento: parametroActual.tipoDocumento, 
    rtn_Restaurante: parametroActual.rtn_Restaurante, estado: parametroActual.estado})

    console.log(`Respuesta de UPDATE`)
    console.log(response2.data)

    crearFacturaPDF(numeroFacturaActual, parametroActual.rtn_Restaurante, parametroActual.rangoInicial, parametroActual.rangoFinal)
    
  }
  //
  const crearFacturaPDF = async (numeroFacturaActual, RTN, rangoInicio, rangoFinal)=>{
    let clienteRTN = 0
    clientes.map(async(cliente)=>{
      if (cliente.id == idCliente){
        clienteRTN = cliente.clienteRTN
      }
    })

    
    const doc = new jsPDF({
      format: 'dl'
    })
    
    doc.setFontSize(15)
    doc.text(`FIVE FORKS`, 10, 10)
    doc.addImage(Logo, 'JPEG', 70, 0, 30, 30)

    doc.setFontSize(10)

    doc.text(`RTN: ${RTN}`, 10, 20)
    doc.text(`Fecha y Hora: ${moment(fechaActual).format("DD/MM/yy, hh:mm")}`, 10, 25)
    doc.text(`Cajero: ${nombreUsuario}`, 10, 30)
    doc.text(`NÚMERO DE FACTURA: ${numeroFacturaActual}`, 10, 35)

    doc.text(`Artículo: `, 10, 45)
    doc.text(`Cantidad: `, 35, 45)
    doc.text(`Descuento: `, 53, 45)
    doc.text(`Precio: `, 80, 45)
    doc.text(`-------------------------------------------------------------------`, 10, (50))
    for (let i = 0; i < carroProductos.length; i++){
      doc.text(`${carroProductos[i].productoNombre}`, 10, (55+(i*5)))
      doc.text(`${carroProductos[i].cantidadDeCompra}`, 35, (55+(i*5)))
      doc.text(`${carroProductos[i].descuento}%`, 53, (55+(i*5)))
      doc.text(`${Intl.NumberFormat('ES-HN', {
        style: 'currency',
        currency: 'Hnl'
      }).format(carroProductos[i].precio)}`, 80, (55+(i*5)))
    }
    doc.text(`-------------------------------------------------------------------`, 10, (55+(carroProductos.length*5)))
    
    doc.text(`Descuento Global:`, 40, (55+(carroProductos.length*5)+5))
    doc.text(`${descuentoGlobal} %`, 75, (55+(carroProductos.length*5)+5))

    doc.text(`Subtotal:`, 40, (55+(carroProductos.length*5)+10))
    doc.text(`${Intl.NumberFormat('ES-HN', {
      style: 'currency',
      currency: 'Hnl'
    }).format(subtotal)}`, 75, (55+(carroProductos.length*5)+10))

    doc.text(`Impuesto:`, 40, (55+(carroProductos.length*5)+15))
    doc.text(`${Intl.NumberFormat('ES-HN', {
      style: 'currency',
      currency: 'Hnl'
    }).format(impuesto)}`, 75, (55+(carroProductos.length*5)+15))

    doc.text(`Total:`, 40, (55+(carroProductos.length*5)+20))
    doc.text(`${Intl.NumberFormat('ES-HN', {
      style: 'currency',
      currency: 'Hnl'
    }).format(total)}`, 75, (55+(carroProductos.length*5)+20))

    doc.text(`CAI: ${parametroCAIId}`, 10, (55+(carroProductos.length*5)+30))
    doc.text(`Rango Autorizado: ${rangoInicio} - ${rangoFinal}`, 10, (55+(carroProductos.length*5)+35))
    doc.text(`Cliente: ${clienteId}`, 10, (55+(carroProductos.length*5)+40))
    doc.text(`Cliente RTN: ${clienteRTN}`, 10, (55+(carroProductos.length*5)+45))
    doc.text(`Cocinero: ${cocineroId}`, 10, (55+(carroProductos.length*5)+50))
    doc.text(`Mesero: ${meseroId}`, 10, (55+(carroProductos.length*5)+55))
    //doc.text(`Fecha Emision: ${moment(fechaEmision).format("DD/MM/yy")}`, 10, (55+(carroProductos.length*5)+60))
    doc.text(`Fecha Límite Emisión: ${moment(fechaLimiteEmision).format("DD/MM/yy")}`, 10, (55+(carroProductos.length*5)+60))

    doc.text(`La factura es beneficio de todos, EXÍJALA.`, 10, (55+(carroProductos.length*5)+80))

    
    doc.save(`Factura ${numeroFacturaActual}.pdf`)

    

    const {value: confirmacion} = await Swal.fire({
      title: 'Registro exitoso',
      text: `La factura ${numeroFacturaActual} ha sido registrado con éxito.`,
      width: '410px',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#7109BF',
      background: 'black',
      color: 'white',
    })

    if (confirmacion){
      navigate('/Facturas')
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
          {tituloModal.includes('Error')?   /*If*/ mensajeModal: //ERROR
          tituloModal.includes('Verificación')?     //Verificación
          <div>                               
            {mensajeModal}                                
            
            <br />
            <label>Contraseña: </label>
            <input
              type='password'
              className='form-control'
              value={contraseniaGerente}
              onChange={(e)=>setContraseniaGerente(e.target.value)}/>

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

                  if (contraseniaGerente == '123'){   //SE COMPRARÁ CON LA VARIABLE GOLBAL DE LA CONTRASEÑA DEL GERENTE
                    verificarInventario()
                  }else{
                    activarModal('Error', 'Contraseña incorrecta')
                  }
                  
                }}
                auto>
                  Aceptar
                </Button>
              </div>
          </div>
          :
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
              min={1}
              max={100}
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

      <div className='layoutFactura'>

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
            <label>Número CAI</label>
            <input
            value={parametroCAIId}
            readOnly
            />
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

          <div className='atributo'>
            <label>Subtotal</label>
            <h4>{Intl.NumberFormat('ES-HN', {
              style: 'currency',
              currency: 'Hnl'
            }).format(subtotal)}</h4>
          </div>

          <div className='atributo'>
            <label>Impuesto</label>
            <h4>{Intl.NumberFormat('ES-HN', {
              style: 'currency',
              currency: 'Hnl'
            }).format(impuesto)}</h4>
          </div>

          <div className='atributo'>
            <label>Total</label>
            <h4>{Intl.NumberFormat('ES-HN', {
              style: 'currency',
              currency: 'Hnl'
            }).format(totalConDescuento)}</h4>
          </div>

          <div className='atributo'>
            <label>Forma de pago</label>
            <select
            value={formaPagoId}
            onChange={(e)=>{
              setEfectivo(0)
              setFormaPagoId(e.target.value)
            }}
            className='select'> 
              <option>Seleccione forma de pago</option>
              {formasPago.map((formaDePago)=> <option key={formaDePago.id}>{formaDePago.nombreFormaPago}</option>)}
            </select>
          </div>

          <div className='infoDePago'>

            {formaPagoId=='Efectivo'?           //Efectivo
              <div className='atributo'>
                <label>Efectivo</label>
                <input
                type={'number'}
                value={efectivo}
                onChange={(e)=>setEfectivo(e.target.value)}
                />
              </div>
            : formaPagoId=='Tarjeta'?         //Tarjeta
            
              <div className='atributo'>
                <label>Número de tarjeta</label>
                <input
                type={'number'}
                maxLength={16}
                value={numeroTarjeta}
                onChange={(e)=>setNumeroTarjeta(e.target.value)}
                />
              </div>
            : formaPagoId=='Mixto'?           //Mixto
              <div className='atributo'>
                <label>Efectivo</label>
                <input
                type={'number'}
                value={efectivo}
                onChange={(e)=>{
                  if(e.target.value >= total){
                    activarModal('Error', 'Seleccione efectivo, el monto que quiere ingresar cubre el total.')
                  }else{
                    setEfectivo(e.target.value)
                  }
                }}
                />
             </div>
            :
            ''
            }
          </div>

          <div>
          {formaPagoId=='Efectivo'? 
            <div>
              <div className='atributo'>
                <label>Devuelto</label>
                <label>
                  {
                    efectivo < total?
                    'Esperando'
                    :
                    Intl.NumberFormat('ES-HN', {
                      style: 'currency',
                      currency: 'Hnl'
                    }).format(efectivo-totalConDescuento)
                  }
                </label>
              </div>

            </div>
            :
            null}
          </div>

          {formaPagoId=='Mixto'?
          <div className='atributo'>
            <label>Número de tarjeta</label>
            <input
            type={'number'}
            maxLength={16}
            value={numeroTarjeta}
            onChange={(e)=>setNumeroTarjeta(e.target.value)}
            />
          </div>
        :
        null
        }

          <div className='atributo'>
            <label>Descuento %</label>
            <input
            type={'number'}
            value={descuentoGlobal}
            onChange={(e)=>{
              if (e.target.value > 100 || e.target.value < 0){
                activarModal('Error', 'El descuento debe estar entre 0 y 100.')
              }else{
                setDescuentoGlobal(e.target.value)
                setTotalConDescuento(total - (total * (e.target.value/100)))
              }
            }}
            />
          </div>
          
        </div>

        {/*Lista de los productos*/}
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

        {/*Productos en el carrito*/}
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
                  <th>Descuento</th>
                  <th>Opciones</th>
                </tr>
              </thead>

              <tbody>

                {carroProductos.map((producto)=>
                  <tr key={producto.id}>
                    <td>{producto.productoNombre}</td>
                    <td>{producto.cantidadDeCompra}</td>
                    <td>{producto.precio}</td>
                    <td>{producto.descuento}%</td>
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