import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { Button, Confirm, Icon, Popup } from "semantic-ui-react";
import { QUERY_ALL_POSTS } from "../Pages/Home";
type Props = {
  postId: string | undefined;
  commentID: string | undefined;
};

const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;
const DELETE_COMMENT = gql`
  mutation DeleteComment($postId: ID!, $commentID: ID!) {
    deleteComment(postId: $postId, commentID: $commentID) {
      comments {
        body
      }
    }
  }
`;

function DeleteItem({ postId, commentID }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const mutation = commentID ? DELETE_COMMENT : DELETE_POST;
  const [deletePostorComment] = useMutation(mutation, {
    variables: { postId: postId, commentID: commentID?.toString() },
    onCompleted() {
      setConfirmOpen(false);
    },
    refetchQueries: [{ query: QUERY_ALL_POSTS }],
  });
  const handleConfirm = () => {
    deletePostorComment();
  };
  return (
    <>
    <Popup
      content="Delete"
      position="bottom center"
      trigger={
      <Button
        as="div"
        color="red"
        floated="right"
        onClick={() => setConfirmOpen(true)}
      >
        <Icon name="trash" style={{ margin: 0 }} />
      </Button>}/>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}

export default DeleteItem;
