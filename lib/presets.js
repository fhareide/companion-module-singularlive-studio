module.exports = {
	getPresets: function () {
		var presets = []

    for (var i = 0; i < this.compositions.length; i++) {
      let comp = this.compositions[i]
			let baseObj = {
				category: 'Toggle In/Out',
				label: comp.label,
				bank: {
					style: 'text',
					text: comp.label,
					size: '14',
					color: this.rgb(255,255,255),
					bgcolor: this.rgb(this.hexToRgb(this.compData[comp.id].tagcolor).r,this.hexToRgb(this.compData[comp.id].tagcolor).g,this.hexToRgb(this.compData[comp.id].tagcolor).b)
				},
				feedbacks: [
					{
						type: 'composition_state',
						options: {
              fg: this.rgb(255, 255, 255),
							bg: this.rgb(255, 0, 0),
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
		}

		return presets
	},
}
