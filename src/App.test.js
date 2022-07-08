import React, { Component } from 'react';
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { prettyDOM } from '@testing-library/dom';
import AgregarCargo from './Componentes/Cargo/AgregarCargo';
import AgregarCliente from './Componentes/Cliente/AgregarCliente';
import AgregarComentario from './Componentes/Comentario/AgregarComentario';
import AgregarDelivery from './Componentes/Delivery/AgregarDelivery';
import AgregarEmpleado from './Componentes/Empleado/AgregarEmpleados';
import AgregarImpuesto from './Componentes/Impuesto/AgregarImpuesto';
import AgregarInsumo from './Componentes/Insumo/AgregarInsumo';
import AgregarMesa from './Componentes/Mesa/AgregarMesa';
import AgregarProducto from './Componentes/Producto/AgregarProducto';
import AgregarProveedor from './Componentes/Proveedor/AgregarProveedor';
import AgregarReservacion from './Componentes/Reservacion/AgregarReservacion';
import AgregarSucursal from './Componentes/Sucursal/AgregarSucursal';
//-------------------------Producto----------------------------------

/*test('Producto Exito', async()=>{
  const component = render(
    <Router>
      <AgregarProducto></AgregarProducto>
    </Router>
  )

  const productoNombre = await component.findByPlaceholderText('Hamburguesa')
  fireEvent.change(productoNombre, {target: {value: 'Pan de ajo'}})

  const productoDescripcion = await component.findByPlaceholderText('Hamburguesa con queso')
  fireEvent.change(productoDescripcion, {target: {value: 'Hamburguesa con queso'}})

  const precioProducto = await component.findByPlaceholderText('L. 10')
  fireEvent.change(precioProducto, {target: {value: '10'}})

  const impuesto = await component.findByDisplayValue('Seleccione un impuesto')
  fireEvent.click(impuesto)

  const impuestoSeleccionado = await component.findByText('Exento')
  userEvent.selectOptions(impuesto, 'Exento')

  const descuento = await component.findByPlaceholderText('5%')
  fireEvent.change(descuento, {target: {value: '5'}})

  const pan = await component.findByText('Pan')
  fireEvent.click(pan)

  const cantidad = await component.findByPlaceholderText('Cantidad')
  fireEvent.change(cantidad, {target: {value: '1'}})

  const agregar = await component.findByText('Agregar')
  fireEvent.click(agregar)
  
  const botonGuardar = await component.findByText('Guardar')
  fireEvent.click(botonGuardar)

  const message = await component.findByText('Registro exitoso')

  console.log(prettyDOM(message))

})*/

//-------------------------Reservacion----------------------------------

/*test('Reservacion Error', async()=>{
  const component = render(
    <Router>
      <AgregarReservacion></AgregarReservacion>
    </Router>
  )
  
  const cliente = await component.findByDisplayValue('Seleccione un Cliente')
  fireEvent.click(cliente)

  const clienteNombre = await component.findByText('Carlos')
  userEvent.selectOptions(cliente, 'Carlos')

  const sucursal = await component.findByDisplayValue('Seleccione una Sucursal')
  fireEvent.click(sucursal)

  const sucursalNombre = await component.findByText('Sucursal del centro')
  userEvent.selectOptions(sucursal, 'Sucursal del centro')

  const botonGuardar = await component.findByText('Guardar')
  fireEvent.click(botonGuardar)

  const message = await component.findByText('Error')

  console.log(prettyDOM(message))
})*/

/*test('Reservacion Exito', async()=>{
  const component = render(
    <Router>
      <AgregarReservacion></AgregarReservacion>
    </Router>
  )
  
  const cliente = await component.findByDisplayValue('Seleccione un Cliente')
  fireEvent.click(cliente)

  const clienteNombre = await component.findByText('Carlos')
  userEvent.selectOptions(cliente, 'Carlos')

  const sucursal = await component.findByDisplayValue('Seleccione una Sucursal')
  fireEvent.click(sucursal)

  const sucursalNombre = await component.findByText('Sucursal del centro')
  userEvent.selectOptions(sucursal, 'Sucursal del centro')

  const mesa = await component.findByDisplayValue('Seleccione una Mesa')
  fireEvent.click(mesa)

  const mesaNumero = await component.findByText('2')
  userEvent.selectOptions(mesa, '2')

  const fechaReservacion = await component.findByLabelText('Fecha Reservación')
  userEvent.type(fechaReservacion, '2022-06-12');

  const horaInicio = await component.findByLabelText('Hora Inicio')
  fireEvent.change(horaInicio, {target: {value: '08:00'}})

  const horaFin = await component.findByLabelText('Hora Final')
  fireEvent.change(horaFin, {target: {value: '10:00'}})

  const botonGuardar = await component.findByText('Guardar')
  fireEvent.click(botonGuardar)

  const message = await component.findByText('Registro exitoso')

  console.log(prettyDOM(message))

})*/

