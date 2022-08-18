import { API } from "aws-amplify";
import {
  TIMETREE_CALENDAR_ID,
  SPREADSHEET_ID,
  TIMETREE_ACCESS_TOKEN,
} from "@env";

export const getToken = async () => {
  const apiName = "getToken";
  const path = "/token";
  try {
    const jwt = await API.get(apiName, path);
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      body: JSON.stringify({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });
    const { access_token } = await res.json();
    return access_token;
  } catch (error) {
    console.log(error.response);
  }
};

const appendToSheets = (rows, token, sheetId) => {
  fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //update this token with yours.
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        requests: [
          {
            appendCells: {
              rows: rows,
              fields: "*",
              sheetId: sheetId,
            },
          },
        ],
      }),
    }
  )
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const updateTimeTreeEvent = async (title, startTime, endTime) => {
  try {
    const res = await fetch(
      `https://timetreeapis.com/calendars/${TIMETREE_CALENDAR_ID}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TIMETREE_ACCESS_TOKEN}`,
          Accept: "application/vnd.timetree.v1+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            attributes: {
              title: title,
              category: "schedule",
              start_at: startTime,
              start_timezone: "UTC+8",
              end_at: endTime,
              end_timezone: "UTC+8",
              all_day: false,
            },
            relationships: {
              label: {
                data: {
                  id: "2",
                  type: "label",
                },
              },
            },
          },
        }),
      }
    );

    return true;
  } catch (error) {
    return false;
  }
};
