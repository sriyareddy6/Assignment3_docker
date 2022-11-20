import React, {useState, useEffect} from "react";
import { Routes, Route  } from "react-router-dom";
import Navbar from "./components/navbar";
import RecordList from "./components/recordList";
import Register from "./components/auth/Regstration";
import Login from "./components/auth/Login";
import UserList from "./components/UserList";
import axios from 'axios';

const App = () => {
  const [userLoggedIn,setLoginUser] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem('token');
    const api = 'http://localhost:4000/api/user/verify';
    axios.get(api, { headers: {"Authorization" : `Bearer ${token}`} })
    .then(res => {
        console.log(res);
        setLoginUser(true)
    })
    .catch(err => {
      localStorage.removeItem("token");
      console.log(err)
      setLoginUser(false)
    })
  }, []);

  return (
    <div>
      <Navbar userLoggedIn={userLoggedIn} />
      <div style={{ margin: 20 }}>
      <Routes>
        <Route exact path="/" element={<RecordList />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/user-list" element={<UserList />} />
        <Route exact path="/login" element={<Login />} />
      </Routes>
      </div>
    </div>
  );
};

export default App;
