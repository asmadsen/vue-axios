module.exports = {
    lintOnSave: false,

    configureWebpack: {
		output: {
			libraryExport: 'default'
		}
	},

    baseUrl: undefined,
    outputDir: undefined,
    assetsDir: undefined,
    runtimeCompiler: undefined,
    productionSourceMap: undefined,
    parallel: true,

    css: {
      extract: false
    }
}
