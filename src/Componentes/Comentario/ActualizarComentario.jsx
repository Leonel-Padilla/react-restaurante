import { useNavigate, useParams} from "react-router-dom";
import React, {useState, useEffect, useRef} from 'react'
import { Button, Input, Modal, Text} from '@nextui-org/react'
import axios from "axios";



const endPointGetSucursal             = 'http://127.0.0.1:8000/api/Sucursal'
const endPointUpdateComentario        = 'http://127.0.0.1:8000/api/updateComentario'
const endPointGetComentario           = 'http://127.0.0.1:8000/api/Comentario'
const ActualizarComentario = () =>{
    const [sucursales, setSucursales]       = useState([])
    const [comentario, setComentario]       = useState([])

    const [sucursalId, setSucursalId]           = useState('Seleccione')
    let idSucursal                              = ''
    const [telefonoCliente, setTelefonoCliente] = useState('')
    const [correoCliente, setCorreoCliente]     = useState('')
    const [descripcion, setDescripcion]         = useState('')
    const [estado, setEstado]                   = useState()
    const {id}                                  = useParams()


    const navigate = useNavigate()
    const [mensajeModal, setMensajeModal]   = useState('')
    const [tituloModal, setTituloModal]     = useState('')
    const [visible, setVisible]             = useState(false)

    useEffect(()=>{
        getAllSucursales()
        getComentario()
    },[])

    //
    const activarModal = (titulo, mensajeModal)=>{
        setTituloModal(titulo)
        setMensajeModal(mensajeModal)
        setVisible(true)
    }
    //
    const getAllSucursales = async () =>{
        const response = await axios.get(endPointGetSucursal)
        setSucursales(response.data)
        //console.log(response.data)
    }
    //
    const formatearSucursalId = ()=>{
        sucursales.map((sucursal)=>{
            if(sucursal.sucursalNombre == sucursalId){
                idSucursal = sucursal.id
            }
        })
    }
    //
    const getComentario = async () =>{
        const respose = await axios.get(`${endPointGetComentario}/${id}`)
        setComentario(respose.data)
        const response1 = await axios.get(`${endPointGetSucursal}/${respose.data.sucursalId}`)

        setSucursalId(response1.data.sucursalNombre)
        setTelefonoCliente(respose.data.telCliente)
        setCorreoCliente(respose.data.correoCliente)
        setDescripcion(respose.data.descripcion)
        setEstado(respose.data.estado)
    }

    const actualizar =  async (e)=>{
        e.preventDefault()
        if (sucursalId.includes('Seleccione')){
            activarModal('Error', 'Debe seleccionar una sucursal.')
        }else{
            const datos = [correoCliente]
            let contador = 0
    
            datos.map((dato)=>{
                if (/(.)\1\1/.test(dato)) {
                    contador++
                }
            })

            if (contador > 0){
                activarModal('Error', 'La información ingresada contiene mas de dos caracteres repetidos seguidos.')
            }else{
                formatearSucursalId()
                console.log(idSucursal)

                const response = await axios.put(`${endPointUpdateComentario}/${id}`, {sucursalId: idSucursal, descripcion: descripcion, 
                telCliente: telefonoCliente, correoCliente: correoCliente, estado: estado})
                
                //console.log(response.data)

                if (response.status !== 200){
                    activarModal('Error', `${response.data.Error}`)
                }else{
                    navigate('/Comentarios')
                }
            }
        }
    }

    return(
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
                {mensajeModal}
            </Modal.Body>

        </Modal>

        <div className='d-flex justify-content-center bg-dark mb-2'
        style={{backgroundColor: 'whitesmoke'}}>
          <h1 className='text-white'>Registrar Comentario</h1>
         </div>


        {/*--------Formulario de informacio*/}
        <form onSubmit={actualizar} className='formulario'>

            <div className='atributo'>
                <label>Sucursal Id</label>
                <select
                value={sucursalId}
                onChange={(e)=>setSucursalId(e.target.value)}
                className='select'> 
                    <option>Seleccione una sucursal</option>

                    {sucursales.map(sucursal=>
                        <option key={sucursal.id}>{sucursal.sucursalNombre}</option>)}
                </select>
            </div>

            <div className='atributo'>
                <label>Teléfono Cliente:</label>
                <input
                aria-label='aria-describedby'
                placeholder='Excelente servicio'
                value={telefonoCliente}
                onChange={(e)=>setTelefonoCliente(e.target.value)}
                type='number'
                className='form-control'
                />
            </div>

            <div className='atributo'>
                <label>Correo Cliente:</label>
                <input
                aria-label='aria-describedby'
                placeholder='Excelente servicio'
                value={correoCliente}
                onChange={(e)=>setCorreoCliente(e.target.value)}
                type='email'
                className='form-control'
                />
            </div>

            <div className='atributo'>
                <label>Descripción del comentario:</label>
                <textarea
                aria-label='aria-describedby'
                placeholder='Excelente servicio'
                maxLength={100}
                value={descripcion}
                onChange={(e)=>setDescripcion(e.target.value)}
                type='text'
                className='form-control p-4'
                />
            </div>

            <div className='d-flex mt-2'>

                <Button 
                color={'gradient'}
                className='align-self-end me-3 ' 
                auto 
                onClick={()=>navigate('/Comentarios')}
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
export default ActualizarComentario