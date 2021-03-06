module.exports = wallaby => {

	return {
		files: ['src/**/*', 'jest.config.js', 'package.json', 'tsconfig.json', '!src/**/__*'],

		tests: ['tests/**/*.spec.ts'],

		env: {
			type: 'node',
			runner: 'node',
		},

		preprocessors: {
			'**/*.js?(x)': file => require('babel-core').transform(
				file.content,
				{
					sourceMap: true,
					compact: false,
					filename: file.path,
					presets: ['babel-preset-env', 'babel-preset-stage-2'],
					plugins: ['transform-es2015-modules-commonjs', 'transform-runtime']
				})
		},

		setup(wallaby) {
			const jestConfig = require('./package').jest || require('./jest.config')
			delete jestConfig.transform['^.+\\.tsx?$']
			wallaby.testFramework.configure(jestConfig)
		},

		testFramework: 'jest',

		debug: true
	}
}