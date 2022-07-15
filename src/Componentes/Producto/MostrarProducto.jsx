import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Input,Tooltip, Modal, Text } from '@nextui-org/react';
import buscarLupa from '../../img/buscar_lupa.png';
import lapizEditar from '../../img/lapiz_editar.png'
import moment from 'moment';
import Logo from '../../img/LOGO.png';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx'
import 'jspdf-autotable'

const endPointGetProductos          = 'http://127.0.0.1:8000/api/Producto'
const endPointUpdateComentarios     = 'http://127.0.0.1:8000/api/updateProducto'
const endPointGetImpuesto           = 'http://127.0.0.1:8000/api/Impuesto'
const endPointGetInsumo             = 'http://127.0.0.1:8000/api/Insumo'
const endPointGetProductoInsumo     = 'http://127.0.0.1:8000/api/ProductoInsumo'

const MostrarProducto = ({ accesos }) =>{
    const [productos, setProductos]             = useState([])
    const [productoActual, setProductoActual]   = useState()
    const [impuestos, setImpuestos]             = useState([])
    const [insumos, setInsumos]                 = useState([])
    const [productoInsumos, setproductoInsumos] = useState([])
    let impuestoNombre                          = ''
    let insumoNombre                            = ''

    const navigate = useNavigate()
    const [mensajeModal, setMensajeModal]   = useState('')
    const [tituloModal, setTituloModal]     = useState('')
    const [visible, setVisible]             = useState(false)

    const [parametroBusqueda, setParametroBusqueda]   = useState('Seleccione')
    const [valorBusqueda, setValorBusqueda]           = useState('Seleccione')
    const date = new Date()

    useEffect(()=>{
        getAllProductos()
        getAllImpuestos()
        getAllInsumos()
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
    const getAllInsumos = async () =>{
        const response = await axios.get(endPointGetInsumo)
        setInsumos(response.data)
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
    const formatearInsumoId = (insumoId)=>{
        insumos.map((insumo)=>{
            if(insumo.id == insumoId){
                insumoNombre = insumo.insumoNombre
            }
        })
    }
    //
    const getProductoInsumos = async (idPorducto)=>{
        const response = await axios.get(`${endPointGetProductoInsumo}P/${idPorducto}`)
        setproductoInsumos(response.data)
    }
    //
    const getByValorBusqueda = async (e)=>{
        e.preventDefault()
  
        if (parametroBusqueda.includes('Seleccione')){
            activarModal('Error', 'Seleccione un parametro de búsqueda.')
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

    //
    const createExcel = ()=>{
        const libro = XLSX.utils.book_new()
    
        const copiaDatos = [...productos]
        copiaDatos.map((dato)=>{
            dato.estado = dato.estado == 1? 'Habilitado' : 'Desabilitado'
    
            delete dato.created_at
            delete dato.updated_at
            delete dato.descuento

            formatearImpuestoId(dato.impuestoId)
            dato.impuestoId = impuestoNombre
        })
    
        const pagina = XLSX.utils.json_to_sheet(copiaDatos, {origin: 'A3'})
    
        XLSX.utils.sheet_add_aoa(pagina, [[`Usuario: ${sessionStorage.getItem('userName')}`, 
        `Fecha: ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
        `Hora: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`]],
        {origin: `B1`})
    
        XLSX.utils.book_append_sheet(libro, pagina, 'Productos')
        pagina["!cols"] = [ 
            {wch: 3},
            {wch: 20},
            {wch: 20},
            {wch: 20},
            {wch: 20},
            {wch: 20}
        ];
        XLSX.utils.sheet_add_aoa(pagina, [['Impuesto', 'Nombre', 'Descripción', 'Precio', 'Estado']], {origin: 'B3'})
    
        XLSX.writeFile(libro, 'Reporte Productos.xlsx')
    }

    //
    const createPDF = ()=>{
        const copiaDatos = [...productos]
        copiaDatos.map((dato)=>{
            dato.estado = dato.estado == 1? 'Habilitado' : 'Desabilitado'
    
            delete dato.created_at
            delete dato.updated_at
            delete dato.descuento

            formatearImpuestoId(dato.impuestoId)
            dato.impuestoId = impuestoNombre
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
            doc.text(`Reporte Productos`, 70, 10)
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
                head: [['Id', 'Impuesto', 'Nombre', 'Descripción', 'Precio', 'Estado']],
            
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

        doc.save('Reporte Productos')
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
                {tituloModal.includes('Insumos')?
                <div>
                    <table className='table mt-2 text-white'>
                        <thead>
                            <tr>
                                <th>Insumo</th>
                                <th>Cantidad</th>
                            </tr>
                        </thead>

                        <tbody> 
                            {productoInsumos.map((productoInsumo)=>{
                            formatearInsumoId(productoInsumo.insumoId)
                            
                            return(
                            <tr key={productoInsumo.id}>
                                <td>{insumoNombre}</td>
                                <td>{productoInsumo.cantidad}</td>
                            </tr>)
                            })}
                        </tbody>
                    </table>
                </div>
                :
                tituloModal.includes('Error')?     //IF ERROR
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
                        <option>Seleccione tipo Búsqueda</option>
                        <option>ID</option>
                        <option>Nombre</option>
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
                    }}>
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
                
            <table className='table mt-2'> 
                <thead className='bg-dark text-white'> 
                    <tr>
                        <th>ID</th>
                        <th>Producto Nombre</th>
                        <th>Producto Precio</th>
                        <th>Descripción</th>
                        <th>Impuesto</th>
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
                                        if (Number(accesos.actualizar) === 0){
                                            activarModal('Error', 'No tienes permisos para realizar esta acción.')
                                        }else{
                                            setProductoActual(producto)
                                            activarModal('Cambiar', `¿Seguro que desea ${producto.estado == 1 ? 'deshabilitar' : 'habilitar'} este registro?`)
                                        }
                                    }}
                                ></Button>

                                <Button 
                                    children='Ver Insumos'
                                    color={'gradient'}
                                    onClick={()=>{
                                        if (Number(accesos.detalles) === 0){
                                            activarModal('Error', 'No tienes permisos para realizar esta acción.')
                                        }else{
                                            activarModal('Insumos', '')
                                            getProductoInsumos(producto.id)
                                        }
                                    }}
                                >
                                </Button>
                            </td>
                        </tr>)
                    })}
                </tbody>

            </table>
        </div>
    )
}
export default MostrarProducto