/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
var jwt = require("jsonwebtoken");
exports.handler = async (event) => {
  const secondsSinceEpoch = Math.round(new Date().getTime() / 1000);
  const claim = {
    iss: "test-530@tests-352500.iam.gserviceaccount.com",
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: secondsSinceEpoch + 3600,
    iat: secondsSinceEpoch,
  };
  var token = jwt.sign(
    claim,
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD8DD5NlbsO6Bnl\n0YfbzqNiJvZZmr2289dY4wzzAJ//UNYHO0c8LL7jVtO7da7VmEMZ6E173L/fvPr+\nV3r2gdJ6/xGGUM3jxduS9V3qhdzmGE/ipP2Kl+geaxy6M1x1Q/Pt8+br1Bffq/fE\n/wCmo/6nd2imkVnck9UZ/7i+Z+7vi6WT/TF75BZstDk5gRBj511nhrywqAlA4vVc\ni5h/SI7hllks3gdq1T693Crl+5Ns582SX7QV/gRvWY065Z/6e4WBXxATY2zhAp58\n/Ut1Xu2juhpyNv6LF6C6oSOT9OInvO8bxUmgWV0pxyp0q3gox1mLeeSBHtkdDAtB\nijiZsW4bAgMBAAECggEAUJqfwBMOv70lLxRbhMVoBacdKFmuqxf++cuepAXCpRVW\nZPills5ee3iUfMItV9x6NQpP4Tke2W/nurgCOFwbEj+I/LHRrjJjvnMehjYqByGm\nRn5qIMzkq/moNbngKxZAp4vVAP0SZ3Lo6UR9kk0mzqqGuqIIIVzbjRV1INs/E7as\nFB5R0yBN7y5gth1XA6AKJ+qhdeH3euL2FkbDFxR6t09owAZ0fZXdJyL/tWIzgTdW\n4qx8i0/E4JprAvbJZoZ0G8uRicXujJYttAGUCPJq9pidot2Bmr9ZbINZHaMBeg+D\nSvao47NxSTB9Gm/hmKIy1c3Ehn6QeO4KTe0TvCuQPQKBgQD+7GcWXnv+Q9qeDNvL\nYe/spRValT6SOzEO9XBbte7wN/jH+RhgJag3ImmTTW86pE98b0XKcI/NjCCJlwr0\nzrxfMOL62r8DMV04D6geVNWGdwpVyHBjn97O+Q9kvzVhoYCzjNang0Q5EY6yhMND\n3amSWusKWtl5AF4wHX0kXrrEjwKBgQD9HLta5na1WxEMsnZQpHzKQz4VVos3MMId\nf/7aMSxnXQvxnn0ZMHfBfT0xF5/DZ+ygiC3Arkz1Mu6CgKLDlYbrBYid+++bsUlD\nAKAU914x5nz9PdPQzO4mOlzIArEcoebJf6C5YMcs3oPwZHinZc05G/gSKAqAW9KK\nLTnIVPC7tQKBgHsAikUq1d071FKKlcsuuFuQ1BrfBE/+q48yMkKuKFpUR4AF2xMZ\nWG8x9YsTw+WhvpCmCCDD6z8cq953uNuinRW5OuwbfCsIOJiCRXZNLLIy4hO+ISyQ\nyStI1XqhIBq5mKYKANDW76YxqI7OrIEkhVuO7vYSG/jcipXgxK813hxVAoGBANVx\nv0T+iCiTbSNJ86A5tcpTPi18V9Xo1ilOYLnbMdjQjFvrDQ+K4dJXLJ0TkPSV1OPj\nMsIDun4jvyJqG9fXZnkWp4iihgLDVEaeZmCH4fUuq0RbOR4hUssF+GvqaTT+CsLt\nT7pENHJQCu9TqrNvk8qPHXkiLwjjZf6D+PBJQODpAoGAOgO9AByahVvPm2mie4Vi\nb4uaFTqHL5beaky4AYDti43dGhVLYwBKO13Z2A//GNKD0YnhR/LrgiRFZ3lN44Zi\nnoPs6wshyeZm5ZuIuM3o8wzZuLoki2Ey/gEWRe4C+NCrmU0uGf6BL9TXoSq1QgoB\ntwK+PSh5jM5oBT0rJoVw5Aw=\n-----END PRIVATE KEY-----\n",
    { algorithm: "RS256" }
  );
  return {
    statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  },
    body: JSON.stringify(token),
  };
};
