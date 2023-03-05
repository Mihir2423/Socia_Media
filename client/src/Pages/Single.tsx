import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import decode from "jwt-decode";
import {
  Button,
  Card,
  Form,
  Grid,
  Icon,
  Image,
  Label,
  Popup,
} from "semantic-ui-react";
import { PostType } from "./Home";
import moment from "moment";
import LikeItem from "../components/LikeItem";
import { DecodedToken } from "../components/MenuItem";
import DeleteItem from "../components/DeleteItem";
import React, { useState } from "react";

type Props = {};

const FETCH_POST = gql`
  query GetPost($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation CreateComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

type Comment = {
  username: string;
  id: string;
  createdAt: string;
  body: string;
};

const initailState = {
  body: "",
  postId: "",
};

type CommentInput = {
  body: string;
  postId: string;
};

function Single({}: Props) {
  const { postId } = useParams();
  const token = localStorage.getItem("token");

  const user = token ? (decode(token) as DecodedToken) : null;

  const [comment, setComment] = useState<CommentInput>(initailState);

  const [createComment] = useMutation(CREATE_COMMENT);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setComment({ ...comment, [event.target.name]: event.target.value });
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    createComment({
      variables: {
        postId: postId,
        body: comment.body,
      },
    });
    setComment(initailState);
    refetch();
  };

  const {
    loading,
    data: post,
    refetch,
  } = useQuery(FETCH_POST, {
    variables: {
      postId,
    },
  });

  let postMarkup;

  if (loading) {
    postMarkup = <h1>Loading Posts..</h1>;
  } else {
    const { body, createdAt, username, comments, commentCount } = post.getPost;
    const date = new Date(Number(createdAt));

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              size="small"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(date).fromNow(true)}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeItem post={post.getPost} />
                <Popup
                  content={`${commentCount} comments`}
                  position="bottom center"
                  trigger={
                    <Button
                      as="div"
                      labelPosition="right"
                      onClick={() => console.log("Comment on post")}
                    >
                      <Button basic color="blue">
                        <Icon name="comments" />
                      </Button>
                      <Label basic color="blue" pointing="left">
                        {commentCount}
                      </Label>
                    </Button>
                  }
                />
              </Card.Content>
              {user && (
                <Card fluid>
                  <Card.Content>
                    <p>Post a comment</p>
                    <Form
                      noValidate
                      onSubmit={onSubmit}
                      className={loading ? "loading" : ""}
                    >
                      <div className="ui action input fluid">
                        <input
                          type="text"
                          placeholder="Comment.."
                          name="body"
                          value={comment.body}
                          onChange={onChange}
                        />
                        <button
                          type="submit"
                          className="ui button teal"
                          disabled={comment.body.trim() === ""}
                        >
                          Submit
                        </button>
                      </div>
                    </Form>
                  </Card.Content>
                </Card>
              )}
              {comments.map((comment: Comment) => (
                <Card fluid key={comment.id}>
                  <Card.Content>
                    {user && user.username === comment.username && (
                      <DeleteItem postId={postId} commentID={comment.id} />
                    )}
                    <Card.Header>{comment.username}</Card.Header>
                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                    <Card.Description>{comment.body}</Card.Description>
                  </Card.Content>
                </Card>
              ))}
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
}

export default Single;
