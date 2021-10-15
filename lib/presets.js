module.exports = {
	getPresets: function () {
		var presets = []

		this.compositions.forEach((comp) => {
			let baseObj = {
				category: 'Toggle In/Out',
				label: comp.label,
				bank: {
					style: 'text',
					text: comp.label,
					size: '14',
					color: this.rgb(255, 255, 255),
					bgcolor: this.rgb(10, 10, 10),
				},
				feedbacks: [
					{
						type: 'composition_state',
						options: {
              fg: this.rgb(255, 255, 255),
							bg: this.rgb(0,  100, 0),
							comp: comp.id
						},
					},
				],
				actions: [
					{
						action: 'toggleAnimation',
						options: {
							comp: comp.id,
						},
					},
				],
			}

			presets.push(baseObj)
		})

		return presets
	},
}
