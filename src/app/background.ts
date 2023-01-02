import { Alert } from "./interfaces";

let _INIT = true;
let _ETAG = "0";

export const IL_GLOB = {
  USER_AGENT: "ilert-chrome/0.2.0",
  MAX_ALERT_STRING_LENGTH: 25,
  ILERT_URL: "https://api.ilert.com/api"
};

const fetchAlerts = async (_organization: string, token: string, alertStorageIds: number[]) => {

  const response = await fetch(IL_GLOB.ILERT_URL + "/alerts?state=PENDING&state=ACCEPTED", {
    headers: {
      "x-ilert-client": IL_GLOB.USER_AGENT,
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": !token.startsWith("Bearer ") ? `Bearer ${token}` : token,
      "If-None-Match": _ETAG
    }
  });

  const status = response.status;

  // cache / no changes
  if(status == 304) {
    return;
  }

  if (status >= 400) {
    const responseBody = await response.text();
    console.log(responseBody);
    return;
  }

  const etag = response.headers.get("etag");
  if(etag) {
    _ETAG = etag;
  }

  const alerts: Alert[] = await response.json();
  chrome.storage.sync.set({incidentIds: alerts.map(incident => incident.id)});

  if (alerts.length <= 0) {
    console.log("No new alerts found");
    chrome.action.setBadgeBackgroundColor({color: "green"});
    chrome.action.setBadgeText({text: "0"});
    return;
  }

  let hasPendingAlerts = false;
  alerts.forEach(alert => {
    if(!hasPendingAlerts && alert.status == "PENDING") {
      hasPendingAlerts = true;
    }
  });

  // filter the alerts that are unknown -> new
  // and alerts that are of low priority
  const alertDiffs: Alert[] = alerts
    .filter(alert => !alertStorageIds.some(alertId => alertId === alert.id))
    .filter(alert => alert.priority != "LOW");

  // never exceed 5 notifications at once
  alertDiffs.length = Math.min(alertDiffs.length, 5);
  alertDiffs.forEach((alert: Alert) => {

    const notificationBody = alert.details
      ? alert.details.length > IL_GLOB.MAX_ALERT_STRING_LENGTH
        ? `${alert.details.slice(0, IL_GLOB.MAX_ALERT_STRING_LENGTH)}...`
        : alert.details
      : "This alert has no further details";
  
    chrome.notifications.create(`${alert.id}`, {
        type: "basic",
        iconUrl: "../icons/icon48.png",
        title: alert.summary,
        message: notificationBody,
        priority: 2
    }, (id) => {
      console.log(`Notification for alert ${id} created`);
    });
  });

  chrome.action.setBadgeBackgroundColor({color: hasPendingAlerts ? "red" : "blue"});
  chrome.action.setBadgeText({text: alerts.length.toString()});
};

chrome.alarms.create("pollAlerts", {
  periodInMinutes: 1
});

chrome.alarms.onAlarm.addListener((alarm) => {

  if (alarm.name !== "pollAlerts") {
    return;
  }

  // incidents = legacy -> alerts
  chrome.storage.sync.get(["organization", "token", "incidentIds"], function (result) {

    if (!result.organization || !result.token || !result.incidentIds) {
      console.log("No token or alertIds (incidentIds) found in the storage");
      return;
    }

    const {
      organization
    } = result;

    if(_INIT) {
      _INIT = false;
      console.log("init");
      chrome.notifications.onClicked.addListener((alertId: string) => {
        const url = `https://${organization}.ilert.com/incident/view.jsf?id=${alertId}`;
        chrome.tabs.create({ url });
      });
    }

    fetchAlerts(organization, result.token, result.incidentIds);
  });
});
