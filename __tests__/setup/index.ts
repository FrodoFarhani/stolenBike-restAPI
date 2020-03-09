import loggerMock from "../../__mocks__/loggerMock";

jest.mock("../../src/lib/logger.ts", () => loggerMock);

if (process.env.CI) {
	jest.setTimeout(30000);
}
