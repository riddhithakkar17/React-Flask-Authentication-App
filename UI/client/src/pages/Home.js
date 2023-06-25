import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";

import gql from "graphql-tag";
import { Image, Grid } from "semantic-ui-react";

import $ from "jquery";
import { Button } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
// import "../co";
const Home = () => {
  const history = useHistory();
  const HideSplash = () => {
    $("#JoinNow").fadeOut();
    history.push("/login");
  };
  // const {loading,data : { getPosts : posts }} = useQuery(FETCH_POSTS_QUERY)
  //     const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  //       console.log(data)

  //     return loading ? (
  //         <>
  //             <PostLoader/>
  //         </>
  //     ) : (<>
  //         <Grid columns={1} >
  //           <Grid.Row>
  //             <Grid.Column>
  //               <AddPost/>
  //             </Grid.Column>
  //           </Grid.Row>
  //           <Grid.Row>

  //          {data.getPosts &&
  //               data.getPosts.map((post) => (
  //                 <Grid.Column key={post.id} style={{ marginBottom: 20 }} height={20}>
  //                   <PostCard body={post.body} id = {post.id} username={post.username} createdAt={post.createdAt}/>
  //                 </Grid.Column>
  //         ))}

  //           </Grid.Row>

  //       </Grid>
  //       </>)
  // };

  // const FETCH_POSTS_QUERY = gql`
  // {
  //     getPosts{
  //         id
  //         body
  //         createdAt
  //         username
  //         #
  //         # likes{
  //         #     username
  //         # }
  //         # # commentCount
  //         # comments{
  //         #     id
  //         #     username
  //         #     createdAt
  //         #     body
  //         # }
  //     }
  // }
  // `
  return (
    <div id="JoinNow">
      <div class="IntroTitle">Authenticator</div>
      <div class="IntroImage">
        <img src="/images/Intro.jpg" alt="Login Image" />
      </div>
      {/* <div class="IntroLoginBtn"> */}
      <button
        // href="/login"
        style={{
          backgroundColor: "#007dfe",
          transform: "translate(-50%, -50%)",
          left: "50%",
          width: "80%",
          borderRadius: "30px",
          height: "50px",
          fontSize: "20px",
        }}
        class="ui button blue"
        onClick={HideSplash}
      >
        Login
      </button>
      {/* </div>{" "} */}
      <div class="IntroSignupBtn">
        Not registered yet ? <a href="/register">Signup</a> now for free.
      </div>


      <div class="IntroCopyright">
        Copyright 2022 Authenticator. All Rights Reserved.
      </div>
    </div>
  );
};

export default Home;
