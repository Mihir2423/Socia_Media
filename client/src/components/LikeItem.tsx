import { useEffect, useState } from "react";
import { Button, Icon, Label, Popup } from "semantic-ui-react";
import { Props } from "./PostItem";
import decode from "jwt-decode";
import { DecodedToken } from "./MenuItem";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

const LIKE_POST = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

function LikeItem({ post }: Props) {
  const token = localStorage.getItem("token");

  const user = token ? (decode(token) as DecodedToken) : null;

  const [liked, setLiked] = useState(false);

  const [likePost] = useMutation(LIKE_POST);

  useEffect(() => {
    if (user && post.likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, post.likes]);

  const likeButton = user ? (
    liked ? (
      <Button color="teal">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="teal" basic>
      <Icon name="heart" />
    </Button>
  );

  return (
    <Popup
      content={!liked ? "Like" : "Unlike"}
      position="bottom center"
      trigger={
        <Button
          as="div"
          labelPosition="right"
          onClick={() => {
            likePost({
              variables: { postId: post.id.toString() },
            });
          }}
        >
          {likeButton}
          <Label as="a" basic color="blue" pointing="left">
            {post.likeCount}
          </Label>
        </Button>
      }
    />
  );
}

export default LikeItem;
