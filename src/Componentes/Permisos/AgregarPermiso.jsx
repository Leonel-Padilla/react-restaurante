import { useState } from 'react'
import { Button, Modal, Text } from '@nextui-org/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useEffect } from 'react'

const endPointgetScreens          = 'http://127.0.0.1:8000/api/Pantalla'
const endPointgetRoles            = 'http://127.0.0.1:8000/api/Rol'
const endPointPostRolesScreens    = 'http://127.0.0.1:8000/api/addRolPantalla'

const AgregarPermiso = () => {
  const [allScreens, setAllScreens] = useState([])
  const [allRoles, setAllRoles]     = useState([])

  const [rolId, setRolId]                 = useState(0)
  const [screenId, setScreenId]           = useState(0)
  const [currentScreen, setCurrentScreen] = useState('')
  const [actions, setActions]             = useState({actualizar: 0, registrar: 0, buscar: 0,
    imprimirReportes: 0, reimprimir: 0, detalles: 0})
  const navigate                          = useNavigate()

  const [mensajeModal, setMensajeModal] = useState('')
  const [tituloModal, setTituloModal]   = useState('')
  const [visible, setVisible]           = useState(false)

  useEffect(() => {
    getScreens()
    getRoles()
  },[])

  //
  const activarModal = (titulo, mensajeModal)=>{
    setTituloModal(titulo)
    setMensajeModal(mensajeModal)
    setVisible(true)
  }
  //
  const getScreens = async () => {
    const response = await axios.get(endPointgetScreens)
    setAllScreens(response.data)
  }
  //
  const getRoles = async () => {
    const response = await axios.get(endPointgetRoles)
    setAllRoles(response.data)
  }
  //
  const registrar = async (e) => {
    e.preventDefault()  

    if (parseInt(rolId) === 0 || parseInt(screenId[0]) === 0 || screenId === 0){
      activarModal('Error', 'Debe seleccionar un rol y una pantalla.')
    }else{
      const screenCode = screenId.split(' ')[0]

      const response = await axios.post(endPointPostRolesScreens, {rolesId: rolId, pantallaId: screenCode, 
      rolPantalla: `${rolId} - ${screenCode}` ,...actions, estado: 1})

      if (response.status !== 200){
        activarModal('Error', response.data.Error)
      }else{

        const {value: confirmacion} = await Swal.fire({
          title: 'Registro exitoso',
          text: `Los permisos han sido registrado con éxito.`,
          width: '410px',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#7109BF',
          background: 'black',
          color: 'white',
        })
  
        if (confirmacion){
            navigate('/MenuPrincipal')
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

      <div className='d-flex justify-content-center bg-dark mb-2'
        style={{backgroundColor: 'whitesmoke'}}>
        <h1 className='text-white'>Registrar Permiso</h1>
      </div>

      <form onSubmit={registrar} className='formulario'>

        <div className='atributo'>
          <label>Rol</label>
          <select
            value={rolId}
            onChange={(e)=> setRolId(e.target.value)}
            type='number'
            className='select'>   
              <option value={0} >Seleccione el Rol</option> 
              {allRoles.map((rol) => <option key={rol.id} value={rol.id}>{ rol.nombre }</option>)}
            </select>
        </div>

        <div className='atributo'>
          <label>Pantalla</label>
          <select
            value={screenId}
            onChange={(e)=> {
              setScreenId(e.target.value)              
              setCurrentScreen(e.target.value.split(' ')[1])
            }}
            type='number'
            className='select'>   
              <option value={0} >Seleccione la Pantalla</option>
              {allScreens.map((screen) => 
                <option key={screen.id} value={`${screen.id} ${screen.nombrePantalla}`}>{ screen.nombrePantalla }</option>)
              }
            </select>
        </div>

        <div className='containerAcciones'>
          <div className='acciones'>
            <input type='checkbox' 
              checked={actions.registrar === 1 ? true : false}
              onChange={()=>{
                const newState = {...actions, registrar: actions.registrar === 1 ? 0 : 1}
                setActions(newState)
                }}>
            </input> Registrar
          </div>

          <div className='acciones'>
            <input type='checkbox' 
              checked={actions.buscar === 1 ? true : false}
              onChange={()=>{
                const newState = {...actions, buscar: actions.buscar === 1 ? 0 : 1}
                setActions(newState)
              }}>
            </input> Buscar
          </div>

          <div className='acciones'>
            <input type='checkbox'           
              checked={actions.actualizar === 1 ? true : false}
              onChange={()=>{
                const newState = {...actions, actualizar: actions.actualizar === 1 ? 0 : 1}
                setActions(newState)
              }}>
            </input> Actualizar
          </div>

          <div className='acciones'>
            <input type='checkbox'           
              checked={actions.imprimirReportes === 1 ? true : false}
              onChange={()=>{
                const newState = {...actions, imprimirReportes: actions.imprimirReportes === 1 ? 0 : 1}
                setActions(newState)
              }}>
            </input> Imprimir Reportes
          </div>

          {currentScreen === 'compra' || currentScreen === 'factura' || currentScreen === 'producto' ? 
            <div className='acciones'>
            <input type='checkbox'           
              checked={actions.detalles === 1 ? true : false}
              onChange={()=>{
                const newState = {...actions, detalles: actions.detalles === 1 ? 0 : 1}
                setActions(newState)
              }}>
            </input> Ver Detalles
          </div>

          : null}

          {currentScreen === 'factura'? 
            <div className='acciones'>
            <input type='checkbox'           
              checked={actions.reimprimir === 1 ? true : false}
              onChange={()=>{
                const newState = {...actions, reimprimir: actions.reimprimir === 1 ? 0 : 1}
                setActions(newState)
              }}>
            </input> Reimprimir Factura
          </div>

          : null
          }
        </div>
        



        <div className='d-flex mt-2'>

          <Button 
            color={'gradient'}
            className='align-self-end me-3 ' 
            auto 
            onClick={()=>navigate('/MenuPrincipal')}
            ghost>
              Regresar
          </Button>

          <Button
            auto
            type='submit'
            color={'gradient'} 
            ghost>
              Guardar
          </Button>

        </div>


      </form>

    </div>
  )
}

export default AgregarPermiso