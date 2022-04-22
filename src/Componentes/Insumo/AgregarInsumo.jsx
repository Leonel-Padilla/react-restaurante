import React, {useEffect, useRef, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Modal, Text, Textarea} from '@nextui-org/react'
import Swal from 'sweetalert2'


const endPointGetAllProveedores     = 'http://127.0.0.1:8000/api/Proveedor'
const endPointAddInsumo            = 'http://127.0.0.1:8000/api/addInsumo'

const AgregarInsumo = () =>{

    const [proveedores, setPorveedores]             = useState([])
    const [proveedorId, setProveedorId]             = useState('Seleccione')
    let idProveedor                                 = 0
    const [insumoNombre, setInsumoNombre]           = useState('')
    const [insumoDescripcion, setInsumoDescripcion] = useState('')
    const [cantidad, setCantidad]                   = useState(0)
    const [cantidadMin, setCantidadMin]             = useState(0)
    const [cantidadMax, setCantidadMax]             = useState(0)
    const [estado, setEstado]                       = useState(1)

    const navigate                          = useNavigate()
    const [mensajeModal, setMensajeModal]   = useState('')
    const [tituloModal, setTituloModal]     = useState('')
    const [visible, setVisible]             = useState(false)

    useEffect(()=>{
        getAllProveedores()
    }, [])

    //
    const registrar = async (e)=>{ 
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

                const response = await axios.post(endPointAddInsumo, {proveedorId: idProveedor, insumoNombre: insumoNombre,
                insumoDescripcion: insumoDescripcion, cantidad: cantidad, cantidadMin: cantidadMin, cantidadMax: cantidadMax,
                estado: estado})
            
                if (response.status !== 200){
                    setTituloModal('Error')
                    setMensajeModal(response.data.Error)
                    setVisible(true)
                }else{
                    
                    (async ()=>{

                        const {value: confirmacion} = await Swal.fire({
                            title: 'Registro exitoso',
                            text: `El insumo ${insumoNombre} ha sido registrado con éxito.`,
                            width: '410px',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#7109BF',
                            background: 'black',
                            color: 'white',
                        })
                
                        if (confirmacion){
                            navigate('/Insumos')
                        }
                    })()
                    
                }
            }
        }
    }

    //
    const getAllProveedores = async ()=>{
        const respose = await axios.get(endPointGetAllProveedores)
        setPorveedores(respose.data)
    }

    //
    const formatearProveedorId = ()=>{
        proveedores.map((proveedor)=>{
            if (proveedorId == proveedor.proveedorNombre){
                idProveedor = proveedor.id
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
                    {mensajeModal}
                </Modal.Body>

            </Modal>

            <div className='d-flex justify-content-center bg-dark mb-2'
            style={{backgroundColor: 'whitesmoke'}}>
                <h1 className='text-white'>Registrar Insumos</h1>
            </div>

            <form onSubmit={registrar} className='formulario'>
                
                <div className='atributo'>
                    <label>Nombre Insumo:</label>
                    <input
                    placeholder='Pan'
                    value={insumoNombre}
                    onChange={(e)=>setInsumoNombre(e.target.value)}
                    type='text'
                    pattern='[A-Za-z ]{3,}'
                    maxLength={40}
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
                    <label>Descripción del insumo:</label>
                    <textarea
                    aria-label='aria-describedby'
                    placeholder='Producto necesita estar refrigerado'
                    value={insumoDescripcion}
                    maxLength={100}
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
                    maxLength={3}
                    title='numeros del 0-9"'
                    className='form-control'
                    />
                </div>

                <div className='atributo'>
                    <label>Cantidad mínima:</label>
                    <input
                    aria-label='aria-describedby'
                    placeholder='numeros del 0-9'
                    value={cantidadMin}
                    onChange={(e)=>setCantidadMin(e.target.value)}
                    type='text'
                    maxLength={3}
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
                    maxLength={3}
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

export default AgregarInsumo