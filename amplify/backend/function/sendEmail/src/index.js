/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["GMAIL_CLIENT_ID","GMAIL_CLIENT_SECRET","GMAIL_REFRESH_TOKEN"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
var nodemailer = require("nodemailer");
const { google } = require("googleapis");
const aws = require("aws-sdk");

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

exports.handler = async (event) => {
  const {
    Parameters: [GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN],
  } = await new aws.SSM()
    .getParameters({
      Names: [
        "GMAIL_CLIENT_ID",
        "GMAIL_CLIENT_SECRET",
        "GMAIL_REFRESH_TOKEN",
      ].map((secretName) => process.env[secretName]),
      WithDecryption: true,
    })
    .promise();
  // return {
  //   statusCode: 200,
  //   //  Uncomment below to enable CORS requests
  //   //  headers: {
  //   //      "Access-Control-Allow-Origin": "*",
  //   //      "Access-Control-Allow-Headers": "*"
  //   //  },
  //   body: GMAIL_CLIENT_ID.Value,
  // };
  const body = JSON.parse(event.body);
  const mailData = {
    from: "joseph.hhj@gmail.com",
    to: ["joseph.hhj@gmail.com", event.userEmail],
    subject: body.subject,
    text: body.text,
  };
  try {
    const OAuth2Client = new google.auth.OAuth2(
      GMAIL_CLIENT_ID.Value,
      GMAIL_CLIENT_SECRET.Value,
      "https://developers.google.com/oauthplayground"
    );
    OAuth2Client.setCredentials({
      refresh_token: GMAIL_REFRESH_TOKEN.Value,
    });
    const accessToken = await OAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        type: "OAuth2",
        user: "joseph.hhj@gmail.com",
        clientId: GMAIL_CLIENT_ID.Value,
        clientSecret: GMAIL_CLIENT_SECRET.Value,
        refreshToken: GMAIL_REFRESH_TOKEN.Value,
        accessToken: accessToken,
      },
    });

    const info = await transporter.sendMail(mailData);
    return {
      statusCode: 200,
      //  Uncomment below to enable CORS requests
      //  headers: {
      //      "Access-Control-Allow-Origin": "*",
      //      "Access-Control-Allow-Headers": "*"
      //  },
      body: JSON.stringify(info),
    };
  } catch (err) {
    return {
      statusCode: 500,
      //  Uncomment below to enable CORS requests
      //  headers: {
      //      "Access-Control-Allow-Origin": "*",
      //      "Access-Control-Allow-Headers": "*"
      //  },
      body: JSON.stringify(err),
    };
  }
};
