import React, {useEffect, useRef, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, Text,} from '@nextui-org/react'


const endPointAddProducto   = 'http://127.0.0.1:8000/api/addProducto'
const endPointGetInsumo     = 'http://127.0.0.1:8000/api/Insumo'
const AgregarProducto = () =>{
    const [insumos, setInsumos] = useState([])

    const [productoNombre, setProductoNombre]           = useState('')
    const [productoDescripcion, setProductoDescripcion] = useState('')
    const [precio, setPrecio]                           = useState('')

    const navigate = useNavigate()

    const [mensajeModal, setMensajeModal]   = useState('')
    const [tituloModal, setTituloModal]     = useState('')
    const [visible, setVisible]             = useState(false)

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
    const registrar = async(e) =>{
        e.preventDefault()

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
                navigate('/Productos')
            }
        }

    }
    //
    const getAllInsumos = async() =>{
        const response = await axios.get(endPointGetInsumo)
        setInsumos(response.data)
        // console.log(response.data)
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
                    {tituloModal.includes('Error') ? mensajeModal : 'Hola'}
                    
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

                

                <div className='d-flex mt-2'>

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

                </div>

                </form>
                

        </div>
    );  
}

export default AgregarProducto
