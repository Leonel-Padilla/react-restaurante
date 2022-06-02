import { useNavigate, useParams} from "react-router-dom";
import React, {useState, useEffect, useRef} from 'react'
import { Button, Input, Modal, Text} from '@nextui-org/react'
import axios from "axios";
import moment from 'moment';


const endPointGetProducto               = 'http://127.0.0.1:8000/api/Producto'
const endPointUpdateProducto            = 'http://127.0.0.1:8000/api/updateProducto'
const endPointGetHistorialProducto      = 'http://127.0.0.1:8000/api/ProductoHistorial'
const endPointGetImpuesto               = 'http://127.0.0.1:8000/api/Impuesto'
const endPointUpdateHistorialProducto   = 'http://127.0.0.1:8000/api/updateProductoHistorial'
const endPointaddProductoHistorial      = 'http://127.0.0.1:8000/api/addProductoHistorial'

const ActualizarProducto = () =>{

    const {id} = useParams();
    const [productoNombre, setProductoNombre]           = useState('')
    const [productoDescripcion, setProductoDescripcion] = useState('')
    const [precio, setPrecio]                           = useState('')
    const [precioEnCambio, setPrecioEnCambio]           = useState('')
    const [impuestoId, setImpuestoId]                   = useState('Seleccione')
    let idImpuesto                                      = 0   
    const [descuento, setDescuento]                     = useState(0)
    const [historialProducto, setHistorialProducto]     = useState([])
    const [impuestos, setImpuestos]                     = useState([])

    const navigate = useNavigate()
    const [mensajeModal, setMensajeModal]   = useState('')
    const [tituloModal, setTituloModal]     = useState('')
    const [visible, setVisible]             = useState(false)

    const date = new Date()
    const fechaHoy = `${date.getFullYear()}-${date.getMonth() < 9? '0':''}${date.getMonth()+1}-${date.getDate() < 10? '0':''}${date.getDate()}`

    const date2 = new Date()
    let valor = date2.getDate()
    date2.setDate(valor-1)

    let fechaFin = `${date2.getFullYear()}-${date2.getMonth() < 9? '0':''}${date2.getMonth()+1}-${date2.getDate() < 10? '0':''}${date2.getDate()}`

    useEffect(()=>{
        getProducto()
        getHistorialProducto()
        getAllImpuestos()
    },[])

    //
    const validarTexto = (texto) =>{
        if(/([A-Z]{2}|[A-Z]\s)/.test(texto) || /\s\s/.test(texto) || /(.)\1\1/.test(texto)){
            activarModal('Error', 'No ingrese caracteres ni deje espacios de forma incorrecta.')
        }else{
            return false
        }
    }
    //
    const activarModal = (titulo, mensajeModal)=>{
        setTituloModal(titulo)
        setMensajeModal(mensajeModal)
        setVisible(true)
    }
    //
    const getProducto = async ()=>{
        const response = await axios.get(`${endPointGetProducto}/${id}`)

        const response1 = await axios.get(`${endPointGetImpuesto}/${response.data.impuestoId}`)
        
        setProductoNombre(response.data.productoNombre)
        setProductoDescripcion(response.data.productoDescripcion)
        setPrecio(response.data.precio)
        setImpuestoId(response1.data.nombreImpuesto)
        setPrecioEnCambio(response.data.precio)
        setDescuento(response.data.descuento)
    }
    //
    const getHistorialProducto = async ()=>{
        const response = await axios.get(`${endPointGetHistorialProducto}P/${id}`)
        setHistorialProducto(response.data)
    }
    //
    const getAllImpuestos = async ()=>{
        const response = await axios.get(`${endPointGetImpuesto}`)
        setImpuestos(response.data)
    }
    //
    const actualizar = async (e)=>{
        e.preventDefault()

        const datos = [productoNombre]
        let contador = 0

        datos.map((dato)=>{
            if (/(.)\1\1/.test(dato)) {
                contador++
            }
        })

        if (contador > 0){
            activarModal('Error', 'La información ingresada contiene mas de dos caracteres repetidos seguidos.')
        }else{

            formatearImpuesto()
            const response = await axios.put(`${endPointUpdateProducto}/${id}`, {impuestoId: idImpuesto, productoNombre: productoNombre,
            productoDescripcion: productoDescripcion, precio: precio, descuento: descuento ,estado: 1})

            //console.log(response.data)
    
            if (response.status !== 200){
                activarModal('Error', `${response.data.Error}`)
            }else{
                actualizarProductoHistorial()
            }
        }

    }
    //
    const actualizarProductoHistorial = async ()=>{
        if (precioEnCambio != precio){
            historialProducto.map(async(historialProducto)=>{
                if (historialProducto.fechaFinal == null){

                    if (historialProducto.fechaInicio > fechaFin){
                        date2.setDate(date2.getDate()+2)
                        fechaFin = `${date2.getFullYear()}-${date2.getMonth() < 9? '0':''}${date2.getMonth()+1}-${date2.getDate() < 10? '0':''}${date2.getDate()}`
                        
                    }
                    const response = await axios.put(`${endPointUpdateHistorialProducto}/${historialProducto.id}`,
                    {productoId: historialProducto.productoId, precio: historialProducto.precio, 
                    fechaInicio: historialProducto.fechaInicio, fechaFinal: fechaFin, estado: 1})
                    
                    //console.log(response.data)
                }
            })

            const response1 = await axios.post(endPointaddProductoHistorial, {productoId: id,
            precio: precio, fechaInicio: fechaHoy, estado: 1})

            navigate('/Productos')
        }else{
            navigate('/Productos')
        }
    }
    //
    const formatearImpuesto = ()=>{
        impuestos.map((impuesto)=>{
            if (impuesto.nombreImpuesto == impuestoId){
                idImpuesto = impuesto.id
            }
        })
    }

    return(
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
                    {tituloModal.includes('Error')?     //IF
                    mensajeModal
                    :                                   //ELSE           
                    <div className="Historial">
                    <table className="table mt-2 text-white">
                        <thead>
                            <tr>
                                <th>Precio</th>
                                <th>Fecha Inicio</th>
                                <th>Fecha Final</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historialProducto.map((historialProducto)=>{
                                
                                if(historialProducto.fechaFinal != null){
                                    
                                    return(
                                    <tr key={historialProducto.id}>
                                        <td>{historialProducto.precio}</td>
                                        <td>{moment(historialProducto.fechaInicio).format("DD/MM/yy")}</td>
                                        <td>{moment( historialProducto.fechaFinal).format("DD/MM/yy")}</td>
                                    </tr>)
                                }

                            })}
                        </tbody>
                    </table>
                </div>
                    }
                </Modal.Body>

            </Modal>

            <div className='d-flex justify-content-center bg-dark mb-2'
            style={{backgroundColor: 'whitesmoke'}}>

                <h1 className='text-white'>Actualizar Producto</h1>

                <Button
                className='align-self-center ms-1'
                ghost
                auto
                color={'gradient'}
                onClick={()=>{
                    activarModal('Historial Precios','')}
                }>
                    Historial Precios
                </Button>
            </div>


            <form onSubmit={actualizar} className='formulario'>
            <div className='atributo'>
                <label>Producto Nombre:</label>
                <input
                placeholder='Hamburguesa'
                pattern='[A-Za-z ]{3,}'
                maxLength={50}
                value={productoNombre}
                onChange={(e)=>{
                    if(validarTexto(e.target.value) == false){
                        setProductoNombre(e.target.value)
                    }
                }}
                type='text'
                className='form-control'
                />
                </div>


                <div className='atributo'>
                    <label>Descripción del Producto:</label>
                    <textarea
                    aria-label='aria-describedby'
                    placeholder='Hamburguesa con queso'
                    maxLength={100}
                    value={productoDescripcion}
                    onChange={(e)=>{
                        if(validarTexto(e.target.value) == false){
                            setProductoDescripcion(e.target.value)
                        }
                    }}
                    type='text'
                    className='form-control p-4'
                    />
                </div>

                <div className='atributo'>
                    <label>Precio Producto:</label>
                    <input
                    placeholder='L. 100'
                    value={precio}
                    onChange={(e)=>setPrecio(e.target.value)}
                    type='text'
                    pattern='^[0-9]+$'
                    maxLength={8}
                    className='form-control'
                    />
                </div>

                <div className='atributo'>
                    <label>Impuesto</label>
                    <select
                    value={impuestoId}
                    onChange={(e)=> setImpuestoId(e.target.value)}
                    type='number'
                    className='select'
                    >   
                        <option>Seleccione un impuesto</option>
                        {impuestos.map((impuesto)=>{
                            return( <option key={impuesto.id}>{impuesto.nombreImpuesto}</option>)
                        })}

                    </select>
                </div>

                <div className='atributo'>
                    <label>Descuento:</label>
                    <input
                    placeholder='5%'
                    value={descuento}
                    onChange={(e)=>setDescuento(e.target.value)}
                    type='text'
                    pattern='^[0-9]+$'
                    min={0}
                    maxLength={3}
                    className='form-control'
                    />
                </div>

                <div className='d-flex'>
                    <Button 
                    color={'gradient'}
                    className='align-self-end me-2' 
                    auto 
                    onClick={()=>navigate('/Productos')}
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
    );

}
export default ActualizarProducto