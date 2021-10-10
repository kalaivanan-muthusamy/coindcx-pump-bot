require('dotenv').config()
const { createMarginOrder, editMarginOrderTargetPrice, editMarginOrderSLtPrice } = require('./api');
const { getAccountBalances } = require('./get-balance');
const marketMetaDetails = require('./utils/market-details.json');
const allTickerDetails = require('./utils/ticker.json');

async function init() {

    // Format currency basic information
    const arguments = process.argv.slice(2);
    const base_currency = 'USDT';
    const target_currency = arguments[0].toUpperCase();

    const market_pair = `B-${target_currency}_${base_currency}`;
    const marketKey = target_currency + base_currency;

    // Get the current target currency account balance
    // const { balance } = await getAccountBalances({ currency: base_currency }); // Should not be await
    const usdtBalance = 102;

    const coinMetaDetails = marketMetaDetails.find(market => market.symbol === marketKey);
    const maxLeverage = coinMetaDetails?.max_leverage;
    const tickerDetails = allTickerDetails.find(ticker => ticker.market === marketKey);
    const averagePrice = tickerDetails?.last_price;

    const buyQuantity = parseInt(((usdtBalance * 0.8) / averagePrice).toFixed(0));
    const maxBuyQuantity = buyQuantity * maxLeverage;


    // BUY/LONG MARGIN ORDER
    const orderDetails = await createMarginOrder({
        market: marketKey,
        totalQuantity: maxBuyQuantity,
        leverage: maxLeverage,
        // totalQuantity: 160,
        // leverage: 1,
    })

    const buyOrderDetails = orderDetails?.[0];
    const buyPrice = buyOrderDetails?.price;
    const targetPrice = parseFloat((buyPrice + ((2 / 100) * buyPrice)).toFixed(coinMetaDetails?.base_currency_precision));
    const stopLossPrice = parseFloat((buyPrice - ((1.5 / 100) * buyPrice)).toFixed(coinMetaDetails?.base_currency_precision));


    console.log(JSON.stringify(buyOrderDetails, null, 2));
    console.log({ targetPrice, stopLossPrice });

    await editMarginOrderTargetPrice({ id: buyOrderDetails?.id, target_price: targetPrice });
    await editMarginOrderSLtPrice({ id: buyOrderDetails?.id, sl_price: stopLossPrice });

    return
}

init();
