

var timeManager = {}

	timeManager.timers = []

	timeManager.addTimer = function(time, cycle, run)
	{
		new_timer = new Timer(time, cycle, run)
		timeManager.timers.push(new_timer)
		return new_timer
	}

	timeManager.tick = function()
	{
		for (var i = timeManager.timers.length - 1; i >= 0; i--) 
		{ 
			timeManager.timers[i].update()
		}
	}

function Timer(time, cycle, run)
{
	this.length = time
	this.time = 0
	this.cycle = cycle
	this.run = run
	this.end = false

	this.update = function()
	{
		if (this.run)
		{
			this.time++
			this.end = false

			if (this.time >= this.length)
			{
				this.end = true

				if(this.cycle)
				{
					this.time = 0
				}

				else
				{
					this.time = this.length
					this.run = false
				}
			}
		}
	}

	this.reset = function(run)
	{
		this.time = 0
		this.run = run
		this.end = false
	}

	this.start = function()
	{
		this.run = true
	}
}