//-------------------------Empleado----------------------------------

/*test('Empleado Error', async()=>{
  const component = render(
    <Router>
      <AgregarEmpleado></AgregarEmpleado>
    </Router>
  )
  
  const nombreEmpleado = await component.findByPlaceholderText('Jose Perez');
  fireEvent.change(nombreEmpleado, {target: {value: 'Jose Perez'}});

  const numeroEmpleado = await component.findByPlaceholderText('88922711');
  fireEvent.change(numeroEmpleado, {target: {value: '88922711'}});

  const correoEmpleado = await component.findByPlaceholderText('ejem@gmail.com')
  fireEvent.change(correoEmpleado, {target: {value: 'ejem@gmail.com'}});

  const direccionEmpleado = await component.findByPlaceholderText('Res. Las uvas');
  fireEvent.change(direccionEmpleado, {target: {value: 'Res. Las uvas'}});

  const sucursal = await component.findByDisplayValue('Seleccione una sucursal');

  const nombreSucursal = await component.findByText('Sucursal del centro');
  userEvent.selectOptions(sucursal, 'Sucursal del centro');
  
  const tipoDocumento = await component.findByDisplayValue('Seleccione Tipo Documento');

  const nombreTipoDocumento = await component.findByText('Identidad');
  userEvent.selectOptions(tipoDocumento, 'Identidad');

  const numeroDocumento = await component.findByPlaceholderText('1234567890123');
  fireEvent.change(numeroDocumento, {target: {value: '1234567890123'}});

  const botonGuardar = await component.findByText('Guardar');
  fireEvent.click(botonGuardar);

  const message = await component.findByText('Error');
  console.log(prettyDOM(message));

})*/

/*test('Empleado Exitoso', async()=>{
  const component = render(
    <Router>
      <AgregarEmpleado></AgregarEmpleado>
    </Router>
  )
  
  const nombreEmpleado = await component.findByPlaceholderText('Jose Perez');
  fireEvent.change(nombreEmpleado, {target: {value: 'Jose Perez'}});

  const numeroEmpleado = await component.findByPlaceholderText('88922711');
  fireEvent.change(numeroEmpleado, {target: {value: '88922711'}});

  const correoEmpleado = await component.findByPlaceholderText('ejem@gmail.com')
  fireEvent.change(correoEmpleado, {target: {value: 'ejem@gmail.com'}});

  const direccionEmpleado = await component.findByPlaceholderText('Res. Las uvas');
  fireEvent.change(direccionEmpleado, {target: {value: 'Res. Las uvas'}});

  const sucursal = await component.findByDisplayValue('Seleccione una sucursal');

  const nombreSucursal = await component.findByText('Sucursal del centro');
  userEvent.selectOptions(sucursal, 'Sucursal del centro');
  
  const tipoDocumento = await component.findByDisplayValue('Seleccione Tipo Documento');

  const nombreTipoDocumento = await component.findByText('Identidad');
  userEvent.selectOptions(tipoDocumento, 'Identidad');

  const numeroDocumento = await component.findByPlaceholderText('1234567890123');
  fireEvent.change(numeroDocumento, {target: {value: '1234567890123'}});

  const fechaNacimiento = await component.findByLabelText('Fecha Nacimiento:');
  userEvent.type(fechaNacimiento, '2004-06-06');

  const fechaContrato = await component.findByLabelText('Fecha Contrato:');
  userEvent.type(fechaContrato, '2022-06-13');

  const sueldo = await component.findByPlaceholderText('5000');
  fireEvent.change(sueldo, {target: {value: '5000'}});

  const usuario = await component.findByPlaceholderText('empleado1');
  fireEvent.change(usuario, {target: {value: 'empleado1'}});
  
  const contrasenia = await component.findByLabelText('Contraseña:');
  fireEvent.change(contrasenia, {target: {value: 'Admin1234'}});

  const confirmarContrasenia = await component.findByLabelText('Confirmar contraseña:');
  fireEvent.change(confirmarContrasenia, {target: {value: 'Admin1234'}});

  const cargo = await component.findByDisplayValue('Seleccione Cargo Actual');

  const nombreCargo = await component.findByText('Cajero');
  userEvent.selectOptions(cargo, 'Cajero');

  const botonGuardar = await component.findByText('Guardar');
  fireEvent.click(botonGuardar);

})*/

