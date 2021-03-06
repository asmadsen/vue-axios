module.exports = {
	root: true,
	env: {
		node: true
	},
	'extends': [
		'plugin:vue/essential',
		'@vue/standard',
		'@vue/typescript'
	],
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'quotes': ['error', 'single'],
		'indent': [
			'error',
			"tab"
		],
		'no-tabs': 'off',
		'space-before-function-paren': 'off'
	},
	overrides: [
		{
			files: ["*.vue"],
			rules: {
				"indent": "off",
				'vue/script-indent': [
					'error',
					'tab',
					{'baseIndent': 1}
				],
			}
		}
	]
}