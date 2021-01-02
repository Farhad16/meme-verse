import React, { useContext, useEffect, useState } from 'react';
import UploadImage from '../UploadImage/UploadImage';
import axios from 'axios';
import './NewsFeed.css';
import Memes from '../Memes/Memes';
import { UserContext } from '../../../App';

const NewsFeed = () => {
  const [memes, setMemes] = useState([]);
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [pageState, setPageState] = useState(null)
  const [comment, setComment] = useState();

  useEffect(() => {
    axios.get('https://protected-fortress-52581.herokuapp.com/api/memes')
      .then(response => {
        if (response) {
          setMemes(response.data)
          setIsLoading(false)
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
      const url = `https://protected-fortress-52581.herokuapp.com/api/write-comment`
      axios.post(url, {
        commentData: commentData
      })
        .then(response => {
          handlePageChange(response.data);
          event.target.value = '';
        })
        .catch(function (error) {
          console.log(error);
        })
    }
    event.preventDefault();
  }

  const handleLike = (color, _id) => {
    const status = color;
    const id = _id;
    const username = loggedInUser.username;
    const likeData = {
      id,
      username
    }
    if (status === true) {
      const url = `https://protected-fortress-52581.herokuapp.com/api/remove-like`
      axios.delete(url, {
        data: {
          likeData: likeData
        }
      })
        .then(response => {
          handlePageChange(response.data);
        })
        .catch(function (error) {
          console.log(error);
        })
    } else {
      const url = `https://protected-fortress-52581.herokuapp.com/api/give-like`
      axios.post(url, {
        likeData: likeData
      })
        .then(response => {
          handlePageChange(response.data);
        })
        .catch(function (error) {
          console.log(error);
        })
    }


  }

  return (
    <div className="news-feed">
      <div className="max-width feeds">
        <div className="row my-3">
          <UploadImage handlePageChange={handlePageChange}></UploadImage>
        </div>
        <div className="row mt-3">
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
                  handleLike={handleLike}
                />
              )
          }
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;