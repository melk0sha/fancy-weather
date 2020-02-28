import Model from "../components/model";

const data = {
    optionsForTime: {
        hour12: false,
        hour: "numeric",
        minute: "numeric"
    },
    optionsForDate: {
        hour12: false,
        weekday: "short",
        day: "2-digit",
        month: "long"
    }
}

test('Current time of year must be with correct value', () => {
    expect(Model.getCurrentTimeOfYear()).toMatch(/(winter)?(autumn)?(spring)?(summer)?/);
});

test('Converting temperature from C to F (if value is 0)', () => {
    expect(Model.convertTemperatureToF(0)).toBe(32);
});

test('Converting temperature from C to F (if value is positive)', () => {
    expect(Model.convertTemperatureToF(20)).toBe(68);
});

test('Converting temperature from C to F (if value is negative)', () => {
    expect(Model.convertTemperatureToF(-20)).toBe(-4);
});

test('Converting temperature from F to C (if value is 0)', () => {
    expect(Model.convertTemperatureToC(0)).toBe(-18);
});

test('Converting temperature from F to C (if value is positive)', () => {
    expect(Model.convertTemperatureToC(20)).toBe(-7);
});

test('Converting temperature from F to C (if value is negative)', () => {
    expect(Model.convertTemperatureToC(-20)).toBe(-29);
});

test('Method of getting random number must be in [0,200]', () => {
    expect(Model.getRandomNumber(0, 201)).toBeGreaterThanOrEqual(0);
    expect(Model.getRandomNumber(0, 201)).toBeLessThanOrEqual(200);
});

test('Current time must be like 15:00', () => {
    expect(Model.getCurrentTime(data)).toBeDefined();
    expect(Model.getCurrentTime(data).length).toBe(5);
    expect(Model.getCurrentTime(data)).toMatch(/:/);
});

test('Current date must be like Tue 10 December', () => {
    expect(Model.getCurrentDate(data)).toBeDefined();
    expect(Model.getCurrentDate(data).length).toBeGreaterThan(1);
    expect(Model.getCurrentDate(data)).toMatch(/(January)?(February)?(March)?(April)?(May)?(June)?(July)?(August)?(September)?(October)?(November)?(December)?/);
});