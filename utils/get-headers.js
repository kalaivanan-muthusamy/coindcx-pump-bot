const crypto = require('crypto')

function getAPIHeaders(requestBody) {
    const secret = process.env.SECRET;
    const payload = new Buffer.from(JSON.stringify(requestBody)).toString();
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return {
        'X-AUTH-APIKEY': process.env.APIKEY,
        'X-AUTH-SIGNATURE': signature
    }
}

module.exports = {
    getAPIHeaders
}