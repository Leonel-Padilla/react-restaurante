import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Tooltip, Modal, Text } from '@nextui-org/react';
import buscarLupa from '../../img/buscar_lupa.png';
import lapizEditar from '../../img/lapiz_editar.png';
import moment from 'moment';
import Logo from '../../img/LOGO.png';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx'
import 'jspdf-autotable'


const endPointGetCompras        = 'http://127.0.0.1:8000/api/CompraEncabezado'
const endPointGetEmpleados      = 'http://127.0.0.1:8000/api/Empleado'
const endPointGetProveedores    = 'http://127.0.0.1:8000/api/Proveedor'
const endPointGetInsumos        = 'http://127.0.0.1:8000/api/Insumo'
const endPointGetCompraDetalles = 'http://127.0.0.1:8000/api/CompraDetalle'
const endPointUpdateDetalle     = 'http://127.0.0.1:8000/api/updateCompraDetalle'
const endPointUpdateInsumo      = 'http://127.0.0.1:8000/api/updateInsumo'

const MostrarCompras = ()=> {

  const [compras, setCompras]           = useState([])
  const [empleados, setEmpleados]       = useState([])
  let   nombreEmpleado                  = ''
  const [proveedores, setProveedores]   = useState([])
  let   idProveedor                     = 0
  const [insumos, setInsumos]           = useState([])
  let   insumoNombre                    = ''

  const [detalleActual, setDetalleActual]           = useState({})
  const [compraDetalles, setCompraDetalles]         = useState([])
  const [parametroBusqueda, setParametroBusqueda]   = useState('Seleccione')
  const [valorBusqueda, setValorBusqueda]           = useState('Seleccione')
  
  const [mensajeModal, setMensajeModal]   = useState('')
  const [tituloModal, setTituloModal]     = useState('')
  const [visible, setVisible]             = useState(false)
  const navigate                          = useNavigate()
  const date = new Date()

  useEffect(()=>{
    getAllCompras()
    getAllEmpleados()
    getAllProveedores()
    getAllInsumos()
  },[])

  //
  const activarModal = (titulo, mensajeModal)=>{
    setTituloModal(titulo)
    setMensajeModal(mensajeModal)
    setVisible(true)
  }
//
  const getAllProveedores = async () => {
    const response = await axios.get(endPointGetProveedores)
    setProveedores(response.data)
  }
  //
  const getCompraDetalles = async (compraId) => {
    const response = await axios.get(`${endPointGetCompraDetalles}E/${compraId}`)
    setCompraDetalles(response.data)
  }
  //
  const getAllCompras = async ()=>{
    const respose = await axios.get(endPointGetCompras)
    //console.log(respose.data)
    setCompras(respose.data)
  }
  //
  const getAllEmpleados = async ()=>{
    const response = await axios.get(endPointGetEmpleados)
    setEmpleados(response.data)
  }
  //
  const getAllInsumos = async () =>{
    const response = await axios.get(endPointGetInsumos)
    setInsumos(response.data)

  }
  //
  const getByValorBusqueda = async (e)=>{
    e.preventDefault()
    if (parametroBusqueda.includes('Seleccione')){
        activarModal('Error','Seleccione un parametro de busqueda.' )

    }else{

        if (parametroBusqueda == 'ID'){

            const response = await axios.get(`${endPointGetCompras}/${valorBusqueda}`)
        
            if (response.status != 200){
                activarModal('Error', response.data.Error)
            }else{
                const array = [response.data]
                setCompras(array)
            }
            
        }else if (parametroBusqueda == 'Estado'){

            if (valorBusqueda.includes('Seleccione')){
                activarModal('Error', 'Debe seleccionar un estado de busqueda.')
            }else{
                const response = await axios.get(`${endPointGetCompras}E/${valorBusqueda}`)
                
                const array = response.data
        
                if (array.length < 1){
                    activarModal('Error', 'No hay compras con ese estado.')
                }else{
                    setCompras(array)
                }
            }
            
        }else{
            formatearProveedorId()

            const response = await axios.get(`${endPointGetCompras}P/${idProveedor}`)                
            const array = response.data
    
            if (array.length < 1){
                activarModal('Error', 'No hay compras a ese proveedor.')
            }else{
                setCompras(array)
            }

        }
    }
  }
  //
  const formatearProveedorId = ()=>{
    proveedores.map((proveedor)=>{
        if (proveedor.proveedorNombre == valorBusqueda){
            idProveedor = proveedor.id
        }
    })
  }
  //
  const formatearIdEmpleado = (idEmpleado)=>{
    empleados.map((empleado)=>{
        if(empleado.id == idEmpleado){
            nombreEmpleado = empleado.empleadoNombre 
        }
    })
  }
  //
  const formatearInsumoId = (insumoId)=>{
    insumos.map((insumo)=>{
        if(insumo.id == insumoId){
            insumoNombre = insumo.insumoNombre 
        }
    })
  }
  //
    const rechazarDetalleDeCompra = async ()=>{

        let insumoActual = {}
        insumos.map((insumo)=>{
            if(insumo.id == detalleActual.insumoId){
                insumoActual = {...insumo}
            }
        })

        if ((parseInt(insumoActual.cantidad) - parseInt(detalleActual.cantidad)) < parseInt(insumoActual.cantidadMin)){
            activarModal('Error', 'La compra del insumo no puede ser rechazada, ya que no se puede cubrir la cantidad mínima.')
        }else{
            insumoActual.cantidad = (parseInt(insumoActual.cantidad) - parseInt(detalleActual.cantidad))

            detalleActual.cantidad = 0
            detalleActual.precio = 0
    
            
            console.log(detalleActual)
            console.log(insumoActual)
            
    
            const response = await axios.put(`${endPointUpdateDetalle}/${detalleActual.id}`, detalleActual)
            console.log(response.data)
    
            const response1 = await axios.put(`${endPointUpdateInsumo}/${insumoActual.id}`, insumoActual)
            console.log(response1.data)

            setVisible(false)
        }

    }

     //
     const createExcel = ()=>{
        const libro = XLSX.utils.book_new()
    
        const copiaDatos = [...compras]
        copiaDatos.map((dato)=>{
            dato.estado = dato.estado == 1? 'Habilitado' : 'Desabilitado'
    
            delete dato.created_at
            delete dato.updated_at
            delete dato.numeroFacturaCai
            delete dato.cai
            delete dato.estado
            delete dato.proveedorId
            
            formatearIdEmpleado(dato.empleadoId)
            dato.empleadoId = nombreEmpleado
        })
    
        const pagina = XLSX.utils.json_to_sheet(copiaDatos, {origin: 'A3'})
    
        XLSX.utils.sheet_add_aoa(pagina, [[`Usuario: ${sessionStorage.getItem('userName')}`, 
        `Fecha: ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
        `Hora: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`]],
        {origin: `B1`})
    
        XLSX.utils.book_append_sheet(libro, pagina, 'Compras')
        pagina["!cols"] = [ 
            {wch: 3},
            {wch: 20},
            {wch: 20},
            {wch: 20},
            {wch: 20},
            {wch: 20}
        ];
        XLSX.utils.sheet_add_aoa(pagina, [['Empleado', 'Fecha Solicitud', 'Fecha Entrega', 'Fecha Pago', 'Estado Compra']], {origin: 'B3'})
    
        XLSX.writeFile(libro, 'Reporte Compras.xlsx')
    }

    //
    const createPDF = ()=>{
        const copiaDatos = [...compras]
        copiaDatos.map((dato)=>{
            dato.estado = dato.estado == 1? 'Habilitado' : 'Desabilitado'
    
            delete dato.created_at
            delete dato.updated_at
            delete dato.numeroFacturaCai
            delete dato.cai
            delete dato.estado
            delete dato.proveedorId
            
            formatearIdEmpleado(dato.empleadoId)
            dato.empleadoId = nombreEmpleado
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
            doc.text(`Reporte Compras`, 70, 10)
            doc.text(`FIVE FORKS`, 70, 20)
            doc.addImage(Logo, 'JPEG', 105, 0, 30, 30)
            
            doc.setFontSize(10)
            doc.text(`Usuario: ${sessionStorage.getItem('userName')}`, 165, 10)
            doc.text(`Fecha: ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`, 165, 15)
            doc.text(`Hora: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`, 165, 20)
            doc.text('--------------------------------------------------------------------------------'+
            '------------------------------------------------------------------------',
            15, 35)

            doc.autoTable({
                head: [['Id', 'Empleado', 'Fecha Solicitud', 'Fecha Entrega', 'Fecha Pago', 'Estado Compra']],
            
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

        doc.save('Reporte Compras')
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
                : tituloModal.includes('Eliminar')?   //ELSE IF ELIMINAR
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
                          rechazarDetalleDeCompra()
                        }}
                        auto>
                          Eliminar
                        </Button>
                      </div>
                </div>
                :                                   //ELSE DETALLES
                <div>
                    <table className='table mt-2 text-white'>
                        <thead>
                            <tr>
                                <th>Insumo</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Opciones</th>
                            </tr>
                        </thead>

                        <tbody> 
                            {compraDetalles.map((compraDetalle)=>{
                            formatearInsumoId(compraDetalle.insumoId)
                             
                            return(
                            <tr key={compraDetalle.id}>
                                <td>{insumoNombre}</td>
                                <td>{compraDetalle.precio}</td>
                                <td>{compraDetalle.cantidad}</td>
                                <td>
                                    {compraDetalle.cantidad == 0 || compraDetalle.precio == 0?
                                    <p>Ya rechazado</p>
                                    :
                                    <Button
                                    auto
                                    onClick={()=>{
                                        setDetalleActual(compraDetalle)
                                        activarModal('Eliminar Detalle', '¿Está seguro que desea rechazar el detalle de esta compra?')
                                    }}
                                    >
                                        Rechazar
                                    </Button>}


                                </td>
                            </tr>)
                            })}
                        </tbody>
                    </table>
                </div>
                }
            </Modal.Body>

        </Modal>

        {/*----------Cabecera*/}
        <div className='d-flex justify-content-start pt-2 pb-2'
        style={{backgroundColor: 'whitesmoke'}} >
           
            <h1 className='ms-4 me-4' >Compras</h1>

            <select style={{height: '35px'}}
            className='align-self-center me-2'
            onChange={(e)=>setParametroBusqueda(e.target.value)}>
                <option>Seleccione tipo busqueda</option>
                <option>ID</option>
                <option>Estado</option>
                <option>Nombre Proveedor</option>
            </select>

            {/*Formulario de busqueda*/}
            <form 
            className='d-flex align-self-center' 
            style={{left: '300px'}} 
            onSubmit={getByValorBusqueda}
            >
                {
                    parametroBusqueda == 'Estado'?
                    
                    <select className='select'
                    onChange={(e)=>setValorBusqueda(e.target.value)}>
                        <option>Seleccione un estado</option>
                        <option>Recibida</option>
                        <option>Pendiente</option>
                    </select>

                    : parametroBusqueda == 'Nombre Proveedor'?
                    <select className='select'
                    onChange={(e)=>setValorBusqueda(e.target.value)}>
                        <option>Seleccione un proveedor</option>
                        {proveedores.map((proveedor)=>
                            <option key={proveedor.id}>{proveedor.proveedorNombre}</option>
                        )}
                    </select>
                    :
                    <input
                    placeholder={parametroBusqueda.includes('Seleccione')? '': `${parametroBusqueda}`}
                    aria-label='aria-describedby'
                    onChange={(e)=>setValorBusqueda(e.target.value)}
                    type={parametroBusqueda == 'ID'? 'number':'text'}
                    className='form-control'
                    required={true}
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
            onClick={()=>getAllCompras()}
            >
                Llenar Tabla
            </Button>

            <Button 
            className='bg-dark text-light align-self-center'
            color={'dark'}
            bordered
            onClick={()=>navigate('/Compras/addCompra')}>
                Registrar
            </Button>

            <Button 
                auto
                color={'gradient'}
                bordered
                style={{right: '0px'}}
                className='align-self-center ms-2 me-2' 
                onClick={()=>createPDF()}
                >Reporte PDF
            </Button>

            <Button 
                auto
                color={'gradient'}
                bordered
                style={{right: '0px'}}
                className='align-self-center ms-2 me-2' 
                onClick={()=>createExcel()}
                >Reporte Excel
            </Button>
        </div>


        {/*---------Tabla de compras*/}
        <table className='table mt-2'> 
            <thead className='bg-dark text-white'> 
                <tr>
                  <th>Id</th>
                  <th>Empleado</th>
                  <th>Fecha Solicitud</th>
                  <th>Fecha Recibida</th>
                  <th>Fecha Pago</th>
                  <th>Estado compra</th>
                  <th>Opciones</th>
                </tr>
            </thead>

            <tbody>
                {compras.map(compra =>{

                        formatearIdEmpleado(compra.empleadoId)
                        return(

                        <tr key={compra.id}>
                            <td>{compra.id}</td>
                            <td>{nombreEmpleado}</td>
                            <td>{moment(compra.fechaSolicitud).format("DD/MM/yy")}</td>
                            <td>{compra.fechaEntregaCompra == null? 'Por definir':moment(compra.fechaEntregaCompra).format("DD/MM/yy")}</td>
                            <td>{compra.fechaPagoCompra == null? 'Por definir':moment(compra.fechaPagoCompra).format("DD/MM/yy")}</td>
                            <td>{compra.estadoCompra}</td>
                            <td>
                                <Button
                                className='mb-1'
                                color={'gradient'}
                                iconRight={<img src={lapizEditar}/>}
                                onClick={()=>navigate(`/Compras/updateCompra/${compra.id}`)}
                                    >Editar
                                </Button>

                                <Button 
                                light
                                shadow
                                color={'secondary'}
                                onClick={()=>{
                                    
                                    
                                    if (compra.estadoCompra == 'Recibida'){
                                        getCompraDetalles(compra.id)
                                        activarModal('Detalles de compra', ``)
                                    }else{
                                        activarModal('Error', 'Para poder ver o rechazar los detalles de una compra, esta debe estar recibida.')
                                    }

                                }}
                                >Detalles de Compra</Button>

                            </td>
                        </tr>)
                    })}
                </tbody>
            </table>

    </div>
  )
}

export default MostrarCompras