import React, {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const [error, setError] = useState("");
	  const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
        const userInfo = {
            'user_name': name,
            'email': email,
            'password': password,
            'bio': '',
            'image': 'avatar.jpg'
        };
        
        console.log(userInfo)
        try{
          const url = "http://localhost:4000/api/user/register";
          await axios.post(url, userInfo);
          navigate("/login");
        }catch(error) {
          if (
            error.response &&
            error.response.status >= 400 &&
            error.response.status <= 500
          ) {
            setError(error.response.data.message);
          }
        }

    }

    return (
        <section className="vh-100" style={{"backgroundColor": "#eee"}}>
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-11">
              <div className="card text-black" style={{"borderRadius": "25px"}}>
                <div className="card-body p-md-5">
                  {error &&
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="close" data-dismiss="alert" onClick={() => setError()} aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  }
                  <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">

                      <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>

                      <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                          <div className="form-outline flex-fill mb-0">
                              <label className="form-label" htmlFor="form3Example1c">Your Name</label>
                              <input type="text" value={name} required onChange={(e) => setName(e.target.value)} id="form3Example1c" className="form-control" />
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                          <div className="form-outline flex-fill mb-0">
                              <label className="form-label" htmlFor="form3Example3c">Your Email</label>
                            <input type="email" value={email} required onChange={(e) => setEmail(e.target.value)} id="form3Example3c" className="form-control" />
                            
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                          <div className="form-outline flex-fill mb-0">
                              <label className="form-label"  htmlFor="form3Example4c">Password</label>
                            <input type="password" value={password} required onChange={(e) => setPassword(e.target.value)} id="form3Example4c" className="form-control" />
                            
                          </div>
                        </div>
                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                          <button type="submit" className="btn btn-primary btn-lg">Register</button>
                        </div>

                      </form>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
}