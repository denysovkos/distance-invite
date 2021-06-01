const fs = require('fs');
fs.createReadStream = jest.fn().mockReturnValue("test-file-stream");
const mockStreamWrite = {
	write: jest.fn(),
	end: jest.fn()
}
fs.createWriteStream = jest.fn().mockReturnValue(mockStreamWrite)

const mockInputPath = "test/input.txt";
const mockOutputPath = "test/output.txt";

const mockData = [
	{"latitude": "52.986375", "user_id": 12, "name": "Christina McArdle", "longitude": "-6.043701"},
	{"latitude": "51.92893", "user_id": 1, "name": "Alice Cahill", "longitude": "-10.27699"}
]

const mockReadline = {
	createInterface: jest.fn().mockReturnValue(function* () {
		yield JSON.stringify(mockData[0])
		yield JSON.stringify(mockData[1])
	}())
}

jest.mock("readline", () => mockReadline)

const FileSystem = require("../../modules/fileSystem");
const fileSystem = new FileSystem(mockInputPath, mockOutputPath);

test("#FileSystem should exists", () => {
	expect(fileSystem).toBeTruthy();
})

test("#FileSystem should init with test params", () => {
	expect(fileSystem.pathToFile).toBe(mockInputPath);
	expect(fileSystem.pathToOutput).toBe(mockOutputPath);
})

test("#FileSystem initial data should be empty", () => {
	expect(fileSystem.data).toStrictEqual([]);
})

test("#FileSystem should set data", () => {
	fileSystem.setData([ "test1", "test2" ]);
	expect(fileSystem.data).toStrictEqual([ "test1", "test2" ]);
	fileSystem.setData([])
})

test("#FileSystem should read file and store to data", async () => {
	await fileSystem.readFile();
	expect(fileSystem.data).toStrictEqual(mockData);

	expect(fs.createReadStream).toBeCalled();
	expect(fs.createReadStream).toBeCalledWith(mockInputPath);

	expect(mockReadline.createInterface).toBeCalled();
	expect(mockReadline.createInterface).toBeCalledWith({
		input: "test-file-stream",
		crlfDelay: Infinity
	});
})

test("#FileSystem write file", async () => {
	await fileSystem.readFile();
	await fileSystem.writeFile();

	expect(fs.createWriteStream).toBeCalled();
	expect(fs.createWriteStream).toBeCalledWith(mockOutputPath, {flags:'a'});

	expect(mockStreamWrite.write).toBeCalled();
	expect(mockStreamWrite.write).toBeCalledTimes(2);
	expect(mockStreamWrite.write).toBeCalledWith(`${JSON.stringify(mockData[0])}\n`);
	expect(mockStreamWrite.write).toBeCalledWith(`${JSON.stringify(mockData[1])}\n`);

	expect(mockStreamWrite.end).toBeCalled();
	expect(mockStreamWrite.end).toBeCalledTimes(1);
})
