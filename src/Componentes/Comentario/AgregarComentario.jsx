import React, {useEffect, useRef, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, Text,} from '@nextui-org/react'
import Swal from 'sweetalert2'

const endPointGetSucursales           = 'http://127.0.0.1:8000/api/Sucursal'
const endPointAddComentario           = 'http://127.0.0.1:8000/api/addComentario'
const AgregarComentario = () =>{
    
    const [sucursales, setSucursales]       = useState([])

    const [sucursalId, setSucursalId]           = useState('Seleccione')
    let idSucursal                              = ''
    const [telefonoCliente, setTelefonoCliente] = useState('')
    const [correoCliente, setCorreoCliente]     = useState('')
    const [descripcion, setDescripcion]         = useState('')

    const navigate                          = useNavigate()
    const [mensajeModal, setMensajeModal]   = useState('')
    const [tituloModal, setTituloModal]     = useState('')
    const [visible, setVisible]             = useState(false)
    const refButton                         = useRef()

    useEffect(()=>{
        getAllSucursales()
    },[])

    //
    const activarModal = (titulo, mensajeModal)=>{
        setTituloModal(titulo)
        setMensajeModal(mensajeModal)
        setVisible(true)
    }
    //
    const registrar = async (e) =>{
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

                const response = await axios.post(endPointAddComentario, {sucursalId: idSucursal, descripcion: descripcion, 
                telCliente: telefonoCliente, correoCliente: correoCliente, estado: 1})

                if (response.status !== 200){
                    activarModal('Error', `${response.data.Error}`)
                }else{
                    (async ()=>{

                        const {value: confirmacion} = await Swal.fire({
                            title: 'Registro exitoso',
                            text: `El comentario ha sido registrado con éxito.`,
                            width: '410px',
                            height: '800px',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#7109BF',
                            background: 'black',
                            color: 'white',
                        })
                
                        if (confirmacion){
                            navigate('/Comentarios')
                        }
                    })()
                    
                }
            }
        }

    }

    //
    const getAllSucursales = async () =>{
        const response = await axios.get(endPointGetSucursales)
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


            {/*--------Formulario de informacion*/}
            <form onSubmit={registrar} className='formulario'>

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
                    placeholder='98515484'
                    pattern='[0-9]{8,}'
                    maxLength={8}
                    value={telefonoCliente}
                    onChange={(e)=>setTelefonoCliente(e.target.value)}
                    type='text'
                    className='form-control'
                    />
                </div>

                <div className='atributo'>
                    <label>Correo Cliente:</label>
                    <input
                    aria-label='aria-describedby'
                    placeholder='ejem@gmail.com'
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
                    ref={refButton}
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

export default AgregarComentario