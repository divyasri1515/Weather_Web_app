let input = document.querySelector("input");
let btn = document.querySelector("button");
let output = document.querySelector("#output");

let currentUnit = "metric"; // metric = °C, imperial = °F, kelvin = K

// --- Temperature animation ---
function animateTemp(el, finalTemp, symbol) {
    let startTime = null;
    let duration = 400;

    function update(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = Math.min((timestamp - startTime) / duration, 1);
        let value = Math.round(progress * finalTemp);
        el.textContent = value + symbol;

        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// --- Weather backgrounds ---
const weatherBackgrounds = {
    Clear: { day: "linear-gradient(to top, #a1c4fd, #c2e9fb)", night: "linear-gradient(to top, #0d1b2a, #1b263b)" },
    Clouds: { day: "linear-gradient(to top, #d7d2cc, #304352)", night: "linear-gradient(to top, #2c3e50, #4ca1af)" },
    Rain: { day: "linear-gradient(to top, #89f7fe, #66a6ff)", night: "linear-gradient(to top, #1f1c2c, #928dab)" },
    Snow: { day: "linear-gradient(to top, #e0eafc, #cfdef3)", night: "linear-gradient(to top, #2c3e50, #bdc3c7)" },
    Thunderstorm: { day: "linear-gradient(to top, #141e30, #243b55)", night: "linear-gradient(to top, #0f0c29, #302b63)" },
    Mist: { day: "linear-gradient(to top, #d7d2cc, #304352)", night: "linear-gradient(to top, #2c3e50, #4ca1af)" },
    Default: { day: "linear-gradient(to top, #c3ecf9, #eeefff)", night: "linear-gradient(to top, #0f2027, #203a43, #2c5364)" }
};

// --- Keyboard support ---
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") btn.click();
});

// --- Button click handler ---
btn.addEventListener("click", async () => {
    let cityName = input.value.trim();
    if (!cityName) { alert("Please enter a city name."); return; }

    // Clear previous overlays
    document.querySelectorAll('.weather-effect').forEach(el => el.remove());

    // Loading state
    btn.classList.add("loading");
    btn.innerHTML = `<i class="fa-solid fa-spinner"></i>`;
    output.classList.remove("animate");
    output.innerHTML = `<p class="placeholder">Loading...</p>`;
    output.style.background = "#fff";

    const key = "9209b060d4a2934b6ac803700f132782";

    try {
        let unitParam = currentUnit === "kelvin" ? "" : `&units=${currentUnit}`;
        let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}${unitParam}&appid=${key}`);
        if (!res.ok) throw new Error("City not found");

        let data = await res.json();

        // Local time
        const timezoneOffset = data.timezone;
        const localTime = new Date(Date.now() + timezoneOffset * 1000);
        const timeString = localTime.toUTCString().slice(17, 22); // HH:MM

        // Temperature
        let temp = Math.round(data.main.temp);
        let tempSymbol = currentUnit === "metric" ? "°C" : currentUnit === "imperial" ? "°F" : "K";

        // Wind
        let windSpeed, windUnit, windValueForCheck;
        if (currentUnit === "imperial") {
            windSpeed = data.wind.speed.toFixed(1);
            windUnit = "mph";
            windValueForCheck = data.wind.speed;
        } else {
            windSpeed = (data.wind.speed * 3.6).toFixed(1);
            windUnit = "km/h";
            windValueForCheck = data.wind.speed * 3.6;
        }
        let windIcon = windValueForCheck > 20 ? "💨" : "🌬️";

        // Weather icon
        let iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        // Day/night
        let isDay = data.dt > data.sys.sunrise && data.dt < data.sys.sunset;
        let weatherType = data.weather[0].main;
        let bgGradient = (weatherBackgrounds[weatherType] || weatherBackgrounds.Default)[isDay ? "day" : "night"];
        output.style.background = bgGradient;
        output.style.boxShadow = isDay ? "0 20px 40px rgba(0,0,0,0.15)" : "0 30px 60px rgba(0,0,0,0.6)";
        output.style.color = isDay ? "#1a1a1a" : "#f5f5f5";

        // UI
        output.innerHTML = `
            <div class="unit-select">
                <select id="unit">
                    <option value="metric">°C</option>
                    <option value="imperial">°F</option>
                    <option value="kelvin">K</option>
                </select>
            </div>

            <div class="content">
                <h3 class="city">${data.name}</h3>
                <span class="local-time">Local time • ${timeString}</span>
                <img class="weather-icon" src="${iconUrl}"> 
                <div class="temp">0${tempSymbol}</div>
            </div>

            <div class="bottomRow">
                <p class="desc">${data.weather[0].description}</p>
                <div class="wind-box">
                    <span class="wind-title">Wind Speed</span>
                    <div class="wind">
                        <span class="wind-icon">${windIcon}</span>
                        <span class="wind-value">${windSpeed} ${windUnit}</span>
                    </div>
                </div>
            </div>
        `;
        requestAnimationFrame(() => output.classList.add("animate"));

        // Animate temperature
        const tempEl = document.querySelector(".temp");
        animateTemp(tempEl, temp, tempSymbol);

        // Wind animation
        const windBox = document.querySelector(".wind");
        if (windBox && windValueForCheck > 20) windBox.classList.add("fast");
        else if (windBox) windBox.classList.remove("fast");

        // Unit selector
        const unitSelect = document.querySelector("#unit");
        unitSelect.value = currentUnit;
        unitSelect.addEventListener("change", e => {
            currentUnit = e.target.value;
            btn.click();
        });

        // --- Weather Effects ---
        // Clouds
        if(weatherType === "Clouds") {
            let cloud = document.createElement("div");
            cloud.classList.add("clouds", "weather-effect");
            output.appendChild(cloud);
        }

        // Rain
        if(weatherType === "Rain") {
            for(let i=1;i<=30;i++){
                let drop = document.createElement("div");
                drop.classList.add("rain","weather-effect");
                drop.style.setProperty('--i', i);
                output.appendChild(drop);
            }
        }

        // Snow
        if(weatherType === "Snow") {
            for(let i=1;i<=20;i++){
                let flake = document.createElement("div");
                flake.classList.add("snow","weather-effect");
                flake.style.setProperty('--i', i);
                output.appendChild(flake);
            }
        }

        // Stars for night
        if(!isDay) {
            for(let i=1;i<=50;i++){
                let star = document.createElement("div");
                star.classList.add("stars","weather-effect");
                star.style.setProperty('--i', Math.random());
                star.style.setProperty('--j', Math.random());
                output.appendChild(star);
            }
        }

        btn.classList.remove("loading");
        btn.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i>`;
    } catch (err) {
        output.innerHTML = `<p class="error">❌ City not found. Try another name.</p>`;
        output.style.background = "#fff";
        output.style.color = "#333";
        btn.classList.remove("loading");
        btn.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i>`;
    }
});
