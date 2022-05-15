const { enableFetchMocks } = require('jest-fetch-mock')

enableFetchMocks();

beforeEach(() => {
    fetch.resetMocks();
});

const getRequest = async () => {
    try {
        const response = await fetch("http://localhost:8080/some_endpoint");
        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }
};

test('Test example', () => {
    expect("hello " + "world").toBe("hello world");
});

test("Test fetch example", async () => {
    fetch.mockResponseOnce(JSON.stringify({ key: "value"}));
    const response = await getRequest();
    expect(response.key).toBe("value");
});

