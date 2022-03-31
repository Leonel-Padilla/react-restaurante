import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Tooltip, Modal, Text } from '@nextui-org/react';
import buscarLupa from '../../img/buscar_lupa.png';
import lapizEditar from '../../img/lapiz_editar.png';
import moment from 'moment';


const endPointGetCompras    = 'http://127.0.0.1:8000/api/CompraEncabezado'
const endPointUpdateComrpra = 'http://127.0.0.1:8000/api/updateCompraEncabezado'
const endPointGetEmpleados  = 'http://127.0.0.1:8000/api/Empleado'

const MostrarCompras = ()=> {

  const [compras, setCompras]           = useState([])
  const [compraActual, setCompraACtual] = useState([])
  const [empleados, setEmpleados]       = useState([])
  let   nombreEmpleado                  = ''

  const [parametroBusqueda, setParametroBusqueda]   = useState('Seleccione')
  const [valorBusqueda, setValorBusqueda]           = useState('Seleccione')
  
  const [mensajeModal, setMensajeModal]   = useState('')
  const [tituloModal, setTituloModal]     = useState('')
  const [visible, setVisible]             = useState(false)
  const navigate                          = useNavigate()

  useEffect(()=>{
    getAllCompras()
    getAllEmpleados()
  },[])

  //
  const activarModal = (titulo, mensajeModal)=>{
    setTituloModal(titulo)
    setMensajeModal(mensajeModal)
    setVisible(true)
  }
  //
  const cambioEstado = async ()=>{
    //console.log(compraActual)

    const response = await axios.put(`${endPointUpdateComrpra}/${compraActual.id}`, {proveedorId: compraActual.proveedorId, 
        empleadoId: compraActual.empleadoId, fechaSolicitud: compraActual.fechaSolicitud, 
        fechaEntregaCompra: compraActual.fechaEntregaCompra, fechaPagoCompra: compraActual.fechaPagoCompra, 
        estadoCompra: compraActual.estadoCompra, numeroFactura: compraActual.numeroFactura, cai: compraActual.cai, 
        estado: compraActual.estado == 1? 0 : 1})

        //console.log(response.data)
        getAllCompras()
  }

  //
  const getAllCompras = async ()=>{
    const respose = await axios.get(endPointGetCompras)
    //console.log(respose.data)
    setCompras(respose.data)
  }
  //
  const getAllEmpleados = async ()=>{
    const response = await axios.get(endPointGetEmpleados)
    setEmpleados(response.data)
  }
  //
  const getByValorBusqueda = async (e)=>{
    e.preventDefault()
    if (parametroBusqueda.includes('Seleccione')){
        activarModal('Error','Seleccione un parametro de busqueda.' )

    }else{

        if (parametroBusqueda == 'ID'){
            const response = await axios.get(`${endPointGetCompras}/${valorBusqueda}`)
        
            if (response.status != 200){
                activarModal('Error', response.data.Error)
            }else{
                const array = [response.data]
                setCompras(array)
            }
            
        }else{

            if (valorBusqueda.includes('Seleccione')){
                activarModal('Error', 'Debe seleccionar un estado de busqueda.')
            }else{
                const response = await axios.get(`${endPointGetCompras}E/${valorBusqueda}`)
                
                const array = response.data
        
                if (array.length < 1){
                    activarModal('Error', 'No hay compras con ese estado.')
                }else{
                    setCompras(array)
                }
            }
        }
    }
  }

  const formatearIdEmpleado = (idEmpleado)=>{
    empleados.map((empleado)=>{
        if(empleado.id == idEmpleado){
            nombreEmpleado = empleado.empleadoNombre 
        }
    })
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
                            cambioEstado()
                            setVisible(false)
                            }}>
                            Cambiar
                        </Button>
                    </div>
                </div>
                }
            </Modal.Body>

        </Modal>

        {/*----------Cabecera*/}
        <div className='d-flex justify-content-start pt-2 pb-2'
        style={{backgroundColor: 'whitesmoke'}} >
           
            <h1 className='ms-4 me-4' >Compras</h1>

            <select style={{height: '35px'}}
            className='align-self-center me-2'
            onChange={(e)=>setParametroBusqueda(e.target.value)}>
                <option>Seleccione tipo busqueda</option>
                <option>ID</option>
                <option>Estado</option>
            </select>

             {/*Formulario de busqueda*/}   
            <form 
            className='d-flex align-self-center' 
            style={{left: '300px'}} 
            onSubmit={getByValorBusqueda}
            >
                {
                    parametroBusqueda != 'Estado'?
                    <input
                    placeholder={parametroBusqueda.includes('Seleccione')? '': `${parametroBusqueda}`}
                    aria-label='aria-describedby'
                    onChange={(e)=>setValorBusqueda(e.target.value)}
                    type={parametroBusqueda == 'ID'? 'number':'text'}
                    className='form-control'
                    required={true}
                    />
                    : 
                    <select className='select'
                    onChange={(e)=>setValorBusqueda(e.target.value)}>
                        <option>Seleccione un estado</option>
                        <option>Recibida</option>
                        <option>Pendiente</option>
                    </select>
                }

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
            style={{right: '0px'}}
            className='align-self-center ms-2 me-2' 
            auto onClick={()=>navigate('/MenuPrincipal')}>
                Regresar
            </Button>

            <Button
            auto
            color={"gradient"}
            bordered
            className='align-self-center me-2'
            onClick={()=>getAllCompras()}
            >
                Llenar Tabla
            </Button>

            <Button 
            className='bg-dark text-light align-self-center'
            color={'dark'}
            bordered
            onClick={()=>navigate('/Compras/addCompra')}>
                Registrar
            </Button>
        </div>


        {/*---------Tabla de compras*/}
        <table className='table mt-2'> 
            <thead className='bg-dark text-white'> 
                <tr>
                  <th>Id</th>
                  <th>Empleado</th>
                  <th>Fecha Solicitud</th>
                  <th>Fecha Pago</th>
                  <th>Fecha Recibida</th>
                  <th>Estado compra</th>
                  <th>Estado</th>
                  <th>Opciones</th>
                </tr>
            </thead>

            <tbody>
                {compras.map(compra =>{

                        formatearIdEmpleado(compra.empleadoId)
                        return(

                        <tr key={compra.id}>
                            <td>{compra.id}</td>
                            <td>{nombreEmpleado}</td>
                            <td>{moment(compra.fechaSolicitud).format("DD/MM/yy")}</td>
                            <td>{moment(compra.fechaEntregaCompra).format("DD/MM/yy")}</td>
                            <td>{moment(compra.fechaPagoCompra).format("DD/MM/yy")}</td>
                            <td>{compra.estadoCompra}</td>
                            <td>{compra.estado == 1 ? 'Habilitado' : 'Deshabilitado'}</td>
                            <td>
                                <Button
                                className='mb-1'
                                color={'gradient'}
                                iconRight={<img src={lapizEditar}/>}
                                onClick={()=>navigate(`/Compras/updateCompra/${compra.id}`)}
                                    >Editar
                                </Button>

                                <Button 
                                light
                                shadow
                                children={compra.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
                                color={'secondary'}
                                onClick={()=>{
                                    setCompraACtual(compra)
                                    activarModal('Cambiar', `¿Seguro que desea ${compra.estado == 1 ? 'deshabilitar' : 'habilitar'} este registro?`)
                                }}
                                ></Button>

                                {/* <Tooltip
                                placement='left'
                                initialVisible={false}
                                trigger='hover' 
                                content={<div>
                                            <p>Está seguro que desea cambiar este registro?</p> 

                                            <div style={{display: 'flex'}}>
                                            <Button 
                                            auto
                                            className='bg-dark text-light '
                                            color={'dark'}
                                            children={compra.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
                                            onClick={()=>cambioEstado(compra)}>
                                            </Button>


                                            </div>
                                            
                                        </div>}>
                                    <Button 
                                    light
                                    shadow
                                    children={compra.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
                                    color={'secondary'}
                                    ></Button>

                                    
                                </Tooltip> */}

                            </td>
                        </tr>)
                    })}
                </tbody>
            </table>

    </div>
  )
}

export default MostrarCompras