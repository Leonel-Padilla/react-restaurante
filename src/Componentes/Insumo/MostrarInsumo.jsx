import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Tooltip, Modal, Text } from '@nextui-org/react';
import buscarLupa from '../../img/buscar_lupa.png';
import lapizEditar from '../../img/lapiz_editar.png'



const endPointGetInsumos        = 'http://127.0.0.1:8000/api/Insumo'
const endPointUpdateInsumos     = 'http://127.0.0.1:8000/api/updateInsumo'
const endPointGetAllProveedores = 'http://127.0.0.1:8000/api/Proveedor'
const MostrarInsumo = () =>{

    const [insumos, setInsumos]             = useState([])
    const [proveedores, setProveedores]     = useState([])
    let proveedorNombre                     = ''


    const [parametroBusqueda, setParametroBusqueda] = useState('Seleccione')
    const [valorBusqueda, setValorBusqueda] = useState()
    const [mensajeModal, setMensajeModal]   = useState('')
    const [tituloModal, setTituloModal]     = useState('')
    const [visible, setVisible]             = useState(false)
    const navigate                          = useNavigate()

    useEffect(()=>{
        getAllInsumos()
        getAllProveedores()
    }, [])

    //
    const getAllInsumos = async ()=>{
        const respose = await axios.get(endPointGetInsumos)
        setInsumos(respose.data)
    }

    //
    const getAllProveedores = async ()=>{
        const resposne = await axios.get(endPointGetAllProveedores)
        setProveedores(resposne.data)
    }

    //
    const formatearProveedor = (insumo)=>{
        proveedores.map((proveedor)=>{
            if (insumo.proveedorId == proveedor.id){
                proveedorNombre = proveedor.proveedorNombre
            }
        })
    }


    //
    const cambioEstado = async (insumo)=>{
        await axios.put(`${endPointUpdateInsumos}/${insumo.id}`, {proveedorId: insumo.proveedorId, insumoNombre: insumo.insumoNombre,
            insumoDescripcion: insumo.insumoDescripcion, cantidad: insumo.cantidad, cantidadMin: insumo.cantidadMin, 
            cantidadMax: insumo.cantidadMax, estado: insumo.estado == 1? 0 : 1})

        getAllInsumos()

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
              const response = await axios.get(`${endPointGetInsumos}/${valorBusqueda}`)
              
              if (response.status != 200){
                  setTituloModal('Error')
                  setMensajeModal(response.data.Error)
                  setVisible(true)
              }else{
                  const array = [response.data]
                  setInsumos(array)
              }
              
            }else{
              const response = await axios.get(`${endPointGetInsumos}N/${valorBusqueda}`)
              const array = response.data
      
              if (array.length < 1){
                  setTituloModal('Error')
                  setMensajeModal('No hay Insumos con el nombre que ingresó.')
                  setVisible(true)
              }else{
                  setInsumos(array)
              }
          }
      } 
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

            <div className='d-flex justify-content-start pt-2 pb-2' style={{backgroundColor: 'whitesmoke'}} >
                <h1 className='ms-4 me-4' >Insumos</h1>

                <select style={{height: '35px'}} 
                    className='align-self-center me-2'
                    onChange={(e)=>setParametroBusqueda(e.target.value)} 
                    >   
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
                    className='form-control me-2'
                    required={true}
                    title=''
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
            onClick={()=>getAllInsumos()}
            >Llenar Tabla
            </Button>

            <Button 
            className='bg-dark text-light align-self-center'
            color={'dark'}
            bordered
            onClick={()=>navigate('/Insumos/addInsumo')}>
                Registrar
            </Button>
            
        </div>

            <table className='table mt-2'> 
                <thead className='bg-dark text-white'> 
                    <tr>
                        <th>Id Insumo</th>
                        <th>Nombre Insumo</th>
                        <th>Proveedor</th>
                        <th>Cantidad actual</th>
                        <th>Estado</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                
                <tbody>
                {insumos.map((insumo)=>{
                    
                    formatearProveedor(insumo)

                    return(
                    <tr key={insumo.id}>
                        <td>{insumo.id}</td>
                        <td>{insumo.insumoNombre}</td>
                        <td>{proveedorNombre}</td>
                        <td>{insumo.cantidad}</td>
                        <td>{insumo.estado == 1 ? 'Habilitado' : 'Deshabilitado'}</td>

                        <td>
                            <Button
                            className='mb-1'
                            color={'gradient'}
                            iconRight={<img src={lapizEditar}/>}
                            onClick={()=>navigate(`/insumos/updateinsumo/${insumo.id}`)}
                                >Editar
                            </Button>

                            <Tooltip
                            placement='left'
                            initialVisible={false}
                            trigger='hover' 
                            content={<div>
                                        <p>Está seguro que desea cambiar este registro?</p> 

                                        <Button 
                                        auto
                                        className='bg-dark text-light'
                                        color={'dark'}
                                        children={insumo.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
                                        onClick={()=> cambioEstado(insumo)}
                                        ></Button>
                                        
                                    </div>}>
                                <Button 
                                light
                                shadow
                                children={insumo.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
                                color={'secondary'}
                                ></Button>
                            </Tooltip>

                        </td>
                    </tr>
                    )
                    })}

                </tbody>

            </table>
        </div>
    );
}

export default MostrarInsumo

