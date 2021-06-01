const fs = require('fs');
const readline = require('readline');

class FileSystem {
	constructor(pathToFile, pathToOutput) {
		this.pathToFile = pathToFile;
		this.pathToOutput = pathToOutput;

		this.data = [];
	}

	async readFile() {
		const fileStream = fs.createReadStream(this.pathToFile);
		const rl = readline.createInterface({
			input: fileStream,
			crlfDelay: Infinity
		});

		for await (const line of rl) {
			this.data.push(JSON.parse(line));
		}

		return this;
	}

	setData(data) {
		this.data = data;
	}

	async writeFile() {
		const stream = fs.createWriteStream(this.pathToOutput, {flags:'a'});
		this.data.forEach( function (item) {
			stream.write(JSON.stringify(item) + "\n");
		});
		stream.end();
	}
}

module.exports = FileSystem;
