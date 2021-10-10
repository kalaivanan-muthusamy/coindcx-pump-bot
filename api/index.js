const axios = require('axios');
const { getAPIHeaders } = require('../utils/get-headers');
const BASE_URL = process.env.BASE_URL;


// MARGIN ORDERS
async function createMarginOrder({ side = 'buy', orderType = 'market_order', market, totalQuantity, leverage = 1 }) {
    try {
        const timeStamp = Math.floor(Date.now());
        const body = {
            market,
            quantity: totalQuantity,
            side,
            order_type: orderType,
            leverage,
            ecode: 'B',
            timestamp: timeStamp
        }
        console.log({ body })
        const { data: buyResponse } = await axios.post(BASE_URL + '/exchange/v1/margin/create', body, {
            headers: getAPIHeaders(body),
        });

        return buyResponse
    } catch (err) {
        console.error(err)
    }
}

async function editMarginOrderTargetPrice({ id, target_price }) {
    try {
        const timeStamp = Math.floor(Date.now());
        const body = {
            id,
            target_price,
            timestamp: timeStamp
        }
        const { data } = await axios.post(BASE_URL + '/exchange/v1/margin/edit_target', body, {
            headers: getAPIHeaders(body),
        });

        return data
    } catch (err) {
        console.error(err)
    }
}


async function editMarginOrderSLtPrice({ id, sl_price }) {
    try {
        const timeStamp = Math.floor(Date.now());
        const body = {
            id,
            sl_price,
            timestamp: timeStamp
        }
        const { data } = await axios.post(BASE_URL + '/exchange/v1/margin/edit_sl', body, {
            headers: getAPIHeaders(body),
        });

        return data
    } catch (err) {
        console.error(err)
    }
}


module.exports = {
    createMarginOrder,
    editMarginOrderTargetPrice,
    editMarginOrderSLtPrice
}