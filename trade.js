import "https://cdn.plot.ly/plotly-2.5.1.min.js";
let userInput = document.getElementsByClassName('userinput')[0];
const form = document.getElementById('search-form');
let coinPrice = 0;
form.addEventListener('submit', (e)  =>{
    e.preventDefault();
    GetCoinPrice();
})


async function GetCoinPrice(){
    let searchCoinName = "https://api.coinbase.com/v2/prices/"+userInput.value+"-AUD/spot";
    const response = await fetch(searchCoinName)
                        .then(function(res){
                            if(!res.ok){    
                                throw new Error("Bad Input")    //if res not ok, then throw a new error then catch it.
                            }else{
                                return res.json();
                            }
                         }).then(function(data){
                            return coinPrice = parseFloat(data.data.amount).toFixed(2);
                         }).catch((error) =>{
                             alert("Bad Input")
                             window.location.href = "trade.html";   //if user no currency found, return to trade page
                         })
    setTimeout(GetCoinPrice,30000);
}

const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Blue'],
        datasets: [{
            label: '$',
            data: [],
            backgroundColor:'rgba(255, 99, 132, 0.2)',
            borderColor:'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
}
const config = {
    type: 'line',
    data,
    options: {
        plugins:{
            streaming:{
                duration: 20000,
                ttl: 60000, //TTL = time to live for data,
                refresh: 5000,   ///refresh duration,
                frameRate: 30
            }
        },
        scales: {
            x: {
                type:  'realtime',
                realtime:{      
                    onRefresh: chart => {    //onrefresh is a call back func. every time it gets call. it push new data to the dataset.
                        chart.data.datasets.forEach(dataset =>{
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

async function DrawChart(){
    await GetCoinPrice();
    let coinChart = new Chart(
        document.getElementById('coin-graph'),config
    )
}