//-------------------------Cargo----------------------------------

/*test('Cargo Exitoso', async()=>{
  const component = render(
    <Router>
      <AgregarCargo></AgregarCargo>
    </Router>
  )

  const nombreCargo = await component.findByPlaceholderText('Cajero');
  fireEvent.change(nombreCargo, {target:{value:'Pinche'}});

  const botonGuardar = await component.findByText('Guardar');
  fireEvent.click(botonGuardar);

  const message = await component.findByText('Error');

  console.log(prettyDOM(message));
})*/

/*test('Cargo Exitoso', async()=>{
  const component = render(
    <Router>
      <AgregarCargo></AgregarCargo>
    </Router>
  )

  const nombreCargo = await component.findByPlaceholderText('Cajero');
  fireEvent.change(nombreCargo, {target:{value:'Pinche'}});

  const descripcionCargo = await component.findByPlaceholderText('Responsable de caja');
  fireEvent.change(descripcionCargo, {target:{value:'Ayudante personal del chef.'}});

  const botonGuardar = await component.findByText('Guardar');
  fireEvent.click(botonGuardar);

  const message = await component.findByText('Registro exitoso');

  console.log(prettyDOM(message));
})*/

//-------------------------Sucursal----------------------------------


/*test('Sucursal Error', async()=>{
  const component =  render(
    <Router>
      <AgregarSucursal></AgregarSucursal>
    </Router>
  )

  const nombreSucursal = await component.findByPlaceholderText('Sucursal de las uvas');
  fireEvent.change(nombreSucursal, {target: {value: 'Sucursal de las torres'}});

  const direccionSucursal = await component.findByPlaceholderText('Colonia Las Uvas');
  fireEvent.change(direccionSucursal, {target: {value: 'Colonia Las Torres'}});

  const botonGuardar = await component.findByText('Guardar');
  fireEvent.click(botonGuardar);

  const message = await component.findByText('Error');

  console.log(prettyDOM(message));
})*/

/*test('Sucursal Exitoso', async()=>{
  const component =  render(
    <Router>
      <AgregarSucursal></AgregarSucursal>
    </Router>
  )

  const nombreSucursal = await component.findByPlaceholderText('Sucursal de las uvas');
  fireEvent.change(nombreSucursal, {target: {value: 'Sucursal de las torres'}});

  const direccionSucursal = await component.findByPlaceholderText('Colonia Las Uvas');
  fireEvent.change(direccionSucursal, {target: {value: 'Colonia Las Torres'}});

  const encargadoSucursal = await component.findByDisplayValue('Seleccione un Encargado');
  
  const nombreEncargado = await component.findByText('Mike')
  userEvent.selectOptions(encargadoSucursal, 'Mike');

  const botonGuardar = await component.findByText('Guardar');
  fireEvent.click(botonGuardar);

  const message = await component.findByText('Registro exitoso');

  console.log(prettyDOM(message));
})*/

//-------------------------Proveedor----------------------------------

/*test('Proveedor Error', async() => {
  const component = render(
    <Router>
      <AgregarProveedor></AgregarProveedor>
    </Router>
  )
  
  const nombreProveedor = await component.findByPlaceholderText('Nombre')
  fireEvent.change(nombreProveedor, {target: { value: 'Proveedor' }})

  const numeroProveedor = await component.findByPlaceholderText('Numero')
  fireEvent.change(numeroProveedor, {target: { value: '32345678' }})

  const botonGuardar = await component.findByText('Guardar')
  fireEvent.click(botonGuardar)
  
  const message = await component.findByText('Error')

  console.log(prettyDOM(message))

})*/

