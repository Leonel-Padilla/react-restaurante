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

const endPointGetMesas      = 'http://127.0.0.1:8000/api/Mesa'
const endPointUpdateMesa    = 'http://127.0.0.1:8000/api/updateMesa'
const endPointGetSucursal   = 'http://127.0.0.1:8000/api/Sucursal'

const MostrarMesas = ({ accesos })=>{
    const [parametroBusqueda, setParametroBusqueda]   = useState('Seleccione')
    const [valorBusqueda, setValorBusqueda]           = useState('')
    const [sucursales, setSucursales]                 = useState([]) 
    let sucursalNombre                                = ''
    let sucursalId                                    = 0 

    const [mesas, setMesas]                 = useState([])
    const [mesaActual, setMesaActual]       = useState()
    const [mensajeModal, setMensajeModal]   = useState('')
    const [tituloModal, setTituloModal]     = useState('')
    const [visible, setVisible]             = useState(false)
    const navigate                          = useNavigate()
    const date = new Date()

    useEffect(()=>{
        getAllMesas()
        getAllSucursales()
    }, [])


    //
    const activarModal = (titulo, mensajeModal)=>{
        setTituloModal(titulo)
        setMensajeModal(mensajeModal)
        setVisible(true)
    }
    //
    const getAllMesas = async ()=>{
        const response = await axios.get(endPointGetMesas)
        setMesas(response.data)
    }

    //
    const cambioEstado = async (mesa)=>{
        const response = await axios.put(`${endPointUpdateMesa}/${mesa.id}`, {sucursalId: mesa.sucursalId, 
        cantidadAsientos: mesa.cantidadAsientos, descripcion: mesa.descripcion, numero: mesa.numero,
        estado: mesa.estado == 1? 0 : 1})
        
        console.log(response.data)
        
        getAllMesas()
    }

    const formatearSucursalNombre = (nombreSucursal)=>{
        sucursales.map((sucursal)=>{
            if (sucursal.sucursalNombre == nombreSucursal){
                sucursalId = sucursal.id
            }
        })
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
            const response = await axios.get(`${endPointGetMesas}/${valorBusqueda}`)
            
            if (response.status != 200){
                setTituloModal('Error')
                setMensajeModal(response.data.Error)
                setVisible(true)
            }else{
                const array = [response.data]
                setMesas(array)
            }
            
          }else{
            formatearSucursalNombre(valorBusqueda)
            const response = await axios.get(`${endPointGetMesas}N/${sucursalId}`)
            //console.log(response.data)

            const array = response.data

            if (array.length < 1){
                setTituloModal('Error')
                setMensajeModal('No hay sucursales con el nombre que ingresó.')
                setVisible(true)
            }else{
                setMesas(array)
            }
          }
    }
      
  }    

    //
    const getAllSucursales = async()=>{
        const response = await axios.get(endPointGetSucursal)
        setSucursales(response.data)
    }

    //
    const formatearSucursalId = (mesa)=>{
        sucursales.map((sucursal)=>{
            if (sucursal.id == mesa.sucursalId){
                sucursalNombre = sucursal.sucursalNombre
            }
        })
    }

    //
    const createExcel = ()=>{
        const libro = XLSX.utils.book_new()
    
        const copiaDatos = [...mesas]
        copiaDatos.map((dato)=>{
            dato.estado = dato.estado == 1? 'Habilitado' : 'Desabilitado'
    
            delete dato.created_at
            delete dato.updated_at
            delete dato.descripcion

            formatearSucursalId(dato)
            dato.sucursalId = sucursalNombre
        })
    
        const pagina = XLSX.utils.json_to_sheet(copiaDatos, {origin: 'A3'})
    
        XLSX.utils.sheet_add_aoa(pagina, [[`Usuario: ${sessionStorage.getItem('userName')}`, 
        `Fecha: ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
        `Hora: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`]],
        {origin: `B1`})
    
        XLSX.utils.book_append_sheet(libro, pagina, 'Mesas')
        pagina["!cols"] = [ 
            {wch: 3},
            {wch: 20},
            {wch: 20},
            {wch: 20},
        ];
        XLSX.utils.sheet_add_aoa(pagina, [['Nombre Sucursal', 'Cantidad Asientos', 'Número Mesa', 'Estado']], {origin: 'B3'})
    
        XLSX.writeFile(libro, 'Reporte Mesas.xlsx')
    }

    //
    const createPDF = ()=>{
        const copiaDatos = [...mesas]
        copiaDatos.map((dato)=>{
            dato.estado = dato.estado == 1? 'Habilitado' : 'Desabilitado'
    
            delete dato.created_at
            delete dato.updated_at
            delete dato.descripcion

            formatearSucursalId(dato)
            dato.sucursalId = sucursalNombre
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
            doc.text(`Reporte Mesas`, 70, 10)
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
                head: [['Id', 'Nombre Sucursal', 'Cantidad Asientos', 'Número Mesa', 'Estado']],
            
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

        doc.save('Reporte Mesas')
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
                            cambioEstado(mesaActual)
                            setVisible(false)
                            }}>
                            Cambiar
                        </Button>
                    </div>
                </div>}
                </Modal.Body>

            </Modal>


            <div className='d-flex justify-content-start pt-2 pb-2' style={{backgroundColor: 'whitesmoke'}} >
                <h1 className='ms-4 me-4' >Mesas</h1>

                <select style={{height: '35px'}} 
                    className='align-self-center me-2'
                    onChange={(e)=>setParametroBusqueda(e.target.value)} 
                >
                    <option>Seleccione tipo busqueda</option>
                    <option>ID</option>                
                    <option>Sucursal Nombre</option>
                </select>

            <form 
            className='d-flex align-self-center' 
            style={{left: '300px'}} 
            onSubmit={(e) => {
                if (Number(accesos.buscar) === 0){
                    e.preventDefault()
                    activarModal('Error', 'No tienes permisos para realizar esta acción.')
                }else{
                    getByValorBusqueda(e)
                }
            }}>
                <input
                    placeholder={parametroBusqueda.includes('Seleccione')? '': `${parametroBusqueda}`}
                    aria-label='aria-describedby'
                    onChange={(e)=>setValorBusqueda(e.target.value)}
                    type={parametroBusqueda == 'ID'? 'number':'text'}
                    className='form-control me-2'
                    required={true}
                    title='Solo se aceptan letras, ejem: "La Colonia"'
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
            onClick={()=>getAllMesas()}
            >Llenar Tabla
            </Button>

            <Button 
            className='bg-dark text-light align-self-center'
            color={'dark'}
            bordered
            onClick={()=>navigate('/Mesas/addMesa')}>
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
                        <th>Id Mesa</th>
                        <th>Número Mesa</th>
                        <th>Cantidad de asientos</th>
                        <th>Sucursal nombre</th>
                        <th>Estado</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                
                <tbody>

                    {mesas.map((mesa)=>{

                        formatearSucursalId(mesa)

                     return(   
                    <tr key={mesa.id}>
                        <td>{mesa.id}</td>
                        <td>{mesa.numero}</td>
                        <td>{mesa.cantidadAsientos}</td>
                        <td>{sucursalNombre}</td>
                        <td>{mesa.estado == 1 ? 'Habilitado' : 'Deshabilitado'}</td>

                        <td>
                            <Button
                            className='mb-1'
                            color={'gradient'}
                            iconRight={<img src={lapizEditar}/>}
                            onClick={()=>navigate(`/Mesas/updateMesa/${mesa.id}`)}
                                >Editar
                            </Button>

                            <Button 
                            light
                            shadow
                            children={mesa.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
                            color={'secondary'}
                            onClick={()=>{
                                if (Number(accesos.actualizar) === 0){
                                    activarModal('Error', 'No tienes permisos para realizar esta acción.')
                                }else{
                                    setMesaActual(mesa)
                                    activarModal('Cambiar', `¿Seguro que desea ${mesa.estado == 1 ? 'deshabilitar' : 'habilitar'} este registro?`)
                                }
                            }}
                            ></Button>

                        </td>
                    </tr>)
                    })}

                </tbody>

            </table>
        </div>
    );
}

export default MostrarMesas
