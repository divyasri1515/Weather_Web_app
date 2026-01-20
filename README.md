🌦️ Weather Web Application

A responsive weather web application that displays real-time weather information using the OpenWeatherMap API. The application allows users to search for locations by city or state and presents weather data in multiple temperature units through a clean and user-friendly interface.

🔹 Features

Search weather details by city or state

Displays real-time temperature, weather conditions, wind speed, and local time

Supports temperature units: Celsius (°C), Fahrenheit (°F), and Kelvin (K)

Dynamic weather icons based on current conditions

Input validation and error handling for invalid locations

Responsive design for desktop and mobile devices

🔹 Technologies Used

Frontend: HTML, CSS, JavaScript

API: OpenWeatherMap API

🔹 How It Works

The application sends a request to the OpenWeatherMap API based on the user’s search input. The API response, which provides temperature data in Kelvin, is processed using JavaScript and converted into Celsius and Fahrenheit when selected by the user. Weather details such as conditions, wind speed, and local time are displayed dynamically, with UI elements updating based on the retrieved data.

🔹 Project Structure

Weather-Web-App/

│

├── weather.html

├── style.css

└── weather.js

🔹 Setup Instructions

Clone the repository

git clone https://github.com/your-username/weather-web-app.git


Navigate to the project directory

cd weather-web-app


Open weather.html in a web browser

Add your OpenWeatherMap API key in weather.js

const apiKey = "YOUR_API_KEY";

🔹 Future Enhancements

Add a 5-day weather forecast

Implement geolocation-based weather detection

Deploy the application using GitHub Pages or Netlify

Rebuild the application using React.js
