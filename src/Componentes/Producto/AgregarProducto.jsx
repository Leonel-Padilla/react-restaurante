import React, {useEffect, useRef, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, Text,} from '@nextui-org/react'


const endPointAddProducto           = 'http://127.0.0.1:8000/api/addProducto'
const endPointaddProductoInsumo     = 'http://127.0.0.1:8000/api/addProductoInsumo'
const endPointaddProductoHistorial  = 'http://127.0.0.1:8000/api/addProductoHistorial'
const endPointGetInsumo             = 'http://127.0.0.1:8000/api/Insumo'
const endPointGetProducto           = 'http://127.0.0.1:8000/api/Producto'
const AgregarProducto = () =>{
    const [insumos, setInsumos] = useState([])
    const [carroInsumos, setCarroInsumos]               = useState([])
    const [insumoActual, setInsumoActual]               = useState({})
    const [cantidadInsumo, setCantidadInsumo]           = useState(0)

    const [productoNombre, setProductoNombre]           = useState('')
    const [productoDescripcion, setProductoDescripcion] = useState('')
    const [precio, setPrecio]                           = useState('')

    const navigate = useNavigate()

    const [mensajeModal, setMensajeModal]   = useState('')
    const [tituloModal, setTituloModal]     = useState('')
    const [visible, setVisible]             = useState(false)

    const date = new Date()
    const fechaHoy = `${date.getFullYear()}-${date.getMonth() < 9? '0':''}${date.getMonth()+1}-${date.getDate() < 10? '0':''}${date.getDate()}`
    

    useEffect(() => {
        getAllInsumos()
    }, [])


    //
    const activarModal = (titulo, mensajeModal)=>{
        setTituloModal(titulo)
        setMensajeModal(mensajeModal)
        setVisible(true)
    }
    //
    const getAllInsumos = async() =>{
        const response = await axios.get(endPointGetInsumo)
        setInsumos(response.data)
    }
    //
    const agregarAlCarro = ()=>{
    
        if (parseInt(cantidadInsumo) <= 0){
            setCantidadInsumo(0)
            activarModal('Error', `La cantidad de insumo debe ser real, no puede ser cero.`)
        }else if (parseInt(cantidadInsumo) > 10){
          setCantidadInsumo(0)
          activarModal('Error', `Un producto no puede tener más de 10 unidades del mismo insumo.`)
        }else{
    
          let nuevoCarrito = [...carroInsumos]
          let nuevoInsumo = {...insumoActual, cantidadDeCompra: cantidadInsumo}
      
          nuevoCarrito.push(nuevoInsumo)
      
          setCarroInsumos(nuevoCarrito)
          setCantidadInsumo(0)
          setVisible(false)
        }
    }
    //
    const eliminarDelCarro = ()=>{
        let nuevoCarro = carroInsumos.filter((insumo)=> insumo.insumoNombre != insumoActual.insumoNombre)
        setCarroInsumos(nuevoCarro)
        setCantidadInsumo(0)
        setVisible(false)
    }

    //
    const editarCompra = ()=>{
        
        if (parseInt(cantidadInsumo) <= 0){
            setCantidadInsumo(0)
            activarModal('Error', `La cantidad de insumo debe ser real, no puede ser cero.`)
        }else if (parseInt(cantidadInsumo) > 10){
            setCantidadInsumo(0)
            activarModal('Error', `Un producto no puede tener más de 10 unidades del mismo insumo.`)
        }else{
        let nuevoCarro = [...carroInsumos]

        if (nuevoCarro.find(insumo => insumo.insumoNombre == insumoActual.insumoNombre)){
            insumoActual.cantidadDeCompra = cantidadInsumo
        }
    
        setCarroInsumos(nuevoCarro)
        setCantidadInsumo(0)
        setVisible(false)
        }

    }
    // 
    const registrar = async() =>{

        if (carroInsumos.length == 0){
            activarModal('Error', `Debe agregar al menos un insumo al producto.`)
        }else{
            const datos = [productoNombre]
            let contador = 0
    
            datos.map((dato)=>{
                if (/(.)\1\1/.test(dato)) {
                    contador++
                }
            })
    
            if (contador > 0){
                activarModal('Error', 'La información ingresada contiene mas de dos caracteres repetidos seguidos.')
            }else{
                const response = await axios.post(endPointAddProducto, {productoNombre: productoNombre,
                productoDescripcion: productoDescripcion, precio: precio, estado: 1})
    
                //console.log(response.data)
    
                if (response.status !== 200){
                    activarModal('Error', `${response.data.Error}`)
                }else{
                    registrarProductoHistorial()
                    registrarProductoInsumo()
                }
            }
        }

    }
    //
    const registrarProductoHistorial = async() =>{
        const response = await axios.get(endPointGetProducto)
        const productoActual = response.data[response.data.length-1].id

        const response1 = await axios.post(endPointaddProductoHistorial, {productoId: productoActual,
        precio: precio, fechaInicio: fechaHoy, estado: 1})
    }
    //
    const registrarProductoInsumo = async() =>{
        const response = await axios.get(endPointGetProducto)
        const productoActual = response.data[response.data.length-1].id

        carroInsumos.map(async(insumo)=>{
            const response1 = await axios.post(endPointaddProductoInsumo, {productoId: productoActual, insumoId: insumo.id, 
            cantidad: insumo.cantidadDeCompra, estado:1})

            //console.log(response1.data)
        })

        navigate('/Productos')
    }
    


    return(
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
                    {tituloModal.includes('Error') ? /*If*/ mensajeModal: //ERROR
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
                    : tituloModal.includes('Editar')?    //ELSE IF EDITAR
                      
                    <div>
                      <label>Cantidad</label>
                      <input
                      type='number'
                      className='form-control'
                      value={cantidadInsumo}
                      onChange={(e)=>setCantidadInsumo(e.target.value)}/>

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

            <div className='d-flex justify-content-center bg-dark mb-2'
            style={{backgroundColor: 'whitesmoke'}}>
              <h1 className='text-white'>Registrar Producto</h1>
          </div>

            <form onSubmit={registrar} className='formulario'>

                <div className='atributo'>
                <label>Producto Nombre:</label>
                <input
                placeholder='Hamburguesa'
                pattern='[A-Za-z ]{3,}'
                maxLength={50}
                value={productoNombre}
                onChange={(e)=>setProductoNombre(e.target.value)}
                type='text'
                className='form-control'
                />
                </div>


                <div className='atributo'>
                    <label>Descripción del Producto:</label>
                    <textarea
                    aria-label='aria-describedby'
                    placeholder='Hamburguesa con queso'
                    maxLength={100}
                    value={productoDescripcion}
                    onChange={(e)=>setProductoDescripcion(e.target.value)}
                    type='text'
                    className='form-control p-4'
                    />
                </div>

                <div className='atributo'>
                <label>Precio Producto:</label>
                <input
                placeholder='L. 100'
                value={precio}
                onChange={(e)=>setPrecio(e.target.value)}
                type='text'
                pattern='^[0-9]+$'
                maxLength={8}
                className='form-control'
                />
                </div>

                {/* <div className='d-flex mt-2'>

                    <Button 
                    color={'gradient'}
                    className='align-self-end me-3 ' 
                    auto 
                    onClick={()=>navigate('/Productos')}
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

                </div> */}

            </form>
                
                <div className='contenedorInsumos mt-2'>
                        
                    {/*Lista de todo insumo*/}
                    <div className='listaInsumos'>
                        <div className='d-flex justify-content-center bg-dark mb-2'
                        style={{borderRadius: '10px', height:'41.59px'}}>
                        <h3 className='text-white'>Lista Insumos</h3>
                        </div>

                        <div>
                            {insumos.map((insumo)=>
                            <div
                            key={insumo.id}
                            className='productoInsumo'
                            onClick={()=>{
                                if(carroInsumos.find(insumoEnCarro => insumoEnCarro.insumoNombre == insumo.insumoNombre)){
                                    activarModal('Error', 'No puede tener repetidos, si desea editar o elminar hagalo en el apartado del insumos del producto.')
                                }else{
                                    setInsumoActual(insumo)
                                    activarModal('Detalle de Producto', '')
                                }
                            }}>
                                {insumo.insumoNombre}
                            </div>
                            )}
                        </div>

                    </div>
                    
                    {/*Lista de insumos del producto*/}
                    <div className='insumoDePorducto'>
                        <div className='d-flex justify-content-center bg-dark mb-2'
                        style={{borderRadius: '10px', height:'41.59px'}}>
                        <h3 className='text-white'>Insumos utilizados</h3>
                    </div>

                    <div>
                        
                        <table className='table'>
                        <thead>
                            <tr>
                            <th>Nombre</th>
                            <th>Cantidad</th>
                            <th>Opciones</th>
                            </tr>
                        </thead>

                            <tbody>

                                {carroInsumos.map((insumo)=>
                                <tr key={insumo.id}>
                                <td>{insumo.insumoNombre}</td>
                                <td>{insumo.cantidadDeCompra}</td>
                                <td className='d-flex'>
                                    <Button
                                    className='d-flex'
                                    color={'error'}
                                    auto
                                    onClick={()=>{
                                    activarModal('Eliminar Insumo', 'Seguro que desea eliminar este registro?')
                                    setInsumoActual(insumo)
                                    }}
                                    >
                                    Eliminar
                                    </Button>

                                    <Button
                                    onClick={()=>{
                                    activarModal('Editar Insumo', '')
                                    setInsumoActual(insumo)
                                    setCantidadInsumo(insumo.cantidadDeCompra)
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
                </div>

                <div className='botones'>

                    <Button 
                    color={'gradient'}
                    className='align-self-end me-3 ' 
                    auto 
                    onClick={()=>navigate('/Productos')}
                    ghost>
                        Regresar
                    </Button>

                    <Button
                    onClick={()=>registrar()}
                    auto
                    type='submit'
                    color={'gradient'} 
                    ghost>
                        Guardar
                    </Button>

                </div>
        </div>
    );  
}

export default AgregarProducto
