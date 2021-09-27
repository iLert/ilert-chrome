import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button';
import { Credentials, IncidentsType } from "../app/interfaces";
import { Badge } from "react-bootstrap";

const MAX_INCIDENT_STRING_LENGTH = 25;

interface IncidentsProps {
  creds: Credentials;
  logoutHandler: () => void;
}

const Incidents: React.FC<IncidentsProps> = (props) => {

  const [incidents, setIncidents] = useState<IncidentsType[]>([]);
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
      const response = await fetch("https://api.ilert.com/api/v1/incidents?state=PENDING&state=ACCEPTED", {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const status = response.status;

      if (status >= 400) {
        const responseBody = await response.text();
        setFetchStatus(status);
        setErrorBody(responseBody);
        setIsError(true);
      } else {
        const data: IncidentsType[] = await response.json();
        setIncidents(data);
        chrome.storage.sync.set({incidentIds: data.map(incident => incident.id)});
        chrome.browserAction.setBadgeBackgroundColor({color: "red"});
        chrome.browserAction.setBadgeText({text: data.length.toString()});
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
              <h2 className="align-bottom">{chrome.i18n.getMessage("incidentsTitle")}</h2> :
              <h2 className="align-bottom">Error</h2>
          }
          <a href={`https://${props.creds.organization}.ilert.com/incident/list.jsf`} target="_blank">
            <img width="80px" height="32px" src="images/ilert_logo.png" alt="iLert Logo"/>
          </a>
        </div>
        {
          isLoading ?
            <p>{chrome.i18n.getMessage("incidentsLoading")}</p> :
            isError ?
              errorComponent(fetchStatus, errorBody) :
              incidents.length ?
                (
                  <ListGroup>
                  {
                    incidents.map((incident, i) => {
                      const summary = incident.summary.length > MAX_INCIDENT_STRING_LENGTH ? `${incident.summary.slice(0, MAX_INCIDENT_STRING_LENGTH)}...` : incident.summary;
                      const link = `https://${props.creds.organization}.ilert.com/incident/view.jsf?id=${incident.id}`;
                      return(
                        <ListGroup.Item key={incident.id} className="d-flex justify-content-between">
                          <a className="smaller-font" target="_blank" href={link}>{summary}</a>
                          <div>
                            {getStateComponent(incident.status)}
                            <Badge className="margin-horizontal" bg="secondary">{incident?.alertSource?.name || chrome.i18n.getMessage("notAvailable")}</Badge>
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
          <Button className="horizontal-padded" variant="danger" onClick={props.logoutHandler}>
            {chrome.i18n.getMessage("logoutTitle")}
          </Button>
        </div>
      </div>
    </Form>
  )
}

export default Incidents;