import additioncalCurrenciesData from "./currencies_data";

const currencies = additioncalCurrenciesData;

function findMatches(searched, currencies) {
    return currencies.filter(currency => {
        const regex = new RegExp(searched, "gi");
        return currency.name.match(regex) || currency.symbol.match(regex);
    });
}

function displayMatches(val, i) {
    if (val.length < 1) {
        suggestions[i].innerHTML = [];
        return;
    }
    const matchArray = findMatches(val, currencies);
    var innerHtml = matchArray.map((el, index) => {
        if (index >= 15) return null;
        return `
                <li class="listItem">
                    ${el.name}, ${el.symbol}
                </li>`;
    });
    suggestions[i].innerHTML = innerHtml.join("");
}

const suggestions = document.querySelectorAll(".suggestions");

export default displayMatches;
