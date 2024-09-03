import { useEffect, useRef, useState } from "react";
import switchLogo from './assets/icons/swap-svgrepo-com.svg';

function CurrencyConverter() {

    const amountInput = useRef('');
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState('IRR');
    const [freeMarketRate, setFreeMarketRate] = useState(600000);
    const [freeMarketResult, setFreeMarketResult] = useState(0);
    const [officialResult, setOfficialResult] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [inputNumber, setInputNumber] = useState(0);
    const [options, setOptions] = useState(['USD', 'IRR']);
    const [flags, setFlags] = useState({
        'USD': "./icons/united-states.svg",
        "IRR": "./icons/iran.svg"
    });

    function handleSwitch() {
        let temp = fromCurrency;
        setFromCurrency(toCurrency);
        setToCurrency(temp);
        setOfficialResult(0);
        setFreeMarketResult(0);
    }

    function handleSubmit(e, amount) {
        e.preventDefault();
        
        if(amount !== '') {
            setInputNumber(amount);
            convertCurrency(amount);
            amountInput.current.value = '';
        } else {
            setError('لطفا یک مقدار وارد نمایید.');
        }
    }

    function handleBlur(amount) {
        if(amount === '') {
            amountInput.current.classList.add('hasError');
            setError('لطفا یک مقدار وارد نمایید.');
        } else {
            amountInput.current.classList.remove('hasError');
            setError('');
        }        
    }

    function convertCurrency(amount) {
        let marketResult;
        setLoading(true);
        fetch(`https://v6.exchangerate-api.com/v6/d153f07b9c638c53841573d8/latest/${fromCurrency}`)
        .then(response => {
            if(response.ok) {
                return response.json();
            } else {
                throw Error(response.status);
            }
        })
        .then(data => {

            let rate = data.conversion_rates[toCurrency];
            let result = amount * rate;

            if(fromCurrency === 'USD') {
                marketResult = amount * freeMarketRate;
            } else if(fromCurrency === "IRR") {
                marketResult = amount / freeMarketRate;
            }

            setFreeMarketResult(marketResult);
            setOfficialResult(result);
            setLoading(false);
        });

    }

    const optionList = options.map(option => (
        <option 
        key={option}
        value={option}
        >
            {option}
        </option>
    ))
    
    return (
        <main className="converter-container">
            <h1>مبدل ارز</h1>
            <form>
                <label htmlFor="amount">مبلغ *</label>
                <input 
                ref={amountInput} 
                id="amount" 
                type="number" 
                placeholder="مبلغ مورد نظر را وارد نمایید." 
                onBlur={() => handleBlur(amountInput.current.value)}
                />
                {error &&
                <div className="error">{error}</div>
                }

                <div className="currency-inputs">
                    <div className="select-section">
                        <label htmlFor="from">ارز مبدأ</label>
                        <img src={flags[fromCurrency]} alt="" />
                        <select 
                        id="from"
                        value={fromCurrency} 
                        onChange={(e) => setFromCurrency(e.target.value)}
                        >
                            {optionList}
                        </select>
                    </div>

                    <div 
                    onClick={handleSwitch}
                    className="switch"
                    >
                        <img src={switchLogo} alt="switch" />
                    </div>

                    <div className="select-section">
                        <label htmlFor="to">ارز مقصد</label>
                        <img src={flags[toCurrency]} alt="" />
                        <select 
                        id="to"
                        value={toCurrency} 
                        onChange={(e) => setToCurrency(e.target.value)} 
                        >
                            {optionList}
                        </select>
                    </div>
                </div>

                <button 
                className="convertBtn" 
                type="submit" 
                onClick={(e) => handleSubmit(e, amountInput.current.value)}
                >
                    تبدیل
                </button>
            </form>

            <p>مقدار تبدیل شده:</p>
            <div className="result-box">
                {officialResult && freeMarketResult ? 
                <>
                <div className="item">
                    <span>نرخ رسمی:</span>
                    <p>{inputNumber} {fromCurrency} = {officialResult.toLocaleString()} {toCurrency}</p>
                </div>
                <div className="item">
                    <span>نرخ بازار آزاد:</span>
                    <p>{inputNumber} {fromCurrency} = {freeMarketResult.toLocaleString()} {toCurrency}</p>
                </div>
                </>
                : loading && <div dir="ltr">Loading...</div>}
            </div>
        </main>
    )
}

export default CurrencyConverter