import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Credentials } from "../app/interfaces";

interface LoginProps {
  storeCredentials: (creds: Credentials) => void;
}

const Login: React.FC<LoginProps> = (props) => {

  const [organization, setOrganization] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [isOrganizationValid, setIsOrganizationValid] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(true);

  const { storeCredentials } = props;

  const loginHandler = (e) => {

    e.preventDefault();

    setIsOrganizationValid(organization ? true : false);
    setIsTokenValid(token ? true : false);

    if (!organization || !token) {
      return;
    }

    storeCredentials({
      organization,
      token,
    });
  }

  return (
    <Form noValidate className="popup-padded" onSubmit={loginHandler}>
      <div className="horizontal-padded text-center">
        <img width="150px" src="images/ilert_logo.png" alt="iLert Logo" />
      </div>

      <Form.Group className="mb-3" controlId="formBasicOrganization">
        <Form.Control isInvalid={!isOrganizationValid} onChange={(e) => setOrganization(e.currentTarget.value)} required type="text" placeholder={chrome.i18n.getMessage("organizationPlaceholder")} />
        <Form.Control.Feedback type="invalid">
          {chrome.i18n.getMessage("inputEmpty")}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicToken">
        <Form.Control isInvalid={!isTokenValid} onChange={(e) => setToken(e.currentTarget.value)} required type="password" placeholder={chrome.i18n.getMessage("apiKeyPlaceholder")} />
        <Form.Control.Feedback type="invalid">
          {chrome.i18n.getMessage("inputEmpty")}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="text-center d-grid gap-2">
        <Button className="text-center" variant="primary" type="submit">
          {chrome.i18n.getMessage("loginTitle")}
        </Button>
      </div>

      <Form.Group className="mb-3 horizontal-padded" controlId="getAPIKey">
        <a href="https://api.ilert.com/api-docs/#section/Authentication" target="_blank">{chrome.i18n.getMessage("getKey")}</a>
      </Form.Group>
    </Form>
  );
}

export default Login;