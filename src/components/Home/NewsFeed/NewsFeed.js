import React, { useContext, useEffect, useState } from 'react';
import UploadImage from '../UploadImage/UploadImage';
import axios from 'axios';
import './NewsFeed.css';
import Memes from '../Memes/Memes';
import { UserContext } from '../../../App';

const NewsFeed = () => {
  const [memes, setMemes] = useState([]);
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [pageState, setPageState] = useState(null)
  const [comment, setComment] = useState();

  useEffect(() => {
    axios.get('http://localhost:5000/api/memes')
      .then(response => {
        if (response) {
          setMemes(response.data)
          setIsLoading(false)
        } else {
          setMessage('No result found')
        }
      })
  }, [pageState])

  const handlePageChange = (pageState) => {
    setPageState(pageState)
  }


  const writeAComment = (event, _id) => {
    const comment = event.target.value;
    const id = _id;
    const username = loggedInUser.username;
    const commentData = {
      comment,
      id,
      username
    }
    if (event.keyCode === 13) {
      const url = `http://localhost:5000/api/write-comment`
      axios.post(url, {
        commentData: commentData
      })
        .then(response => {
          setComment(response.data);
          handlePageChange(response.data);
          event.target.value = '';
        })
        .catch(function (error) {
          console.log(error);
        })
    }
    event.preventDefault();
  }

  return (
    <div className="news-feed">
      <div className="feeds">
        <div className="max-width">
          <UploadImage handlePageChange={handlePageChange}></UploadImage>
        </div>
        <div className="row max-width">
          {
            isLoading ?
              <div className="col-md-12 d-flex justify-content-center py-5">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
              : memes.slice(0).reverse().map((meme) =>
                <Memes
                  pageState={pageState}
                  key={meme._id}
                  meme={meme}
                  writeAComment={writeAComment}
                />
              )
          }
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;