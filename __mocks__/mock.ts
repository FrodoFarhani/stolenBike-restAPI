export type Mock<T> = { [P in keyof T]: T[P] & jest.Mock<any, any> };

export const AsMockObj = <T>(obj: T): Mock<T> => {
	return obj as Mock<T>;
};

export const AsMockFn = <T>(fn: T): T & jest.Mock<any, any> => {
	return fn as any;
};