/*test('Proveedor Exitoso', async() => {
  const component = render(
    <Router>
      <AgregarProveedor></AgregarProveedor>
    </Router>
  )
  
  const nombreProveedor = await component.findByPlaceholderText('Nombre')
  fireEvent.change(nombreProveedor, {target: { value: 'Proveedor' }})

  const numeroProveedor = await component.findByPlaceholderText('Numero')
  fireEvent.change(numeroProveedor, {target: { value: '32345678' }})

  const correoProveedor = await component.findByPlaceholderText('Correo')
  fireEvent.change(correoProveedor, {target: { value: 'correo@gmail.com' }})

  const nombreEncargado = await component.findByPlaceholderText('Encargado')
  fireEvent.change(nombreEncargado, {target: { value: 'Juan' }})

  const rtnProveedor = await component.findByPlaceholderText('RTN')
  fireEvent.change(rtnProveedor, {target: { value: '12345678912345' }})

  const botonGuardar = await component.findByText('Guardar')
  fireEvent.click(botonGuardar)
  
  const message = await component.findByText('Registro exitoso')

  console.log(prettyDOM(message))

})*/

//-------------------------Mesa----------------------------------

/*test('Mesa Exitoso', async ()=>{
  const component = render(
    <Router>
      <AgregarMesa></AgregarMesa>
    </Router>
  )

  const nombreSucursal = await component.findByDisplayValue('Seleccione Sucursal')
  fireEvent.click(nombreSucursal)

  const sucursal = await component.findByText('Sucursal del centro')
  userEvent.selectOptions(nombreSucursal, 'Sucursal del centro')

  const descripcionMesa = await component.findByPlaceholderText('Mesa para reservar')
  fireEvent.change(descripcionMesa, {target: {value: 'Mesa para reservar'}})

  const botonGuardar = await component.findByText('Guardar')
  fireEvent.click(botonGuardar)

  const message = await component.findByText('Error')

  console.log(prettyDOM(message))
})*/

/*test('Mesa Exitoso', async ()=>{
  const component = render(
    <Router>
      <AgregarMesa></AgregarMesa>
    </Router>
  )

  const nombreSucursal = await component.findByDisplayValue('Seleccione Sucursal')
  fireEvent.click(nombreSucursal)

  const sucursal = await component.findByText('Sucursal del centro')
  userEvent.selectOptions(nombreSucursal, 'Sucursal del centro')

  const descripcionMesa = await component.findByPlaceholderText('Mesa para reservar')
  fireEvent.change(descripcionMesa, {target: {value: 'Mesa para reservar'}})

  const numeroMesa = await component.findByPlaceholderText('1')
  fireEvent.change(numeroMesa, {target: {value: '1'}})

  const numeroAsientos = await component.findByPlaceholderText('5')
  fireEvent.change(numeroAsientos, {target: {value: '5'}})

  const botonGuardar = await component.findByText('Guardar')
  fireEvent.click(botonGuardar)

  const message = await component.findByText('Registro exitoso')

  console.log(prettyDOM(message))
})*/

//-------------------------Insumos----------------------------------

/*test('Insumo Error', async () => {
  const component = render(
    <Router>
      <AgregarInsumo></AgregarInsumo>
    </Router>
  )

  const insumoNombre = await component.findByPlaceholderText('Pan');
  fireEvent.change(insumoNombre, { target: { value: 'Maiz' }});

  const insumoProveedor = await component.findByDisplayValue('Seleccione un proveedor');

  const nombreProveedor = await component.findByText('Paiz');
  userEvent.selectOptions(insumoProveedor, 'Paiz');

  
  const botonGuardar = await component.findByText('Guardar');
  fireEvent.click(botonGuardar);

  const message = await component.findByText('Error');

  console.log(prettyDOM(message))
})*/

