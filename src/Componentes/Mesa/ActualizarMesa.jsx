import { useNavigate, useParams} from "react-router-dom";
import React, {useState, useEffect, useRef} from 'react'
import { Button, Input, Modal, Text} from '@nextui-org/react'
import axios from "axios";

const endPointGetMesa       = 'http://127.0.0.1:8000/api/Mesa'
const endPointUpdateMesa    = 'http://127.0.0.1:8000/api/updateMesa'
const endPointGetSucursal   = 'http://127.0.0.1:8000/api/Sucursal'
const ActualizarMesa = ()=>{

    const {id}                                      = useParams()
    const [sucursales, setSucursales]               = useState([])
    const [sucursalId, setSucursalId]               = useState('Seleccione')
    let idSucursal                                  = ''
    const [cantidadAsientos, setCantidadAsientos]   = useState(0)
    const [mesaEstado, setMesaEstado]               = useState(1)
    const [descripcion, setDescripcion]             = useState('')
    const [numero, setNumero]                       = useState('')

    const navigate = useNavigate()
    const [mensajeModal, setMensajeModal] = useState('')
    const [tituloModal, setTituloModal] = useState('')
    const [visible, setVisible] = useState(false)
    


    useEffect(()=>{
        getMesa()
        getAllSucursales()
    }, [])

    //
    const activarModal = (titulo, mensajeModal)=>{
        setTituloModal(titulo)
        setMensajeModal(mensajeModal)
        setVisible(true)
    }
    //
    const getMesa = async ()=>{
        const response = await axios.get(`${endPointGetMesa}/${id}`)

        const response1 = await axios.get(`${endPointGetSucursal}/${response.data.sucursalId}`)

        setCantidadAsientos(response.data.cantidadAsientos)
        setSucursalId(response1.data.sucursalNombre)
        setDescripcion(response.data.descripcion)
        setNumero(response.data.numero)
        setMesaEstado(response.data.estado)
    }

    //
    const getAllSucursales = async ()=>{
        const response = await axios.get(endPointGetSucursal)
        setSucursales(response.data)

        //console.log(response.data)
    }

    //
    const formatearSucursalId = ()=>{
        sucursales.map((sucursal)=>{
            if (sucursal.sucursalNombre == sucursalId){
                idSucursal = sucursal.id
            }
        })
    }

    //
    const Actualizar = async (e) =>{
        e.preventDefault()

        if (sucursalId.includes('Seleccione')){
            setTituloModal('Error')
            setMensajeModal('Debe seleccionar una sucursal.')
            setVisible(true)
        }else{
            formatearSucursalId()

            const response = await axios.put(`${endPointUpdateMesa}/${id}`, {sucursalId: idSucursal ,cantidadAsientos: cantidadAsientos,
            descripcion: descripcion, numero: numero, estado: mesaEstado, estado: mesaEstado})

            //console.log(response.data)     
            
            if (response.status !== 200){
                activarModal('Error', `${response.data.Error}`)
            }else{
                navigate('/Mesas')
            }
        }
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
                <h1 className='text-white'>Actualizar Mesas</h1>
            </div>

            <form onSubmit={Actualizar} className='formulario'>
                
                <div className='atributo'>
                <label>Id de sucursales</label>
                <select
                value={sucursalId}
                onChange={((e)=>setSucursalId(e.target.value))}
                className='select'> 
                    <option>Seleccione Sucursal</option>
                    {sucursales.map((sucursal)=> <option key={sucursal.id}>{sucursal.sucursalNombre}</option>)}
                </select>

                </div>
                <div className='atributo'>
                    <label>Cantidad de asientos:</label>
                    <input
                    aria-label='aria-describedby'
                    value={cantidadAsientos}
                    placeholder='numeros del 0-9'
                    onChange={(e)=>setCantidadAsientos(e.target.value)}
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

export default ActualizarMesa
