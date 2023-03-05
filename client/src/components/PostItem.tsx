import React from "react";
import { Button, Card, Icon, Label, Image, Popup } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";
import LikeItem from "./LikeItem";
import DeleteItem from "./DeleteItem";
import decode from "jwt-decode";
import { DecodedToken } from "./MenuItem";

export type Props = {
  post: {
    username: string;
    body: string;
    userId: string;
    id: string;
    likeCount: string;
    commentCount: string;
    createdAt: string;
    likes: Like[];
  };
};
interface Like {
  createdAt: string;
  username: string;
  id: string;
}

function PostItem({ post }: Props) {
  const date = new Date(Number(post.createdAt));

  const token = localStorage.getItem("token");

  const user = token ? (decode(token) as DecodedToken) : null;

  return (
    <Card fluid>
      <Card.Content>
        <Popup
          content="User"
          trigger={
            <Image
              floated="right"
              size="mini"
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
            />
          }
        />
        <Card.Header>{post.username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${post.id}`}>
          {moment(date).fromNow(true)}
        </Card.Meta>
        <Card.Description>{post.body}</Card.Description>
      </Card.Content>
      <Card.Content>
        <LikeItem post={post} />
        <Popup
          content="Comments"
          position="bottom center"
          trigger={
            <Button as="div" labelPosition="right">
              <Button
                basic
                color="blue"
                as={Link}
                to={user ? `/post/${post.id}` : "/login"}
              >
                <Icon name="comments" />
              </Button>
              <Label as="a" basic color="blue" pointing="left">
                {post.commentCount}
              </Label>
            </Button>
          }
        />
        {user && user.username === post.username && (
          <DeleteItem postId={post.id} commentID={undefined} />
        )}
      </Card.Content>
    </Card>
  );
}

export default PostItem;
