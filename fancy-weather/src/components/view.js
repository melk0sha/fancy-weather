/* eslint-disable no-param-reassign */
import clearDay from "../assets/clear-day.png";
import clearNight from "../assets/clear-night.png";
import cloudy from "../assets/cloudy.png";
import fog from "../assets/fog.png";
import hail from "../assets/hail.png";
import partlyCloudyDay from "../assets/partly-cloudy-day.png";
import partlyCloudyNight from "../assets/partly-cloudy-night.png";
import rain from "../assets/rain.png";
import sleet from "../assets/sleet.png";
import snow from "../assets/snow.png";
import thunderstorm from "../assets/thunderstorm.png";
import tornado from "../assets/tornado.png";
import wind from "../assets/wind.png";

export default class View {
    createPage() {
        this.wrapper = this.createWrapper();
        this.header = View.createElement("header", this.wrapper, "header");
        this.main = View.createElement("main", this.wrapper, "main");

        this.controlBlockCreation();

        this.weatherBlock = View.createElement("div", this.main, "weather");

        this.weatherTodayCreation(); // Inside this.weatherBlock
        this.weatherThreeDaysCreation(); // Inside this.weatherBlock
        this.geolocationCreation();

        this.appendAllElements();
    }

    controlBlockCreation() {
        const controlBlock = View.createElement("div", this.header, "control");
        const leftControlBlock = View.createElement(
            "div",
            controlBlock,
            "control__left-block"
        );
        const rightControlBlock = View.createElement(
            "div",
            controlBlock,
            "control__right-block"
        );

        this.changeBgImageButton = View.createElement(
            "button",
            leftControlBlock,
            "btn",
            "control__change-bg-image"
        );
        this.changeLanguageButton = View.createElement(
            "button",
            leftControlBlock,
            "btn",
            "control__change-language", "language__english"
        );
        this.changeFahrenheitButton = View.createElement(
            "button",
            leftControlBlock,
            "btn",
            "control__change-temperature_fahrenheit"
        );
        this.changeCelsiusButton = View.createElement(
            "button",
            leftControlBlock,
            "btn",
            "control__change-temperature_celsius",
            "active"
        );

        this.searchButton = this.createSearch(
            rightControlBlock,
            "form",
            "form__search-text",
            "btn",
            "form__button"
        );

        View.updateBgImageButtonContent(this.changeBgImageButton);
        View.updateButtonContent(this.changeLanguageButton, "EN");
        View.updateButtonContent(this.changeFahrenheitButton, "°F");
        View.updateButtonContent(this.changeCelsiusButton, "°C");
        View.updateButtonContent(this.searchButton, "Search");
    }

    weatherTodayCreation() {
        const weatherTodayBlock = View.createElement(
            "div",
            this.weatherBlock,
            "weather-today"
        );

        this.town = View.createElement(
            "p",
            weatherTodayBlock,
            "weather-today__town"
        );

        const dateTimeContainer = View.createElement(
            "div",
            weatherTodayBlock,
            "weather-today__date-time"
        );
        this.date = View.createElement(
            "p",
            dateTimeContainer,
            "weather-today__date"
        );
        this.time = View.createElement(
            "p",
            dateTimeContainer,
            "weather-today__time"
        );

        const weatherInfoContainer = View.createElement(
            "div",
            weatherTodayBlock,
            "weather-today__total-weather-info"
        );

        const summaryContainer = View.createElement(
            "div",
            weatherInfoContainer,
            "weather-today__summary"
        );
        this.weatherIcon = View.createElement(
            "img",
            summaryContainer,
            "weather-today__icon"
        );
        this.weatherDescription = View.createElement(
            "p",
            summaryContainer,
            "weather-today__description"
        );
        this.feelsLike = View.createElement(
            "p",
            summaryContainer,
            "weather-today__feels-like"
        );
        this.wind = View.createElement(
            "p",
            summaryContainer,
            "weather-today__wind"
        );
        this.humidity = View.createElement(
            "p",
            summaryContainer,
            "weather-today__humidity"
        );

        this.temperature = View.createElement(
            "p",
            weatherInfoContainer,
            "weather-today__temperature"
        );
        const grad = View.createElement(
            "p",
            weatherInfoContainer,
            "weather-today__temperature_grad"
        );

        View.updateParagraphElement(grad, "°");
    }

