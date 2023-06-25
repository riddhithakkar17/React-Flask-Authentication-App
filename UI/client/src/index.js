import ReactDOM from "react-dom";
// import Framework7 from "framework7/lite-bundle";
// import Framework7React from "framework7-react";

import reportWebVitals from "./reportWebVitals";
import ApolloProvider from "./ApolloProvider";
// import "framework7/framework7-bundle.css";

// Framework7.use(Framework7React);

ReactDOM.render(ApolloProvider, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
