import React, {useEffect, useRef, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Modal, Text, Textarea} from '@nextui-org/react'
import Swal from 'sweetalert2'


const endPointRegistarCliente   = 'http://127.0.0.1:8000/api/addCliente'
const endPointGetTipoDocumento  = 'http://127.0.0.1:8000/api/TipoDocumento'

const AgregarCliente = ()=>{
    const [tipoDocumentoId, setTipoDocumentoId] = useState('')
    let idTipoDocumento                         = 0
    const [numeroDocumento, setNumeroDocumento] = useState('')
    const [clienteNombre, setClienteNombre]     = useState('')
    const [clienteNumero, setClienteNumero]     = useState('')
    const [clienteCorreo, setClienteCorreo]     = useState('')
    const [clienteRTN, setClienteRTN]           = useState('')
    const [clienteEstado, setClienteEstado]     = useState(1)

    const [tiposDocumento, setTiposDocumento] = useState([])


    const navigate                          = useNavigate()
    const [mensajeModal, setMensajeModal]   = useState('')
    const [tituloModal, setTituloModal]     = useState('')
    const [visible, setVisible]             = useState(false)

    let digitosNumero = 0

    useEffect(()=>{
        getAllTipoDocumento()
    },[])

    //
    const getAllTipoDocumento = async () =>{
        const response = await axios.get(`${endPointGetTipoDocumento}`)
        setTiposDocumento(response.data)
    }
    //
    const formatearIdDocumento = ()=>{
        tiposDocumento.map((documento)=>{
            if(documento.nombreDocumento == tipoDocumentoId){
                idTipoDocumento = documento.id
            }
        })
    }
    //
    const registrar = async (e)=>{ 
        e.preventDefault()
        
        const datos = [clienteNombre, clienteCorreo]
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
            formatearIdDocumento()

            const response = await axios.post(endPointRegistarCliente, {tipoDocumentoId: idTipoDocumento,
            numeroDocumento: numeroDocumento, clienteNombre: clienteNombre, clienteNumero: clienteNumero,
            clienteCorreo: clienteCorreo,  clienteRTN: clienteRTN, estado: clienteEstado})
        
            //console.log(response.data)

                if (response.status !== 200){
                    setTituloModal('Error')
                    setMensajeModal(response.data.Error)
                    setVisible(true)
                }else{
                    (async ()=>{

                        const {value: confirmacion} = await Swal.fire({
                            title: 'Registro exitoso',
                            text: `El cliente ${clienteNombre} ha sido registrado con éxito.`,
                            width: '410px',
                            height: '800px',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#7109BF',
                            background: 'black',
                            color: 'white',
                        })
                
                        if (confirmacion){
                            navigate('/Clientes')
                        }
                    })()

                    
                }
        }
    }

    //
    const verificarTipoDocumento = ()=> {

        switch (tipoDocumentoId){
            case 'RTN': digitosNumero = 14 
                break
            case 'Identidad': digitosNumero = 13 
                break
            case 'Pasaporte': digitosNumero = 7 
                break
            case 'Visa': digitosNumero = 9 
                break
            case 'Licencia Conducir': digitosNumero = 9
                break
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
                <h1 className='text-white'>Registrar Cliente</h1>
            </div>

            <form onSubmit={registrar} className='formulario'>

                <div className='atributo'>
                    <label>Tipo Documento</label>
                    <select
                    value={tipoDocumentoId}
                    onChange={(e)=> setTipoDocumentoId(e.target.value)}
                    type='number'
                    className='select'
                    >   
                        <option>Seleccione Tipo Documento</option>
                        {tiposDocumento.map((documento)=>{
                            verificarTipoDocumento()
                            if (documento.nombreDocumento != 'RTN'){
                                return( <option key={documento.id}>{documento.nombreDocumento}</option>)
                            }
                        })}

                    </select>
                </div>

                <div className='atributo'>
                    <label>Número documento:</label>
                    <input
                    required={true}
                    minLength={digitosNumero}
                    maxLength={digitosNumero}
                    value={numeroDocumento}
                    pattern={tipoDocumentoId == 'Visa' || tipoDocumentoId == 'Pasaporte'? '^[A-Z][0-9]+$':
                    tipoDocumentoId == 'RTN' || tipoDocumentoId == 'Identidad'? '^[0-1][0-9]+$': '^[1][0-9]+$'}
                    onChange={(e)=> setNumeroDocumento(e.target.value)}
                    type='text'
                    className='form-control'
                    />
                </div>
                
                <div className='atributo'>
                    <label>Nombre:</label>
                    <input
                    aria-label='aria-describedby'
                    value={clienteNombre}
                    placeholder='Juan Perez'
                    onChange={(e)=>setClienteNombre(e.target.value)}
                    type='text'
                    pattern='[A-Za-z ]{3,}'
                    maxLength={40}
                    title='Solo se aceptan letras, ejem: "Juan"'
                    className='form-control'
                    />
                </div>

                <div className='atributo'>
                    <label>Número telefónico:</label>
                    <input
                    placeholder='88922711'
                    value={clienteNumero}
                    onChange={(e)=>setClienteNumero(e.target.value)}
                    pattern='[0-9]{8,}'
                    maxLength={8}
                    title='Solo se aceptan numeros del 0-9 y la longitud del numero debe ser igual a 8, ejem: "2252667"'
                    type='text'
                    className='form-control'
                    />
                </div>

                <div className='atributo'>
                    <label>Correo electrónico:</label>
                    <input
                    placeholder='ejem@gmail.com'
                    value={clienteCorreo}
                    onChange={(e)=>setClienteCorreo(e.target.value)}
                    maxLength={50}
                    type='email'
                    className='form-control'
                    />
                </div>

                <div className='atributo'>
                    <label>RTN:</label>
                    <input
                    maxLength={14}
                    value={clienteRTN}
                    pattern='[0-9]{14,}'
                    onChange={(e)=>setClienteRTN(e.target.value)}
                    placeholder='08019999176681'
                    type='text'
                    className='form-control'
                    />
                </div>


                <div className='d-flex mt-2'>

                    <Button 
                    color={'gradient'}
                    className='align-self-end me-3 ' 
                    auto 
                    onClick={()=>navigate('/Clientes')}
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
    )
}


export default AgregarCliente