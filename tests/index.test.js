const mockData = [{"latitude": "52.986375", "user_id": 1, "name": "Christina First", "longitude": "-6.043701"},
	{"latitude": "51.986375", "user_id": 2, "name": "Christina Second", "longitude": "-7.043701"}]

const mockFileSystem = {
	readFile: jest.fn().mockReturnThis(),
	data: mockData,
	writeFile: jest.fn(),
	setData: jest.fn()
};
jest.mock("../modules/fileSystem", () => jest.fn().mockReturnValue(mockFileSystem));

const mockGeo = {
	findDistance: jest.fn().mockReturnValue(10)
}
jest.mock("../modules/geo", () => mockGeo);

const controller = require("../index");

beforeEach(() => jest.clearAllMocks())

test("#Main file should be read", () => {
	controller();
	expect(mockFileSystem.readFile).toBeCalled();
});

test("#Main geo distance calculations should be called", async () => {
	await controller();
	expect(mockGeo.findDistance).toBeCalled();
	expect(mockGeo.findDistance).toBeCalledTimes(2);
	mockData.map((v) => expect(mockGeo.findDistance).toBeCalledWith(v));

	expect(mockFileSystem.setData).toBeCalled();
	expect(mockFileSystem.setData).toBeCalledWith([]);
});

test("#Main geo distance calculations filter distances > 100 km", async () => {
	mockGeo.findDistance = jest.fn().mockReturnValue(150)

	await controller();
	expect(mockGeo.findDistance).toBeCalled();
	expect(mockGeo.findDistance).toBeCalledTimes(2);

	expect(mockFileSystem.setData).toBeCalled();
	expect(mockFileSystem.setData).toBeCalledWith([]);
});

test("#Main geo distance calculations should be sorted ASC by user_id", async () => {
	mockGeo.findDistance = jest.fn().mockImplementation((obj) =>  ({ ...obj, distance: 10 }))

	await controller();
	expect(mockGeo.findDistance).toBeCalled();
	expect(mockGeo.findDistance).toBeCalledTimes(2);

	expect(mockFileSystem.setData).toBeCalled();

	expect(mockFileSystem.setData.mock.calls[0][0][0].user_id).toStrictEqual(1);
	expect(mockFileSystem.setData.mock.calls[0][0][1].user_id).toStrictEqual(2);
});

test("#Main file should be written", async () => {
	mockGeo.findDistance = jest.fn().mockImplementation((obj) =>  ({ ...obj, distance: 10 }))

	await controller();
	expect(mockGeo.findDistance).toBeCalled();
	expect(mockGeo.findDistance).toBeCalledTimes(2);

	expect(mockFileSystem.setData).toBeCalled();

	expect(mockFileSystem.writeFile).toBeCalled();
});

