/* global ymaps, SpeechRecognition */

import View from "./view";
import Model from "./model";

export default class App {
    constructor() {
        this.view = new View();
        this.model = new Model();
    }

    async init() {
        this.view.createPage();
        await ymaps.ready(() => this.addMap());
        await this.setCoordinates();
        await this.setDefaultProperties();
        App.addSearchSuggest();
        this.speechRecognitionInit();
    }

    async setDefaultProperties() {
        if (localStorage.getItem("language")) {
            this.language = localStorage.getItem("language");
        } else {
            this.language = "en";
        }

        if (localStorage.getItem("measurement")) {
            this.measurement = localStorage.getItem("measurement");
        } else {
            this.measurement = "C";
        }

        this.changeButtonsContentByLocalStorage();

        // Get and set time, date and weather data
        this.timeDateWeatherData = await this.getTimeDateWeatherData();
        const bgImageData = await App.getBgImageData(this.timeDateWeatherData);

        App.updateBackground(bgImageData);
        this.updateCoordinates();
        this.updateTownAndCountry();
        this.updateCurrentDate(this.timeDateWeatherData);
        this.updateCurrentTime(this.timeDateWeatherData);
        setInterval(() => {
            this.updateCurrentTime(this.timeDateWeatherData);
        }, 1000 * 60);
        this.updateWeatherToday(this.timeDateWeatherData);
        this.updateWeatherThreeDays(this.timeDateWeatherData);

        this.addEventOnBgImageButton(this.timeDateWeatherData);
        this.addEventOnTemperatureButtons();
        this.addEventOnSearch();
        this.addEventOnLanguageButton();

        window.addEventListener("beforeunload", () => {
            localStorage.setItem("language", this.language);
            localStorage.setItem("measurement", this.measurement);
        });
    }

    async setCoordinates() {
        await ymaps.geolocation.get().then(
            // Resolve case
            (res) => {
                const bounds = res.geoObjects
                    .get(0)
                    .properties.get("boundedBy");
                [this.coordinates] = bounds;
            },
            // Error case
            () => {
                this.coordinates = [53.9, 27.5667];
            }
        );
    }

    static addSearchSuggest() {
        new ymaps.SuggestView("suggest"); // eslint-disable-line no-new
    }

    static getBgImageData(timeDateWeatherData) {
        // eslint-disable-next-line
        return Model.getDataFromFlickr(timeDateWeatherData);
    }

    static updateBackground(data) {
        View.updateBgImage(data);
    }

    async getTimeDateWeatherData() {
        return await Model.getDataFromDarkSky( // eslint-disable-line no-return-await
            this.coordinates[0],
            this.coordinates[1]
        );
    }

    async updateCoordinates() {
        const [latitude, longitude] = Model.convertCoordinatesIntoMinSec(
            this.coordinates
        );
        View.updateParagraphElement(
            this.view.getLatitude(),
            await this.translate("Latitude: ") + latitude
        );
        View.updateParagraphElement(
            this.view.getLongitude(),
            await this.translate("Longitude: ") + longitude
        );
    }

    async updateTownAndCountry() {
        const townAndCountry = await Model.getTownCoutryDataFromYandexGeocode(
            this.coordinates[0],
            this.coordinates[1]
        );
        View.updateParagraphElement(
            this.view.getTownAndCountry(),
            await this.translate(townAndCountry)
        );
    }

    updateCurrentTime(data) {
        const currentTime = Model.getCurrentTime(data);
        View.updateParagraphElement(this.view.getTime(), currentTime);
    }

    async updateCurrentDate(data) {
        const currentDate = Model.getCurrentDate(data);
        View.updateParagraphElement(this.view.getDate(), await this.translate(currentDate));
    }

