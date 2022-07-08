import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Tooltip, Modal, Text } from '@nextui-org/react';
import buscarLupa from '../../img/buscar_lupa.png';
import lapizEditar from '../../img/lapiz_editar.png'
import Logo from '../../img/LOGO.png';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx'
import 'jspdf-autotable'

const endPoint = 'http://127.0.0.1:8000/api/Proveedor'
const endPointUpdate = 'http://127.0.0.1:8000/api/updateProveedor'
const endPointGet = 'http://127.0.0.1:8000/api/Proveedor'

const MostrarProveedores = ()=>{
    const [proveedores, setProveedores] = useState([])
    const [proveedorActual, setProveedorActual] = useState()

    const navigate = useNavigate()
    const [parametroBusqueda, setParametroBusqueda] = useState('Seleccione')
    const [valorBusqueda, setValorBusqueda] = useState()
    const [mensajeModal, setMensajeModal] = useState('')
    const [tituloModal, setTituloModal] = useState('')
    const [visible, setVisible] = useState(false)
    const date = new Date()

    useEffect(()=>{
        getAllProveedores()
    }, [])


    //
    const activarModal = (titulo, mensajeModal)=>{
        setTituloModal(titulo)
        setMensajeModal(mensajeModal)
        setVisible(true)
    }
    //
    const getAllProveedores = async ()=>{
        const response = await axios.get(endPoint)
        setProveedores(response.data)
    }
    //
    const cambioEstado = async (proveedor)=>{

    await axios.put(`${endPointUpdate}/${proveedor.id}`, {proveedorNombre: proveedor.proveedorNombre, 
        proveedorNumero: proveedor.proveedorNumero, proveedorCorreo: proveedor.proveedorCorreo,
        proveedorEncargado: proveedor.proveedorEncargado,  proveedorRTN: proveedor.proveedorRTN, 
        estado: proveedor.estado == 1? 0 : 1})

        getAllProveedores()
    }

    //
    const getByValorBusqueda = async (e)=>{
        e.preventDefault()

        if (parametroBusqueda.includes('Seleccione')){
            setTituloModal('Error')
            setMensajeModal('Seleccione un parametro de busqueda.')
            setVisible(true)
        }else{
            if (parametroBusqueda == 'ID'){
                const response = await axios.get(`${endPointGet}/${valorBusqueda}`)
                
                if (response.status != 200){
                    setTituloModal('Error')
                    setMensajeModal(response.data.Error)
                    setVisible(true)
                }else{
                    const array = [response.data]
                    setProveedores(array)
                }
                
              }else{
                const response = await axios.get(`${endPointGet}N/${valorBusqueda}`)
                console.log(response.data)
                
                const array = response.data
        
                if (array.length < 1){
                    setTituloModal('Error')
                    setMensajeModal('No hay proveedor con el nombre que ingresó.')
                    setVisible(true)
                }else{
                    setProveedores(array)
                }
            }
        }

    }

     //
     const createExcel = ()=>{
        const libro = XLSX.utils.book_new()
    
        const copiaDatos = [...proveedores]
        copiaDatos.map((dato)=>{
            dato.estado = dato.estado == 1? 'Habilitado' : 'Desabilitado'
    
            delete dato.created_at
            delete dato.updated_at
        })
    
        const pagina = XLSX.utils.json_to_sheet(copiaDatos, {origin: 'A3'})
    
        XLSX.utils.sheet_add_aoa(pagina, [[`Usuario: ${sessionStorage.getItem('userName')}`, 
        `Fecha: ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
        `Hora: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`]],
        {origin: `B1`})
    
        XLSX.utils.book_append_sheet(libro, pagina, 'Proveedores')
        pagina["!cols"] = [ 
            {wch: 3},
            {wch: 20},
            {wch: 20},
            {wch: 20},
            {wch: 20},
            {wch: 20},
            {wch: 20}
        ];
        XLSX.utils.sheet_add_aoa(pagina, [['Nombre', 'Número', 'Correo', 'Encargado', 'RTN', 'Estado']], {origin: 'B3'})
    
        XLSX.writeFile(libro, 'Reporte Proveedores.xlsx')
    }

    //
    const createPDF = ()=>{
        const copiaDatos = [...proveedores]
        copiaDatos.map((dato)=>{
            dato.estado = dato.estado == 1? 'Habilitado' : 'Desabilitado'
    
            delete dato.created_at
            delete dato.updated_at


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
            doc.text(`Reporte Proveedores`, 70, 10)
            doc.text(`FIVE FORKS`, 70, 20)
            doc.addImage(Logo, 'JPEG', 105, 0, 30, 30)
            
            doc.setFontSize(10)
            doc.text(`Usuario: ${sessionStorage.getItem('userName')}`, 165, 10)
            doc.text(`Fecha: ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`, 165, 15)
            doc.text(`Hora: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`, 165, 20)
            doc.text('--------------------------------------------------------------------------------'+
            '------------------------------------------------------------------------',
            15, 35)

            doc.autoTable({
                head: [['Id', 'Nombre', 'Número', 'Correo', 'Encargado', 'RTN', 'Estado']],
            
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

        doc.save('Reporte Proveedores')
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
                            cambioEstado(proveedorActual)
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

           
            <h1 className='ms-4 me-4' >Proveedor</h1>

            <select style={{height: '35px'}}
            className='align-self-center me-2'
            onChange={(e)=>setParametroBusqueda(e.target.value)}>
                <option>Seleccione Tipo Busqueda</option>
                <option value="ID">ID</option>
                <option value="Nombre">Nombre</option>
            </select>

            <form 
            className='d-flex align-self-center' 
            style={{left: '300px'}} 
            onSubmit={getByValorBusqueda}>
                <input
                    placeholder={parametroBusqueda.includes('Seleccione')? '': `${parametroBusqueda}`}
                    aria-label='aria-describedby'
                    onChange={(e)=>setValorBusqueda(e.target.value)}
                    type={parametroBusqueda == 'ID'? 'number':'text'}
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
            onClick={()=>getAllProveedores()}>
                Llenar Tabla
            </Button>

            <Button 
            className='bg-dark text-light align-self-center'
            color={'dark'}
            bordered
            onClick={()=>navigate('/Proveedores/addProveedor')}>
                Registrar
            </Button>
            
            <Button 
                auto
                color={'gradient'}
                bordered
                style={{right: '0px'}}
                className='align-self-center ms-2 me-2' 
                onClick={()=>createPDF()}
                >Reporte PDF
            </Button>

            <Button 
                auto
                color={'gradient'}
                bordered
                style={{right: '0px'}}
                className='align-self-center ms-2 me-2' 
                onClick={()=>createExcel()}
                >Reporte Excel
            </Button>
        </div>


            <table className='table mt-2'> 
                <thead className='bg-dark text-white'> 
                    <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Número</th>
                        <th>Correo</th>
                        <th>Encargado</th>
                        <th>Estado</th>
                        <th>RTN</th>
                        <th>Opciones</th>
                    </tr>
                </thead>

                <tbody>
                    {proveedores.map(proveedor => 
                        
                        <tr key={proveedor.id}>
                            <td>{proveedor.id}</td>
                            <td>{proveedor.proveedorNombre}</td>
                            <td>{proveedor.proveedorNumero}</td>
                            <td>{proveedor.proveedorCorreo}</td>
                            <td>{proveedor.proveedorEncargado}</td>
                            <td>{proveedor.estado == 1 ? 'Habilitado' : 'Deshabilitado'}</td>
                            <td>{proveedor.proveedorRTN}</td>
                            <td>
                                <Button
                                className='mb-1'
                                color={'gradient'}
                                iconRight={<img src={lapizEditar}/>}
                                onClick={()=>navigate(`/Proveedores/updateProveedor/${proveedor.id}`)}
                                    >Editar
                                </Button>

                                <Button 
                                light
                                shadow
                                children={proveedor.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
                                color={'secondary'}
                                onClick={()=>{
                                    setProveedorActual(proveedor)
                                    activarModal('Cambiar', `¿Seguro que desea ${proveedor.estado == 1 ? 'deshabilitar' : 'habilitar'} este registro?`)
                                }}
                                ></Button>

                            </td>
                        </tr>
                    )}
                </tbody>
            </table>


        </div>
    )
}

export default MostrarProveedores