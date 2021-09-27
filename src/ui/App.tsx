import React, { useEffect, useState } from "react";
import * as ReactDOM from "react-dom";

import "../styles/popup.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./Login";
import Incidents from "./Incidents";
import { Credentials } from "../app/interfaces";

const App: React.FC = () => {

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [creds, setCreds] = useState<Credentials>({ token: "", organization: "" });

  const storeCredentials = (creds: Credentials) => {
    chrome.storage.sync.set(creds);
    setCreds(creds);
    setIsLoggedIn(true);
  }

  const logoutHandler = () => {
    const creds: Credentials = { token: "", organization: "" };
    setCreds(creds);
    chrome.storage.sync.set(creds);
    chrome.browserAction.setBadgeText({text: ""});
    setIsLoggedIn(false);
  }

  useEffect(() => {

    // Get the stored org and email and password here
    const getStorage = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        chrome.storage.sync.get(["token", "organization"], function (result) {

          if (!result.token || !result.organization) {
            setIsLoggedIn(false);
            resolve();
            return;
          }

          const creds: Credentials = {
            token: result.token,
            organization: result.organization,
          }

          setCreds(creds);
          setIsLoggedIn(true);
          resolve();
        });
      });
    } 

    let isSubscribed = true;
    getStorage();
    return () => { isSubscribed = false; }
  }, []);

  return (
    !isLoggedIn ?
      <Login storeCredentials={storeCredentials} /> :
      <Incidents creds={creds} logoutHandler={logoutHandler} />
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);