    async updateWeatherToday(data) {
        this.temperature = Model.getCurrentTemperature(data);
        const icon = Model.getCurrentWeatherIcon(data);
        let summary = Model.getCurrentSummary(data);
        this.feelsLike = Model.getCurrentFeelsLike(data);
        const wind = Model.getCurrentWind(data);
        const humidity = Model.getCurrentHumidity(data);

        if (this.measurement === "F") {
            this.temperature = Model.convertTemperatureToF(
                this.temperature
            );
            this.feelsLike = Model.convertTemperatureToF(this.feelsLike);
        }

        summary = await this.translate(summary);
        if (summary === "Понятно") {
            summary = "Ясно";
        }

        View.updateParagraphElement(
            this.view.getTemperatureNow(),
            this.temperature
        );
        View.updateWeatherIcon(this.view.getWeatherIcon(), icon);
        View.updateParagraphElement(
            this.view.getWeatherDescription(),
            summary
        );
        View.updateParagraphElement(
            this.view.getFeelsLike(),
            await this.translate(`Feels like: ${this.feelsLike}°`)
        );
        View.updateParagraphElement(
            this.view.getWind(),
            await this.translate(`Wind: ${wind} m/s`)
        );
        View.updateParagraphElement(
            this.view.getHumidity(),
            await this.translate(`Humidity: ${humidity}%`)
        );
    }

    async updateWeatherThreeDays(data) {
        this.firstDay = Model.getFirstDayInfo(data);
        this.secondDay = Model.getSecondDayInfo(data);
        this.thirdDay = Model.getThirdDayInfo(data);

        if (this.measurement === "F") {
            this.firstDay.temperature = Model.convertTemperatureToF(
                this.firstDay.temperature
            );
            this.secondDay.temperature = Model.convertTemperatureToF(
                this.secondDay.temperature
            );
            this.thirdDay.temperature = Model.convertTemperatureToF(
                this.thirdDay.temperature
            );
        }

        View.updateParagraphElement(
            this.view.getFirstDayName(),
            await this.translate(this.firstDay.name)
        );
        View.updateParagraphElement(
            this.view.getSecondDayName(),
            await this.translate(this.secondDay.name)
        );
        View.updateParagraphElement(
            this.view.getThirdDayName(),
            await this.translate(this.thirdDay.name)
        );

        View.updateParagraphElement(
            this.view.getFirstDayTemperature(),
            this.firstDay.temperature
        );
        View.updateParagraphElement(
            this.view.getSecondDayTemperature(),
            this.secondDay.temperature
        );
        View.updateParagraphElement(
            this.view.getThirdDayTemperature(),
            this.thirdDay.temperature
        );

        View.updateWeatherIcon(
            this.view.getFirstDayWeatherIcon(),
            this.firstDay.icon
        );
        View.updateWeatherIcon(
            this.view.getSecondDayWeatherIcon(),
            this.secondDay.icon
        );
        View.updateWeatherIcon(
            this.view.getThirdDayWeatherIcon(),
            this.thirdDay.icon
        );
    }

    speechRecognitionInit() {
        const microphoneElement = this.view.getMicrophoneElement();
        const input = this.view.getTextInput();

        window.SpeechRecognition = window.webkitSpeechRecognition
            || window.SpeechRecognition;

        const recognition = new SpeechRecognition();
        recognition.lang = this.language;

        let recognizing = false;

        microphoneElement.addEventListener("click", () => {
            if (!recognizing) {
                recognition.start();
            }
        });

        recognition.addEventListener("start", () => {
            recognizing = true;
            microphoneElement.classList.add("form__speech-active");
        });

        recognition.addEventListener("end", () => {
            recognizing = false;
            microphoneElement.classList.remove("form__speech-active");
            recognition.abort();
        });

        recognition.addEventListener("result", async (e) => {
            recognizing = false;
            let { transcript } = e.results[0][0];
            microphoneElement.classList.remove("form__speech-active");

            /* Let remove last symbol because it is a sign,
             * for example "Moscow." or "Amstergam!"
             */
            if (recognition.lang === "en") {
                transcript = transcript.slice(0, -1);
            }

            await this.updateAllMainOptionsByTown(transcript);

            input.value = transcript;
            recognition.abort();
        });
    }

