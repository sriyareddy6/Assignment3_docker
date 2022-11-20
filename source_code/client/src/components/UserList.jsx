import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserList() {

  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () =>{
      try {
        const url = "http://localhost:4000/api/user/lists";
        const {data: response} = await axios.get(url);
        setData(response)
      } catch (error) {
        console.error(error.message);
      }
    }

    fetchData();
  }, []);

  const checkLogin = (userId) => {
    let token = localStorage.getItem('token');

    console.log(token !== null)
    if(token !== null) {
      const api = 'http://localhost:4000/api/user/owner';
      axios.get(api,
        {
          headers: {
            "Authorization" : `Bearer ${token}`,
            "userId": userId
          } 
        }
      )
      .then(res => {
        // navigate('/');
          console.log(res);
          if(res.data) {
            navigate('/');
          } else {
            navigate('/login');
          }
          // setLoginUser(true)
      })
    } else {
      console.log("else block")
      navigate('/login');
    }
  }

    return (
        <div>
            {data.length > 0 && data.map((value, index) =>
              
                <div className="row mb-5 align-items-center" key={index}>
                    <div className="col-md-3 pr-0">
                        <img src={value.image} className="img-thumbnail pl-0" alt="Cinque Terre" width="304" height="236" />
                    </div>
                    <div className="col-md-5 mt-5">
                        <div>
                            <h2>{value.user_name}</h2>
                        </div>
                        <p className="description mt-3 pt-2 pr-3 pb-3 bio">{value.bio}</p>
                    </div>
                    <div className="col-md-4 align-middle">
                      <button onClick={() =>checkLogin(value._id)} className="btn btn-primary" type='button' >Edit</button>
                    </div>
                </div>
            )}
        </div>
    )
}