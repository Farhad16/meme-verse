import React, { useContext, useRef, useState } from 'react';
import { UserContext } from '../../../App';
import './UploadImage.css';
import avatar from '../../images/avatar.png';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const UploadImage = ({ handlePageChange }) => {
  const ref = useRef();
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const { handleSubmit } = useForm();
  const [imageUrl, setImageUrl] = useState("")
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    setFile(e.target.files[0]);
    const files = e.target.files
    const formData = new FormData()
    formData.append('file', files[0]);
    formData.append('upload_preset', 'memeVerse');

    const res = await fetch('https://api.cloudinary.com/v1_1/dla3bk84z/image/upload', {
      method: 'POST',
      body: formData,
    })
    const data = await res.json();
    const url = data.secure_url
    setImageUrl(url)
  }

  const onSubmit = (data, e) => {
    if (imageUrl) {
      setLoading(true);
      axios.post('https://protected-fortress-52581.herokuapp.com/api/upload-image', {
        uploadData: {
          username: loggedInUser.username,
          imageUrl: imageUrl
        }
      })
        .then(response => {
          if (response.data) {
            setLoading(false);
            ref.current.value = ""
            setFile(null);
            handlePageChange(file);
            alert("Upload successfully");
          }
        })
        .catch(error => {
          console.error(error)
        })
    } else {
      alert("Wait a second and try to upload again")
    }

    e.preventDefault();
  }

  const removeImage = () => {
    ref.current.value = ""
    setFile(null);
    setLoading(false);
  }

  return (
    <div className="upload col-md-12">
      <p className="waitint">
        {
          loading ? 'Wait a moment uploading...' : ''
        }
      </p>
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