    /** * Start of Yandex API Map */
    async addMap(coordinates) {
        const createMap = (state) => {
            this.map = new ymaps.Map("map", state);
        };

        await ymaps.geolocation.get().then(
            // Resolve case
            (res) => {
                const mapContainer = document.getElementById("map");
                const bounds = res.geoObjects
                    .get(0)
                    .properties.get("boundedBy");
                // Рассчитываем видимую область для текущей положения пользователя
                const mapState = ymaps.util.bounds.getCenterAndZoom(bounds, [
                    mapContainer.offsetWidth,
                    mapContainer.offsetHeight
                ]);
                createMap(mapState);
            },
            // Error case
            () => {
                // Если местоположение невозможно получить, то просто создаем карту.
                createMap({
                    center: coordinates,
                    zoom: 2
                });
            }
        );

        this.myPlacemark = new ymaps.Placemark(this.map.getCenter());
        this.map.geoObjects.add(this.myPlacemark);

        this.myPlacemark.events
            .add("mouseenter", (e) => {
                // Ссылку на объект, вызвавший событие,
                // можно получить из поля 'target'.
                e.get("target").options.set("preset", "islands#greenIcon");
            })
            .add("mouseleave", (e) => {
                e.get("target").options.unset("preset");
            });
    }

    changeMap(coordinates) {
        this.myPlacemark.geometry.setCoordinates(coordinates);
        this.map.setCenter(coordinates, 10);
    }
    /** * End of Yandex API Map */

    addEventOnBgImageButton(data) {
        const button = this.view.getChangeBgImageButton();

        const event = async () => {
            const bgImageData = await App.getBgImageData(data);
            App.updateBackground(bgImageData);
        };

        button.addEventListener("click", event);
    }

    convertAllTemperature(data) {
        if (data === "FtoC") {
            this.temperature = Model.convertTemperatureToC(
                this.temperature
            );
            this.feelsLike = Model.convertTemperatureToC(this.feelsLike);
            this.firstDay.temperature = Model.convertTemperatureToC(
                this.firstDay.temperature
            );
            this.secondDay.temperature = Model.convertTemperatureToC(
                this.secondDay.temperature
            );
            this.thirdDay.temperature = Model.convertTemperatureToC(
                this.thirdDay.temperature
            );
        } else if (data === "CtoF") {
            this.temperature = Model.convertTemperatureToF(
                this.temperature
            );
            this.feelsLike = Model.convertTemperatureToF(this.feelsLike);
            this.firstDay.temperature = Model.convertTemperatureToF(
                this.firstDay.temperature
            );
            this.secondDay.temperature = Model.convertTemperatureToF(
                this.secondDay.temperature
            );
            this.thirdDay.temperature = Model.convertTemperatureToF(
                this.thirdDay.temperature
            );
        }
    }

    addEventOnTemperatureButtons() {
        const celsiusButton = this.view.getChangeCelsiusButton();
        const fahrenheitButton = this.view.getChangeFahrenheitButton();

        const event = async (e) => {
            if (e.target.classList.contains("active")) return;

            View.changeTemperatureMeasurement(
                celsiusButton,
                fahrenheitButton
            );

            if (
                e.target.classList.contains(
                    "control__change-temperature_celsius"
                )
            ) {
                this.convertAllTemperature("FtoC");
                this.measurement = "C";
            } else if (
                e.target.classList.contains(
                    "control__change-temperature_fahrenheit"
                )
            ) {
                this.convertAllTemperature("CtoF");
                this.measurement = "F";
            }

            View.updateParagraphElement(
                this.view.getTemperatureNow(),
                this.temperature
            );
            View.updateParagraphElement(
                this.view.getFeelsLike(),
                await this.translate(`Feels like: ${this.feelsLike}°`)
            );
            View.updateParagraphElement(
                this.view.getFirstDayTemperature(),
                this.firstDay.temperature
            );
            View.updateParagraphElement(
                this.view.getSecondDayTemperature(),
                this.secondDay.temperature
            );
            View.updateParagraphElement(
                this.view.getThirdDayTemperature(),
                this.thirdDay.temperature
            );
        };

        celsiusButton.addEventListener("click", event);
        fahrenheitButton.addEventListener("click", event);
    }

