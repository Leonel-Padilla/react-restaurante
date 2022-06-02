import React, {useEffect, useRef, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Modal, Text, Textarea} from '@nextui-org/react'
import Swal from 'sweetalert2'


const endPointGetSucursal   = 'http://127.0.0.1:8000/api/Sucursal'
const endPointAddMesa       = 'http://127.0.0.1:8000/api/addMesa'
const AgregarMesa = () =>{

    const [sucursales, setSucursales]               = useState([])
    const [sucursalId, setSucursalId]               = useState('Seleccione')
    let idSucursal                                  = ''
    const [cantidadAsientos, setCantidadAsientos]   = useState(0)
    const [descripcionMesa, setDescripcionMesa]     = useState('')
    const [numeroMesa, setNumeroMesa]               = useState(0)
    const [mesaEstado, setMesaEstado]               = useState(1)
    

    const navigate = useNavigate()
    const [mensajeModal, setMensajeModal] = useState('')
    const [tituloModal, setTituloModal] = useState('')
    const [visible, setVisible] = useState(false)

    useEffect(()=>{
        getAllSucursales()
    }, [])

    //
    const registrar = async(e)=>{ 
        e.preventDefault()

        if (sucursalId.includes('Seleccione')){
            setTituloModal('Error')
            setMensajeModal('Debe seleccionar una sucursal.')
            setVisible(true)
        }else{
            formatearSucursalId()

            const response = await axios.post(endPointAddMesa, {sucursalId: idSucursal, 
            cantidadAsientos: cantidadAsientos, descripcion: descripcionMesa, numero: numeroMesa, estado: mesaEstado})
        
            if (response.status !== 200){
                setTituloModal('Error')
                setMensajeModal(response.data.Error)
                setVisible(true)
            }else{
                (async ()=>{

                    const {value: confirmacion} = await Swal.fire({
                        title: 'Registro exitoso',
                        text: `La mesa ${numeroMesa} ha sido registrado con éxito.`,
                        width: '410px',
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#7109BF',
                        background: 'black',
                        color: 'white',
                    })
            
                    if (confirmacion){
                        navigate('/Mesas')
                    }
                })()
                
            }
        }
    }

    //
    const getAllSucursales = async ()=>{
        const response = await axios.get(endPointGetSucursal)
        setSucursales(response.data)
    }

    //
    const formatearSucursalId = ()=>{
        sucursales.map((sucursal)=>{
            if (sucursal.sucursalNombre == sucursalId){
                idSucursal = sucursal.id
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
                <h1 className='text-white'>Registrar Mesas</h1>
            </div>

            <form onSubmit={registrar} className='formulario'>
                
                <div className='atributo'>
                <label>Sucursales</label>
                <select
                value={sucursalId}
                onChange={(e)=>setSucursalId(e.target.value)}
                className='select'> 
                    <option>Seleccione Sucursal</option>

                    {sucursales.map((sucursal)=> <option key={sucursal.id}>{sucursal.sucursalNombre}</option>)}

                </select>

                </div>

                <div className='atributo'>
                    <label>Descripción Mesa:</label>
                    <input
                    aria-label='aria-describedby'
                    value={descripcionMesa}
                    placeholder='Mesa para reservar'
                    onChange={(e)=>{
                        if(/([A-Z]{2}|[A-Z]\s)/.test(e.target.value) || /\s\s/.test(e.target.value) || /(.)\1\1/.test(e.target.value)){
                            setTituloModal('Error')
                            setMensajeModal( 'No ingrese caracteres ni deje espacios de forma incorrecta.')
                            setVisible(true)
                        }else{
                            setDescripcionMesa(e.target.value)
                        }
                    }}
                    type='text'
                    title='Solo acepta números'
                    className='form-control'
                    />
                </div>

                <div className='atributo'>
                    <label>Número de mesa:</label>
                    <input
                    aria-label='aria-describedby'
                    value={numeroMesa}
                    placeholder='numeros 0-9'
                    onChange={(e)=>setNumeroMesa(e.target.value)}
                    type='text'
                    pattern='[0-9]{1,}'
                    maxLength={3}
                    title='numeros del 0-9"'
                    className='form-control'
                    />
                </div>

                <div className='atributo'>
                    <label>Cantidad de asientos:</label>
                    <input
                    aria-label='aria-describedby'
                    value={cantidadAsientos}
                    placeholder='numeros 0-9'
                    onChange={(e)=>setCantidadAsientos(e.target.value)}
                    type='text'
                    pattern='[0-9]{1,}'
                    maxLength={3}
                    title='numeros del 0-9"'
                    className='form-control'
                    />
                </div>

                <div className='d-flex mt-2'>
                    <Button 
                    color={'gradient'}
                    className='align-self-end me-3 ' 
                    auto 
                    onClick={()=>navigate('/Mesas')}
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
export default AgregarMesa