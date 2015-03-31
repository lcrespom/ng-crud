taskInfo = null

serialize = (taskList) ->
	runTaskFromList = (ctrl, i) ->
		task = taskList[i]
		if not task
			ctrl.success("Task sequence #{taskNames} completed successfully", true)
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
		throw(msg)
	success: (msg, nocb) ->
		console.log(msg)
		@successCB(msg) unless nocb
	log: (msg) -> console.log('  ' + msg)
	warn: (msg) -> console.warn(msg)
	start: (task) -> console.log("--- Running task '#{task}' ---")
	failCB: (msg) ->
	successCB: (msg) ->
}

runTask = (task, successCB) ->
	taskImpl = taskInfo[task]
	if !taskImpl
		taskControl.fail("Error: task '#{task}' not found")
	else if taskImpl.constructor == Array
		taskImpl = serialize(taskImpl)
	else if taskImpl.constructor != Function
		taskControl.fail("Task '#{task}' is invalid")
	if successCB then taskControl.successCB = successCB
	taskControl.start(task)
	taskImpl(taskControl, task, process.argv[3..])

module.exports = (tasks) ->
	taskInfo = tasks
	task = process.argv[2]
	if !task
		throw('Missing task')
	runTask(task)
