import React from "react";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { Button, Form } from "semantic-ui-react";
import {useNavigate} from "react-router-dom"

const LOGIN_USER = gql`
  mutation LoginUser($input: RegisterInput!) {
    registerUser(input: $input) {
      username
      email
      token
      id
    }
  }
`;

type AuthUser = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type Props = {};

const initialState = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function Register({}: Props) {
  const navigate = useNavigate()
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
  const [registerUser, { loading }] = useMutation(LOGIN_USER, {
    onError(err: ApolloError) {
      setErrors(
        err.graphQLErrors[0].extensions.errors as { [key: string]: string }
      );
    },
    onCompleted(){
      navigate("/")
    }
  });
  const [values, setValues] = React.useState<AuthUser>(initialState);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    registerUser({
      variables: {
        input: {
          username: values.username,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
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
          label="Email"
          placeholder="Email.."
          name="email"
          type="email"
          value={values.email}
          error={errors.email ? true : false}
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
        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password.."
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          error={errors.confirmPassword ? true : false}
          onChange={onChange}
        />
        <Button type="submit" secondary>
          Register
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

export default Register;
