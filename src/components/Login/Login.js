import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory, useLocation } from 'react-router-dom';
import './Login.css'
import axios from 'axios'
import { UserContext } from '../../App';


const Login = () => {
	const [loggedInUser, setLoggedInUser] = useContext(UserContext);
	const [error, setError] = useState('');
	const [loginData, setLoginData] = useState({});
	const { handleSubmit } = useForm();

	const history = useHistory();
	const location = useLocation();
	let { from } = location.state || { from: { pathname: "/" } };

	const handleBlur = (e) => {
		const newInfo = { ...loginData }
		newInfo[e.target.name] = e.target.value;
		setLoginData(newInfo)
	}


	const onSubmit = (data, e) => {
		axios.post('https://protected-fortress-52581.herokuapp.com/api/login', {
			loginData: loginData
		})
			.then(response => {
				if (response.data.code === 401) {
					setError(response.data.status);
				} else {
					localStorage.setItem('token', response.data.token);
					setLoggedInUser(loginData);
					setError('')
					if (from) {
						history.replace(from)
					}
					history.replace("/")
					alert('Login success');
					e.target.reset();
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
				<form action="" onSubmit={handleSubmit(onSubmit)}>
					<h5>Login</h5>
					<input type="text" name="username" onBlur={handleBlur} placeholder="Username or Email" required /><br />
					<input type="password" name="password" onBlur={handleBlur} placeholder="Password" required /><br />
					<p className="sizing">
						<span className="colorBrown" >Forget Password?</span>
					</p><br />
					<input type="submit" className="createAccount" onClick={handleSubmit} value="Login" />
					<p className="note">
						Don't have an account?
						<Link to="/register" className="colorBlue">{" "}Create an account</Link>
					</p>
				</form>
				<p className="error">{error}</p>
			</div>
		</div >
	);
};

export default Login;