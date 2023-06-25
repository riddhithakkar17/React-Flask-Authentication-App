import axios from "axios";
import React, { useContext, useState, useEffect } from "react";

import {
    Button,
    Form,
    Grid,
    Header,
    Image,
    Message,
    Segment,
  } from "semantic-ui-react";

const ForgotPassword = (props) => {

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [msg, setMsg] = useState(null);

    const onChange = (event) => {
        setUsername(event.target.value);
    }

    const onChangePassword = (event) => {
        setPassword(event.target.value);
    }

    const changePassword = () => {
        axios.post(
            "http://127.0.0.1:5000/forgotPassword",{
                'username':username,
                'password':password
            }
        ).then(
            response => {
              window.location.href = '/'
            }
          ).catch(error => {
            setMsg(error.toString())
            console.error('There was an error!', error);
        });;
    }
    return ( 
    <>
     <Form.Input
                fluid
                placeholder="Username"
                name="username"
                type="text"
                onChange={onChange}
              />
        
        <Form.Input
                fluid
                placeholder="Password"
                name="password"
                type="password"
                onChange={onChangePassword}
              />
        <p>{msg}</p>

        <Button
                style={{ backgroundColor: "#007afe", color: "white" }}
                fluid
                size="large"
                onClick={changePassword}
              >
            Change Password
        </Button>

    </>

    );

}

export default ForgotPassword;