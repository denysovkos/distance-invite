const controller = require("../../modules/geo");

test("#Geo service should exists", () => {
	expect(controller).toBeTruthy();
})

test("#Geo service should have office coordinates", () => {
	expect(controller.officeCoordinates).toStrictEqual({
		latitude: 53.339428,
		longitude: -6.257664
	});
})

test("#Geo service should calculate radians", () => {
	expect(controller.getRadians(52.986375)).toBe(0.9247867024464104);
	expect(controller.getRadians(-7.714444)).toBe(-0.13464244776072143);
})

test("#Geo service should properly find distance", () => {
	const data = {
		"latitude": "52.986375",
		"user_id": 12,
		"name": "Christina McArdle",
		"longitude": "-6.043701"
	}
	expect(controller.findDistance(data)).toStrictEqual({
		...data,
		distance: 41.7687255008362
	});
})

test("#Geo service should faild on NaN", () => {
	const data = {
		"latitude": "ooops!",
		"user_id": 12,
		"name": "Christina McArdle",
		"longitude": "-6.043701"
	}
	expect(controller.findDistance(data)).toStrictEqual({
		...data,
		distance: NaN
	});
})
