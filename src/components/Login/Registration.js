import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios'
import { useForm } from 'react-hook-form';

const Registration = () => {
  const [registerData, setRegisterData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState({});
  const history = useHistory();
  const [checking, setChecking] = useState(false);

  const { handleSubmit } = useForm();

  const handleBlur = (e) => {
    const newInfo = { ...registerData }
    newInfo[e.target.name] = e.target.value;
    setRegisterData(newInfo)
  }

  const onSubmit = (data, e) => {
    setChecking(true);
    axios.post('https://protected-fortress-52581.herokuapp.com/api/register', {
      registerData: registerData
    })
      .then(response => {
        if (response.data.code === 500) {
          setError(response.data.status);
          setChecking(false);
        }
        else {
          setSuccess(response.data);
          setChecking(false);
          setError('')
          alert('Registration success');
          history.replace('/home')
          e.target.reset()
        }
      })
      .catch(error => {
        console.error(error)
      })

    e.preventDefault();
  }

  return (
    <div className="signInAndSignUp">
      <div className="signUp">
        {
          checking
            ?
            <p className="waiting mb-3">Register in progress please wait....</p>
            : ''
        }
        <form action="" onSubmit={handleSubmit(onSubmit)}>
          <h5>Create an account</h5>

          <input type="text" name="username" onBlur={handleBlur} placeholder="Username or Email" required /><br />
          <input type="password" name="password" onBlur={handleBlur} placeholder="Password" required /><br />
          <input type="password" name="password1" onBlur={handleBlur} placeholder="Confirm Password" required /><br />
          <br />
          <p className="credential">
            ( Passwor at least 6 characters, must contain at least one <br />
           lower-case letter, one numeric digit and a special character )
          </p>
          <input type="submit" className="createAccount" onClick={handleSubmit} value="Create Account" />
          <p className="note">
            Already have an account?
              <Link to="/login" className="colorBlue">{" "}Login</Link>
          </p>
        </form>
        <p className="error">{error}</p>
      </div>
    </div>
  );
};

export default Registration;