const PI = Math.PI;
const RADIUS_OF_EARTH = 6371e3;

class Geo {
	static officeCoordinates = {
		latitude: 53.339428,
		longitude: -6.257664
	}

	static getRadians = (coordinate) => {
		return (coordinate * PI) / 180;
	};

	static findDistance = (data) => {
		let { latitude: lat1, longitude: lng1 } = data;
		lat1 = Number(lat1);
		lng1 = Number(lng1);

		const { latitude: lat2, longitude: lng2 } = Geo.officeCoordinates;

		const gLR1 = Geo.getRadians(lat1);
		const gLR2 = Geo.getRadians(lat2);
		const dist1 = Geo.getRadians(lat2 - lat1);
		const distC = Geo.getRadians(lng2 - lng1);
		const a = Math.sin(dist1 / 2) * Math.sin(dist1 / 2) +
			Math.cos(gLR1) * Math.cos(gLR2) * Math.sin(distC / 2) * Math.sin(distC / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const d = RADIUS_OF_EARTH * c;
		const distance = d / 1000;

		return {...data, distance}
	}
}

module.exports = Geo;
