import {BrowserRouter, Route, Routes} from 'react-router-dom';
import { Signin } from './pages/Signin';
import { Signup } from './pages/Signup';
import { SendMoney } from './pages/SendMoney';
import { Dashboard } from './pages/Dashboard';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<Signup></Signup>}></Route>
        <Route path='/signin' element={<Signin></Signin>}></Route>
        <Route path='/dashboard' element={<Dashboard></Dashboard>}></Route>
        <Route path='/send' element={<SendMoney></SendMoney>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
