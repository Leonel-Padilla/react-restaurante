import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Tooltip, Modal, Text } from '@nextui-org/react';
import buscarLupa from '../../img/buscar_lupa.png';
import lapizEditar from '../../img/lapiz_editar.png'
import moment from 'moment';
import Logo from '../../img/LOGO.png';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx'
import 'jspdf-autotable'

const endPoint                      = 'http://127.0.0.1:8000/api/Empleado'
const endPointUpdate                = 'http://127.0.0.1:8000/api/updateEmpleado'
const endPointGetEmpleados          = 'http://127.0.0.1:8000/api/Empleado'
const endPointBuscarTodosDocumentos = 'http://127.0.0.1:8000/api/TipoDocumento'

const MostrarEmpleados = ({ accesos })=>{
    const [empleados, setEmpleados]                 = useState([])
    const [empleadoActual, setEmpleadoActual]       = useState()
    const navigate                                  = useNavigate()
    const [todosDocumentos, setTodosDocumentos]     = useState([])
    const [parametroBusqueda, setParametroBusqueda] = useState('Seleccione')
    const [valorBusqueda, setValorBusqueda]         = useState()
    const [mensajeModal, setMensajeModal]           = useState('')
    const [tituloModal, setTituloModal]             = useState('')
    const [visible, setVisible]                     = useState(false)
    let tipoDocumento = ''
    const date = new Date()

    useEffect(()=>{
        getAllEmpleados()
        getAllDocumentos()
    },[])

    //
    const activarModal = (titulo, mensajeModal)=>{
        setTituloModal(titulo)
        setMensajeModal(mensajeModal)
        setVisible(true)
    }
    //
    const getAllEmpleados = async ()=>{
    
        const response = await axios.get(endPoint)
        setEmpleados(response.data)
        
    }
    //
    const cambioEstado = async (empleado)=>{

        const response = await axios.put(`${endPointUpdate}/${empleado.id}`, {...empleado, estado: empleado.estado === 1 ? 0 : 1})
        getAllEmpleados()
    }
    //
    const GetByValorBusqueda = async (e)=>{
        e.preventDefault()

        if (parametroBusqueda.includes('Seleccione')){
            setTituloModal('Error')
            setMensajeModal('Seleccione un parametro de busqueda.')
            setVisible(true)
        }else{
            if (parametroBusqueda == 'ID'){
                const response = await axios.get(`${endPointGetEmpleados}/${valorBusqueda}`)
                //console.log(response.data)
                
                if (response.status != 200){
                    setTituloModal('Error')
                    setMensajeModal(response.data.Error)
                    setVisible(true)
                }else{
                    const array = [response.data]
                    setEmpleados(array)
                }
                
            }else if (parametroBusqueda == 'Nombre'){
                const response = await axios.get(`${endPointGetEmpleados}N/${valorBusqueda}`)
                //console.log(response.data)
                
                const array = response.data
        
                if (array.length < 1){
                    setTituloModal('Error')
                    setMensajeModal('No hay Empleados con el nombre que ingresó.')
                    setVisible(true)
                }else{
                    setEmpleados(array)
                }
            }else{
                const response = await axios.get(`${endPointGetEmpleados}ND/${valorBusqueda}`)
                //console.log(response.data)
                
                const array = response.data
        
                if (array.length < 1){
                    setTituloModal('Error')
                    setMensajeModal('No hay Empleados con el numero de documento que ingresó.')
                    setVisible(true)
                }else{
                    setEmpleados(array)
                }

            }
        }
    }

    const getNumeroDocumento = (empleado)=>{
        todosDocumentos.map((documento)=>{
            if (documento.id == empleado.tipoDocumentoId){
                tipoDocumento = documento.nombreDocumento
            }
        })
    }

    const getAllDocumentos = async ()=>{
        const response = await axios.get(endPointBuscarTodosDocumentos)
        setTodosDocumentos(response.data)

    }

    //
    const createExcel = ()=>{
        const libro = XLSX.utils.book_new()
    
        const copiaDatos = [...empleados]
        copiaDatos.map((dato)=>{
            dato.estado = dato.estado == 1? 'Habilitado' : 'Desabilitado'
    
            delete dato.created_at
            delete dato.updated_at
            delete dato.sucursalId
            delete dato.fechaBloqueo
            delete dato.fechaNacimiento
            delete dato.cargoActualId
            delete dato.empleadoContrasenia
            delete dato.empleadoDireccion
            delete dato.estado
            delete dato.empleadoSueldo
            
            dato.fechaContratacion = moment(dato.fechaContratacion).format("DD/MM/yy")

            getNumeroDocumento(dato)
            dato.tipoDocumentoId = tipoDocumento
        })
    
        const pagina = XLSX.utils.json_to_sheet(copiaDatos, {origin: 'A3'})
    
        XLSX.utils.sheet_add_aoa(pagina, [[`Usuario: ${sessionStorage.getItem('userName')}`, 
        `Fecha: ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
        `Hora: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`]],
        {origin: `B1`})
    
        XLSX.utils.book_append_sheet(libro, pagina, 'Empleados')
        pagina["!cols"] = [ 
            {wch: 3},
            {wch: 20},
            {wch: 20},
            {wch: 20},
            {wch: 20},
            {wch: 20},
            {wch: 20},
            {wch: 20}
        ];
        XLSX.utils.sheet_add_aoa(pagina, [['Tipo Documento', 'Número Documento', 'Nombre', 'Número', 'Correo', 'Usuario', 
        'Fecha Contratación']], {origin: 'B3'})
    
        XLSX.writeFile(libro, 'Reporte Empleados.xlsx')
    }

    //
    const createPDF = ()=>{
        const copiaDatos = [...empleados]
        copiaDatos.map((dato)=>{
            dato.estado = dato.estado == 1? 'Habilitado' : 'Desabilitado'
    
            delete dato.created_at
            delete dato.updated_at
            delete dato.sucursalId
            delete dato.fechaBloqueo
            delete dato.fechaNacimiento
            delete dato.cargoActualId
            delete dato.empleadoContrasenia
            delete dato.empleadoDireccion
            delete dato.estado
            delete dato.empleadoSueldo
            
            dato.fechaContratacion = moment(dato.fechaContratacion).format("DD/MM/yy")

            getNumeroDocumento(dato)
            dato.tipoDocumentoId = tipoDocumento
        })

        const matrizDeDatos = []
        let repeticiones = 0 


        if(Number.isInteger(copiaDatos.length/30)){
            repeticiones = (copiaDatos.length/30)
        }else{
            repeticiones = Math.trunc((copiaDatos.length/30)+1)
        }

        for (let i = 0; i < repeticiones; i++){
            const array = copiaDatos.slice(i*30, (i+1)*30)
            matrizDeDatos.push(array)
        }
    
        
        const doc = new jsPDF({
            format: 'a4'
        })

        matrizDeDatos.map((array, index)=>{

            
            doc.setFontSize(15)
            doc.text(`Reporte Empleados`, 70, 10)
            doc.text(`FIVE FORKS`, 70, 20)
            doc.addImage(Logo, 'JPEG', 120, 0, 30, 30)
            
            doc.setFontSize(10)
            doc.text(`Usuario: ${sessionStorage.getItem('userName')}`, 165, 10)
            doc.text(`Fecha: ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`, 165, 15)
            doc.text(`Hora: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`, 165, 20)
            doc.text('--------------------------------------------------------------------------------'+
            '------------------------------------------------------------------------',
            15, 35)

            doc.autoTable({
                head: [['Id', 'Tipo Documento', 'Número Documento', 'Nombre', 'Número', 'Correo', 'Usuario', 
                'Fecha Contratación']],
            
                body: array.map((dato)=> Object.values(dato)),
                startY: 40,
            })
                            
            doc.text('--------------------------------------------------------------------------------'+
            '------------------------------------------------------------------------',
            15, 280)
            doc.text(`${index+1} / ${repeticiones}`, 185, 285)
            
            if ((index+1 != repeticiones)){
                doc.addPage()
            }
        })

        doc.save('Reporte Empleados')
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
            {tituloModal.includes('Error')?     //IF ERROR
                mensajeModal
                :                                   //ELSE ELIMINAR
                <div>
                    {mensajeModal}

                    <div className='d-flex mt-3'>
                        <Button
                        className='me-3 ms-5'
                        auto
                        onClick={()=>{
                            setVisible(false)
                        }}>
                            Cancelar
                        </Button>

                        <Button
                        className='ms-5'
                        auto
                        onClick={()=>{
                            cambioEstado(empleadoActual)
                            setVisible(false)
                            }}>
                            Cambiar
                        </Button>
                    </div>
                </div>}
            </Modal.Body>

        </Modal>
        
        <div className='d-flex justify-content-start pt-2 pb-2'
        style={{backgroundColor: 'whitesmoke'}} >
            
            <h1 className='ms-4 me-4' >Empleado</h1>

            <select style={{height: '35px'}}
            className='align-self-center me-2'
            onChange={(e)=>setParametroBusqueda(e.target.value)}>
                <option>Seleccione Tipo Búsqueda</option>
                <option value="ID">ID</option>
                <option value="Nombre">Nombre</option>
                <option value="Numero Documento">Numero Documento</option>
            </select>

            <form 
            className='d-flex align-self-center' 
            style={{left: '300px'}} 
            onSubmit={(e) => {
                if (Number(accesos.buscar) === 0){
                    e.preventDefault()
                    activarModal('Error', 'No tienes permisos para realizar esta acción.')
                }else{
                    GetByValorBusqueda(e)
                }
            }}>
                <input
                placeholder={parametroBusqueda.includes('Seleccione')? '': 
                parametroBusqueda == 'ID'? 'ID': parametroBusqueda == 'Nombre'? 'Nombre': 'Numero Documento'}
                aria-label='aria-describedby'
                onChange={(e)=>setValorBusqueda(e.target.value)}
                type={parametroBusqueda == 'ID'? 'number': 'text'}
                className='form-control me-2'
                required={true}
                //pattern={parametroBusqueda == 'Nombre'? '[A-Za-z ]{3,}':''}
                />
                <Button
                auto
                className='ms-2'
                color={'gradient'}
                icon={<img src={buscarLupa}/>}
                type={'submit'}>
                    Buscar
                </Button>
            </form>
            <Button 
            color={'gradient'}
            bordered
            className='align-self-center ms-2 me-2' 
            auto onClick={()=>navigate('/MenuPrincipal')}>
                Regresar
            </Button>

            <Button
            auto
            color={"gradient"}
            bordered
            className='align-self-center me-2'
            onClick={()=>getAllEmpleados()}>
                Llenar Tabla
            </Button>

            <Button 
            className='bg-dark text-light align-self-center'
            color={'dark'}
            bordered
            onClick={()=>navigate('/Empleados/addEmpleado')}>
            Registrar
            </Button>

            <Button 
                auto
                color={'gradient'}
                bordered
                style={{right: '0px'}}
                className='align-self-center ms-2 me-2' 
                onClick={()=>{
                    if (Number(accesos.imprimirReportes) === 0){
                        activarModal('Error', 'No tienes permisos para realizar esta acción.')
                    }else{
                        createPDF()
                    }
                }}
                >Reporte PDF
            </Button>

            <Button 
                auto
                color={'gradient'}
                bordered
                style={{right: '0px'}}
                className='align-self-center ms-2 me-2' 
                onClick={()=>{
                    if (Number(accesos.imprimirReportes) === 0){
                        activarModal('Error', 'No tienes permisos para realizar esta acción.')
                    }else{
                        createExcel()
                    }
                }}
                >Reporte Excel
            </Button>
        </div>

            
        <table className='table mt-2'> 
            <thead className='bg-dark text-white'> 
                <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Usuario</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Fecha contratación</th>
                    <th>Tipo documento</th>
                    <th>Número Documento</th>
                    <th>Estado</th>
                    <th>Opciones</th>
                </tr>
            </thead>

            <tbody>
                {empleados.map(empleado =>{
                    
                    getNumeroDocumento(empleado)

                    return(
                    <tr key={empleado.id}>
                        <td>{empleado.id}</td>
                        <td>{empleado.empleadoNombre}</td>
                        <td>{empleado.empleadoUsuario}</td>
                        <td>{empleado.empleadoNumero}</td>
                        <td>{empleado.empleadoCorreo}</td>
                        <td>{moment(empleado.fechaContratacion).format("DD/MM/yy")}</td>
                        <td>{tipoDocumento}</td>
                        <td>{empleado.numeroDocumento}</td>
                        <td>{empleado.estado == 1 ? 'Habilitado' : 'Deshabilitado'}</td>
                        
                        <td>
                            <Button
                            className='mb-1'
                            color={'gradient'}
                            iconRight={<img src={lapizEditar}/>}
                            onClick={()=>navigate(`/Empleados/updateEmpleado/${empleado.id}`)}
                                >Editar
                            </Button>

                            <Button 
                            light
                            shadow
                            children={empleado.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
                            color={'secondary'}
                            onClick={()=>{
                                if (Number(accesos.actualizar) === 0){
                                    activarModal('Error', 'No tienes permisos para realizar esta acción.')
                                }else{
                                    setEmpleadoActual(empleado)
                                    activarModal('Cambiar', `¿Seguro que desea ${empleado.estado == 1 ? 'deshabilitar' : 'habilitar'} este registro?`)
                                }
                            }}
                            ></Button>


                        </td>
                    </tr>)})}
            </tbody>
        </table>

        

        </div>
    )
}

export default MostrarEmpleados
