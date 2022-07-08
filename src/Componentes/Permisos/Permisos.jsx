import { Button } from '@nextui-org/react'
import { useState } from 'react'
import  { useNavigate } from 'react-router-dom'
import './Permisos.css'

const Permisos = () => {
  const navigate = useNavigate()
  const [roles, setRoles] = useState([{id: 1, nombre: 'Administrador'}, {id: 2, nombre: 'Vendedor'}])

  const [rolesPantallas, setRolesPantallas] = useState(
    [
      {id: 1, id_rol: 1, id_pantalla: 1, actualizar: 0, registrar: 1, buscar: 1, estado: 1},
      {id: 2, id_rol: 1, id_pantalla: 2, actualizar: 1, registrar: 0, buscar: 0, estado: 1},
      {id: 3, id_rol: 1, id_pantalla: 3, actualizar: 1, registrar: 1, buscar: 1, estado: 1},
      {id: 4, id_rol: 1, id_pantalla: 4, actualizar: 0, registrar: 1, buscar: 1, estado: 1},
      {id: 5, id_rol: 1, id_pantalla: 5, actualizar: 1, registrar: 0, buscar: 1, estado: 1},
      {id: 6, id_rol: 1, id_pantalla: 6, actualizar: 0, registrar: 0, buscar: 1, estado: 1},
      {id: 7, id_rol: 1, id_pantalla: 7, actualizar: 1, registrar: 1, buscar: 1, estado: 1},
      {id: 8, id_rol: 1, id_pantalla: 8, actualizar: 1, registrar: 0, buscar: 1, estado: 1},
      {id: 9, id_rol: 1, id_pantalla: 9, actualizar: 1, registrar: 0, buscar: 1, estado: 1},
      {id: 10, id_rol: 1, id_pantalla: 10, actualizar: 1, registrar: 0, buscar: 0, estado: 1},
      {id: 11, id_rol: 1, id_pantalla: 11, actualizar: 0, registrar: 1, buscar: 1, estado: 1},
      {id: 12, id_rol: 1, id_pantalla: 12, actualizar: 0, registrar: 1, buscar: 1, estado: 1},
      {id: 13, id_rol: 1, id_pantalla: 13, actualizar: 1, registrar: 1, buscar: 1, estado: 1},
      {id: 14, id_rol: 1, id_pantalla: 14, actualizar: 1, registrar: 0, buscar: 1, estado: 1}
    ]
  )
  const [rolesPantallas2, setRolesPantallas2] = useState([...rolesPantallas])

  return (
    <div>
      
      <div className='d-flex justify-content-center bg-dark mb-2'
        style={{backgroundColor: 'whitesmoke'}}>
        <h1 className='text-white'>Actualizar Permisos</h1>
      </div>


      <div className='contenedor'>

        <div className='atributo rol'>
          <label >Roles</label>
          <select className='select'>
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
                    
                    newArray[index] = {...rolPantalla, estado: newValue, actualizar: newValue, registrar: newValue, buscar: newValue}
                    setRolesPantallas2(newArray)
                  }}>
                </input> {rolPantalla.id_pantalla}

                <div className='acciones'>
                  <input type='checkbox' 
                    
                    checked={rolPantalla.registrar === 1 ? true : false}
                    onChange={()=>{
                      const newArray = [...rolesPantallas2]
                      newArray[index] = {...rolPantalla, registrar: rolPantalla.registrar === 1 ? 0 : 1}
                      setRolesPantallas2(newArray)
                    }}>
                  </input> Registrar
                </div>

                <div className='acciones'>
                  <input type='checkbox' 
                    
                    checked={rolPantalla.buscar === 1 ? true : false}
                    onChange={()=>{
                      const newArray = [...rolesPantallas2]
                      newArray[index] = {...rolPantalla, buscar: rolPantalla.buscar === 1 ? 0 : 1}
                      setRolesPantallas2(newArray)
                    }}>
                  </input> Buscar
                </div>

                <div className='acciones'>
                  <input type='checkbox' 
                    
                    checked={rolPantalla.actualizar === 1 ? true : false}
                    onChange={()=>{
                      const newArray = [...rolesPantallas2]
                      newArray[index] = {...rolPantalla, actualizar: rolPantalla.actualizar === 1 ? 0 : 1}
                      setRolesPantallas2(newArray)
                    }}>
                  </input> Actualizar
                </div>
                  
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
        type='submit'
        color={'gradient'} 
        ghost>
            Guardar
        </Button>

      </div>

    </div>
  )
}

export default Permisos