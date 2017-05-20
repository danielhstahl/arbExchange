const getPriceRatio=(currency1, currency2)=>{ //for now, price them in dollars
    return currency1/currency2
}


const currencyTransaction=(currency1)=>currency1//update with price in dollars
const convertToCurrency=(unitsOfDenominatingCurrency, ratioToDenominatingCurrency)=>{
    return unitsOfDenominatingCurrency/ratioToDenominatingCurrency
}




const trade=(size, portfolio, rates, buyCurrency, sellCurrency)=>{
    const rate=rates[buyCurrency+sellCurrency]
    return Object.assign({}, portfolio, {[buyCurrency]:portfolio[buyCurrency]+size, [sellCurrency]:portfolio[sellCurrency]-size*rate})
}
const assets=["ETH", "BTC", "XRP"]
const getPairsFromRates=(ratios)=>{
    return assets.reduce((aggr, curr, index, arr)=>{
        return Object.assign({}, aggr, arr.filter((val=>val!==curr)).reduce((aggrInner, currInner)=>{
            const pair=`${curr}${currInner}`
            const oppositePair=`${currInner}${curr}`
            return Object.assign({}, aggrInner, {[pair]:ratios[pair]?ratios[pair]:1/ratios[oppositePair]})}, 
        {}))
    }, {})
}
/*const getSizeInCurrency=(currency, rates, buy, sell)=>{
    return buy===currency?1:1/rates[buy+sell]
}*/

const getRates=(currency1, currency2, rates)=>{
    return currency1===currency2?1:rates[currency2+currency1]
}

const getPortfolioValue=(portfolio, currency, rates)=>{
    return Object.keys(portfolio).reduce((aggr, curr)=>{
        return aggr+portfolio[curr]*getRates(curr, currency, rates)
    }, 0)
}
/**a strategy is a set of trades such that when starting with a portfolio containing only one asset ends with a portfolio containing only one asset */
const strategy=(ratios, portfolio)=>{
    const rates=getPairsFromRates(ratios)
    //console.log(rates)
    if(rates.ETHBTC*rates.XRPETH>rates.XRPBTC){
        const trades=[{buy:"BTC", sell:"ETH"}, {buy:"ETH", sell:"XRP"}, {buy:"XRP", sell:"BTC"}]
        return trades.reduce((aggr, curr)=>{
            return trade(getRates(curr.buy, 'BTC', rates)*getPortfolioValue(aggr, 'BTC', rates), aggr, rates, curr.buy, curr.sell)
        }, portfolio)
    }
}


/**first two price ratio is same denomination...eg, BTC/ETH and XRP/ETH, third is ratio of the other numerators...eg BTC/XRP  */
const arbDecision=(/*currency1, currency2, currency3,*/ratio1, ratio2, ratio3, exchangeCost)=>{
    /*const ratio1=getPriceRatio(currency1, currency3)
    const ratio2=getPriceRatio(currency2, currency3)
    const ratio3=getPriceRatio(currency1, currency2)*/
    const unitsOfCurrency1=1;
    const shortCurrency1=()=>currencyTransaction(-convertToCurrency(unitsOfCurrency1*.5, 1))
    const shortCurrency2=()=>currencyTransaction(-convertToCurrency(unitsOfCurrency1*.5, 1/ratio3))
    const shortCurrency3=()=>currencyTransaction(-convertToCurrency(unitsOfCurrency1, 1/ratio2))
    const buyCurrency1=()=>currencyTransaction(convertToCurrency(unitsOfCurrency1*.5, 1))
    const buyCurrency2=()=>currencyTransaction(convertToCurrency(unitsOfCurrency1*.5, 1/ratio3))
    const buyCurrency3=()=>currencyTransaction(convertToCurrency(unitsOfCurrency1, 1/ratio2))
    return ratio1/ratio2>ratio3?shortCurrency1()+shortCurrency2()+buyCurrency3():buyCurrency1()+buyCurrency2()+shortCurrency3();
}
module.exports.arbDecision=arbDecision
module.exports.convertToCurrency=convertToCurrency
module.exports.getPriceRatio=getPriceRatio
module.exports.strategy=strategy
module.exports.trade=trade
module.exports.getPairsFromRates=getPairsFromRates
module.exports.getPortfolioValue=getPortfolioValue