export default class Model {
    static async getCoordinatesFromYandexGeocode(adress) {
        const url = `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=08875343-2337-4552-a37a-80727eba4a54&geocode=${adress}`;
        const responce = await fetch(url);
        const data = await responce.json();
        if (data.response.GeoObjectCollection.featureMember[0]) {
            const coordinates = data.response.GeoObjectCollection.featureMember[0]
                .GeoObject.Point.pos.split(" ").map((x) => +x).reverse();
            return coordinates;
        }
        return [53.9, 27.5667];
    }

    static async getTextTranslate(text, language) {
        const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20191214T211507Z.43f68ee65489a6ca.8697def0e007664c5dcd8db7be11209ceb27c4a3&text=${text}&lang=${language}`;
        const responce = await fetch(url);
        const data = await responce.json();
        return data.text[0];
    }

    static async getTownCoutryDataFromYandexGeocode(latitude, longitude) {
        const url = `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=08875343-2337-4552-a37a-80727eba4a54&lang=en_US&geocode=${longitude},${latitude}`;
        const responce = await fetch(url);
        const data = await responce.json();

        let townCountry = "";

        /* Just return correct town and country data
         * depending on responce.json because of different
         * necessary info position for different places requests
         */
        data.response.GeoObjectCollection.featureMember[0].GeoObject
            .metaDataProperty.GeocoderMetaData.Address.Components.reverse().forEach(
                (kind) => {
                    if (kind.kind === "country") {
                        townCountry += kind.name;
                    } else if (kind.kind === "locality") {
                        townCountry = `${kind.name}, `;
                    }
                    if (!townCountry && kind.kind === "province") {
                        townCountry = `${kind.name}, `;
                    }
                }
            );

        return townCountry;
    }

    static async getDataFromFlickr(timeZoneAndWeatherData) {
        const timeOfYear = Model.getCurrentTimeOfYear();
        const timeOfDay = Model.getCurrentTimeOfDay(timeZoneAndWeatherData);
        let weatherSummary = Model.getCurrentSummary(timeZoneAndWeatherData);

        if (weatherSummary.includes(" ")) {
            [weatherSummary] = weatherSummary.split(" ").reverse();
        }

        const url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=d6a379e19425409c0e5f07c0bd6b5b05&tags=${timeOfYear},${timeOfDay},${weatherSummary}&orientation=landscape&tag_mode=all&sort=relevance&per_page=200&content_type=1&format=json&nojsoncallback=1&extras=url_o%60`;

        const responce = await fetch(url);
        const {
            photos: { photo }
        } = await responce.json();

        const randomNumber = Model.getRandomNumber(0, 40); // [0, 40]
        let image = "http://4put.ru/pictures/max/288/884879.jpg";

        if (photo[randomNumber]) {
            const farmId = photo[randomNumber].farm;
            const serverId = photo[randomNumber].server;
            const { id } = photo[randomNumber];
            const secretId = photo[randomNumber].secret;

            image = `https://farm${farmId}.staticflickr.com/${serverId}/${id}_${secretId}_b.jpg`;
        }

        return image;
    }

