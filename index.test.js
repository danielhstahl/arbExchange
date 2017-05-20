const arb=require('./index')
it('correctly identifies price ratio', ()=>{
    expect(arb.getPriceRatio(5, 2)).toEqual(2.5)
})
it('correctly converts currency', ()=>{
    const units=5
    const ratio=2.0
    expect(arb.convertToCurrency(units, ratio)).toEqual(2.5)
})
it('correctly assesses arbDecision', ()=>{
    const currency1=5
    const currency2=5
    const currency3=5
    expect(arb.arbDecision(currency1, currency2, currency3, 0)).toEqual(0.0)
})

it('correctly assesses trade', ()=>{
    const portfolio={
        BTC:4,
        ETH:0,
        XRP:0
    }
    const rates={
        ETHBTC:1.5,
        XRPETH:.8,
        XRPBTC:.75*1.5
    }
    const pairs=arb.getPairsFromRates(rates)
    //console.log(arb.trade(5, portfolio, pairs, "BTC", "ETH"))
})
it('correctly portfolio value', ()=>{
    const ratios={
        ETHBTC:1.5,
        XRPETH:.8,
        XRPBTC:.75*1.5
    }
    const portfolio={
        BTC:0,
        ETH:4.5,
        XRP:0
    }
    const rates=arb.getPairsFromRates(ratios)
    expect(arb.getPortfolioValue(portfolio, 'BTC', rates)).toEqual(3.0)
})

it('correctly implements strategy', ()=>{
    const rates={
        ETHBTC:1.5,
        XRPETH:.8,
        XRPBTC:.75*1.5
    }
    const portfolio={
        BTC:4,
        ETH:0,
        XRP:0
    }
    console.log(arb.strategy(rates, portfolio, 4))
})