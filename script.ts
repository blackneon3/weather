type WeatherIcons = "01d" | "02d" | "03d" | "04d" | "09d" | "10d" | "11d";

interface Weather {
  id: number;
  main: string;
  description: string;
  icon: WeatherIcons;
}

// TypeScript types for the main weather data
interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

// TypeScript types for the wind data
interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

// TypeScript types for the rain data
interface Rain {
  "3h": number;
}

// TypeScript types for the sys data
interface Sys {
  pod: string;
}

// TypeScript types for the list item (hourly forecast)
interface ListItem {
  dt: number;
  main: MainWeatherData;
  weather: Weather[];
  clouds: {
    all: number;
  };
  wind: Wind;
  visibility: number;
  pop: number;
  rain: Rain;
  sys: Sys;
  dt_txt: string;
}

// TypeScript types for the city data
interface City {
  id: number;
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

// TypeScript type for the entire response object
interface WeatherApiResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ListItem[];
  city: City;
}

const cityWeather = document.querySelector(
  ".weather-app__city"
) as HTMLParagraphElement | null;
const temperature = document.querySelector(
  ".weather-app__weather-temp"
) as HTMLHeadingElement | null;
const cityInput = document.querySelector(
  ".weather-app__input"
) as HTMLInputElement | null;
const searchButton = document.querySelector(
  ".weather-app__button"
) as HTMLButtonElement | null;
const day = document.querySelector(
  ".weather-app__day"
) as HTMLHeadingElement | null;
const currentDate = document.querySelector(
  ".weather-app__current-date"
) as HTMLParagraphElement | null;
const weatherDescription = document.querySelector(
  ".weather-app__weather-description"
) as HTMLHeadingElement | null;
const humidity = document.querySelector(
  ".weather-app__weather-humidity"
) as HTMLParagraphElement | null;
const wind = document.querySelector(
  ".weather-app__weather-wind"
) as HTMLParagraphElement | null;
const otherDayInformation = document.querySelector(
  ".weather-app__other-days-information"
) as HTMLDivElement | null;
const weatherInformation = document.querySelector(
  ".weather-app__information"
) as HTMLDivElement | null;
const icon = document.querySelector(".bi") as HTMLElement | null;

const weatherIcons: Record<WeatherIcons, `bi${string}`> = {
  "01d": "bi-brightness-high-fill",
  "02d": "bi-cloud-sun",
  "03d": "bi-cloud-sun",
  "04d": "bi-cloud-sun",
  "09d": "bi-cloud-drizzle",
  "10d": "bi-cloud-drizzle",
  "11d": "bi-cloud-lightning",
};

async function findWeather() {
  const cityInputName = cityInput?.value;
  const weather: WeatherApiResponse = await myFetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityInputName}&appid=4b03bf5685cfcf66d0f3b02c6ca29074&units=metric&cnt=2`
  );
  console.log(weather);
  if (weather.cod === "404" || cityInputName === "") {
    return;
  }
  weatherInformation?.classList.remove("weather-app__information--none");
  if (cityWeather) {
    cityWeather.innerText = `${weather.city.name}, ${weather.city.country}`;
  }
  icon?.classList.forEach((x) => {
    if (x !== "bi") {
      icon.classList.remove(x);
    }
  });

  const iconFromApi: WeatherIcons = weather.list[0].weather[0].icon;

  icon?.classList.add(weatherIcons[iconFromApi]);
  if (temperature) {
    temperature.innerText = `${Math.round(weather.list[0].main.temp)}°C`;
  }
  const cityDate = new Date(weather.list[0].dt * 1000);
  const [weekDayName, actualDate] = new Intl.DateTimeFormat("pl", {
    dateStyle: "full",
  } as Intl.DateTimeFormatOptions)
    .format(cityDate)
    .split(", ");
  if (day && currentDate && humidity && wind) {
    day.innerText = weekDayName;
    currentDate.innerText = actualDate;
    humidity.innerText = `${Math.round(weather.list[0].main.humidity)}%`;
    wind.innerText = `${Math.round(weather.list[0].wind.speed) * 3.6}km/h`;
  }

  weather.list.forEach((element) => {
    const nextCityDate = new Date(element.dt * 1000);
    const wrapperElement = document.createElement("div");
    wrapperElement.classList.add("weather-app__other-days-information__box");
    otherDayInformation?.appendChild(wrapperElement);
    const paragraf = document.createElement("p");
    const h4 = document.createElement("h3");

    paragraf.innerText = new Intl.DateTimeFormat("pl", {
      weekday: "short",
    }).format(nextCityDate);
    h4.innerText = `${Math.round(element.main.temp)}°C`;

    wrapperElement.appendChild(paragraf);
    wrapperElement.appendChild(h4);
  });

  const weatherDescriptionTranslate = weather.list[0].weather[0].description;
  const translatedValue = await myFetch(
    `https://api.mymemory.translated.net/get?q=${weatherDescriptionTranslate}&langpair=en|pl`
  );
  if (weatherDescription) {
    weatherDescription.innerText = translatedValue.responseData.translatedText;
  }
}

searchButton?.addEventListener("click", findWeather);
cityInput?.addEventListener("keyup", (event) => {
  console.log("test");
  if (event.code === "Enter") {
    findWeather();
  }
});

async function myFetch(url: RequestInfo | URL) {
  const response = await fetch(url);
  return response.json();
}
