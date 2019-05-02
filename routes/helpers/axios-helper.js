const https = require('https');
const axios = require('axios');
const PORTUS_BASE_URL = process.env.PORTUS_BASE_URL;

const portusAxiosInstance = axios.create({
  baseURL: PORTUS_BASE_URL,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  }),
  headers: {
    "Portus-Auth": process.env.PORTUS_ADMIN_TOKEN,
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Connection": "keep-alive"
  }
});

class AxiosHelper {

  getHttpsAgent(){
    return agent;
  }

  static portusInstance(){
    return portusAxiosInstance;
  }

}

module.exports = AxiosHelper;