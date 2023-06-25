import React, { useContext, useEffect, useState } from "react";
import {decode as base64_decode, encode as base64_encode, encode} from 'base-64';
import Cookies from 'universal-cookie';
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
} from "semantic-ui-react";
import Avatar from "react-avatar";

import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/auth";
import { useForm } from "../utils/hooks";
import "../components/styles/common.css";
import axios from "axios";

const GameTypeOptions = [
  { key: "1", text: "Heart Points", value: "1" },
  { key: "2", text: "Steps", value: "2" },
  { key: "3", text: "Calories", value: "3" },
];

const Profile = (props) => {
  //   const context = useContext(AuthContext);
  const { user, logout } = useContext(AuthContext);
  const [values, setValues] = useState({});
  const [phone, setPhone] = useState("+1(226)876-4567");
  const [name, setName] = useState(null);
  const [username, setUsername] = useState(props.username);
  const [password, setPassword] = useState("tannu");
  const [email, setEmail] = useState(null);
  const [image, setImage] = useState(0);
  const [bio, setBio] = useState("I live in New york. I love to read");
  const [profileUpdate, setProfileUpdate] = useState(false);
  const [id,setId] = useState(null);
  const [lastLoginTime, setLastLoginTime] = useState(Date.now())
  const [selectedFile, setSelectedFile] = useState({selectedFile: null})
  const uploadedImage = React.useRef(null);
  const imageUploader = React.useRef(null);
  const cookies = new Cookies();
  useEffect(()=>{
    
    let encoded = cookies.get('access-token');
    let usernameAndPassword = base64_decode(encoded)
    let username = usernameAndPassword.split(":")[0]
    axios.get('http://127.0.0.1:5000/username/'+username,{
      headers:{
        'Authorization': `Basic  ${encoded}`
      }
    }).then(
      response => {
        var data = response.data
        setEmail(data.email)
        setName(data.name)
        setPassword(data.password)
        setUsername(data.username)
        setBio(data.bio)
        setPhone(data.phone)
        setId(data.id)
        setProfileUpdate(true)
        setLastLoginTime(data.last_login_time)
      });
    },[profileUpdate]);
  const handleImageUpload = (e) => {
    const [file] = e.target.files;
    if (file) {
      const reader = new FileReader();
      const { current } = uploadedImage;
      current.file = file;
      reader.onload = (e) => {
        current.src = e.target.result;
      };
      reader.readAsDataURL(file);
      setImage(1);
    }
  };

      // On file select (from the pop up)
      const onFileChange = event => {
    
        // Update the state
        this.setState({ selectedFile: event.target.files[0] });
      
      };
      
      // On file upload (click the upload button)
      const onFileUpload = () => {
      
        // Create an object of formData
        const formData = new FormData();
      
        // Update the formData object
        formData.append(
          "myFile",
          this.state.selectedFile,
          this.state.selectedFile.name
        );
      
        // Details of the uploaded file
        console.log(this.state.selectedFile);
      
        // Request made to the backend api
        // Send formData object
        axios.post("api/uploadfile", formData);
      };
  const onSaveClick = () => {
    let encoded = cookies.get('access-token');
    let usernameAndPassword = base64_decode(encoded)
    let username = usernameAndPassword.split(":")[0]
    const details = {
      name: name,
      email: email,
      phone: phone,
      password: password,
      bio: bio,
      username: username,
      id: id
    };
    

    axios.put('http://127.0.0.1:5000/user',details,{
        headers:{
          'Authorization': `Basic  ${encoded}`
        }
    }).then(
      response => {
        cookies.set('access-token',base64_encode(username+":"+password))
        console.log(response)
      }
    )
    alert("Profile Updated Successfully");
    console.log(details);
  };
  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const [errors, setErrors] = useState({});

  function NewGameCallback() {
    //SaveNewCreateGame();
  }
  const signout= () => {
    cookies.set('access-token',"")
    window.location.href = "/"
  }
  return (
    <>
      <Grid textAlign="center" verticalAlign="middle">
        <Grid.Row>
          <h3>Last Login Time: {lastLoginTime}</h3>
          <button onClick={signout}>Sign Out</button>
          <Header
            as="h2"
            textAlign="center"
            onClick={() => imageUploader.current.click()}
            style={{
              fontSize: "15pt",
              marginTop: "10%",
              width: "100%",
              fontWeight: "bold",
            }}
          >
            {image === 0 && (
              <img
                src="/images/img_avatar.png"
                alt="Avatar"
                class="avatar"
                onClick={() => imageUploader.current.click()}
                style={{
                  height: "100px",
                  width: "100px",
                }}
              />
            )}
            <img
              ref={uploadedImage}
              onClick={() => imageUploader.current.click()}
              style={{
                width: "100px",
                height: "100px",
              }}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={imageUploader}
                style={{
                  display: "none",
                }}
              />
            </div>
          </Header>
        </Grid.Row>
        <Grid.Row>
          <Header
            as="h2"
            textAlign="center"
            style={{
              fontSize: "20pt",
              marginTop: "0%",
              width: "100%",
              fontWeight: "bold",
            }}
          >
            {name}
          </Header>
        </Grid.Row>
      </Grid>

      <Grid verticalAlign="middle">
        <Grid.Column>
          {/* <Form size="large" onSubmit={onSubmit} className=""> */}
          <Segment raised style={{ height: "470px", borderRadius: "20px" }}>
            <span class="playerRanking" style={{ fontWeight: "700" }}>
              Edit Profile
            </span>

            <Grid
              divided="vertically"
              style={{ marginTop: "10%" }}
              columns="equal"
              textAlign="center"
            >
              <Grid.Row columns={2} textAlign="center">
                <Grid.Column>
                  <Grid.Row style={{ fontWeight: "700", fontSize: "20px" }}>
                    {/* {user.username} */}
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Grid.Row>
                  <Grid.Row style={{ fontSize: "15px" }}>Name </Grid.Row>
                </Grid.Column>
                <Grid.Column>
                  <Grid.Row style={{ fontWeight: "700", fontSize: "20px" }}>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </Grid.Row>
                  <Grid.Row textAlign="right" style={{ fontSize: "15px" }}>
                    Phone Number
                  </Grid.Row>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={12}>
                <Grid.Column>
                  <Grid.Row style={{ fontWeight: "700", fontSize: "20px" }}>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Grid.Row>
                  <Grid.Row style={{ fontSize: "15px" }}>Email ID</Grid.Row>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={12}>
                <Grid.Column>
                  <Grid.Row
                    style={{
                      fontWeight: "700",
                      fontSize: "20px",
                      width: "100%",
                    }}
                  >
                    <input
                      type="text"
                      value={bio}
                      style={{
                        fontSize: "20px",
                        width: "100%",
                      }}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </Grid.Row>
                  <Grid.Row style={{ fontSize: "15px" }}>Bio</Grid.Row>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={12}>
                <Grid.Column>
                  <Grid.Row style={{ fontWeight: "700", fontSize: "20px" }}>
                    <form>
                      <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </form>
                  </Grid.Row>
                  <Grid.Row style={{ fontSize: "15px" }}>Password</Grid.Row>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={12}>
                <Grid.Column>
                  <Button
                    style={{ backgroundColor: "#007afe", color: "white" }}
                    fluid
                    size="large"
                    onClick={onSaveClick}
                  >
                    Save
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </Grid.Column>
      </Grid>
    </>
  );
};

export default Profile;
