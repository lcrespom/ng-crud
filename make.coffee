# Node requires
exec = require('child_process').exec
fs = require 'fs'

# Other packages
glob = require 'glob'
_ = require 'underscore'
UglifyJS = require 'uglify-js'

# Own requires
make = require './myMake'

# Tool binaries
coffee_bin = 'node node_modules/coffee-script/bin/coffee'
uglify_bin = 'node node_modules/uglify-js/bin/uglifyjs'


#--------------- Tasks ---------------

doClean = (ctrl) ->
	ctrl.fail('TODO clean')


doUglify = (ctrl) ->
	ctrl.log('Minifying...')
	moduleJS = glob.sync("src/clt/**/*.module.js")
	otherJS = glob.sync("src/clt/**/*.js")
	sources = _.union(moduleJS, otherJS).join(' ')
	cmd = commands.uglify(sources, 'web/js/crud.min.js', 'web/js/crud.js.map', 'crud.js.map')
	ctrl.log('Running command: ' + cmd)
	exec(cmd, (err, stdout, stderr) ->
		ctrl.log(stdout + stderr) if stdout.length > 0 || stderr.length > 0
		if err then ctrl.fail(err)
		ctrl.success('Minify OK')
	)


doCoffee = (ctrl) ->
	ctrl.log('Compiling coffee files')
	cmd = commands.coffee('src/', '.')
	ctrl.log('Running command: ' + cmd)
	exec(cmd, (err, stdout, stderr) ->
		ctrl.log(stdout + stderr) if stdout.length > 0 || stderr.length > 0
		if err then ctrl.fail(err)
		ctrl.success('Coffe compile OK')
	)


commands = {
	coffee: (src, dest) -> "#{coffee_bin} --compile --output #{dest} #{src}"
	uglify: (sources, dest, mapDest, mapUrl) ->
		"#{uglify_bin} #{sources} -o #{dest} " +
		"--source-map #{mapDest} --source-map-url #{mapUrl} --source-map-include-sources"
		# Append "-b --comments all" to beautify output, useful during development
}


#--------------- Main ---------------

make
	clean: doClean
	coffee:	doCoffee
	uglify:	doUglify
	build:	['coffee', 'uglify']
