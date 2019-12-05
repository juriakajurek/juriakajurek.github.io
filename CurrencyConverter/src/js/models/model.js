import additioncalCurrenciesData from "../currencies_data";
class BaseModel {
    constructor() {}

    async fetchAllCoinNames() {
        const currencies = [];

        //fetch coins from api listing nearly all supported crypto
        const response = await fetch("https://min-api.cryptocompare.com/data/all/coinlist");
        const data = await response.json();
        if (!!data && data.Response !== "Success") {
            console.error("failed to fetch from main source");
            console.log(data);
            return [];
        }
        Object.values(data.Data).map(coin => {
            currencies.push({ name: coin.CoinName, symbol: coin.Name });
        });

        //add currencies from file
        currencies.push(...additioncalCurrenciesData);

        return currencies;
    }

    async fetchPrice(symbol1, symbol2) {
        const responseJSON = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${symbol1}&tsyms=${symbol2}`);
        const response = await responseJSON.json();
        if (!!response.Response) {
            console.error("Couldn't fetch price");
            return;
        } else {
            return response[symbol2];
        }
    }

    async fetchTopTen() {
        const responseJSON = await fetch(`https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD`);
        const response = await responseJSON.json();
        if (!!response.Response) {
            console.error("Couldn't fetch Top10");
            return {};
        } else {
            return response;
        }
    }

    async getHistoricalData(symbol1, symbol2, limit) {
        const response = await fetch(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol1}&tsym=${symbol2}&limit=${limit}`);
        const data = await response.json();
        if (!!data && data.Response !== "Success") {
            console.error("Couldn't get the data");
            return;
        } else {
            return data.Data.Data;
        }
    }
}

export default BaseModel;
