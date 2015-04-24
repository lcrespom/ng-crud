chalk = require('chalk')

taskInfo = null

serialize = (taskList, successCB) ->
	runTaskFromList = (ctrl, i) ->
		task = taskList[i]
		if not task
			ctrl.success("Task sequence #{taskNames} completed successfully", true)
			successCB?()
			return
		runTask(task, ->
			runTaskFromList(ctrl, i+1)
		)
	taskNames = ('' + taskList).replace(/,/g, '+')
	return (ctrl) ->
		ctrl.log("Running tasks #{taskNames} in sequence")
		runTaskFromList(ctrl, 0)

taskControl = {
	fail: (msg) ->
		@failCB(msg)
		throw('Make failed')
	success: (msg, nocb) ->
		console.log(chalk.green.bold(msg))
		@successCB(msg) unless nocb
	log: (msg) -> console.log('  ' + msg)
	warn: (msg) -> console.warn(chalk.yellow(msg))
	start: (task) -> console.log(chalk.cyan.bold("--- Running task '#{task}' ---"))
	failCB: (msg) -> console.error(chalk.red.bold(msg))
	successCB: (msg) ->
}

runTask = (task, successCB) ->
	taskImpl = taskInfo[task]
	if !taskImpl
		taskControl.fail("Error: task '#{task}' not found")
	else if taskImpl.constructor == Array
		taskImpl = serialize(taskImpl, successCB)
	else if taskImpl.constructor != Function
		taskControl.fail("Task '#{task}' is invalid")
	if successCB then taskControl.successCB = successCB
	taskControl.start(task)
	taskImpl(taskControl, task, process.argv[3..])

reportTime = (t0, t1) ->
	elapsed = t1 - t0
	secs = parseInt(elapsed / 1000)
	mins = parseInt(secs / 60)
	msg = 'Total time: '
	msg += '' + mins + 'm ' if mins
	msg += '' + (secs % 60) + 's ' if secs
	msg += '' + (elapsed % 1000) + 'ms'
	console.log(chalk.cyan.bold(msg))

module.exports = (tasks) ->
	t0 = new Date().getTime()
	taskInfo = tasks
	task = process.argv[2]
	if !task
		throw('Missing task')
	runTask(task, ->
		t1 = new Date().getTime()
		reportTime(t0, t1)
	)
