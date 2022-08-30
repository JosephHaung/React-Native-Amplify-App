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

  const body = JSON.parse(event.body);
  const user = body.user;
  // return {
  //   statusCode: 200,
  //   //  Uncomment below to enable CORS requests
  //   //  headers: {
  //   //      "Access-Control-Allow-Origin": "*",
  //   //      "Access-Control-Allow-Headers": "*"
  //   //  },
  //   body: body,
  //   user: user,
  // };
  const userInfo = `姓名：${user.name}
  Email：${user.email}
  電話：${user.phone_number}
  `;
  const mailDataToOrg = {
    from: "重聽福利協會APP <tw.hearhard@gmail.com>",
    to: "tw.hearhard@gmail.com",
    subject: "新報名 – " + body.eventName,
    html: `<p style="white-space: pre-line"><b>用戶資料</b>\n${userInfo}\n\n<b>提交資料</b>\n${body.text}</p>`,
  };
  const mailDataToUser = {
    from: "重聽福利協會 <tw.hearhard@gmail.com>",
    to: user.email,
    subject: "報名成功 – " + body.eventName,
    html: `<p style="white-space: pre-line">您好，我們已收到您提交的<b>${body.eventName}</b>表單，若有疑問請回覆此郵件。\n\n${body.text}\n\n\n重聽福利協會</p>`,
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
        user: "tw.hearhard@gmail.com",
        clientId: GMAIL_CLIENT_ID.Value,
        clientSecret: GMAIL_CLIENT_SECRET.Value,
        refreshToken: GMAIL_REFRESH_TOKEN.Value,
        accessToken: accessToken,
      },
    });

    await transporter.sendMail(mailDataToOrg);
    const info = await transporter.sendMail(mailDataToUser);
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
