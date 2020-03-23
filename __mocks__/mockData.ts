const stolenCase1 = {
	stolenDate: "2020-03-10",
	licenseNumber: 1234,
	color: "red",
	type: "normal",
	OwnerName: "Test1",
	description: "Description test1"
};
const stolenCase2 = {
	stolenDate: new Date(),
	licenseNumber: 4321,
	color: "blue",
	type: "advanced",
	OwnerName: "Test2",
	description: "Description test2"
};
const stolenCase3 = {
	stolenDate: new Date(),
	licenseNumber: 654,
	color: "black",
	type: "normal",
	OwnerName: "Test3",
	description: "Description test3"
};
const officer1 = {
	staffCode: 111
};
const officer2 = {
	staffCode: 222
};
const officer3 = {
	staffCode: 333
};
const mockData = {
	stolenCase1,
	stolenCase2,
	stolenCase3,
	officer1,
	officer2,
	officer3
};
export default mockData;