    weatherThreeDaysCreation() {
        const weatherThreeDaysBlock = View.createElement(
            "div",
            this.weatherBlock,
            "weather-three-days"
        );

        const firstDayContainer = View.createElement(
            "div",
            weatherThreeDaysBlock,
            "first-day"
        );
        const secondDayContainer = View.createElement(
            "div",
            weatherThreeDaysBlock,
            "second-day"
        );
        const thirdDayContainer = View.createElement(
            "div",
            weatherThreeDaysBlock,
            "third-day"
        );

        this.firstDayName = View.createElement(
            "p",
            firstDayContainer,
            "first-day__name"
        );
        this.secondDayName = View.createElement(
            "p",
            secondDayContainer,
            "second-day__name"
        );
        this.thirdDayName = View.createElement(
            "p",
            thirdDayContainer,
            "third-day__name"
        );

        const firstDayInfoContainer = View.createElement(
            "div",
            firstDayContainer,
            "first-day__info"
        );
        const secondDayInfoContainer = View.createElement(
            "div",
            secondDayContainer,
            "second-day__info"
        );
        const thirdDayInfoContainer = View.createElement(
            "div",
            thirdDayContainer,
            "third-day__info"
        );

        this.firstDayTemperature = View.createElement(
            "p",
            firstDayInfoContainer,
            "first-day__temperature"
        );
        const firstDayGrad = View.createElement(
            "p",
            firstDayInfoContainer,
            "first-day__temperature_grad"
        );
        this.secondDayTemperature = View.createElement(
            "p",
            secondDayInfoContainer,
            "second-day__temperature"
        );
        const secondDayGrad = View.createElement(
            "p",
            secondDayInfoContainer,
            "second-day__temperature_grad"
        );
        this.thirdDayTemperature = View.createElement(
            "p",
            thirdDayInfoContainer,
            "third-day__temperature"
        );
        const thirdDayGrad = View.createElement(
            "p",
            thirdDayInfoContainer,
            "third-day__temperature_grad"
        );

        this.firstDayWeatherIcon = View.createElement(
            "img",
            firstDayInfoContainer,
            "first-day__icon"
        );
        this.secondDayWeatherIcon = View.createElement(
            "img",
            secondDayInfoContainer,
            "second-day__icon"
        );
        this.thirdDayWeatherIcon = View.createElement(
            "img",
            thirdDayInfoContainer,
            "third-day__icon"
        );

        View.updateParagraphElement(firstDayGrad, "°");
        View.updateParagraphElement(secondDayGrad, "°");
        View.updateParagraphElement(thirdDayGrad, "°");
    }

    geolocationCreation() {
        const geolocationBlock = View.createElement(
            "div",
            this.main,
            "geolocation"
        );
        const map = View.createElement(
            "div",
            geolocationBlock,
            "geolocation__map"
        );
        View.addIdName(map, "map");
        this.latitude = View.createElement(
            "p",
            geolocationBlock,
            "geolocation__latitude"
        );
        this.longitude = View.createElement(
            "p",
            geolocationBlock,
            "geolocation__longitude"
        );
    }

    static changeTemperatureMeasurement(celsiusButton, fahrenheitButton) {
        celsiusButton.classList.toggle("active");
        fahrenheitButton.classList.toggle("active");
    }

    getChangeBgImageButton() {
        return this.changeBgImageButton;
    }

    getChangeLanguageButton() {
        return this.changeLanguageButton;
    }

    getChangeFahrenheitButton() {
        return this.changeFahrenheitButton;
    }

    getChangeCelsiusButton() {
        return this.changeCelsiusButton;
    }

    getSearchButton() {
        return this.searchButton;
    }

