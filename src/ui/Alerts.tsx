import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import { Credentials, Alert } from "../app/interfaces";
import { Badge } from "react-bootstrap";

import { IL_GLOB } from "../app/background";

interface AlertProps {
  creds: Credentials;
  logoutHandler: () => void;
}

const Alerts: React.FC<AlertProps> = (props) => {

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorBody, setErrorBody] = useState<string>("");
  const [fetchStatus, setFetchStatus] = useState<number>(200);

  const errorComponent = (code: number, errorBody: string) => {
    return(
      <div>
        <h5>HTTP Status: {code}</h5>
        <p>{errorBody}</p>
      </div>
    );
  }

  useEffect(() => {
    setIsLoading(true);
    const token = props.creds.token;
    const getIncidents = async () => {
      const response = await fetch(IL_GLOB.ILERT_URL + "/alerts?state=PENDING&state=ACCEPTED", {
        headers: {
          "x-ilert-client": IL_GLOB.USER_AGENT,
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": !token.startsWith("Bearer ") ? `Bearer ${token}` : token,
        }
      });

      const status = response.status;

      if (status >= 400) {
        const responseBody = await response.text();
        setFetchStatus(status);
        setErrorBody(responseBody);
        setIsError(true);
      } else {

        const data: Alert[] = await response.json();
        setAlerts(data);
        // legacy incidentIds -> alert
        chrome.storage.sync.set({incidentIds: data.map(alert => alert.id)});

        if(data.length <= 0) {
          chrome.action.setBadgeBackgroundColor({color: "green"});
          chrome.action.setBadgeText({text: "0"});
        } else {

          let hasPendingAlerts = false;
          data.forEach(alert => {
            if(!hasPendingAlerts && alert.status == "PENDING") {
              hasPendingAlerts = true;
            }
          });

          chrome.action.setBadgeBackgroundColor({color: hasPendingAlerts ? "red" : "blue"});
          chrome.action.setBadgeText({text: data.length.toString()});
        }
      }

      setIsLoading(false);
    }
    let isSubscribed = true;
    getIncidents();
    // IMPORTANT: Need to do this to unmount useEffect
    return () => { isSubscribed = false; }
  }, []);

  const getStateComponent = (state: string) => {

    // state === "ACCEPTED"
    let bg = "primary";

    if (state === "PENDING") {
      bg = "danger";
    }

    if (state === "RESOLVED") {
      bg = "success";
    }

    return(<Badge className="margin-horizontal" bg={bg}>{state}</Badge>);
  };

  return (
    <Form className="popup-padded">
      <div>
        <div className="d-flex justify-content-between">
          {
            !isError ?
              <h2 className="align-bottom" style={{color: "rgb(4, 52, 96)"}}>{chrome.i18n.getMessage("incidentsTitle")}</h2> :
              <h2 className="align-bottom">{chrome.i18n.getMessage("error")}</h2>
          }
          <img width="80px" height="32px" src="images/ilert_logo.png" alt="iLert Logo"/>
        </div>
        {
          isLoading ?
            <p>{chrome.i18n.getMessage("incidentsLoading")}</p> :
            isError ?
              errorComponent(fetchStatus, errorBody) :
              alerts.length ?
                (
                  <ListGroup>
                  {
                    alerts.map((alert, i) => {
                      const summary = alert.summary.length > IL_GLOB.MAX_ALERT_STRING_LENGTH ? `${alert.summary.slice(0, IL_GLOB.MAX_ALERT_STRING_LENGTH)}...` : alert.summary;
                      const link = `https://${props.creds.organization}.ilert.com/incident/view.jsf?id=${alert.id}`;
                      return(
                        <ListGroup.Item key={alert.id} className="d-flex justify-content-between">
                          <a className="smaller-font" target="_blank" href={link}>{summary}</a>
                          <div>
                            {getStateComponent(alert.status)}
                            <Badge className="margin-horizontal" bg="secondary">{alert?.alertSource?.name || chrome.i18n.getMessage("notAvailable")}</Badge>
                          </div>
                        </ListGroup.Item>
                      );
                    })
                  }
                  </ListGroup>
                ) :
                (<p>{chrome.i18n.getMessage("incidentsEmpty")}</p>)
        }
        <div className="horizontal-padded">
          <Button className="horizontal-padded btn-sm" variant="light" onClick={props.logoutHandler}>
            {chrome.i18n.getMessage("logoutTitle")}
          </Button>
        </div>
      </div>
    </Form>
  )
}

export default Alerts;