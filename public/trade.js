import "https://cdn.plot.ly/plotly-2.5.1.min.js";
let userInput = document.getElementsByClassName('userinput')[0];
const form = document.getElementById('search-form');
let coinPrice;

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready();
}

function ready(){
    const sellBtn = document.getElementsByClassName('sell-btn');
    for(let i = 0; i<sellBtn.length; i++){
        const soldBtn = sellBtn[i];
        soldBtn.addEventListener('click', Sold)//needs to work on sold function to update account balance
    }
}

function ReloadDiv(){
    $("#user-balance").load(location.href+" #user-balance>*",""); 

}

async function GetCoin(coinName){
    let searchCoinName = "https://api.coinbase.com/v2/prices/" + coinName + "-AUD/spot";
    const response = await fetch(searchCoinName)
    .then(function (res) {
        if (!res.ok) {
            throw new Error("Bad Input")    //if res not ok, then throw a new error then catch it.
        } else {
            matchedName = userInput.value
            return res.json();
        }
    }).then(function (data) {
        return coinPrice = parseFloat(data.data.amount).toFixed(2);
    }).catch((error) => {
        alert("Please check your coin name.")
    })
}

async function Sold(e){
    var selectedTrade = e.target;
    const selectedID = selectedTrade.parentElement.id
    const coinName = selectedTrade.parentElement.firstElementChild.innerHTML.replace(/ /g,"") //removing the extra space after the coin name
    await GetCoin(coinName); //wait for the fetch to finish before passing the coin price otherwise, the first one will be undefined;
    selectedTrade.parentElement.remove();
    const reqType = "sell";
    const result = await fetch('/search', {
        method: "POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            selectedID, reqType, coinPrice
        })
    }).then((res) => res.json())
    if(result.status == "sold"){
        ReloadDiv();
    }

}

form.addEventListener('submit', function (e) {
    e.preventDefault();
    GetCoinPrice();
})

let matchedName = ""

async function GetCoinPrice() {
    let coinName = userInput.value 
    GetCoin(coinName);
    setTimeout(GetCoinPrice, 60000);
}

const data = {
    labels: [],
    datasets: [{
        label: '$ - AUD',
        data: [],
        backgroundColor: '#6f7275',
        borderColor: '#6f7275',
        borderWidth: 1
    }]
}

const config = {
    type: 'line',
    data,
    options: {
        plugins: {
            streaming: {
                duration: 120000,
                ttl: 30000, //TTL = time to live for data,
                refresh: 10000,   ///refresh duration,
                frameRate: 30
            }
        },
        scales: {
            x: {
                type: 'realtime',
                realtime: {
                    onRefresh: chart => {    //onrefresh is a call back func. every time it gets call. it push new data to the dataset.
                        chart.data.datasets.forEach(dataset => {
                            dataset.data.push({
                                x: Date.now(),
                                y: coinPrice
                            })
                        })
                    }
                }
            },
            y: {
                ticks: {
                    maxTicksLimit: 10    //maximum amount of ticks on y axis
                }
            }
        }
    }
}
DrawChart();

async function DrawChart() {
    await GetCoinPrice;
    let coinChart = new Chart(
        document.getElementById('coin-graph'), config
    )
}

/*Buy button, adding new div to the list*/
const buyBtn = document.getElementById('buy-btn');
buyBtn.addEventListener('click', buyCoin);

async function buyCoin() {
    const coinName = userInput.value
    const reqType = "buy";
    const buyAmount = document.getElementById('stock-amount').value;
    const number = /^[0-9]+$/;  //using regrex to ensure that user enter whole numbers only
    if (buyAmount.match(number) && (matchedName != "")) {
        const result = await fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                coinName, buyAmount, coinPrice, reqType
            })
        }).then((res) => res.json())
        if(result.status === "bought"){
            UpdateTransactionHistory(result.tradeId);
            ReloadDiv();
        }
    } else {
        alert("Please check your input")
    }
}

function UpdateTransactionHistory(transactionID) {
    const buyAmount = document.getElementById('stock-amount').value;
    const purchaseHistory = document.getElementById('transaction-history');
    const transactionRow = document.createElement('div')
    transactionRow.classList.add('transaction-row');
    transactionRow.setAttribute('id',transactionID);
    transactionRow.innerHTML = `<span class="purchased-coin-name">${userInput.value.toUpperCase()}  </span>
        <span class="purchased-coin-amount">${buyAmount}  </span>
        <span class="purchased-coin-price">${coinPrice}   </span>
        <button class="sell-btn" id="sell-btn">SELL</button>`
    purchaseHistory.append(transactionRow);

    transactionRow.getElementsByClassName('sell-btn')[0].addEventListener('click', Sold)
}

const logoutBtn = document.getElementById('log-out')
logoutBtn.addEventListener('click',async ()=>{
    const reqType = "logout"
    const res = await fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
           reqType
        })
    }).then((res) => res.json())

    if(res.status == "logged-out"){
        window.location.href ="/"
    }
})