/*test('Insumo Exito', async () => {
  const component = render(
    <Router>
      <AgregarInsumo></AgregarInsumo>
    </Router>
  )

  const insumoNombre = await component.findByPlaceholderText('Pan');
  fireEvent.change(insumoNombre, { target: { value: 'Maiz' }});

  const insumoProveedor = await component.findByDisplayValue('Seleccione un proveedor');

  const nombreProveedor = await component.findByText('Paiz');
  userEvent.selectOptions(insumoProveedor, 'Paiz');

  const insumoDescripcion = await component.findByPlaceholderText('Producto necesita estar refrigerado');
  fireEvent.change(insumoDescripcion, { target: { value: 'Producto necesita estar refrigerado' }});

  const cantidadActual = await component.findByPlaceholderText('80');
  fireEvent.change(cantidadActual, { target: { value: '80' }});

  const cantidadMinima = await component.findByPlaceholderText('20');
  fireEvent.change(cantidadMinima, { target: { value: '20' }});

  const cantidadMaxima = await component.findByPlaceholderText('100');
  fireEvent.change(cantidadMaxima, { target: { value: '100' }});
  
  const botonGuardar = await component.findByText('Guardar');
  fireEvent.click(botonGuardar);

  const message = await component.findByText('Registro exitoso');

  console.log(prettyDOM(message))
})*/

//-------------------------Impuesto----------------------------------

/*test('Impuesto Error', async()=>{
  const component = render(
    <Router>
      <AgregarImpuesto></AgregarImpuesto>
    </Router>
  )

  const valorImpuesto = await component.findByPlaceholderText('15%')
  fireEvent.change(valorImpuesto, {target: {value: ''}})
  
  const nombreImpuesto = await component.findByPlaceholderText('Gravado')
  fireEvent.change(nombreImpuesto, {target: {value: ''}})


  const buttonGuardar = await component.findByText('Guardar')
  fireEvent.click(buttonGuardar)

  const message = await component.findByText('Error')
})*/


/*test('Impuesto Exitoso', async()=>{
  const component = render(
    <Router>
      <AgregarImpuesto></AgregarImpuesto>
    </Router>
  )

  const valorImpuesto = await component.findByPlaceholderText('15%')
  fireEvent.change(valorImpuesto, {target: {value: '10'}})
  
  const nombreImpuesto = await component.findByPlaceholderText('Gravado')
  fireEvent.change(nombreImpuesto, {target: {value: 'Nuevo'}})

  const buttonGuardar = await component.findByText('Guardar')
  fireEvent.click(buttonGuardar)

  const message = await component.findByText('Error')

})*/

//-------------------------Cliente----------------------------------

/*test('Cliente Error', async()=>{
  const component = render(
    <Router>
      <AgregarCliente></AgregarCliente>
    </Router>
  )

  const tipoDocumento = await component.findByLabelText('Tipo Documento')
  fireEvent.click(tipoDocumento)

  const Visa = await component.findByText('Visa')
  userEvent.selectOptions(tipoDocumento, 'Visa')

  const numeroDocumento = await component.findByPlaceholderText('Numero documento')
  fireEvent.change(numeroDocumento, {target: {value: 'A12345678'}})


  const botonGuardar = await component.findByText('Guardar')
  fireEvent.click(botonGuardar)
  
  const message = await component.findByText('Error')
  
})*/

/*test('Cliente Exitoso', async()=>{
  const component = render(
    <Router>
      <AgregarCliente></AgregarCliente>
    </Router>
  )

  const tipoDocumento = await component.findByLabelText('Tipo Documento')
  fireEvent.click(tipoDocumento)

  const Visa = await component.findByText('Visa')
  userEvent.selectOptions(tipoDocumento, 'Visa')

  const numeroDocumento = await component.findByPlaceholderText('Numero documento')
  fireEvent.change(numeroDocumento, {target: {value: 'A12345678'}})

  const nombreCliente = await component.findByPlaceholderText('Juan Perez')
  fireEvent.change(nombreCliente, {target: {value: 'Juan Perez'}})

  const numeroCliente = await component.findByPlaceholderText('88922711')
  fireEvent.change(numeroCliente, {target: {value: '88922711'}})

  const correoCliente = await component.findByPlaceholderText('ejem@gmail.com')
  fireEvent.change(correoCliente, {target: {value: 'algo@gmail.com'}})
  
  const RTN = await component.findByPlaceholderText('08019999176681')
  fireEvent.change(RTN, {target: {value: '08019999176681'}})

  const botonGuardar = await component.findByText('Guardar')
  fireEvent.click(botonGuardar)
  
  const message = await component.findByText('Error')
  
})*/

//-------------------------Comentario----------------------------------

