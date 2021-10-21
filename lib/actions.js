module.exports = {
	getActions() {
		let actions = {}

		actions['animateIn'] = {
			label: 'Animate In',
			options: [
				{
					type: 'dropdown',
					label: 'Composition',
					id: 'comp',
					choices: this.compositions,
					default: 'Select composition',
				},
			],
		}
		actions['animateOut'] = {
			label: 'Animate Out',
			options: [
				{
					type: 'dropdown',
					label: 'Composition',
					id: 'comp',
					choices: this.compositions,
					default: 'Select composition',
				},
			],
		}
		actions['toggleAnimation'] = {
      label: 'Toggle In/Out',
      options: [
        {
          type: 'dropdown',
          label: 'Composition',
          id: 'comp',
          choices: this.compositions,
          default: 'Select composition',
        },
      ],
		}
		actions['setPayload'] = {
			label: 'Set Payload',
			options: [
				{
					type: 'dropdown',
					label: 'Composition',
					id: 'comp',
					choices: this.compositions,
					default: 'Select composition',
				},
				{
					type: 'textinput',
					label: 'Payload',
					id: 'payload',
				},
			],
		}
		actions['updateControlNode'] = {
			label: 'Update Control Node',
			options: [
				{
					type: 'dropdown',
					label: 'Control Node',
					id: 'controlnode',
					choices: this.controlnodes,
					default: 'Select control node',
				},
				{
					type: 'textinput',
					label: 'Value',
					id: 'value',
				},
			],
		}
		actions['updateButtonNode'] = {
			label: 'Activate button',
			options: [
				{
					type: 'dropdown',
					label: 'Button',
					id: 'controlnode',
					choices: this.buttons,
					default: 'Select button node',
				},
			],
		}
		actions['updateCheckboxNode'] = {
			label: 'Update Checkbox Node',
			options: [
				{
					type: 'dropdown',
					label: 'Control Node',
					id: 'controlnode',
					choices: this.checkboxes,
					default: 'Select checkbox node',
				},
				{
					type: 'checkbox',
					label: 'Value',
					id: 'value',
				},
			],
		}
		actions['updateTimerNode'] = {
			label: 'Update Timer Control',
			options: [
				{
					type: 'dropdown',
					label: 'Control Node',
					id: 'controlnode',
					choices: this.timers,
					default: 'Select timer control',
				},
				{
					type: 'dropdown',
					label: 'Action',
					id: 'value',
					choices: [
						{
							id: 'play',
							label: 'Play',
						},
						{
							id: 'pause',
							label: 'Pause',
						},
						{
							id: 'reset',
							label: 'Reset',
						},
					],
					default: 'Select action',
				},
			],
		}

		return actions
	},

	async animateIn({ comp }) {
		await this.SingularLive.animateIn(comp)
	},

	async animateOut({ comp }) {
		await this.SingularLive.animateOut(comp)
	},

	async toggleAnimation({ comp }) {
		if (this.compData[comp].state.startsWith('Out')) {
			await this.SingularLive.animateIn(comp)
		} else {
			await this.SingularLive.animateOut(comp)
		}
	},

  async setPayload({ comp, payload }) {
		await this.SingularLive.setPayload(comp, payload)
	},

	async updateControlNode({ controlnode, value }) {
		if (value.includes('$(')) {
			system.emit('variable_parse', value, function (str) {
				value = str.trim()
			})
		}
		await this.SingularLive.updateControlNode(controlnode, value)
	},

	async updateButtonNode({ controlnode }) {
		await this.SingularLive.updateButtonNode(controlnode)
	},

	async updateCheckboxNode({ controlnode, value }) {
		await this.SingularLive.updateCheckboxNode(controlnode, value)
	},

	async updateTimerNode({ controlnode, value }) {
		await this.SingularLive.updateTimer(controlnode, value)
	},
}
