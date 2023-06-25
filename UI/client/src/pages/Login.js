import React, { useContext, useState, useEffect } from "react";
import {decode as base64_decode, encode as base64_encode, encode} from 'base-64';
import Cookies from 'universal-cookie';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script';
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
} from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/auth";
import { useForm } from "../utils/hooks";
import "../components/styles/common.css";
import axios from "axios";
import GoogleLoginPage from "./GoogleLoginPage";

const Login = (props) => {
  const context = useContext(AuthContext);
  // const { onChange, onSubmit, values } = useForm(loginUserCallback, {
  //   username: "",
  //   password: "",
  // });

  const [errors, setErrors] = useState({});

  const [details, setDetails] = useState({});
  const onChange = (event) => {
    details[event.target.name] = event.target.value;
  }
  const login = () => {
    console.log(details);
    
    let encoded = base64_encode(details['username']+":"+details['password']);
    axios.post("http://127.0.0.1:5000/login", {
      "code":encoded
    }, {
      headers:{
        'Authorization': `Basic  ${encoded}`
      }
    }).then(
      response => {
        const cookies = new Cookies();
        cookies.set('access-token', encoded);
        console.log(response);
        window.location.href = '/profile'
      }
    )
  }

  const [ profile, setProfile ] = useState(undefined);
  const clientId = '1070090749549-t3cvjs44hi2tqu8sb6gimq91aelid3mn.apps.googleusercontent.com';
  useEffect(() => {
      const initClient = () => {
          gapi.client.init({
              clientId: clientId,
              scope: ''
          });
      };
      gapi.load('client:auth2', initClient);
  });

  const onSuccess = (res) => {
      setProfile(res.profileObj);
      const cookies = new Cookies();
      cookies.set('profileObj', res.profileObj);
      window.location.href = '/glogin'
  };

  const onFailure = (err) => {
      console.log('failed', err);
  };

  const forgotPassword = () => {
    window.location.href = "/forgotPassword "
  }
  // const [loginUser, { loading }] = useMutation(LOGIN_USER, {
  //   update(_, { data: { login: userData } }) {
  //     context.login(userData);
  //     setErrors({});
  //     // props.history.push("/game");
  //     props.history.push("/profile");
  //   },
  //   onError(err) {
  //     // console.log(err.graphQLErrors[0].extensions.exception.errors);
  //     setErrors(err.graphQLErrors[0].extensions.exception.errors);
  //     // props.history.push("/");
  //   },
  //   variables: values,
  // });

  // function loginUserCallback() {
  //   loginUser();
  // }

  return (
    <>
      <Grid
        textAlign="center"
        style={{ height: "20vh" }}
        verticalAlign="middle"
      >
        <Grid.Row>
          <Header
            as="h2"
            textAlign="center"
            style={{
              fontSize: "25pt",
              marginTop: "20%",
              width: "100%",
              fontWeight: "bold",
            }}
          >
            Authenticator
          </Header>
        </Grid.Row>
      </Grid>
      <Grid
        textAlign="center"
        style={{ height: "50vh" }}
        verticalAlign="middle"
      >
        {/* <Header as="h2" textAlign="center">
            FitPlay
          </Header> */}

        <Grid.Column>
          {/* <Header as="h2" textAlign="center">
            FitPlay
          </Header> */}
          <Form
            size="large"
            //onSubmit={onSubmit}
            // className={loading ? "loading" : ""}
            className=""
          >
            <Segment stacked>
              <Form.Input
                fluid
                placeholder="Username"
                name="username"
                type="text"
                error={errors.username ? true : false}
                onChange={onChange}
              />
              <Form.Input
                fluid
                placeholder="Password"
                name="password"
                type="password"
                rror={errors.password ? true : false}
                onChange={onChange}
              />

              <Button
                style={{ backgroundColor: "#007afe", color: "white" }}
                fluid
                size="large"
                onClick={login}
              >
                Sign in
              </Button>
              <br/>
              <Button
                style={{ backgroundColor: "#007afe", color: "white" }}
                fluid
                size="large"
                onClick={forgotPassword}
              >
                Forgot Password
              </Button>
            </Segment>
          </Form>
          <div class="IntroSignupBtn">
            {/**8Log in with <a href="/glogin">Google</a> **/}
            <GoogleLogin
                    clientId={clientId}
                    buttonText="Sign in with Google"
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true}
                />
            {/**<!--GoogleLoginPage></GoogleLoginPage-->**/}
          </div>
          <Message>
            Don't have an account? <a href="/register">Sign up</a>
          </Message>
          {Object.keys(errors).length > 0 && (
            <div className="ui error message">
              <ul className="list">
                {Object.values(errors).map((value) => (
                  <li key={value}>{value}</li>
                ))}
              </ul>
            </div>
          )}
        </Grid.Column>
      </Grid>
    </>
  );
};

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
