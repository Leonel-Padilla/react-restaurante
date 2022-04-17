import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Input,Tooltip, Modal, Text, } from '@nextui-org/react';
import buscarLupa from '../../img/buscar_lupa.png';
import lapizEditar from '../../img/lapiz_editar.png'

const endPointGetImpusto    = 'http://127.0.0.1:8000/api/Impuesto'
const endPointUpdateImpusto = 'http://127.0.0.1:8000/api/updateImpuesto'
function MostrarImpuestos() {
  const [impuestos, setImpuestos]           = useState([])
  const [impuestoActual, setImpuestoActual] = useState({})

  const [parametroBusqueda, setParametroBusqueda]   = useState('Seleccione')
  const [valorBusqueda, setValorBusqueda]           = useState('Seleccione')
  

  const [mensajeModal, setMensajeModal]   = useState('')
  const [tituloModal, setTituloModal]     = useState('')
  const [visible, setVisible]             = useState(false)
  const navigate                          = useNavigate()

  useEffect(()=>{
    getAllImpuestos()
  },[])

  //
  const activarModal = (titulo, mensajeModal)=>{
    setTituloModal(titulo)
    setMensajeModal(mensajeModal)
    setVisible(true)
  }
  //
  const getAllImpuestos = async () => {
    const response = await axios.get(endPointGetImpusto)
    setImpuestos(response.data)
    //console.log(response.data)
  }
  //
  const cambioEstado = async (impuesto)=>{
    impuesto.estado = impuesto.estado === 1 ? 0 : 1

    const response = await axios.put(`${endPointUpdateImpusto}/${impuesto.id}`, impuesto)

    getAllImpuestos()
  }
  //
  const getByValorBusqueda = async (e)=>{
    e.preventDefault()
  
    if (parametroBusqueda.includes('Seleccione')){
      activarModal('Error', 'Seleccione un parametro de busqueda.')
    }else{
  
      if (parametroBusqueda == 'ID'){
        const response = await axios.get(`${endPointGetImpusto}/${valorBusqueda}`)
        console.log(response.data)
                
        if (response.status != 200){
          activarModal('Error', `${response.data.Error}`)
        }else{
          const array = [response.data]
          setImpuestos(array)
        }
                
      }else{
        /*const response = await axios.get(`${endPointGetComentarios}S/${idSucursal}`)
        const array = response.data
        
        if (array.length < 1){
          activarModal('Error', 'No hay Comentarios en la sucursal ingresada.')
        }else{
          setComentarios(array)
        }*/
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
          {tituloModal.includes('Error')?     //IF ERROR
            mensajeModal
          :                               //ELSE ELIMINAR
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
                  cambioEstado(impuestoActual)
                  setVisible(false)
                }}>
                  Cambiar
                </Button>
              </div>

            </div>}
        </Modal.Body>
      </Modal>

      <div className='d-flex justify-content-start pt-2 pb-2' style={{backgroundColor: 'whitesmoke'}} >
        <h1 className='ms-4 me-4' >Impuestos</h1>

        <select style={{height: '35px'}} 
        className='align-self-center me-2'
        onChange={(e)=>setParametroBusqueda(e.target.value)}>   
          <option>Seleccione tipo busqueda</option>
          <option>ID</option>
        </select>

        {/*------Fomulario de busqueda */}
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
          title=''/> 
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
        onClick={()=>getAllImpuestos()}>
          Llenar Tabla
        </Button>

        <Button 
        className='bg-dark text-light align-self-center'
        color={'dark'}
        bordered
        onClick={()=>navigate('/Impuestos/addImpuesto')}>
          Registrar  
        </Button>

      </div>


      <table className='table mt-2'> 
        <thead className='bg-dark text-white'>
          <tr>
            <th>Id</th>
            <th>Nombre Impuesto</th>
            <th>Valor Impuesto</th>
            <th>Estado</th>
            <th>Opciones</th>
          </tr>
        </thead>
                
        <tbody>
          {impuestos.map(impuesto => {

            return(
              <tr key={impuesto.id}>
                <td>{impuesto.id}</td>
                <td>{impuesto.nombreImpuesto}</td>
                <td>{impuesto.valorImpuesto}</td>
                <td>{impuesto.estado == 1? 'Habilitado': 'Deshabilitado'}</td>
                <td>
                  <Button
                  className='mb-1'
                  color={'gradient'}
                  iconRight={<img src={lapizEditar}/>}
                  onClick={()=>navigate(`/Impuestos/updateImpuesto/${impuesto.id}`)}>
                    Editar
                  </Button>

                  <Button 
                  light
                  shadow
                  children={impuesto.estado == 1 ? 'Deshabilitar' : 'Habilitar'}
                  color={'secondary'}
                  onClick={()=>{
                    setImpuestoActual(impuesto)
                    activarModal('Cambiar', `¿Seguro que desea ${impuesto.estado == 1 ? 'deshabilitar' : 'habilitar'} este registro?`)}}>
                  </Button>
                </td>
              </tr>)
          })}
        </tbody>
      </table>


    </div>
  )
}

export default MostrarImpuestos