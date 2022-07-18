import { Button, Modal, Text } from '@nextui-org/react'
import { useEffect } from 'react'
import { useState } from 'react'
import  { useNavigate } from 'react-router-dom'
import axios  from 'axios'
import Swal from 'sweetalert2'
import './Permisos.css'

const endPointGetRolesPantallas     = 'http://127.0.0.1:8000/api/RolPantallaR'
const endPointUpdateRolesPantallas  = 'http://127.0.0.1:8000/api/updateRolPantalla'
const endPointGetPantallas          = 'http://127.0.0.1:8000/api/Pantalla'
const endPointGetRoles              = 'http://127.0.0.1:8000/api/Rol'

const Permisos = () => {
  const navigate = useNavigate()
  const [roles, setRoles]         = useState([])
  const [pantallas, setPantallas] = useState([])

  const [rolesPantallas, setRolesPantallas]   = useState([])
  const [rolesPantallas2, setRolesPantallas2] = useState([])

  const [mensajeModal, setMensajeModal] = useState('')
  const [tituloModal, setTituloModal]   = useState('')
  const [visible, setVisible]           = useState(false)

  useEffect(() => {
    getPantallas()
    getRoles()
  }, [])

  //
  const activarModal = (titulo, mensajeModal)=>{
    setTituloModal(titulo)
    setMensajeModal(mensajeModal)
    setVisible(true)
  }
  //
  const getPantallas = async () => {
    const response = await axios.get(endPointGetPantallas)
    setPantallas(response.data)
  }
  //
  const getRoles = async () => {
    const response = await axios.get(endPointGetRoles)
    setRoles(response.data)
  }
  //
  const getRolesPantallas = async (e) => {
    const rol = e.target.value
    const response = await axios.get(`${endPointGetRolesPantallas}/${rol}`)

    const data = response.data

    data.map(data => {
      pantallas.map(pantalla => {
        if (pantalla.id === data.pantallaId){
          data.pantallaNombre = pantalla.nombrePantalla
        }
      })
    })
    
    setRolesPantallas(data)
    setRolesPantallas2(data)

    //console.log(data)
  }
  //
  const submit = () => {

    const actualizables = []

    for (let i = 0; i < rolesPantallas.length; i++){

      if(JSON.stringify(rolesPantallas[i]) !== JSON.stringify(rolesPantallas2[i])){
        const currentObject = {...rolesPantallas2[i]}

        delete currentObject.pantallaNombre
        delete currentObject.created_at
        delete currentObject.updated_at

        actualizables.push(currentObject) 
      }
    }

    let contador = 0
    actualizables.map(async (data, index) => {
      const response = await axios.put(`${endPointUpdateRolesPantallas}/${data.id}`, data)
      contador = response.status !== 200 ? contador++ : contador
    })

    if (contador === 0){
      (async ()=>{

        const {value: confirmacion} = await Swal.fire({
            title: 'Actualización exitosa',
            text: `Permisos Actualizados`,
            width: '410px',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#7109BF',
            background: 'black',
            color: 'white',
        })

        if (confirmacion){
            navigate('/MenuPrincipal')
        }
      })()
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
        <h1 className='text-white'>Actualizar Permisos</h1>
      </div>


      <div className='contenedor'>

        <div className='atributo rol'>
          <label >Roles</label>
          <select 
          className='select'
          onChange={getRolesPantallas}>
            <option>Seleccione un Rol</option>
            {roles.map((rol) => <option key={rol.id} value={rol.id}> {rol.nombre} </option>)}
          </select>
        </div>


        {rolesPantallas2.map((rolPantalla, index) =>{
          return(
            
            <div key={rolPantalla.id}>
              <input type='checkbox' 
                checked={rolPantalla.estado === 1 ? true : false}
                onChange={()=>{
                  const newArray = [...rolesPantallas2]
                  
                  const newValue = rolPantalla.estado === 1 ? 0 : 1
                  
                  newArray[index] = {...rolPantalla, estado: newValue, actualizar: newValue, registrar: newValue, buscar: newValue,
                  imprimirReportes: newValue, 
                  detalles: rolPantalla.pantallaNombre === 'factura' || rolPantalla.pantallaNombre === 'compra' || 
                  rolPantalla.pantallaNombre === 'producto' ? newValue : 0,
                  reimprimir: rolPantalla.pantallaNombre === 'factura' ? newValue : 0}

                  setRolesPantallas2(newArray)
                }}>
              </input> {rolPantalla.pantallaNombre}

              <div className='acciones'>
                <input type='checkbox' 
                  
                  checked={Number(rolPantalla.registrar) === 1 ? true : false}
                  onChange={()=>{
                    if(rolPantalla.estado === 0){  
                      activarModal('Error', 'Debe activar acceso a la pantalla para agregar permisos')
                    }else{
                      const newArray = [...rolesPantallas2]
                      newArray[index] = {...rolPantalla, registrar: rolPantalla.registrar === 1 ? 0 : 1}
                      setRolesPantallas2(newArray)
                    }
                  }}>
                </input> Registrar
              </div>

              <div className='acciones'>
                <input type='checkbox' 
                  
                  checked={Number(rolPantalla.buscar) === 1 ? true : false}
                  onChange={()=>{
                    if(rolPantalla.estado === 0){  
                      activarModal('Error', 'Debe activar acceso a la pantalla para agregar permisos')
                    }else{
                      const newArray = [...rolesPantallas2]
                      newArray[index] = {...rolPantalla, buscar: rolPantalla.buscar === 1 ? 0 : 1}
                      setRolesPantallas2(newArray)
                    }
                  }}>
                </input> Buscar
              </div>

              <div className='acciones'>
                <input type='checkbox' 
                  
                  checked={Number(rolPantalla.actualizar) === 1 ? true : false}
                  onChange={()=>{
                    if(rolPantalla.estado === 0){  
                      activarModal('Error', 'Debe activar acceso a la pantalla para agregar permisos')
                    }else{
                      const newArray = [...rolesPantallas2]
                      newArray[index] = {...rolPantalla, actualizar: rolPantalla.actualizar === 1 ? 0 : 1}
                      setRolesPantallas2(newArray)
                    }
                  }}>
                </input> Actualizar
              </div>

              <div className='acciones'>
                <input type='checkbox' 
                  
                  checked={Number(rolPantalla.imprimirReportes) === 1 ? true : false}
                  onChange={()=>{
                    if(rolPantalla.estado === 0){  
                      activarModal('Error', 'Debe activar acceso a la pantalla para agregar permisos')
                    }else{
                      const newArray = [...rolesPantallas2]
                      newArray[index] = {...rolPantalla, imprimirReportes: rolPantalla.imprimirReportes === 1 ? 0 : 1}
                      setRolesPantallas2(newArray)
                    }
                  }}>
                </input> Imprimir Reportes
              </div>

              {rolPantalla.pantallaNombre === 'compra' || rolPantalla.pantallaNombre === 'factura' || rolPantalla.pantallaNombre === 'producto' ? 
                <div className='acciones'>
                  <input type='checkbox' 
                    checked={Number(rolPantalla.detalles) === 1 ? true : false}
                    onChange={()=>{
                      if(rolPantalla.estado === 0){  
                        activarModal('Error', 'Debe activar acceso a la pantalla para agregar permisos')
                      }else{
                        const newArray = [...rolesPantallas2]
                        newArray[index] = {...rolPantalla, detalles: rolPantalla.detalles === 1 ? 0 : 1}
                        setRolesPantallas2(newArray)
                      }
                    }}>
                  </input> Ver detalles
                </div>
                :
                null
              }

              {rolPantalla.pantallaNombre === 'factura'? 
                <div className='acciones'>
                  <input type='checkbox' 
                    checked={Number(rolPantalla.reimprimir) === 1 ? true : false}
                    onChange={()=>{
                      if(rolPantalla.estado === 0){  
                        activarModal('Error', 'Debe activar acceso a la pantalla para agregar permisos')
                      }else{
                        const newArray = [...rolesPantallas2]
                        newArray[index] = {...rolPantalla, reimprimir: rolPantalla.reimprimir === 1 ? 0 : 1}
                        setRolesPantallas2(newArray)
                      }
                    }}>
                  </input> Reimprimir
                </div>
                :
                null
              }
                
            </div>
          )
        })}
      </div>

      <div className='buttons'>

        <Button 
        color={'gradient'}
        className='align-self-end me-3 ' 
        auto 
        onClick={()=>navigate(-1)}
        ghost>
            Regresar
        </Button>

        <Button
        auto
        onClick={submit}
        color={'gradient'} 
        ghost>
            Guardar
        </Button>

      </div>

    </div>
  )
}

export default Permisos