    addEventOnSearch() {
        const form = this.view.getInputForm();
        const input = this.view.getTextInput();

        const event = async (e) => {
            if (
                e.target.classList.contains("form__button")
                || e.key === "Enter"
            ) {
                e.preventDefault();
                if (input.value === "") return;
                await this.updateAllMainOptionsByTown(input.value);
            }
        };

        form.addEventListener("keydown", event);
        form.addEventListener("click", event);
    }

    async updateAllMainOptionsByTown(town) {
        this.coordinates = await Model.getCoordinatesFromYandexGeocode(town);
        this.changeMap(this.coordinates);
        this.updateCoordinates();
        this.updateTownAndCountry();
        this.timeDateWeatherData = await this.getTimeDateWeatherData();
        this.updateCurrentTime(this.timeDateWeatherData);
        this.updateWeatherToday(this.timeDateWeatherData);
        this.updateWeatherThreeDays(this.timeDateWeatherData);
    }

    updateMainOptionsByLanguage() {
        this.updateCoordinates();
        this.updateTownAndCountry();
        this.updateCurrentDate(this.timeDateWeatherData);
        this.updateCurrentTime(this.timeDateWeatherData);
        this.updateWeatherToday(this.timeDateWeatherData);
        this.updateWeatherThreeDays(this.timeDateWeatherData);
    }

    addEventOnLanguageButton() {
        const button = this.view.getChangeLanguageButton();

        const event = () => {
            if (button.classList.contains("language__english")) {
                button.classList.remove("language__english");
                button.classList.add("language__russian");
                View.updateButtonContent(button, "RU");
                View.updateButtonContent(this.view.getSearchButton(), "Поиск");

                this.language = "ru";
            } else if (button.classList.contains("language__russian")) {
                button.classList.remove("language__russian");
                button.classList.add("language__belarussian");
                View.updateButtonContent(button, "BE");
                View.updateButtonContent(this.view.getSearchButton(), "Пошук");

                this.language = "be";
            } else if (button.classList.contains("language__belarussian")) {
                button.classList.remove("language__belarussian");
                button.classList.add("language__english");
                View.updateButtonContent(button, "EN");
                View.updateButtonContent(this.view.getSearchButton(), "Search");

                this.language = "en";
            }

            this.updateMainOptionsByLanguage();
        };

        button.addEventListener("click", event);
    }

    changeButtonsContentByLocalStorage() {
        const languageButton = this.view.getChangeLanguageButton();
        const celsiusButton = this.view.getChangeCelsiusButton();
        const fahrenheitButton = this.view.getChangeFahrenheitButton();

        if (this.language === "ru") {
            languageButton.classList.remove("language__english");
            languageButton.classList.add("language__belarussian");
            View.updateButtonContent(languageButton, "RU");
            View.updateButtonContent(this.view.getSearchButton(), "Поиск");
        } else if (this.language === "be") {
            View.updateButtonContent(languageButton, "BE");
            View.updateButtonContent(this.view.getSearchButton(), "Пошук");
        }

        if (this.measurement === "F") {
            View.changeTemperatureMeasurement(
                celsiusButton,
                fahrenheitButton
            );
        }
    }

    async translate(text) {
        if (this.language !== "en") {
            // eslint-disable-next-line
            return await Model.getTextTranslate(text, this.language); 
        }
        return text;
    }
}
