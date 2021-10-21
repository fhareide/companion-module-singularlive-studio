module.exports = {
	getFeedbacks: function () {
		var feedbacks = {}

		feedbacks['composition_state'] = {
			label: 'State of current composition',
			description: 'The composition state',
			options: [
				{
					type: 'colorpicker',
					label: 'Foreground color',
					id: 'fg',
					default: this.rgb(255, 255, 255),
				},
				{
					type: 'colorpicker',
					label: 'Background color',
					id: 'bg',
					default: this.rgb(0, 100, 0),
				},
				{
					type: 'dropdown',
					label: 'Comp',
					id: 'comp',
					choices: this.compositions,
				},
			],
			callback: (feedback, bank) => {
				return this.feedbackStatus(feedback, bank, feedback.options.comp)
			},
		}

		return feedbacks
	},

	feedbackStatus: function (feedback, bank, val) {
		var ret = {}
		if (this.compData[val].state.startsWith('Out')) {
			ret = {
				color: bank.color,
				bgcolor: bank.bgcolor,
			}
		} else {
			ret = {
				color: feedback.options.fg,
				bgcolor: feedback.options.bg,
			}
		}

		return ret
	},
}
