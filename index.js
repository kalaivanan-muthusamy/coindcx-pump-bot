require('dotenv').config()
const { createOrder } = require('./spot-order');
const { getAccountBalances } = require('./get-balance');
const { getOHLC } = require('./get-ohlc');


async function init() {

    console.time("startTime");

    // Format currency basic information
    const arguments = process.argv.slice(2);
    const base_currency = 'BTC';
    const target_currency = arguments[0].toUpperCase();

    const market_pair = `B-${target_currency}_${base_currency}`;
    const marketKey = target_currency + base_currency;

    // Get the current target currency account balance
    // const { balance: btcBalance } = await getAccountBalances({ currency: base_currency }); // Should not be await
    const btcBalance = 0.00030934;

    console.log("Price check Start: ", new Date());
    // Get the OHLC Price to calculate the average buy quantity
    const targetCoinOHLC = await getOHLC({ pair: market_pair });
    const targetCoinAvgPrice = targetCoinOHLC?.[0]?.close;
    const buyQuantity = parseInt(((btcBalance * 0.90) / targetCoinAvgPrice).toFixed(0));
    console.log("Price check End: ", new Date());

    
    console.log("Buy Start: ", new Date());
    // BUY THE ASSET
    console.log(`*** BUYING ${target_currency}. Quantity: ${buyQuantity}`);
    const buyOrderResponse = await createOrder({ side: 'buy', orderType: 'market_order', market: marketKey, totalQuantity: buyQuantity, });
    // console.log({ buyOrderResponse });
    console.log("Buy End: ", new Date());

    // SELL THE ASSET AS TWO PART
    const sellQuantityFirst = Math.floor(buyQuantity / 2);
    const sellQuantitySecond = buyQuantity - sellQuantityFirst;
    setTimeout(async () => {
        console.log(`*** SELLING ${target_currency}. Quantity: ${buyQuantity}`);
        console.log("Sell Start: ", new Date());
        const sellOrderResponse = await createOrder({ side: 'sell', orderType: 'market_order', market: marketKey, totalQuantity: buyQuantity, });
        // console.log({ sellOrderResponse })
        console.log("Sell End: ", new Date());
    }, 1000 * 5)

    // setTimeout(async () => {
    //     console.log(`*** SELLING ${target_currency}. Quantity: ${sellQuantitySecond}`);
    //     const sellOrderResponse = await createOrder({ side: 'sell', orderType: 'market_order', market: marketKey, totalQuantity: sellQuantitySecond, });
    //     // console.log({ sellOrderResponse })
    // }, 1000 * 15)
}

init();
