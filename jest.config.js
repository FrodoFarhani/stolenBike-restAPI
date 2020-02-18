module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	testPathIgnorePatterns: [
		"/node_modules/",
		"/factories/",
		"/support/",
		"__setup__.ts",
		"__dbSetup__.ts",
		"__sharedTests___.ts",
		"setup"
	],
	setupFilesAfterEnv: ["./__tests__/setup/index.ts"],
	watchPlugins: [
		"jest-watch-typeahead/filename",
		"jest-watch-typeahead/testname"
	],
	globals: {
		"ts-jest": {
			diagnostics: false
		}
	}
};
