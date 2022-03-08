import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Avatar, Button, Card, Input, useBodyScroll,} from '@nextui-org/react'

const endPointGet = 'http://localhost:8000/api'
const endPoint = 'http://localhost:8000/api/addLibro'

const AgregarEmpleado = () =>{
    const [empleadoId, setEmpleadoId] = useState(0)
    const [empleadoNombre, setEmpleadoNombre] = useState('')
    const [empleadoNumero, setEmpleadoNumero] = useState('')
    const [empleadoCorreo, setEmpleadoCorreo] = useState('')
    const [empleadoDireccion, setEmpleadoDireccion] = useState('')
    const [empleadoEstado, setEmpleadoEstado] = useState(0)
    const [empleadoTipoDocumentacion, setEmpleadoTipoDocumentacion] = useState(0)

    const [tiposDocumentacion, setTiposDocumentacion] = useState([])

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

        setTiposDocumentacion(response.data)
        setEmpleadoTipoDocumentacion(response.data[0].id)
    }

    const registrar = ()=>{
        /*e.preventDefault()
        const response = await axios.post(endPoint, {categoria_id:categoria_id, nombre:nombre})

        if (response.status !== 200){
            console.log(response.data)
            alert(response.data.Error)  
        }
        navigate('/')*/
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
                    value={empleadoTipoDocumentacion}
                    onChange={(e)=> setEmpleadoTipoDocumentacion(e.target.value)}
                    type='number'
                    className='select'
                    >
                        {tiposDocumentacion.map((elemento)=>
                            <option key={elemento.tipoDocumentacionId}>{elemento.tipoDocumentacionId}</option>
                        )}
                    </select>
                </div>


                <Button type='submit' color={'gradient'} ghost>Guardar</Button>
            </form>


        
       
    </div>
    )
}

export default AgregarEmpleado