    static async getDataFromDarkSky(latitude, longitude) {
        const url = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/ae18fd235a86bd7c7eb2c1945e1e0f27/${latitude},${longitude}?lang=en&units=si`;
        const responce = await fetch(url);
        const info = await responce.json();

        const timeZone = info.timezone;

        info.optionsForTime = {
            timeZone,
            hour12: false,
            hour: "numeric",
            minute: "numeric"
        };
        info.optionsForDate = {
            timeZone,
            hour12: false,
            weekday: "short",
            day: "2-digit",
            month: "long"
        };

        return info;
    }

    static getCurrentTimeOfYear() {
        const locale = "en-GB";
        const options = {
            month: "numeric"
        };

        const date = new Date().toLocaleString(locale, options); // example: 12 (December)
        let timeOfYear = "";

        switch (date) {
        case "12":
        case "1":
        case "2":
            timeOfYear = "winter";
            break;
        case "3":
        case "4":
        case "5":
            timeOfYear = "spring";
            break;
        case "6":
        case "7":
        case "8":
            timeOfYear = "summer";
            break;
        case "9":
        case "10":
        case "11":
            timeOfYear = "autumn";
            break;
        default:
            break;
        }

        return timeOfYear;
    }

    static getCurrentTimeOfDay(data) {
        let time = Model.getCurrentTime(data);
        time = time.slice(0, 2);

        let timeOfDay = "";

        if (time > 5 && time < 18) {
            timeOfDay = "day";
        } else {
            timeOfDay = "night";
        }

        return timeOfDay;
    }

    static convertTemperatureToF(celsius) {
        return Math.round((celsius * 9) / 5 + 32);
    }

    static convertTemperatureToC(fahrenheit) {
        return Math.round(((fahrenheit - 32) * 5) / 9);
    }

    static getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    static getCurrentTime(data) {
        const locale = "en-GB";
        return new Date().toLocaleString(locale, data.optionsForTime); // example: 15:00
    }

    static getCurrentDate(data) {
        const locale = "en-GB";
        return new Date()
            .toLocaleString(locale, data.optionsForDate)
            .replace(/,/g, ""); // example: Tue 10 December
    }

    static getCurrentTemperature(data) {
        return Math.round(data.currently.temperature);
    }

    static getCurrentSummary(data) {
        return data.currently.summary;
    }

    static getCurrentWeatherIcon(data) {
        return data.currently.icon;
    }

    static getCurrentFeelsLike(data) {
        return Math.round(data.currently.apparentTemperature);
    }

    static getCurrentWind(data) {
        return Math.round(data.currently.windSpeed);
    }

    static getCurrentHumidity(data) {
        return data.currently.humidity * 100;
    }

    static getFirstDayInfo(data) {
        const locale = "en-GB";
        const obj = {};
        obj.optionsForDate = {
            weekday: "long"
        };

        let date = new Date();
        date.setDate(date.getDate() + 1);
        date = date.toLocaleString(locale, obj.optionsForDate);

        obj.name = date;
        obj.temperature = Math.round(
            (data.daily.data[1].temperatureHigh
                + data.daily.data[1].temperatureLow)
            / 2
        );
        obj.icon = data.daily.data[1].icon;

        return obj;
    }

    static getSecondDayInfo(data) {
        const locale = "en-GB";
        const obj = {};
        obj.optionsForDate = {
            weekday: "long"
        };

        let date = new Date();
        date.setDate(date.getDate() + 2);
        date = date.toLocaleString(locale, obj.optionsForDate);

        obj.name = date;
        obj.temperature = Math.round(
            (data.daily.data[2].temperatureHigh
                + data.daily.data[2].temperatureLow)
            / 2
        );
        obj.icon = data.daily.data[2].icon;
        return obj;
    }

    static getThirdDayInfo(data) {
        const locale = "en-GB";
        const obj = {};
        obj.optionsForDate = {
            weekday: "long"
        };

        let date = new Date();
        date.setDate(date.getDate() + 3);
        date = date.toLocaleString(locale, obj.optionsForDate);

        obj.name = date;
        obj.temperature = Math.round(
            (data.daily.data[3].temperatureHigh
                + data.daily.data[3].temperatureLow)
            / 2
        );
        obj.icon = data.daily.data[3].icon;
        return obj;
    }

    static convertCoordinatesIntoMinSec(coordinates) {
        const latitude = coordinates[0];
        const longitude = coordinates[1];

        const latitudeMin = Math.round(
            `0.${latitude.toString().split(".")[1]}` * 60
        );
        const longitudeMin = Math.round(
            `0.${longitude.toString().split(".")[1]}` * 60
        );

        return [
            `${Math.floor(latitude)}°${latitudeMin}'`,
            `${Math.floor(longitude)}°${longitudeMin}'`
        ];
    }
}
