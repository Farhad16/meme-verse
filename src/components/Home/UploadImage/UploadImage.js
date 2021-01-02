import React, { useContext, useRef, useState } from 'react';
import { UserContext } from '../../../App';
import './UploadImage.css';
import avatar from '../../images/avatar.png';
import { useForm } from 'react-hook-form';

const UploadImage = ({ handlePageChange }) => {
  const ref = useRef();
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const { handleSubmit } = useForm();

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const onSubmit = (data, e) => {
    const formData = new FormData()
    formData.append('file', file);
    formData.append('username', loggedInUser.username);

    fetch('https://protected-fortress-52581.herokuapp.com/api/upload-image', {
      method: 'POST',
      body: formData,
      // headers: {
      //   'Content-Type': 'application/json'
      // },
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          ref.current.value = ""
          setFile(null);
          handlePageChange(file)
          alert("Meme added successfully wait a moment");
        }
      })
      .catch(error => {
        console.error(error)
      })

    e.preventDefault();
  }

  const removeImage = () => {
    ref.current.value = ""
    setFile(null);
  }

  return (
    <div className="col-md-12 my-3 upload">
      <div className="mt-3">
        <form action="" onSubmit={handleSubmit(onSubmit)}>
          <button onClick={() => removeImage()} className={file ? 'remove-img' : 'displayNone'}>X</button>
          <img className="upload-img" src={file ? URL.createObjectURL(file) : avatar} alt={file ? file.name : null} /> <br />
          <input type="file" onChange={handleFileChange} ref={ref} required />
          <br />
          <button className="btn btn-outline-primary mt-2" type="submit">Upload</button>
        </form>
      </div>
    </div>
  );
};

export default UploadImage;