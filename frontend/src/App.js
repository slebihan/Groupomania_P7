import React from 'react';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Home from './components/Home'
import UserProfile from './components/UserProfile';
import Admin from './components/Admin'
import UserProfileEdit from './components/UserProfileEdit';
import Dashboard from './components/Dashboard';


const App = () => {


  return (
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />}/>
          <Route exact path='/UserProfile/Admin' element={<Admin />}/>
          <Route exact path='/UserProfile/Admin/Dashboard' element={<Dashboard />}/>
          <Route path='/UserProfile/:userId' element={<UserProfile/>} />
          <Route path='/UserProfileEdit/:userId' element={<UserProfileEdit/>}/>
          <Route path='/api/logout/' element={<Home/>}/>

        </Routes>

       </BrowserRouter>
  );
}

export default App;
