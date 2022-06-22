import { API } from "aws-amplify";
const SPREADSHEET_ID = "1g9M4TMCuaCu_ARtXSnF1s1is4Dzh2sh3Z1qRN1q4eSk";
export default getTokenAndSubmit = async (rows, sheetId) => {
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
    appendToSheets(rows, access_token, sheetId);
  } catch (error) {
    console.log(error);
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
