const axios = require("axios");

const BASE_URL = "http://4.224.186.213/evaluation-service";

async function getDepots() {
    const res = await axios.get(`${BASE_URL}/depots`);
    return res.data.depots;
}

async function getVehicles() {
    const res = await axios.get(`${BASE_URL}/vehicles`);
    return res.data.vehicles;
}

module.exports = {
    getDepots,
    getVehicles,
};