/*test('Comentario Error', async()=>{
  const component = render(
    <Router>
      <AgregarComentario></AgregarComentario>
    </Router>
  )

  const nombreSucursal = await component.findByDisplayValue('Seleccione una sucursal')
  fireEvent.click(nombreSucursal)

  const sucursal = await component.findByText('Sucursal del centro')
  userEvent.selectOptions(nombreSucursal, 'Sucursal del centro')

  const telefonoCliente = await component.findByPlaceholderText('98515484')
  fireEvent.change(telefonoCliente, {target: {value: '98515484'}})

  const botonGuardar = await component.findByText('Guardar')
  fireEvent.click(botonGuardar)
  
  const message = await component.findByText('Error')

  console.log(prettyDOM(sucursal))
})*/

test('Comentario Exitoso', async()=>{
  const component = render(
    <Router>
      <AgregarComentario></AgregarComentario>
    </Router>
  )

  const nombreSucursal = await component.findByDisplayValue('Seleccione una sucursal')
  fireEvent.click(nombreSucursal)

  const sucursal = await component.findByText('Sucursal del centro')
  userEvent.selectOptions(nombreSucursal, 'Sucursal del centro')

  const telefonoCliente = await component.findByPlaceholderText('98515484')
  fireEvent.change(telefonoCliente, {target: {value: '98515484'}})

  const correoCliente = await component.findByPlaceholderText('ejem@gmail.com')
  fireEvent.change(correoCliente, {target: {value: 'ejem@gmail.com'}})

  const descripcionComentario = await component.findByPlaceholderText('Excelente servicio')
  fireEvent.change(descripcionComentario, {target: {value: 'Excelente Servicio'}})

  const botonGuardar = await component.findByText('Guardar')
  fireEvent.click(botonGuardar)
  
  const message = await component.findByText('Error')

  console.log(prettyDOM(sucursal))
})

//-------------------------Delivery----------------------------------

/*test('Delivery Error', async()=>{
  const component = render(
    <Router>
      <AgregarDelivery></AgregarDelivery>
    </Router>
  )
  
  const clienteNombre = await component.findByDisplayValue('Seleccione un Cliente')
  fireEvent.click(clienteNombre)

  const cliente = await component.findByText('Alejandro')
  userEvent.selectOptions(clienteNombre, 'Alejandro')

  const repartidorNombre = await component.findByDisplayValue('Seleccione un Repartidor')
  fireEvent.click(repartidorNombre)

  const repartidor = await component.findByText('Axcel')
  userEvent.selectOptions(repartidorNombre, 'Axcel')
  
  const botonGuardar = await component.findByText('Guardar')
  fireEvent.click(botonGuardar)

  const message = await component.findByText('Error')
  console.log(prettyDOM(message))
})*/

/*test('Delivery Exitoso', async()=>{
  const component = render(
    <Router>
      <AgregarDelivery></AgregarDelivery>
    </Router>
  )
  
  const clienteNombre = await component.findByDisplayValue('Seleccione un Cliente')
  fireEvent.click(clienteNombre)

  const cliente = await component.findByText('Alejandro')
  userEvent.selectOptions(clienteNombre, 'Alejandro')

  const repartidorNombre = await component.findByDisplayValue('Seleccione un Repartidor')
  fireEvent.click(repartidorNombre)

  const repartidor = await component.findByText('Axcel')
  userEvent.selectOptions(repartidorNombre, 'Axcel')

  const ordenNombre = await component.findByDisplayValue('Seleccione una orden')
  fireEvent.click(ordenNombre)

  const orden = await component.findByText('46 - 2022-06-12 16:29:00')
  userEvent.selectOptions(ordenNombre, '46 - 2022-06-12 16:29:00')

  const comentario = await component.findByPlaceholderText('Al llegar toque el timbre.')
  fireEvent.change(comentario, {target: {value: 'Al llegar toque el timbre.'}})

  const horaDespacho = await component.findByLabelText('Hora Despacho')
  fireEvent.change(horaDespacho, {target: {value: '08:30'}})

  const horaEntrega = await component.findByLabelText('Hora Entrega')
  fireEvent.change(horaEntrega, {target: {value: '09:00'}})
  
  const botonGuardar = await component.findByText('Guardar')
  fireEvent.click(botonGuardar)

  const message = await component.findByText('Registro exitoso')
  console.log(prettyDOM(message))
})*/