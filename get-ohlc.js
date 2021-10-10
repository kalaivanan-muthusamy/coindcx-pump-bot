const axios = require('axios');

async function getOHLC({ pair }) {
    try {
        const { data: ohlc } = await axios.get('https://public.coindcx.com/market_data/candles', {
            params: {
                pair: pair,
                interval: '1m',
                limit: 1
            },
        });
        return ohlc
    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    getOHLC
}