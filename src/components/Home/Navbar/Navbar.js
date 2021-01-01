import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../App';
import './Navbar.css';


const Navbar = () => {
	const [loggedInUser, setLoggedInUser] = useContext(UserContext);

	return (
		<div className="navColor sticky-top">
			<nav className="navbar navbar-expand-lg navbar-light">
				<Link className="navbar-brand" to="/home">
					<span className="name">Meme</span>
					<span className="name colorYellow">Verse</span>
				</Link>
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarSupportedContent">
					<ul className="navbar-nav mr-auto">
						<li className="nav-item">
							<Link to="/" className="nav-link">News Feed</Link>
						</li>
					</ul>
					<ul className="navbar-nav ml-auto">
						{
							loggedInUser.username ?
								<li className="nav-item">
									<Link to="/login" onClick={() => { setLoggedInUser({}); sessionStorage.clear() }} className="nav-link">Logout</Link>
								</li>

								:
								<li className="nav-item">
									<Link to="/login" className="nav-link">Login</Link>
								</li>
						}
						<li className="nav-item">
							<span className="nav-link inactive">/</span>
						</li>
						{
							loggedInUser.username ?
								<li className="nav-item">
									<span className="nav-link inactive">{loggedInUser.username}</span>
								</li>
								:
								<li className="nav-item">
									<Link to="/register" className="nav-link">Registration</Link>
								</li>
						}

					</ul>
				</div>
			</nav >
		</div >
	);
};

export default Navbar;