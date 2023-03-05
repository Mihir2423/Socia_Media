import { Button, Form } from "semantic-ui-react";
import {ApolloError, gql, useMutation } from "@apollo/client";
import React from "react";
import {QUERY_ALL_POSTS} from "../Pages/Home"

const CREATE_POST = gql`
  mutation CreatePost($input: PostInput!) {
    createPost(input: $input) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

const initialState = {
  body: "",
};

type Input = {
  body : string
}

type Props = {};

export default function PostForm({}: Props) {
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
  const [createPost] = useMutation(CREATE_POST, {
    onError(err: ApolloError) {
      setErrors(
        err.graphQLErrors[0].extensions.errors as { [key: string]: string }
      );
    },
    refetchQueries: [{ query: QUERY_ALL_POSTS }],
  });

  const [values, setValues] = React.useState<Input>(initialState);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    createPost({
      variables: {
        input: {
          body: values.body,
        },
      },
    });
    setErrors({});
    setValues(initialState)
  };

  return (
    <Form onSubmit={onSubmit}>
      <h2>Create a post:</h2>
      <Form.Field>
        <Form.Input
          placeholder="Hi World!"
          name="body"
          onChange={onChange}
          value={values.body}
          error={errors ? false : true}
        />
        <Button type="submit" color="teal">
          Submit
        </Button>
      </Form.Field>
    </Form>
  );
}
