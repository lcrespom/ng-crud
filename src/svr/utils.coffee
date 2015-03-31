exports.jsonStringifyNoCircular = (obj) ->
	cache = []
	str = JSON.stringify(obj, (key, value) ->
		if typeof value == 'object' && value != null
			if cache.indexOf(value) != -1 then return '[CIRCULAR]'
			cache.push(value)
		return value
	, 4)
	cache = null # Enable garbage collection
	return str

