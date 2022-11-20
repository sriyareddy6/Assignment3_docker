import React, {useState, useEffect} from "react";
import axios from 'axios';

const Card = () => {
    
    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [avatar, setAvatar] = useState();
    const [tempAvatar, setTempAvatar] = useState();
    // console.log(tempAvatar !== '', tempAvatar);
    const handleName= (event)=>{
        setName(event.target.value);
        setEdit(true);
    }

    const handleDescription =(event)=>{
        setDescription(event.target.value);
        setEdit(true);
    }
    const handleSave=()=>{
        const formData = new FormData();
        formData.append('user_name', name)
        formData.append('bio', description)
        formData.append('image', avatar)
        async function updateRecords() {
        let token = localStorage.getItem('token');
        const api = 'http://localhost:4000/api/user/update';
            axios.post(api, formData, { headers: {"Authorization" : `Bearer ${token}`} })
            .then(res => {
                setTempAvatar();
                setAvatar(res.data.image);
            });
        }
        updateRecords();
        setEdit(false);
        window.alert("Updated successfully!");
    }

    function handleChangePhoto(e) {
        setEdit(true);
        setAvatar(e.target.files[0]);
        setTempAvatar(URL.createObjectURL(e.target.files[0]));
    }

    const [edit, setEdit] = useState(false);


    useEffect(() => {
        let token = localStorage.getItem('token');
        const api = 'http://localhost:4000/api/user/me';
        axios.get(api, { headers: {"Authorization" : `Bearer ${token}`} })
        .then(res => {
            // setUserData(res.data);
            setName(res.data.user_name);
            setDescription(res.data.bio)
            setAvatar(res.data.image)
        //     console.log("Before run");
        })
        .catch(err => {
            // setUserData();
            console.log(err)
        });
    }, [])


  return (
    <div className="container">
        {(name !== undefined && description !== undefined && avatar !== undefined) &&
            <div className="row">
                <div className="col-md-3 pr-0 img_wrap">
                    <img src={ tempAvatar !== undefined ? tempAvatar : avatar} className="img-thumbnail" alt="Cinque Terre" width="304" height="236" />
                    <input className="user_profile" type="file" name="image" onChange={handleChangePhoto} />
                </div>
                <div className="col-md-9 mt-5 pl-0">
                    <div>
                    <input type="text" value={name} className="avatar" onChange={(e) => handleName(e)} />
                    </div>
                    <textarea name="description" className="description mt-3 pl-4 pt-2 pr-3 pb-3" value={description} cols="90" rows="6" onChange={handleDescription}></textarea>
                </div>
                {
                    edit?<button type="button" className="btn btn-success save_button" onClick={handleSave}>save</button>:
                    <button type="button" className="btn btn-danger save_button disabled_btn" disabled>save</button>
                }
            </div>
        }
    </div>
  );
};

export default Card;
