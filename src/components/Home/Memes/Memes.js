import React, { useEffect, useRef, useState } from 'react';
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
import ShareIcon from '@material-ui/icons/Share';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import './Memes.css';
import axios from 'axios';

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
  }
}));



const Memes = ({ meme, writeAComment, pageState }) => {
  const { username, likes, comments, image, _id } = meme;
  const ref = useRef();
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [allComments, setAllComments] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [color, setColor] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/comments/${_id}`)
      .then(response => {
        if (response) {
          setAllComments(response.data)
          setIsLoading(false)
        }
      });
  }, [_id, allComments]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/likes/${_id}`)
      .then(response => {
        if (response) {
          setAllComments(response.data)
          setIsLoading(false)
        }
      });
  }, [_id, pageState]);


  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleColor = () => {
    setColor(!color);
  }

  return (
    <div className="col-md-12 my-3">
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
          image={`data:image/png;base64,${image.img}`}
          title="Paella dish"
        />
        <CardContent>
        </CardContent>
        <CardActions disableSpacing className={classes.alignAndBorder}>
          <IconButton
            className={classes.like}
            aria-label="add to favorites">
            {/* {
              likes.length > 0
                ? likes.length + ' Likes'
                : ''
            } */}
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
            onClick={handleColor}
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
    </div >
  );
};

export default Memes;