const axios = require('axios');
const { getAPIHeaders } = require('./utils/get-headers');

const BASE_URL = process.env.BASE_URL;

async function createOrder({ side = 'buy', orderType = 'market_order', market, totalQuantity, pricePerUnit }) {
    try {
        const body = {
            side,
            order_type: orderType,
            market,
            total_quantity: totalQuantity,
            price_per_unit: pricePerUnit
        }
        console.log({ body })
        const { data: buyResponse } = await axios.post(BASE_URL + '/exchange/v1/orders/create', body, {
            headers: getAPIHeaders(body),
        });

        return buyResponse
    } catch (err) {
        console.error(err)
    }
}


module.exports = {
    createOrder
}