import { useNavigate, useParams} from "react-router-dom";
import React, {useState, useEffect, useRef} from 'react'
import { Button, Input, Modal, Text} from '@nextui-org/react'
import axios from "axios";


const endPointGetProveedor  = 'http://127.0.0.1:8000/api/Proveedor'
const endPointGetInsumo     = 'http://127.0.0.1:8000/api/Insumo'
const endPointUpdateInsumo     = 'http://127.0.0.1:8000/api/updateInsumo'

const ActualizarInsumo = () =>{
    const {id}                                      = useParams()
    const [proveedores, setPorveedores]             = useState([])
    const [proveedorId, setProveedorId]             = useState('Seleccione')
    let idProveedor                                 = 0
    const [insumoNombre, setInsumoNombre]           = useState('')
    const [insumoDescripcion, setInsumoDescripcion] = useState('')
    const [cantidad, setCantidad]                   = useState(0)
    const [cantidadMin, setCantidadMin]             = useState(0)
    const [cantidadMax, setCantidadMax]             = useState(0)
    const [estado, setEstado]                       = useState(1)

    const navigate = useNavigate()
    const [mensajeModal, setMensajeModal]   = useState('')
    const [tituloModal, setTituloModal]     = useState('')
    const [visible, setVisible]             = useState(false)


    useEffect(()=>{
        getAllProveedores()
        getInsumoById()
    }, [])

    //
    const Actualizar = async (e)=>{ 
        e.preventDefault()

        if (proveedorId.includes('Seleccione')){
            setTituloModal('Error')
            setMensajeModal('Debe seleccionar un proveedor.')
            setVisible(true)
        }else{
            const datos = [insumoNombre]
            let contador = 0
    
            datos.map((dato)=>{
                if (/(.)\1\1/.test(dato)) {
                    contador++
                }
            })
    
    
            if (contador > 0){
                setTituloModal('Error')
                setMensajeModal('La información ingresada contiene mas de dos caracteres repetidos seguidos.')
                setVisible(true)
            }else{
                formatearProveedorId()

                const response = await axios.put(`${endPointUpdateInsumo}/${id}`, {proveedorId: idProveedor, insumoNombre: insumoNombre,
                insumoDescripcion: insumoDescripcion, cantidad: cantidad, cantidadMin: cantidadMin, cantidadMax: cantidadMax,
                estado: estado})
            
                if (response.status !== 200){
                    setTituloModal('Error')
                    setMensajeModal(response.data.Error)
                    setVisible(true)
                }else{
                    navigate('/Insumos')
                }
            }
        }
    }

    //
    const getAllProveedores = async ()=>{
        const respose = await axios.get(endPointGetProveedor)
        setPorveedores(respose.data)
    }

    //
    const getInsumoById = async ()=>{
        const response = await axios.get(`${endPointGetInsumo}/${id}`)

        const response1 = await axios.get(`${endPointGetProveedor}/${response.data.proveedorId}`)
        
        setInsumoNombre(response.data.insumoNombre)
        setProveedorId(response1.data.proveedorNombre)
        setInsumoDescripcion(response.data.insumoDescripcion)
        setCantidad(response.data.cantidad)
        setCantidadMin(response.data.cantidadMin)
        setCantidadMax(response.data.cantidadMax)
    }

    //
    const formatearProveedorId = ()=>{
        proveedores.map((proveedor)=>{
            if (proveedorId == proveedor.proveedorNombre){
                idProveedor = proveedor.id
            }
            })
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
                    {mensajeModal}
                </Modal.Body>

            </Modal>

            <div className='d-flex justify-content-center bg-dark mb-2'
            style={{backgroundColor: 'whitesmoke'}}>
                <h1 className='text-white'>Actualizar Insumos</h1>
            </div>

            <form onSubmit={Actualizar} className='formulario'>
                
                <div className='atributo'>
                    <label>Nombre Insumo:</label>
                    <input
                    placeholder='Pan'
                    value={insumoNombre}
                    onChange={(e)=>setInsumoNombre(e.target.value)}
                    type='text'
                    pattern='[A-Za-z ]{3,}'
                    title='Solo se aceptan letras, ejem: "Pan"'
                    className='form-control'
                    />
                </div>

                <div className='atributo'>
                    <label>Proveedor</label>
                    <select
                    value={proveedorId}
                    onChange={(e)=>setProveedorId(e.target.value)}
                    className='select'> 
                        <option>Seleccione un proveedor</option>
                        
                        {proveedores.map((proveedor)=>
                            <option key={proveedor.id}>{proveedor.proveedorNombre}</option>
                        )}
                    </select>
                </div>

                <div className='atributo'>
                    <label>Descripcion del insumo:</label>
                    <textarea
                    aria-label='aria-describedby'
                    placeholder='Producto necesita estar refrigerado'
                    value={insumoDescripcion}
                    onChange={(e)=>setInsumoDescripcion(e.target.value)}
                    type='text'
                    className='form-control p-4'
                    />
                </div>

                <div className='atributo'>
                    <label>Cantidad actual:</label>
                    <input
                    aria-label='aria-describedby'
                    placeholder='numeros del 0-9'
                    value={cantidad}
                    onChange={(e)=>setCantidad(e.target.value)}
                    type='text'
                    pattern='[0-9]{1,}'
                    title='numeros del 0-9"'
                    className='form-control'
                    />
                </div>

                <div className='atributo'>
                    <label>Cantidad minima:</label>
                    <input
                    aria-label='aria-describedby'
                    placeholder='numeros del 0-9'
                    value={cantidadMin}
                    onChange={(e)=>setCantidadMin(e.target.value)}
                    type='text'
                    pattern='[0-9]{1,}'
                    title='numeros del 0-9"'
                    className='form-control'
                    />
                </div>

                <div className='atributo'>
                    <label>Cantidad máxima:</label>
                    <input
                    aria-label='aria-describedby'
                    placeholder='numeros del 0-9'
                    value={cantidadMax}
                    onChange={(e)=>setCantidadMax(e.target.value)}
                    type='text'
                    pattern='[0-9]{1,}'
                    title='numeros del 0-9"'
                    className='form-control'
                    />
                </div>

                <div className='d-flex mt-2'>
                    <Button 
                    color={'gradient'}
                    className='align-self-end me-3 ' 
                    auto 
                    onClick={()=>navigate('/Insumos')}
                    ghost>
                        Regresar
                    </Button>
                    <Button
                    //ref={refButton}
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

export default ActualizarInsumo