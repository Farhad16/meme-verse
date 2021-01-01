import React from 'react';
import Navbar from '../Navbar/Navbar';
import NewsFeed from '../NewsFeed/NewsFeed';
import './Home.css'

const Home = () => {


    return (
        <div>
            <Navbar />
            <NewsFeed />
        </div>
    );
};

export default Home;