# Node requires
exec = require('child_process').exec

# Own requires
make = require('./myMake')

# Tool binaries
coffee_bin = 'node node_modules/coffee-script/bin/coffee'

#--------------- Tasks ---------------

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
}



#--------------- Main ---------------

make
	coffee:		doCoffee
	build:		['coffee']
