const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (const select of dropdowns) {
  for (const currCode of Object.keys(countryList)) {
    const newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  const amount = document.querySelector(".amount input");
  const amountValue = Number(amount.value);
  const fromCode = fromCurr.value.toLowerCase();
  const toCode = toCurr.value.toLowerCase();

  if (amount.value.trim() === "" || !Number.isFinite(amountValue) || amountValue < 0) {
    msg.innerText = "Please enter a valid amount.";
    return;
  }

  msg.innerText = "Loading exchange rate...";

  try {
    const response = await fetch(`${BASE_URL}/${fromCode}.json`);
    if (!response.ok) {
      throw new Error(`Rate request failed with status ${response.status}`);
    }

    const data = await response.json();
    const rate = data[fromCode]?.[toCode];
    if (typeof rate !== "number" || !Number.isFinite(rate)) {
      throw new Error(`No exchange rate available for ${fromCode.toUpperCase()} to ${toCode.toUpperCase()}`);
    }

    const finalAmount = amountValue * rate;
    msg.innerText = `${amountValue} ${fromCode.toUpperCase()} = ${finalAmount} ${toCode.toUpperCase()}`;
  } catch (error) {
    msg.innerText = "Unable to get the exchange rate. Please try again.";
    console.error("Currency conversion failed:", error);
  }
};

const updateFlag = (element) => {
  const currCode = element.value;
  const countryCode = countryList[currCode];
  const newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  const img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});