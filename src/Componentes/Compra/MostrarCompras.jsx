import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Tooltip, Modal, Text } from '@nextui-org/react';
import buscarLupa from '../../img/buscar_lupa.png';
import lapizEditar from '../../img/lapiz_editar.png'


const endPointGetCompras = ''

const MostrarCompras = ()=> {

  const [compras, setCompras] = useState([])

  const [parametroBusqueda, setParametroBusqueda]   = useState('Seleccione')
  const [valorBusqueda, setValorBusqueda]           = useState()
  
  const [mensajeModal, setMensajeModal]   = useState('')
  const [tituloModal, setTituloModal]     = useState('')
  const [visible, setVisible]             = useState(false)
  const navigate                          = useNavigate()

  useEffect(()=>[
    getAllCompras()
  ],[])

  //
  const activarModal = (titulo, mensajeModal)=>{
    setTituloModal(titulo)
    setMensajeModal(mensajeModal)
    setVisible(true)
  }
  //
  const cambioEstado = async ()=>{

  }

  //
  const getAllCompras = async ()=>{
    

  }

  //
  const getByValorBusqueda = async ()=>{

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

        {/*----------Cabecera*/}
        <div className='d-flex justify-content-start pt-2 pb-2'
        style={{backgroundColor: 'whitesmoke'}} >
           
            <h1 className='ms-4 me-4' >Compras</h1>

            <select style={{height: '35px'}}
            className='align-self-center me-2'
            onChange={(e)=>setParametroBusqueda(e.target.value)}>
                <option>Seleccione tipo busqueda</option>
                <option>ID</option>
                <option>Nombre</option>
            </select>

            <form 
            className='d-flex align-self-center' 
            style={{left: '300px'}} 
            onSubmit={getByValorBusqueda}
            >
                <input
                placeholder={parametroBusqueda.includes('Seleccione')? '': `${parametroBusqueda}`}
                aria-label='aria-describedby'
                onChange={(e)=>setValorBusqueda(e.target.value)}
                type={parametroBusqueda == 'ID'? 'number':'text'}
                className='form-control'
                required={true}
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
                {compras.map(compra => 
                        
                        <tr key={compra.id}>
                            <td>{compra.id}</td>
                            <td>{compra.estado == 1 ? 'Habilitado' : 'Deshabilitado'}</td>
                            <td>
                                <Button
                                className='mb-1'
                                color={'gradient'}
                                iconRight={<img src={lapizEditar}/>}
                                onClick={()=>navigate(`/Compras/updateMesa/${compra.id}`)}
                                    >Editar
                                </Button>

                                <Tooltip
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

                                    
                                </Tooltip>

                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

    </div>
  )
}

export default MostrarCompras