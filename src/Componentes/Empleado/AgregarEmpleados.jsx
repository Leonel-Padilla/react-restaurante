import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Avatar, Button, Card, Input, useBodyScroll,} from '@nextui-org/react'

const endPointRegistrarEmpleado = 'http://127.0.0.1:8000/api/addEmpleado'
const endPointRegistrarTipoDocumento = 'http://127.0.0.1:8000/api/addTipoDocumento'
const endPointBuscarTipoDocumento = 'http://127.0.0.1:8000/api/TipoDocumentoND'
const endPointEliminarTipoDocumento = 'http://127.0.0.1:8000/api/deleteTipoDocumento'

const AgregarEmpleado = () =>{
    const [empleadoNombre, setEmpleadoNombre] = useState('')
    const [empleadoNumero, setEmpleadoNumero] = useState('')
    const [empleadoCorreo, setEmpleadoCorreo] = useState('')
    const [empleadoDireccion, setEmpleadoDireccion] = useState('')
    const [empleadoEstado, setEmpleadoEstado] = useState(1)

    const [empleadoNombreDocumento, setEmpleadoNombreDocumento] = useState('RTN')
    const [empleadoNumeroDocumento, setEmpleadoNumeroDocumento] = useState('')
    const [documentoEstado, setDocumentoEstado] = useState(1)

    useEffect(()=>{
        getTiposDocumentacion()
    }, [])

    const getTiposDocumentacion = ()=>{
        const response = {
            data:[
                {tipoDocumentacionId: 1, nombreDocumento: 'Identidad', numeroDocumento: 'A4015', estado: 1},
                {tipoDocumentacionId: 2, nombreDocumento: 'Pasaporte', numeroDocumento: 'A4015', estado: 1},
                {tipoDocumentacionId: 3, nombreDocumento: 'RTN', numeroDocumento: 'A4015', estado: 1}
            ]
        }

    }

    const registrar = async (e)=>{
        e.preventDefault()
        const response = await axios.post(endPointRegistrarTipoDocumento, {nombreDocumento: empleadoNombreDocumento,
            numeroDocumento: empleadoNumeroDocumento, estado: documentoEstado})

        if (response.status !== 200){
            console.log(response.data) //DEV
            alert(response.data.Error)
        }else{
            
            const responseDocumento = await axios.get(`${endPointBuscarTipoDocumento}/${empleadoNumeroDocumento}`)

            const response1 = await axios.post(endPointRegistrarEmpleado, {tipoDocumentoId: responseDocumento.data.id,
                empleadoNombre: empleadoNombre, empleadoNumero: empleadoNumero, empleadoCorreo: empleadoCorreo,
                empleadoDireccion: empleadoDireccion, estado: empleadoEstado})

            if (response1.status !== 200){
                console.log(response1.data)
                alert(response1.data.Error)

                await axios.delete(`${endPointEliminarTipoDocumento}/${responseDocumento.data.id}`)
            }
        }
    }

    return(
        <div>
            <Card className='nav'>
                <h3>Registrar Empleado</h3>
                <Avatar className='avatar' color={'gradient'} text={'Nombre'} textColor={'white'}></Avatar>
            </Card>

            <form onSubmit={registrar} className='formulario'>
                <div className='atributo'>
                    <Input
                    underlined
                    labelPlaceholder='Nombre'
                    value={empleadoNombre}
                    onChange={(e)=> setEmpleadoNombre(e.target.value)}
                    type='text'
                    className='form-control'
                    />
                </div>
                <div className='atributo'>
                    <Input
                    underlined
                    labelPlaceholder='Numero'
                    value={empleadoNumero}
                    onChange={(e)=> setEmpleadoNumero(e.target.value)}
                    type='number'
                    className='form-control'
                    />
                </div>
                <div className='atributo'>
                    <Input
                    underlined
                    labelPlaceholder='Correo'
                    value={empleadoCorreo}
                    onChange={(e)=> setEmpleadoCorreo(e.target.value)}
                    type='email'
                    className='form-control'
                    />
                </div>
                <div className='atributo'>
                    <Input
                    underlined
                    labelPlaceholder='Direccion'
                    value={empleadoDireccion}
                    onChange={(e)=> setEmpleadoDireccion(e.target.value)}
                    type='text'
                    className='form-control'
                    />
                </div>
                <div className='atributo'>
                    <label>Estado</label> <br/>
                    <select
                    value={empleadoEstado}
                    onChange={(e)=> setEmpleadoEstado(e.target.value)}
                    type='number'
                    className='select'
                    >
                    <option>Habilitado</option>
                    <option>Desabilitado</option>
                    </select>
                </div>
                <div className='atributo'>
                    <label>Tipo Documentacion</label> <br/>
                    <select
                    value={empleadoNombreDocumento}
                    onChange={(e)=> setEmpleadoNombreDocumento(e.target.value)}
                    type='number'
                    className='select'
                    >
                        <option>RTN</option>
                        <option>Identidad</option>
                        <option>Pasaporte</option>
                    </select>
                </div>
                <div className='atributo'>
                    <Input
                    underlined
                    labelPlaceholder='Numero Documento'
                    value={empleadoNumeroDocumento}
                    onChange={(e)=> setEmpleadoNumeroDocumento(e.target.value)}
                    type='text'
                    className='form-control'
                    />
                </div>


                <Button type='submit' color={'gradient'} ghost>Guardar</Button>
            </form>


        
       
    </div>
    )
}

export default AgregarEmpleado