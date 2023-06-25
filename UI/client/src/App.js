import React, { useContext, Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Container } from "semantic-ui-react";
import ForgotPasswordApp  from "./pages/ForgotPassword";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
// import {
//   Panel,
//   View,
//   Page,
//   Block,
//   Navbar,
//   Row,
//   Col,
//   Button,
//   Link,
//   NavLeft,
//   NavRight,
//   NavTitle,
// } from "framework7-react";

import Header from "./components/Header";

import { AuthProvider, AuthContext } from "./context/auth";

const Home = lazy(() => import("./pages/Home"));

const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));

const Profile = lazy(() => import("./pages/Profile"));

const SignupSuccess = lazy(()=>import("./pages/SignupSuccess"))
const GLogin= lazy(()=> import("./pages/GoogleLoginPage"));

const App = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <AuthProvider>
      <Router>
        <Header />
        <Container text>
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/" component={Home} />
              <Route exact path="/register" component={Register} />

              <Route exact path="/profile" component={Profile} />
              <Route exact path="/signup-success" component={SignupSuccess} />
              <Route exact path="/glogin" component={GLogin}/>
              <Route exact path="/forgotPassword" component={ForgotPasswordApp}/>


            </Switch>
          </Suspense>
        </Container>
      </Router>
    </AuthProvider>
  );
};

export default App;
