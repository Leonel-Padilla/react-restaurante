import './App.css';
import Empleado from './Componentes/Empleado/Empleado'
import { Link, Route, Routes, BrowserRouter} from 'react-router-dom';
import { Avatar, Button, Card, Input, useBodyScroll,} from '@nextui-org/react'


function App() {
  return (
    <div>
      {/*<Card className='nav'>
          <Button>Regresar</Button>
          <h3>Registrar Empleado</h3>
          <Avatar className='avatar' color={'gradient'} text={'Nombre'} textColor={'white'}></Avatar>
      </Card>*/}

      <Link to={'/Empleados'}><Button>Empleado</Button></Link>

      <section>
        <Routes>
          <Route path='/' element={<h1>Aqui va el login</h1>}></Route>
          <Route path='/Empleados/*' element={<Empleado></Empleado>}></Route>
        </Routes>
      </section>
    </div>
  );
}

export default App;
