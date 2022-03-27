import React, {useRef, useState, useEffect} from 'react'
import { Button, Input, Modal, Text, Textarea} from '@nextui-org/react'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'


const endPointGelAllInsunmos    = 'http://127.0.0.1:8000/api/Insumo'
const endPointGelAllEmpleado    = 'http://127.0.0.1:8000/api/Empleado'
const endPointGelAllProveedores = 'http://127.0.0.1:8000/api/Proveedor'
const AgregarCompra = () => {
  const [insumos, setInsumos]               = useState([])
  const [carroInsumos, setCarroInsumos]     = useState([])
  const [insumoActual, setInsumoActual]     = useState({})
  const [cantidadInsumo, setCantidadInsumo] = useState(0)
  const [precioInsumo, setPrecioInsumo] = useState(0)
  const [empleados, setEmpleados]           = useState([])
  const [proveedores, setProveedores]       = useState([])
  

  const [empleadoId, setEmpleadoId]         = useState('Seleccione')
  let idEmpleado                            = ''
  const [compraEstado, setCompraEstado]     = useState('Seleccione')
  const [cai, setCai]                       = useState('')
  const [numeroFactura, setNUmeroFactura]   = useState('')
  const [proveedorId, setProveedorId]       = useState()

  const [mensajeModal, setMensajeModal]   = useState('')
  const [tituloModal, setTituloModal]     = useState('')
  const [visible, setVisible]             = useState(false)
  const navigate                          = useNavigate()

  useEffect(()=>{
    getAllInsumos()
    getAllEmpleados()
    getAllProveedores()
  }, [])

  //
  const getAllInsumos = async ()=>{
    const response = await axios.get(endPointGelAllInsunmos)
    setInsumos(response.data)
  }
  //
  const getAllEmpleados = async ()=>{
    const response = await axios.get(endPointGelAllEmpleado)
    setEmpleados(response.data)
  }
  //
  const getAllProveedores = async()=>{
    const response = await axios.get(endPointGelAllProveedores)
    setProveedores(response.data)
  }
  const activarModal = (titulo, mensajeModal)=>{
    setTituloModal(titulo)
    setMensajeModal(mensajeModal)
    setVisible(true)
  }

  //
  const agregarAlCarro = ()=>{
    //PONER EXPRECIÓN REGULAR PARA EVITAR QUE INGRESE NUMERO NEGATIVOS EN CANTIDAD////////////////////////
    //PONER EXPRECIÓN REGULAR PARA EVITAR QUE INGRESE NUMERO NEGATIVOS EN PRECIO//////////////////////////
    if ((parseInt(cantidadInsumo) + parseInt(insumoActual.cantidad)) > parseInt(insumoActual.cantidadMax)){
      activarModal('Error', `La compra sobrepasa la cantidad máxima de ${insumoActual.cantidadMax}`)
    }
    else{

      let nuevoCarrito = [...carroInsumos]
      let nuevoInsumo = {...insumoActual, cantidadDeCompra: cantidadInsumo, precioDeCompra: precioInsumo}
  
      nuevoCarrito.push(nuevoInsumo)
  
      setCarroInsumos(nuevoCarrito)
      setCantidadInsumo(0)
      setPrecioInsumo(0)
      setVisible(false)
    }
  }
  
  //
  const eliminarDelCarro = ()=>{
    let nuevoCarro = carroInsumos.filter((insumo)=> insumo.insumoNombre != insumoActual.insumoNombre)
    setCarroInsumos(nuevoCarro)
    setCantidadInsumo(0)
    setPrecioInsumo(0)
    setVisible(false)
  }

  //
  const editarCompra = ()=>{

    if ((parseInt(cantidadInsumo) + parseInt(insumoActual.cantidad)) > parseInt(insumoActual.cantidadMax)){
      activarModal('Error', `La compra sobrepasa la cantidad máxima de ${insumoActual.cantidadMax}`)
    }
    else{
      let nuevoCarro = [...carroInsumos]

      if (nuevoCarro.find(insumo => insumo.insumoNombre == insumoActual.insumoNombre)){
        insumoActual.cantidadDeCompra = cantidadInsumo
        insumoActual.precioDeCompra   = precioInsumo
      }
  
      setCarroInsumos(nuevoCarro)
      setCantidadInsumo(0)
      setPrecioInsumo(0)
      setVisible(false)
    }

  }

  //
  const registrar = async ()=>{

  }

  return (
    <div>
          <Modal
            closeButton
            blur
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
                    {tituloModal.includes('Error')? /*If*/ mensajeModal: //ERROR
                    tituloModal.includes('Eliminar')?  //ELSE IF Eliminar
                    <div>
                      {mensajeModal}

                      <div className='botonesModal mt-4'>
                        <Button
                        className='me-4'
                        onClick={()=>setVisible(false)}
                        auto>
                          Cancelar
                        </Button>

                        <Button
                        className='ms-4'
                        onClick={()=>{
                          eliminarDelCarro()
                        }}
                        auto>
                          Eliminar
                        </Button>
                      </div>

                    </div>
                    : tituloModal.includes('Editar')?    //ELSE I EDITAR
                      
                    <div>
                      <label>Cantidad</label>
                      <input
                      type='number'
                      className='form-control'
                      value={cantidadInsumo}
                      onChange={(e)=>setCantidadInsumo(e.target.value)}/>

                      <label>Precio Total</label>
                      <input
                      type='number'
                      className='form-control'
                      value={precioInsumo}
                      onChange={(e)=>setPrecioInsumo(e.target.value)}/>

                      <div className='botonesModal mt-4'>
                        <Button
                        className='me-4'
                        auto
                        onClick={()=>setVisible(false)}
                        >
                          Cancelar
                        </Button>

                        <Button
                        className='ms-4'
                        auto
                        onClick={()=>editarCompra()}
                        >
                          Aceptar
                        </Button>
                      </div>

                    </div>

                    : //ELSE AGREGAR

                    <div>
                      <label>Cantidad</label>
                      <input
                      type='number'
                      className='form-control'
                      value={cantidadInsumo}
                      onChange={(e)=>setCantidadInsumo(e.target.value)}/>

                      <label>Precio Total</label>
                      <input
                      type='number'
                      className='form-control'
                      value={precioInsumo}
                      onChange={(e)=>setPrecioInsumo(e.target.value)}/>

                      <div className='botonesModal mt-4'>
                        <Button
                        className='me-4'
                        auto
                        onClick={()=>setVisible(false)}
                        >
                          Cancelar
                        </Button>
                        
                        <Button
                        className='ms-4'
                        auto
                        onClick={()=>agregarAlCarro()}
                        >
                          Agregar
                        </Button>
                      </div>


                    </div>}
                </Modal.Body>

          </Modal>


            <div className='d-flex justify-content-center bg-dark mb-2'>
                <h1 className='text-white'>Registrar Compra</h1>
            </div>

            <div className='layoutCompra'>

              {/*Select de las compras*/}
              <div className='selectCompra'>
                
              <div className='atributo'>
                  <label>Proveedor</label>
                  <select
                  value={proveedorId}
                  onChange={(e)=>setProveedorId(e.target.value)}
                  className='select'> 
                      <option>Seleccione el Empleado</option>
                      {proveedores.map((proveedor)=> <option key={proveedor.id}>{proveedor.proveedorNombre}</option>)}
                  </select>
                </div>

                <div className='atributo'>
                  <label>Empleado</label>
                  <select
                  value={empleadoId}
                  onChange={(e)=>setEmpleadoId(e.target.value)}
                  className='select'> 
                      <option>Seleccione el Empleado</option>
                      {empleados.map((empleado)=> <option key={empleado.id}>{empleado.empleadoNombre}</option>)}
                  </select>
                </div>

                <div className='atributo'>
                  <label>Estado</label>
                  <select
                  value={compraEstado}
                  onChange={(e)=>setCompraEstado(e.target.value)}
                  className='select'> 
                      <option>Seleccione un Estado</option>
                      <option>Pendiente</option>
                      <option>Recibida</option>
                  </select>
                </div>

                
                <div className='atributo'>
                  <label>CAI</label>
                  <input
                  value={cai}
                  onChange={(e)=>setCai(e.target.value)}
                  type='text'
                  maxLength={50}
                  //pattern='^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{5,16}$'
                  className='form-control'
                  />
                </div>

                <div className='atributo'>
                <label>Numero Factura</label>
                <input
                 value={numeroFactura}
                 onChange={(e)=>setNUmeroFactura(e.target.value)}
                 type='text'
                 maxLength={50}
                 //pattern='^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{5,16}$'
                 className='form-control'
                 />
                </div>

              </div>

              
              
              {/*Lista de los insumos*/}
              <div className='listaInsumos'>
                <div className='d-flex justify-content-center bg-dark mb-2'
                style={{borderRadius: '10px', height:'41.59px'}}>
                  <h3 className='text-white'>Lista Insumos</h3>
                </div>

                <div>
                  {insumos.map((insumo)=>
                  <div
                  className='insumoCompra' 
                  key={insumo.id}
                  onClick={()=>{
                    
                    if(carroInsumos.find(insumoEnCarro => insumoEnCarro.insumoNombre == insumo.insumoNombre)){
                      activarModal('Error', 'No puede tener repetidos, si desea editar o elminar hagalo en el apartado del carrito.')
                    }else{
                      setInsumoActual(insumo)
                      activarModal('Detalle de compra', '')
                      
                    }}}>
                    {insumo.insumoNombre}
                    
                  </div>
                  )}
                </div>

              </div>
              
              {/*Insumos en el carrito*/}
              <div className='insumosEnCarro'>

                <div className='d-flex justify-content-center bg-dark mb-2'
                style={{borderRadius: '10px', height:'41.59px'}}>
                <h3 className='text-white'>Carrito de compras</h3>
                </div>

                  <div>
                    <table className='table'>
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Cantidad</th>
                          <th>Precio Total</th>
                          <th>Opciones</th>
                        </tr>
                      </thead>

                      <tbody>

                        {carroInsumos.map((insumo)=>
                        <tr key={insumo.id}>
                          <td>{insumo.insumoNombre}</td>
                          <td>{insumo.cantidadDeCompra}</td>
                          <td>{insumo.precioDeCompra}</td>
                          <td className='d-flex'>
                            <Button
                            className='d-flex'
                            color={'error'}
                            auto
                            onClick={()=>{
                              activarModal('Eliminar Compra', 'Seguro que desea eliminar este registro?')
                              setInsumoActual(insumo)
                            }}
                            >
                              Eliminar
                            </Button>

                            <Button
                            onClick={()=>{
                              activarModal('Editar Compra', '')
                              setInsumoActual(insumo)
                              setCantidadInsumo(insumo.cantidadDeCompra)
                              setPrecioInsumo(insumo.precioDeCompra)
                            }}
                            auto>
                              Editar
                            </Button>
                          </td>
                        </tr>
                        )}

                      </tbody>
                    </table>
                  </div>
              </div>

              {/*Botones de la compra*/}

              <div className='botonesCompra'>                
              <Button
                auto
                color={'gradient'}
                onClick={()=>navigate('/Compras')}
                ghost>
                  Cancelar
                </Button>

                <Button
                auto
                color={'gradient'}
                ghost>
                  Guardar
                </Button>
              </div>
              
              {/*Fechas de la compra*/}
              <div className='fechasCompra'>
                
                <div className='atributo'>
                  <label>Fecha Solicitud</label> 
                  <input type="date" />
                </div>

                <div className='atributo'>
                  <label>Fecha Entrega</label>
                  <input type="date" />
                </div>

                <div className='atributo'>
                  <label>Fecha Pago</label>
                  <input type="date" />
                </div>

              </div>

            </div>
    </div>
  )
}

export default AgregarCompra

