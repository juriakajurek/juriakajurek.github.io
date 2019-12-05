import BaseView from "../views/view";
import BaseModel from "../models/model";
import myChart from "../views/chart";
import displayMatches from "../currenciesSelect";
import currData from "../currencies_data";
import { callbackify } from "util";
import { format } from "path";
import { generateLabels } from "../views/chart";
import { updateChart } from "../views/chart";

class MainCtrl {
    constructor() {
        this.view = new BaseView();
        this.model = new BaseModel();
        this.currencies;
        this.currenciesAvailable = false; //if false cant filter coins
        this.error = false;
        this.fetchingData = false;
    }

    async init() {
        //grab supported cryptocurriences (not actual currencies though, those are missing RN)
        this.fetchingData = true;
        this.currencies = await this.model.fetchAllCoinNames();
        if (!this.currencies || this.currencies.length === 0) {
            this.error = true;
            console.error("Unable to fetch supported coins names");
        } else {
            this.currenciesAvailable = true;
            this.currencies.forEach(el => {
                currData.push(el);
            });
        }
        this.fetchingData = false;
        this.model.fetchTopTen().then(response => displayTopTen(response));
    }
}

var mainCtrl = new MainCtrl();

function displayTopTen(response) {
    const box = document.querySelector("#top10");
    if (!response.Data) {
        const innerHtml = "Couldn't fetch top 10 cryptocurrencies";
        box.innerHTML = innerHtml;
        return false;
    }
    const topTen = response.Data;
    let innerHtml = `<h5 class="box__header">Top ten cryptocurrencies: </h5>
                     <table class="topTenTable">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Price (USD)</th>
                          <th>Change 24h (%)</th>
                        </tr>
                      </thead>`;
    innerHtml += "<tbody>";

    for (let i = 0; i < topTen.length; i++) {
        innerHtml += `<td>${topTen[i].CoinInfo.FullName}</td>`;
        innerHtml += `<td>${topTen[i].DISPLAY.USD.PRICE}</td>`;
        if (topTen[i].DISPLAY.USD.CHANGEPCT24HOUR > 0) {
            innerHtml += `<td><i class="fas fa-long-arrow-alt-up" style="color: green"></i>  ${topTen[i].DISPLAY.USD.CHANGEPCT24HOUR}</td></tr>`;
        } else {
            innerHtml += `<td><i class="fas fa-long-arrow-alt-down" style="color: crimson"></i>  ${topTen[i].DISPLAY.USD.CHANGEPCT24HOUR}</td></tr>`;
        }
    }

    innerHtml += "</tbody></table>";
    box.innerHTML = innerHtml;
}


function selectItem(el, x) {
    underline.style.left = x;
    menuItems.forEach((el, index) => {
        el.classList.remove("select");
    });
    el.classList.add("select");
}

function getScrollPercent() {
    var h = document.documentElement,
        b = document.body,
        st = "scrollTop",
        sh = "scrollHeight";
    return ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100;
}

const underline = document.querySelector(".underline");
const menuItems = document.querySelectorAll(".menuItem");
const sites = document.querySelectorAll(".content");
const currencyInputs = document.querySelectorAll(".currencyInput");
const arrowsButton = document.querySelector(".arrows");
const chartArrowsButton = document.querySelector(".fa-sync");
const forms = document.querySelectorAll("form");

let currFrom = document.querySelector("#currFrom");
let currTo = document.querySelector("#currTo");
let amountFrom = document.querySelector("#amountFrom");
let amountTo = document.querySelector("#amountTo");

async function calculate() {
    if (!currFrom.value || !currTo.value || !amountFrom.value) return; // jesli nie sa uzupelnione potrzebne pola → return

    let currFromSymbol = currFrom.value.split(",")[1].trim();
    let currToSymbol = currTo.value.split(",")[1].trim();
    let money = amountFrom.value;

    let price = await mainCtrl.model.fetchPrice(currFromSymbol, currToSymbol);
    if (price) {
        amountTo.value = money * price;
    } else {
        console.error("Cannot download currencies data.");
    }
}

amountFrom.addEventListener("input", calculate);
amountTo.addEventListener("input", calculate);

arrowsButton.addEventListener("click", e => {
    let temp = currencyInputs[0].value;
    currencyInputs[0].value = currencyInputs[1].value;
    currencyInputs[1].value = temp;
    calculate();
});

chartArrowsButton.addEventListener("click", e => {
    let temp = currencyInputs[2].value;
    currencyInputs[2].value = currencyInputs[3].value;
    currencyInputs[3].value = temp;
});

currencyInputs.forEach((currInp, index) =>
    currInp.addEventListener("input", e => {
        displayMatches(e.target.value, index);
    })
);

document.addEventListener("click", e => {
    if (e.target && e.target.classList.contains("listItem")) {
        e.target.parentNode.parentNode.previousElementSibling.value = e.target.innerText;
        document.querySelectorAll(".suggestions").forEach(el => {
            el.innerHTML = "";
        });
        calculate();
    }
});

document.addEventListener("scroll", () => {
    let scrollPercent = getScrollPercent();
    if (scrollPercent < 25) selectItem(menuItems[0], scrollPercent / 1.5384 + 5 + "%");
    if (scrollPercent > 25) selectItem(menuItems[1], scrollPercent / 1.5384 + 5 + "%");
    if (scrollPercent > 75) selectItem(menuItems[2], scrollPercent / 1.5384 + 5 + "%");
});

const chartButton = document.querySelector('.chartIcon');
const currencyFrom = document.querySelector('.currencyFrom');
const currencyTo = document.querySelector('.currencyTo');
const dateFrom = document.querySelector('#dateFrom');
const dateTo = document.querySelector('#dateTo');
const chart = document.querySelector('#chart');
const legend = document.querySelector('#legend');

chartButton.addEventListener('click', () => {
    if (!currencyFrom.value || !currencyTo.value || !dateFrom.value || !dateTo.value) {
        alert('Please fill all required fields');
        return;
    }
    chart.style.display = 'block';
    legend.style.display = 'none';
    let currFromSymbol = currencyFrom.value.split(",")[1].trim();
    let currToSymbol = currencyTo.value.split(",")[1].trim();
    let todayDate = new Date();
    let adjustedDateFrom = new Date(dateFrom.value);
    let adjustedDateTo =new Date(dateTo.value);
    let limit = Math.floor((todayDate.getTime() - adjustedDateFrom.getTime())/86400000);
    let daysFromEndDate = Math.floor((todayDate.getTime() - adjustedDateTo.getTime())/86400000);
    mainCtrl.model.getHistoricalData(currFromSymbol, currToSymbol, limit).then(response => {
        response.splice(response.length-1-daysFromEndDate, daysFromEndDate);
        let open = [];
        response.forEach(el => open.push(el.open));
        let close = [];
        response.forEach(el => close.push(el.close));
        let high = [];
        response.forEach(el => high.push(el.high));
        let low = [];
        response.forEach(el => low.push(el.low));
        let object = {
            open: open,
            close: close,
            high: high,
            low: low,
            labels: generateLabels(Date.parse(adjustedDateFrom), Date.parse(adjustedDateTo))
        }
        updateChart(object);
        console.log(object);
    });
})

menuItems.forEach((el, index) => {
    el.addEventListener("click", () => {
        switch (index) {
            case 0:
                sites[0].scrollIntoView();
                break;
            case 1:
                sites[1].scrollIntoView();
                break;
            case 2:
                sites[2].scrollIntoView();
                break;
            default:
                break;
        }
    });
});

export default MainCtrl;
