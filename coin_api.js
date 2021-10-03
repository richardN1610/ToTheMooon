getCoinPrice();

async function getCoinPrice() {
    const BTC = fetch("https://api.coinbase.com/v2/prices/BTC-AUD/spot").then(res => res.json())
    const ETH = fetch("https://api.coinbase.com/v2/prices/ETH-AUD/spot").then(res => res.json());
    const DASH = fetch("https://api.coinbase.com/v2/prices/DASH-AUD/spot").then(res => res.json());
    const DOGE = fetch("https://api.coinbase.com/v2/prices/DOGE-AUD/spot").then(res => res.json());
    const LiteCoin = fetch("https://api.coinbase.com/v2/prices/LTC-AUD/spot").then(res => res.json());
    const USDC = fetch("https://api.coinbase.com/v2/prices/USDC-AUD/spot").then(res => res.json());
    const btcCash = fetch("https://api.coinbase.com/v2/prices/BCH-AUD/spot").then(res => res.json());
    const UNI = fetch("https://api.coinbase.com/v2/prices/UNI-AUD/spot").then(res => res.json());

    //using async await with promise.all to fetch all api at once
    const retrieveData = async function () {
        let results = await Promise.all([BTC, ETH, DASH, DOGE, LiteCoin, USDC, btcCash, UNI]);
        DisplayDataTable(results);
    }();
    //using setTimeout  because using settimeinterval can cause a memory leak
    setTimeout(getCoinPrice,30000); //calling the function every 30 seconds
}

function DisplayDataTable(result) {
    const tableRows = [];
    let currentPrice = [];
    for (let i = 0; i < result.length; i++) {   //looping through coin list and get its element.
        currentPrice[i] = parseFloat(result[i].data.amount).toFixed(2)  
        tableRows[i] = document.getElementById("coin" + (i+1))  //add to to i because i started from 0 and coin id start from 1
        tableRows[i].innerHTML = "$ " + currentPrice[i];   //assining values to table rows.
    }
}