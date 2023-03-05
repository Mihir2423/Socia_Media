import React from "react";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { Button, Form } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

const LOGIN_USER = gql`
  mutation LoginUser($input: LoginInput!) {
    loginUser(input: $input) {
      username
      email
      token
      id
    }
  }
`;

type AuthUser = {
  username: string;
  password: string;
};

type Props = {};

const initialState = {
  username: "",
  password: "",
};

function Login({}: Props) {
  const navigate = useNavigate();
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    onError(err: ApolloError) {
      setErrors(
        err.graphQLErrors[0].extensions.errors as { [key: string]: string }
      );
    },
    onCompleted(data) {
      navigate("/");
      localStorage.setItem("token", data.loginUser.token);
    },
  });
  const [values, setValues] = React.useState<AuthUser>(initialState);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    loginUser({
      variables: {
        input: {
          username: values.username,
          password: values.password,
        },
      },
    });
    setErrors({});
  };
  return (
    <div className="form-container">
      <Form noValidate onSubmit={onSubmit} className={loading ? "loading" : ""}>
        <h1>Login</h1>
        <Form.Input
          label="Username"
          placeholder="Username.."
          name="username"
          type="text"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          placeholder="Password.."
          name="password"
          type="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
        />
        <Button type="submit" secondary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Login;
