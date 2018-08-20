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
	'parserOptions': {
		'ecmaFeatures': {
			'jsx': false
		}
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'quotes': ['error', 'single'],
		'indent': [
			'error',
			"tab"
		],
		'no-tabs': 'off',
		'one-var': 'off',
		'handle-callback-err': 'off',
		'space-before-function-paren': 'off',
		'spaced-comment': 'off',
		'comma-dangle': 'off',
		'space-infix-ops': 'off'
	},
	overrides: [
		{
			files: ["*.vue"],
			rules: {
				"indent": "off",
				'one-var': 'off',
				'vue/script-indent': [
					'error',
					'tab',
					{'baseIndent': 1}
				],
			}
		}
	]
}
