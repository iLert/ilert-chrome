import { IncidentsType } from "./interfaces";

const MAX_INCIDENT_STRING_LENGTH = 25;

const fetchAndAlertIncidents = async (organization: string, token: string, incidentStorageIds: number[]) => {
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
    console.log(responseBody);
    return;
  }

  const incidents: IncidentsType[] = await response.json();
  chrome.storage.sync.set({incidentIds: incidents.map(incident => incident.id)});

  const incidentsDiffs: IncidentsType[] = incidents
    // Filter the incidents if it is not inside the stored Incident IDs
    .filter(incident => !incidentStorageIds.some(incidentId => incidentId === incident.id));

  if (incidentsDiffs.length === 0) {
    console.log('No new Incident found');
    return;
  }

  incidentsDiffs.map(incident => {
  
    chrome.notifications.onClicked.addListener((incidentId: string) => {
      const url = `https://${organization}.ilert.com/incident/view.jsf?id=${incidentId}`;
      chrome.tabs.create({ url });
    });
  
    chrome.notifications.create(`${incident.id}`, {
        type: 'basic',
        iconUrl: '../icons/icon48.png',
        title: incident.summary,
        message: incident.details.length > MAX_INCIDENT_STRING_LENGTH ? `${incident.details.slice(0, MAX_INCIDENT_STRING_LENGTH)}...` : incident.details,
        priority: 2,
    });
  });

  chrome.browserAction.setBadgeBackgroundColor({color: "red"});
  chrome.browserAction.setBadgeText({text: incidents.length.toString()});
}

chrome.alarms.create('pollIncidents', {
  periodInMinutes: 1
});

chrome.alarms.onAlarm.addListener((alarm) => {

  if (alarm.name !== 'pollIncidents') {
    return;
  }

  chrome.storage.sync.get(["organization", "token", "incidentIds"], function (result) {

    if (!result.organization || !result.token || !result.incidentIds) {
      console.log('No token or incidentIds found in the storage');
      return;
    }

    fetchAndAlertIncidents(result.organization, result.token, result.incidentIds);
  });
});

