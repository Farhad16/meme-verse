import React, { useContext, useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import Modal from 'react-modal';
import Zoom from 'react-reveal/Zoom';
import './Memes.css';
import axios from 'axios';
import { UserContext } from '../../../App';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 545,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    marginLeft: 'auto',
    fontSize: '14px',
    color: '#000000',
    outline: 'none',
  },
  like: {
    marginRight: 'auto',
    fontSize: '14px',
    color: '#000000',
  },
  avatar: {
    backgroundColor: red[500],
  },
  alignAndBorder: {
    borderBottom: '1px solid #dddddd',
    display: 'flex',
    justifyContent: 'space-between ',
  },
  color: {
    marginRight: 'auto',
    fontSize: '14px',
    color: '#0060EB'
  },

}));

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    overflowY: 'scroll'
  }
};

Modal.setAppElement('#root')



const Memes = ({ meme, writeAComment, pageState, handleLike }) => {
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const { username, imageUrl, _id } = meme;
  const ref = useRef();
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [allComments, setAllComments] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [color, setColor] = useState(false);
  const [allLikes, setAllLikes] = useState();
  const [individualLike, setindividualLike] = useState(null);

  useEffect(() => {
    axios.get(`https://protected-fortress-52581.herokuapp.com/api/comments/${_id}`)
      .then(response => {
        if (response) {
          setAllComments(response.data)
          setIsLoading(false)
        }
      });
  }, [_id, allComments]);

  useEffect(() => {
    axios.get(`https://protected-fortress-52581.herokuapp.com/api/likes/${_id}`)
      .then(response => {
        if (response) {
          setAllLikes(response.data)
          setIsLoading(false)
        }
      });
  }, [_id, pageState]);

  useEffect(() => {
    const username = loggedInUser.username;
    const userLikes = {
      username,
      _id
    }
    axios.post(`https://protected-fortress-52581.herokuapp.com/api/userlikes`, {
      userLikes: userLikes
    })
      .then(response => {
        if (response.data) {
          setColor(!color);
        }
      });
  }, [username]);

  const openModal = (allLikes) => {
    setindividualLike(allLikes)
  }

  const closeModal = () => {
    setindividualLike(null)
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleColor = () => {
    setColor(!color);
  }

  return (
    <div className="col-md-12 mt-3">
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              user
            </Avatar>
          }
          title={username}
        />
        <CardMedia
          className={classes.media}
          image={imageUrl}
          title="Paella dish"
        />
        <CardActions disableSpacing className={classes.alignAndBorder}>
          <IconButton
            className={classes.like}
            aria-label="add to favorites"
            onClick={() => { openModal(allLikes) }}
          >

            {
              allLikes ? allLikes.length + ' Likes'
                : ''
            }
          </IconButton>
          <IconButton
            className={classes.expand}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            {
              allComments ? allComments.length + ' Comments'
                : ''
            }
          </IconButton>
        </CardActions>
        <CardActions disableSpacing className={classes.borderBottom}>
          <IconButton
            aria-label="add to favorites"
            className={color ? classes.color : classes.like}
            onClick={() => { handleColor(); handleLike(color, _id) }}
          >
            <ThumbUpIcon /> Like
          </IconButton>
          <IconButton aria-label="comment">
          </IconButton>
          <IconButton
            className={classes.expand}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ChatBubbleOutlineIcon /> Comment

          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>Comments:</Typography>
            <Typography paragraph>
              <input
                type="text"
                name="comment"
                className="form-control"
                onKeyUp={(event) => writeAComment(event, _id)}
                ref={ref} placeholder="Write a comment...."
              />
              {
                allComments ?
                  (isLoading ?
                    <div className="col-md-12 d-flex justify-content-center">
                      <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                    : allComments.map((comment) =>
                      <div key={comment._id} className="show-comment my-3 pt-3 pb-2">
                        <p className="username">{comment.username}</p>
                        <p>{comment.comment}</p>
                      </div>
                    )
                  )
                  : '0 comments'
              }
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
      {
        individualLike && (
          <Modal
            isOpen={true}
            onRequestClose={closeModal}
            style={customStyles}
          >
            <Zoom>
              <div className="modal-style">
                <div className="d-flex justify-content-between modal-header">
                  <p>All</p>
                  <button
                    className="close-modal"
                    onClick={closeModal}
                  > x
                  </button>
                </div>
                <div className="totalLike mt-3">
                  {
                    individualLike.map((like, index) => <p key={index}>{like.username}</p>)
                  }
                </div>
              </div>
            </Zoom>
          </Modal>
        )
      }
    </div >
  );
};

export default Memes;