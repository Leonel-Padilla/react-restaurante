import { useState } from 'react'
import { Button } from '@nextui-org/react'
import { useNavigate } from 'react-router-dom'

const AgregarPermiso = () => {
  const [rolId, setRolId]           = useState(0)
  const [pantallaId, setPantallaId] = useState(0)
  const [acciones, setAcciones]     = useState({actualizar: 0, registrar: 0, buscar: 0})
  const navigate                    = useNavigate()

  const registrar = () => {

  }

  return (
    <div>

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

            </select>
        </div>

        <div className='atributo'>
          <label>Pantalla</label>
          <select
            value={pantallaId}
            onChange={(e)=> setPantallaId(e.target.value)}
            type='number'
            className='select'>   
              <option value={0} >Seleccione la Pantalla</option>

            </select>
        </div>

        <div className='containerAcciones'>
          <div className='acciones'>
            <input type='checkbox' 
              checked={acciones.registrar === 1 ? true : false}
              onChange={()=>{
                const newState = {...acciones, registrar: acciones.registrar === 1 ? 0 : 1}
                setAcciones(newState)
                }}>
            </input> Registrar
          </div>

          <div className='acciones'>
            <input type='checkbox' 
              checked={acciones.buscar === 1 ? true : false}
              onChange={()=>{
                const newState = {...acciones, buscar: acciones.buscar === 1 ? 0 : 1}
                setAcciones(newState)
              }}>
            </input> Buscar
          </div>

          <div className='acciones'>
            <input type='checkbox'           
              checked={acciones.actualizar === 1 ? true : false}
              onChange={()=>{
                const newState = {...acciones, actualizar: acciones.actualizar === 1 ? 0 : 1}
                setAcciones(newState)
              }}>
            </input> Actualizar
          </div>
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