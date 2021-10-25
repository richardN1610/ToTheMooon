import "https://cdn.plot.ly/plotly-2.5.1.min.js";
let userInput = document.getElementsByClassName('userinput')[0];
const form = document.getElementById('search-form');
let coinPrice = 0;

form.addEventListener('submit', function (e) {
    e.preventDefault();
    GetCoinPrice();
})

let matchedName = ""

async function GetCoinPrice() {
    let searchCoinName = "https://api.coinbase.com/v2/prices/" + userInput.value + "-AUD/spot";
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
            form.reset();
        })
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
                ttl: 60000, //TTL = time to live for data,
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
                    maxTicksLimit: 5    //maximum amount of ticks on y axis
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
    const buyAmount = document.getElementById('stock-amount').value;
    const number = /^[0-9]+$/;  //using regrex to ensure that user enter whole numbers only
    if (buyAmount.match(number) && (matchedName != "")) {
        const result = fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                coinName, buyAmount, coinPrice
            })
        })
        UpdateTransactionHistory();
    } else {
        form.reset();
    }
}

function UpdateTransactionHistory() {
    const buyAmount = document.getElementById('stock-amount').value;
    const purchaseHistory = document.getElementById('transaction-history');
    const transactionRow = document.createElement('div')
    transactionRow.classList.add('transaction-row');
    transactionRow.innerHTML = `<span class="purchased-coin-name">${userInput.value.toUpperCase()}  </span>
        <span class="purchased-coin-amount">${buyAmount}  </span>
        <span class="purchased-coin-price">${coinPrice}   </span>
        <button class="sell-btn">SELL</button>`
    purchaseHistory.append(transactionRow);



}