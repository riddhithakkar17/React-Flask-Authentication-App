import React, { useContext, useState } from "react";
import axios from 'axios';
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

const Register = (props) => {
  const context = useContext(AuthContext);
  const [details,setDetails] = useState({})
  const onChange = (event) =>{
    details[event.target.name] = event.target.value
  }
  /**
  const { onChange, onSubmit, values } = useForm(registerUser, {
    password: "",
    email: "",
    confirmPassword: "",
    username: "",
    name:"",
    phone:"",
    bio:"",
    phone:""

  });
 */
  const [errors, setErrors] = useState({});

  // const [addUser, { loading }] = useMutation(REGISTER_USER, {
  //   update(proxy, { data: { register: userData } }) {
  //     context.login(userData);
  //     setErrors({});
  //     props.history.push("/");
  //   },
  //   onError(err) {
  //     setErrors(err.graphQLErrors[0].extensions.exception.errors);
  //   },
  //   //variables: values,
  // });

  function addUserToBackend(){
    console.log(details)
    axios.post('http://127.0.0.1:5000/user', details ).then(
      response => {
        console.log(response);
        window.location.href = '/signup-success'
        
      }
    )
  }
  //function registerUser() {
   // addUser();
    //addUserToBackend();
    // alert("User registered");
  //}

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
              marginTop: "10%",
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
        {/* <Grid.Column className="register-box"> */}
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
                placeholder="E-mail address"
                name="email"
                type="email"
                error={errors.email ? true : false}
                onChange={onChange}
              />
              <Form.Input
                fluid
                placeholder="Full Name"
                name="name"
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
              <Form.Input
                fluid
                placeholder="Confirm Password"
                name="confirmPassword"
                type="password"
                rror={errors.confirmPassword ? true : false}
                onChange={onChange}
              />
              <Form.Input
                fluid
                placeholder="Phone number"
                name="phone"
                type="number"
                rror={errors.phone ? true : false}
                onChange={onChange}
              />
              <Form.Input
                fluid
                placeholder="Username"
                name="username"
                type="text"
                rror={errors.username ? true : false}
                onChange={onChange}
              />
              <Form.Input
                fluid
                placeholder="Bio"
                name="bio"
                type="text"
                rror={errors.bio ? true : false}
                onChange={onChange}
              />

              <Button
                style={{ backgroundColor: "#007afe", color: "white" }}
                fluid
                size="large"
                onClick={addUserToBackend}
              >
                Sign up
              </Button>
            </Segment>
          </Form>
          {/* <Message>
          <a href="#">Log in with Google</a>
        </Message> */}
          <Message>
            Have an account? <a href="/login">Login in</a>
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

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Register;
