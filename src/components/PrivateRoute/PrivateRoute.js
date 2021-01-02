import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from '../../App';
import jwt_decode from "jwt-decode";


const PrivateRoute = ({ children, ...rest }) => {
	const [loggedInUser, setLoggedInUser] = useContext(UserContext);

	const isLoggedIn = () => {
		const token = localStorage.getItem('token');
		if (!token) {
			return false;
		}
		const decodedToken = jwt_decode(token);
		const tokenSecret = { ...loggedInUser };
		tokenSecret.username = decodedToken.username;
		tokenSecret._id = decodedToken._id;

		setLoggedInUser(tokenSecret)

		return tokenSecret.username;
	}

	return (
		<Route
			{...rest}
			render={({ location }) =>
				(loggedInUser.username || isLoggedIn()) ? (
					children
				) : (
						<Redirect
							to={{
								pathname: "/login",
								state: { from: location }
							}}
						/>
					)
			}
		/>
	);
};

export default PrivateRoute;