    static updateBgImage(image) {
        View.getBody().style.background = `linear-gradient(180deg, rgba(8, 15, 26, 0.59) 0%, rgba(17, 17, 46, 0.46) 100%), url(${image}) center center / cover no-repeat fixed`;
        View.getBody().style.overflow = "auto";
    }

    getFirstDayName() {
        return this.firstDayName;
    }

    getSecondDayName() {
        return this.secondDayName;
    }

    getThirdDayName() {
        return this.thirdDayName;
    }

    getFirstDayTemperature() {
        return this.firstDayTemperature;
    }

    getSecondDayTemperature() {
        return this.secondDayTemperature;
    }

    getThirdDayTemperature() {
        return this.thirdDayTemperature;
    }

    getFirstDayWeatherIcon() {
        return this.firstDayWeatherIcon;
    }

    getSecondDayWeatherIcon() {
        return this.secondDayWeatherIcon;
    }

    getThirdDayWeatherIcon() {
        return this.thirdDayWeatherIcon;
    }

    getHumidity() {
        return this.humidity;
    }

    getWind() {
        return this.wind;
    }

    getFeelsLike() {
        return this.feelsLike;
    }

    getWeatherIcon() {
        return this.weatherIcon;
    }

    getWeatherDescription() {
        return this.weatherDescription;
    }

    getTemperatureNow() {
        return this.temperature;
    }

    getTime() {
        return this.time;
    }

    getDate() {
        return this.date;
    }

    getLatitude() {
        return this.latitude;
    }

    getLongitude() {
        return this.longitude;
    }

    getTownAndCountry() {
        return this.town;
    }

    getInputForm() {
        return this.form;
    }

    getTextInput() {
        return this.input;
    }

    createWrapper() {
        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("wrapper");

        return this.wrapper;
    }

    static createElement(tag, container, ...className) {
        const element = document.createElement(tag);
        element.classList.add(...className);
        container.appendChild(element);
        return element;
    }

    appendAllElements() {
        View.getBody().appendChild(this.wrapper);
    }

    static addIdName(elem, idName) {
        elem.id = idName;
    }

    static updateWeatherIcon(elem, value) {
        switch (value) {
        case "fog":
            elem.src = fog;
            break;
        case "clear-day":
            elem.src = clearDay;
            break;
        case "clear-night":
            elem.src = clearNight;
            break;
        case "cloudy":
            elem.src = cloudy;
            break;
        case "hail":
            elem.src = hail;
            break;
        case "partly-cloudy-day":
            elem.src = partlyCloudyDay;
            break;
        case "partly-cloudy-night":
            elem.src = partlyCloudyNight;
            break;
        case "rain":
            elem.src = rain;
            break;
        case "sleet":
            elem.src = sleet;
            break;
        case "snow":
            elem.src = snow;
            break;
        case "thunderstorm":
            elem.src = thunderstorm;
            break;
        case "tornado":
            elem.src = tornado;
            break;
        case "wind":
            elem.src = wind;
            break;
        default:
            break;
        }
    }

    static updateParagraphElement(elem, value) {
        elem.textContent = value;
    }

    static updateBgImageButtonContent(button) {
        const i = document.createElement("i");
        i.classList.add("fas", "fa-sync-alt", "change-bg-image__icon");
        button.appendChild(i);
    }

    static updateButtonContent(button, content) {
        button.textContent = content;
    }

    getMicrophoneElement() {
        return this.iconSpeech;
    }

    createSearch(container, formClassName, inputClassName, ...buttonClassName) {
        this.form = document.createElement("form");
        this.input = document.createElement("input");
        this.iconSpeech = document.createElement("i");
        const button = document.createElement("button");

        this.input.type = "text";

        this.form.classList.add(formClassName);
        this.input.classList.add(inputClassName);
        this.iconSpeech.classList.add("form__speech", "fa", "fa-microphone");
        View.addIdName(this.input, "suggest"); // For API (suggest-list)
        button.classList.add(...buttonClassName);

        this.form.appendChild(this.input);
        this.form.appendChild(button);
        this.form.appendChild(this.iconSpeech);
        container.appendChild(this.form);
        return button;
    }

    static getBody() {
        return document.body;
    }
}
