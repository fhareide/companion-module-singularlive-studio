const instance_skel = require('../../instance_skel')

const api = require('./lib/api')

const actions = require('./lib/actions')
const feedbacks = require('./lib/feedbacks')
const presets = require('./lib/presets')

class instance extends instance_skel {
	constructor(system, id, config) {
		super(system, id, config)

		Object.assign(this, {
			...actions,
			...feedbacks,
			...presets,
		})

		this.compositions = []
		this.compData = []
		this.controlnodes = []
		this.buttons = []
		this.checkboxes = []
		this.timers = []
	}

	actions(system) {
		this.setActions(this.getActions())
	}

	action({ action, options }) {
		this[action](options)
			.then(() => {
				this.status(this.STATUS_OK, 'Ready')
			})
			.catch((e) => {
				this.handleError(e)
			})
	}

	feedbacks(system) {
		this.setFeedbackDefinitions(this.getFeedbacks())
	}

	presets(system) {
		this.setPresetDefinitions(this.getPresets())
	}

	init() {
		this.initSingularLive(this.config)
	}

	destroy() {
		this.debug('destroy', this.id)
		this.stopUpdatePoller()
	}

	updateConfig(config) {
		this.config = config
		this.initSingularLive(this.config)
	}

	config_fields() {
		return [
			{
				type: 'text',
				id: 'info',
				width: 12,
				label: 'Information',
				value:
					'This module requires an API key to be filled in. This is generated in the Manage Access settings window from the Control application. \ni.e. https://app.singular.live/apiv1/control/172pQ2N1HLagEeayAci0Z4',
			},
			{
				type: 'textinput',
				id: 'apiurl',
				label: 'API URL',
				width: 12,
				default: '',
			},
		]
	}

	async initSingularLive(config) {
		try {
			this.SingularLive = new api(config.apiurl)

			await this.SingularLive.connect().catch((err) => {
				if (err.toString().toLowerCase() == 'not found') {
					const str = config.apiurl ? 'Invalid token' : 'Please enter a token'
					this.log('warn', str)
					throw new Error(str)
				} else {
					this.log('warn', err)
					throw new Error(err)
				}
			})

			this.updateCompositions()

			this.startUpdatePoller()

			this.status(this.STATUS_OK, 'OK')
		} catch (e) {
			this.debug(e.message)
			this.status(this.STATUS_WARNING, e.message)
		}
	}

	async updateCompositions() {
		this.compositions = []
		this.compData = []
		this.controlnodes = []
		this.buttons = []
		this.checkboxes = []
		this.timers = []

		await this.SingularLive.getElements()
			.then((res) => {
				this.compData = Object.fromEntries(
					res.map(({ id, name, state, logicLayer }) => [
						id,
						{
							name,
							state,
							tagcolor: logicLayer?.tag ?? '#000000',
						},
					])
				)

				for (let i = 0; i < res.length; i++) {
					if (res[i].name) {
						this.compositions.push({
							id: res[i].id,
							label: res[i].name,
						})

						console.log(JSON.stringify(this.compData[res[i].id]))

						if (res[i].controlnode && res[i].controlnode.model && res[i].controlnode.model.fields) {
							let fields = []
							fields = Object.entries(res[i].controlnode.model.fields).map((entry) => {
								return {
									title: entry[1].title,
									id: entry[1].id,
									type: entry[1].type,
									defaultValue: entry[1].defaultValue,
								}
							})

							for (let j = 0; j < fields.length; j++) {
								const controlNode = {
									type: 'textinput',
									id: res[i].id + '&!&!&' + fields[j].id,
									label: res[i].name + ' / ' + fields[j].title,
								}

								if (
									fields[j].type == 'text' ||
									fields[j].type == 'number' ||
									fields[j].type == 'textarea' ||
									fields[j].type == 'image' ||
									fields[j].type == 'json'
								) {
									this.controlnodes.push(controlNode)
								} else if (fields[j].type == 'button') {
									this.buttons.push(controlNode)
								} else if (fields[j].type == 'timecontrol') {
									this.timers.push(controlNode)
								} else if (fields[j].type == 'checkbox') {
									this.checkboxes.push(controlNode)
								}
							}
						}
					}
				}
			})
			.catch((err) => {
				this.log('warn', err)
				throw new Error(err)
			})

		this.actions()
		this.presets()
		this.feedbacks()
		this.checkFeedbacks()
	}

	async updateStates() {
		await this.SingularLive.getStates()
			.then((res) => {
				for (let i = 0; i < res.length; i++) {
					this.compData[res[i].id].state = res[i].state
				}
				this.checkFeedbacks()
			})
			.catch((err) => {
				this.log('warn', err)
				throw new Error(err)
			})
	}

	startUpdatePoller() {
		this.stopUpdatePoller()

		this.updatePoller = setInterval(() => {
			if (this.SingularLive) {
				this.updateStates()
			}
		}, 1000)
	}

	stopUpdatePoller() {
		if (this.updatePoller) {
			clearInterval(this.updatePoller)
			this.updatePoller = null
		}
	}

	handleConnectionError() {
		this.log('error', 'Singular.Live connection lost')
		this.status(this.STATUS_ERROR, 'Connection error')
	}

	handleError(error) {
		if (error.code === 'ECONNREFUSED') {
			return this.handleConnectionError()
		} else {
			this.log('error', error.message)
			this.debug(error)
		}
	}

	hexToRgb(hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
		return result
			? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16),
			  }
			: null
	}
}

exports = module.exports = instance
