const axios = require('axios');
const { getAPIHeaders } = require('./utils/get-headers');

const BASE_URL = process.env.BASE_URL;

async function getAccountBalances({ currency }) {
    var timeStamp = Math.floor(Date.now());
    const body = {
        "timestamp": timeStamp
    }
    const { data: balances } = await axios.post(BASE_URL + '/exchange/v1/users/balances', body, {
        headers: getAPIHeaders(body),
    });
    if (currency) {
        return balances.find(balance => balance.currency === currency);
    }
    return balances
}

module.exports = {
    getAccountBalances
}