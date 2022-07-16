import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Tooltip, Modal, Text } from '@nextui-org/react';
import buscarLupa from '../../img/buscar_lupa.png';
import lapizEditar from '../../img/lapiz_editar.png'
import impresora from '../../img/impresora.png'
import moment from 'moment';
import Logo from '../../img/LOGO.png';
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import 'jspdf-autotable'
import Swal from 'sweetalert2'

const endPointGetFactura          = 'http://127.0.0.1:8000/api/Factura'
const endPointGetCliente          = 'http://127.0.0.1:8000/api/Cliente'
const endPointGetOrdenEncabezado  = 'http://127.0.0.1:8000/api/OrdenEncabezado'
const endPointGetOrdenDetalle     = 'http://127.0.0.1:8000/api/OrdenDetalle'
const endPointGetCAI              = 'http://127.0.0.1:8000/api/ParametrosFactura'
const endPointGetProductos        = 'http://127.0.0.1:8000/api/Producto'
const endPointGetEmpleados        = 'http://127.0.0.1:8000/api/Empleado'

function MostrarFacturas({ accesos }) {

    const [facturas, setFacturas]           = useState([])
    const [clientes, setCliente]            = useState([])
    const [ordenes, setOrdenes]             = useState([])
    const [ordenDetalles, setOrdenDetalles] = useState([])
    const [productos, setProductos]         = useState([])
    let nombreProducto                      = ''
    const [empleados, setEmpleados]         = useState([])
    let idEmpleado                          = ''
    //const [facturaActual, setFacturaActual] = useState({})

    /*const [descuentoGlobal, setDescuentoGlobal]       = useState(0)
    const [totalConDescuento, setTotalConDescuento]   = useState(0)
    const [subtotal, setSubtotal]               = useState(0)
    const [impuesto, setImpuesto]               = useState(0)
    const [total, setTotal]                     = useState(0)*/
    
    
  
    const [parametroBusqueda, setParametroBusqueda] = useState('Seleccione')
    const [valorBusqueda, setValorBusqueda] = useState('Seleccione')
    const [mensajeModal, setMensajeModal]   = useState('')
    const [tituloModal, setTituloModal]     = useState('')
    const [visible, setVisible]             = useState(false)
    const navigate                          = useNavigate()
    const date = new Date()

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

    //
    const getDatosDeFactura = async (factura)=>{
      const response = await axios.get(`${endPointGetOrdenEncabezado}/${factura.ordenEncabezadoId}`)
      const ordenEncabezado = response.data
      
      const response2 = await axios.get(`${endPointGetOrdenDetalle}E/${factura.ordenEncabezadoId}`)
      const ordenDetalles = response2.data

      ordenDetalles.map((ordenDetalle)=>{
        
        productos.map((producto)=>{
          if (ordenDetalle.productoId == producto.id){
            ordenDetalle.productoNombre = producto.productoNombre
          }
        })
        
      })

      
      const response3 = await axios.get(`${endPointGetCAI}/${factura.parametroFacturaId}`)
      const CAI = response3.data


      let nombreUsuario = ''
      let cocineroId    = ''
      let meseroId      = ''

      empleados.map((empleado)=>{
        if(factura.empleadoCajeroId == empleado.id){
          nombreUsuario = empleado.empleadoUsuario
        }

        if(ordenEncabezado.empleadoMeseroId == empleado.id){
          meseroId = empleado.empleadoNombre
        }

        if(ordenEncabezado.empleadoCocinaId == empleado.id){
          cocineroId = empleado.empleadoNombre
        }

      })

      actualizarTotales(ordenEncabezado.clienteId, CAI.rtn_Restaurante, ordenEncabezado.fechaHora, nombreUsuario,
      factura.numeroFactura, ordenDetalles, CAI.numeroCAI, CAI.rangoInicial, CAI.rangoFinal, cocineroId, meseroId,
      CAI.fechaHasta, factura.descuentoPorcentaje)
    }

      //
  const actualizarTotales = async (idCliente, RTN, fechaActual, nombreUsuario, numeroFacturaActual, nuevoCarrito,
    parametroCAIId, rangoInicio, rangoFinal, /*clienteId, */cocineroId, meseroId, fechaLimiteEmision, descuentoGlobal)=>{
    let subtotal    = 0
    let impuestoTotal = 0

    nuevoCarrito.map((productoEnCarro)=>{
      if (parseInt(productoEnCarro.descuentoProducto) > 0){
        const descuento = parseFloat('0.'+productoEnCarro.descuentoProducto)

        subtotal += ((productoEnCarro.precio-(productoEnCarro.precio*descuento)) * productoEnCarro.cantidad)

        const impuestoActual = parseFloat('0.'+productoEnCarro.impuestoProducto) 
            
        impuestoTotal += ((productoEnCarro.precio-productoEnCarro.precio*descuento) * impuestoActual) * productoEnCarro.cantidad


      }else{
        subtotal += productoEnCarro.precio * productoEnCarro.cantidad

        const impuestoActual = parseFloat('0.'+productoEnCarro.impuestoProducto) 
            
        impuestoTotal += (productoEnCarro.precio * impuestoActual) * productoEnCarro.cantidad

      }
    })

    
    let total = subtotal + impuestoTotal

    console.log(total, subtotal, impuestoTotal ,descuentoGlobal, (total - (total * parseFloat(descuentoGlobal/100))))

    crearFacturaPDF(idCliente, RTN, fechaActual, nombreUsuario, numeroFacturaActual, nuevoCarrito,
      parametroCAIId, rangoInicio, rangoFinal, /*clienteId, */cocineroId, meseroId, fechaLimiteEmision, descuentoGlobal, 
      subtotal, impuestoTotal, total)
  }

    const crearFacturaPDF = async (idCliente, RTN, fechaActual, nombreUsuario, numeroFacturaActual, carroProductos,
      parametroCAIId, rangoInicio, rangoFinal, /*clienteId, */cocineroId, meseroId, fechaLimiteEmision, descuentoGlobal, 
      subtotal, impuesto, total)=>{
      let clienteRTN = 0
      let clienteId = 0
      clientes.map(async(cliente)=>{
        if (cliente.id == idCliente){
          clienteRTN = cliente.clienteRTN
          clienteId = cliente.clienteNombre
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
        doc.text(`${carroProductos[i].cantidad}`, 35, (55+(i*5)))
        doc.text(`${carroProductos[i].descuentoProducto}%`, 53, (55+(i*5)))
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
        text: `La factura ${numeroFacturaActual} ha sido imprimido con éxito.`,
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

    const createExcel = ()=>{
      const libro = XLSX.utils.book_new()
  
      const copiaDatos = [...facturas]
      copiaDatos.map((dato)=>{
        delete dato.estado
        delete dato.created_at
        delete dato.updated_at
        delete dato.formaPagosId
        delete dato.justificacion
        delete dato.informacionPago
        delete dato.empleadoCajeroId
        delete dato.descuentoCantidad
        delete dato.parametroFacturaId
        delete dato.descuentoPorcentaje
      })
  
      const pagina = XLSX.utils.json_to_sheet(copiaDatos, {origin: 'A3'})
  
      XLSX.utils.sheet_add_aoa(pagina, [[`Usuario: ${sessionStorage.getItem('userName')}`, 
      `Fecha: ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
      `Hora: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`]],
      {origin: `B1`})
  
      XLSX.utils.book_append_sheet(libro, pagina, 'Facturas')
      pagina["!cols"] = [ 
          {wch: 3},
          {wch: 20},
          {wch: 20},
          {wch: 20},
          {wch: 20},
          {wch: 20},
          {wch: 20}
      ];
      XLSX.utils.sheet_add_aoa(pagina, [['Orden Encabezado', 'Fecha y Hora', 'Numero Factura', 'Impuesto', 'Sub Total', 'Total']], 
      {origin: 'B3'})
  
      XLSX.writeFile(libro, 'Reporte Facturas.xlsx')
  }

  //
  const createPDF = ()=>{
      const copiaDatos = [...facturas]
      copiaDatos.map((dato)=>{
        delete dato.estado
        delete dato.created_at
        delete dato.updated_at
        delete dato.formaPagosId
        delete dato.justificacion
        delete dato.informacionPago
        delete dato.empleadoCajeroId
        delete dato.descuentoCantidad
        delete dato.parametroFacturaId
        delete dato.descuentoPorcentaje
      })

      const matrizDeDatos = []
      let repeticiones = 0 


      if(Number.isInteger(copiaDatos.length/30)){
          repeticiones = (copiaDatos.length/30)
      }else{
          repeticiones = Math.trunc((copiaDatos.length/30)+1)
      }

      for (let i = 0; i < repeticiones; i++){
          const array = copiaDatos.slice(i*30, (i+1)*30)
          matrizDeDatos.push(array)
      }
  
      
      const doc = new jsPDF({
          format: 'a4'
      })

      matrizDeDatos.map((array, index)=>{

          
          doc.setFontSize(15)
          doc.text(`Reporte Facturas`, 70, 10)
          doc.text(`FIVE FORKS`, 70, 20)
          doc.addImage(Logo, 'JPEG', 120, 0, 30, 30)
          
          doc.setFontSize(10)
          doc.text(`Usuario: ${sessionStorage.getItem('userName')}`, 165, 10)
          doc.text(`Fecha: ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`, 165, 15)
          doc.text(`Hora: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`, 165, 20)
          doc.text('--------------------------------------------------------------------------------'+
          '------------------------------------------------------------------------',
          15, 35)

          doc.autoTable({
              head: [['Id', 'Orden Encabezado', 'Fecha y Hora', 'Numero Factura', 'Impuesto', 'Sub Total', 'Total']],
          
              body: array.map((dato)=> Object.values(dato)),
              startY: 40,
          })
                          
          doc.text('--------------------------------------------------------------------------------'+
          '------------------------------------------------------------------------',
          15, 280)
          doc.text(`${index+1} / ${repeticiones}`, 185, 285)
          
          if ((index+1 != repeticiones)){
              doc.addPage()
          }
      })

      doc.save('Reporte Facturas')
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
                            <td>{Intl.NumberFormat('ES-HN', {
                                style: 'currency',
                                currency: 'Hnl'
                                }).format(ordenDetalle.precio)}
                            </td>

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
            onSubmit={(e) => {
              if (Number(accesos.buscar) === 0){
                  e.preventDefault()
                  activarModal('Error', 'No tienes permisos para realizar esta acción.')
              }else{
                  getByValorBusqueda(e)
              }
            }}
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

            <Button 
              auto
              color={'gradient'}
              bordered
              style={{right: '0px'}}
              className='align-self-center ms-2 me-2' 
              onClick={()=>{
                  if (Number(accesos.imprimirReportes) === 0){
                      activarModal('Error', 'No tienes permisos para realizar esta acción.')
                  }else{
                      createPDF()
                  }
              }}
              >Reporte PDF
            </Button>

            <Button 
              auto
              color={'gradient'}
              bordered
              style={{right: '0px'}}
              className='align-self-center ms-2 me-2' 
              onClick={()=>{
                  if (Number(accesos.imprimirReportes) === 0){
                      activarModal('Error', 'No tienes permisos para realizar esta acción.')
                  }else{
                      createExcel()
                  }
              }}
              >Reporte Excel
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
                        <td>{Intl.NumberFormat('ES-HN', {
                              style: 'currency',
                              currency: 'Hnl'
                            }).format(factura.total)}</td>
                        <td>{moment(factura.fechaHora).format("DD/MM/yy, hh:mm")}</td>
                        <td>{factura.numeroFactura}</td>

                        <td>
                            <Button
                            className='mb-1'
                            color={'gradient'}
                            iconRight={<img src={lapizEditar}/>}
                            onClick={()=>navigate(`/Facturas/updateFactura/${factura.id}`)}>
                              Editar
                            </Button> 

                            <Button 
                            light
                            shadow
                            color={'secondary'}
                            onClick={()=>{
                              if (Number(accesos.detalles) === 0){
                                activarModal('Error', 'No tienes permisos para realizar esta acción.')
                              }else{
                                getDetallesOrden(factura.ordenEncabezadoId)
                                activarModal('Detalles de orden', ``)  
                              }
                            }}>
                              Ver Detalles
                            </Button>

                            <Button
                            className='mb-1'
                            color={'gradient'}
                            iconRight={<img src={impresora}/>}
                            onClick={()=>{
                              if (Number(accesos.detalles) === 0){
                                activarModal('Error', 'No tienes permisos para realizar esta acción.')
                              }else{
                                getDatosDeFactura(factura)
                              }
                            }}>
                              Reimprimir
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