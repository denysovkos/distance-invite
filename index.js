const path = require("path");

const FileSystem = require("./modules/fileSystem");
const Geo = require("./modules/geo");

const fileSystem = new FileSystem(
	path.resolve(__dirname, "input.txt"),
	path.resolve(__dirname, "output.txt")
);

const main = async () => {
	const { data } = await fileSystem.readFile();
	const distances = await Promise.all(data.map((line) => Geo.findDistance(line)));
	fileSystem.setData(
		distances
			.filter((data) => data.distance < 100)
			.sort((a, b) => a.user_id - b.user_id)
	);
	await fileSystem.writeFile();

	console.table(fileSystem.data);
}

main();
module.exports = main;
