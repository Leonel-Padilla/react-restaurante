
import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Input,Tooltip, Modal, Text } from '@nextui-org/react';
import buscarLupa from '../../img/buscar_lupa.png';
import lapizEditar from '../../img/lapiz_editar.png'


const endPoint = 'http://127.0.0.1:8000/api/Cargo'
const endPointUpdate = 'http://127.0.0.1:8000/api/updateCargo'
const endPointGet = 'http://127.0.0.1:8000/api/Cargo'


function MostrarCargos() {

  const [cargos, setCargos]                         = useState([])
  const navigate                                    = useNavigate()
  const [parametroBusqueda, setParametroBusqueda]   = useState('Seleccione')
  const [valorBusqueda, setValorBusqueda]           = useState()
  const [mensajeModal, setMensajeModal]             = useState('')
  const [tituloModal, setTituloModal]               = useState('')
  const [visible, setVisible]                       = useState(false)
  const [valorTooltip, setValorToolTip]             = useState(false)
  

  useEffect(()=>{

    getAllCargos()    

  }, [])

const getAllCargos = async ()=>{
    
    const response = await axios.get(endPoint)
    setCargos(response.data)
    //console.log(response.data) //DEV
}

//
const cambioEstado = async (cargo)=>{

  await axios.put(`${endPointUpdate}/${cargo.id}`, {cargoNombre: cargo.cargoNombre,
      cargoDescripcion: cargo.cargoDescripcion, estado: cargo.estado == 1? 0 : 1})

      getAllCargos()
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
                setCargos(array)
            }
            
          }else{
            const response = await axios.get(`${endPointGet}N/${valorBusqueda}`)
            console.log(response.data)
            
            const array = response.data
    
            if (array.length < 1){
                setTituloModal('Error')
                setMensajeModal('No hay cargos con el nombre que ingresó.')
                setVisible(true)
            }else{
                setCargos(array)
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

        <div className='d-flex justify-content-start pt-2 pb-2'
        style={{backgroundColor: 'whitesmoke'}} >
           
            <h1 className='ms-4 me-4' >Cargos</h1>

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
                placeholder={`ingrese ${parametroBusqueda}`}
                aria-label='aria-describedby'
                onChange={(e)=>setValorBusqueda(e.target.value)}
                type={parametroBusqueda == 'ID'? 'number':'text'}
                className='form-control'
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
            onClick={()=>getAllCargos()}>
                Llenar Tabla
            </Button>

            <Button 
            className='bg-dark text-light align-self-center'
            color={'dark'}
            bordered
            onClick={()=>navigate('/Cargos/addCargo')}>
                Registrar
            </Button>
        </div>


            <table className='table mt-2'> 
                <thead className='bg-dark text-white'> 
                    <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Opciones</th>
                    </tr>
                </thead>

                <tbody>
                    {cargos.map(cargo => 
                        
                        <tr key={cargo.id}>
                            <td>{cargo.id}</td>
                            <td>{cargo.cargoNombre}</td>
                            <td>{cargo.cargoDescripcion}</td>
                            <td>{cargo.estado == 1 ? 'Habilitado' : 'Deshabilitado'}</td>
                            <td>
                                <Button
                                className='mb-1'
                                color={'gradient'}
                                iconRight={<img src={lapizEditar}/>}
                                onClick={()=>navigate(`/Cargos/updateCargo/${cargo.id}`)}
                                    >Editar
                                </Button>

                                <Tooltip
                                placement='left'
                                initialVisible={false}
                                trigger='hover' 
                                visible = {valorTooltip}
                                content={<div>
                                            <p>Está seguro que desea cambiar este registro?</p> 

                                            <div style={{display: 'flex'}}>
                                            <Button 
                                            auto
                                            className='bg-dark text-light '
                                            color={'dark'}
                                            children={cargo.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
                                            onClick={()=>cambioEstado(cargo)}>
                                            </Button>


                                            </div>
                                            
                                        </div>}>
                                    <Button 
                                    light
                                    shadow
                                    children={cargo.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
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

export default MostrarCargos