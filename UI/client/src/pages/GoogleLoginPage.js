
// import React from 'react';
// import { GoogleLogin } from 'react-google-login';
// import { gapi } from 'gapi-script';

// function googlelogin(){
//     useEffect(() => {
//         const initClient = () => {
//               gapi.client.init({
//               clientId: clientId,
//               scope: ''
//             });
//          };
//          gapi.load('client:auth2', initClient);
//      });
      
// // Handling the response from Google
      
// const handleSuccessLogin = (googleData) => {
//   console.log(googleData);
//   // store returned user in a context?
// }

// const handleErrorLogin = (googleData) => {
//     console.log(googleData);
//     // store returned user in a context?
//   }

//   return(
//     <div >

//     <GoogleLogin
//     clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
//     buttonText="Sign in with Google"
//     onSuccess={handleSuccessLogin}
//     onFailure={handleErrorLogin}
//     cookiePolicy="single_host_origin"
// />
//     </div>
//   )
// }
// export default googlelogin;

import React, { useState, useEffect } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script';
import Cookies from 'universal-cookie';

const GoogleLoginPage = (props) =>{

    const cookies = new Cookies()
    const [ profile, setProfile ] = useState(cookies.get('profileObj'));
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
    };

    const onFailure = (err) => {
        console.log('failed', err);
    };

    const logOut = () => {
        setProfile(null);
        window.location.href = '/login'
    };

    return (
        <div>
            <h2>React Google Login</h2>
            <br />
            <br />
            {profile ? (
                <div>
                    <img src={profile.imageUrl} alt="user image" />
                    <h3>User Logged in</h3>
                    <p>Name: {profile.name}</p>
                    <p>Email Address: {profile.email}</p>
                    <br />
                    <br />
                    <GoogleLogout clientId={clientId} buttonText="Log out" onLogoutSuccess={logOut} />
                </div>
            ) : (
                <div>
                    Data not found
                </div>
            )}
        </div>
    );
}
export default GoogleLoginPage;