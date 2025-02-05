const fetch = require('node-fetch')

const url = 'https://app.singular.live/apiv1/control/'

class SingularLive {
	constructor(apiurl) {
		if (apiurl && apiurl.includes('/')) {
			let urlparts = apiurl.split('/')
			this.token = urlparts[urlparts.length - 1]
		} else {
			this.token = apiurl
		}
	}

	connect() {
		return new Promise((resolve, reject) => {
			fetch(url + this.token, this.GETOption())
				.then((res) => {
					if (res.status == 200) {
						resolve(res.json())
					} else {
						reject(res.statusText)
					}
				})
				.catch((err) => {
					reject(err)
				})
		})
	}

	getElements() {
		return new Promise((resolve, reject) => {
			fetch(url + this.token + '/model', this.GETOption())
				.then((res) => res.json())
				.then((result) => {
					let data = result.data[0].subcompositions
					resolve(data)
				})
				.catch((err) => reject(err))
		})
	}

	getStates() {
		return new Promise((resolve, reject) => {
			fetch(url + this.token + '/subcompositions', this.GETOption())
				.then((res) => res.json())
				.then((result) => {
					resolve(result.data)
				})
				.catch((err) => reject(err))
		})
	}

	animateIn(composition) {
		if (composition === 'Select composition') return

		const body = [
			{
				compositionId: composition,
				animation: {
					action: 'play',
					to: 'In',
				},
			},
		]
		fetch(url + this.token, this.PUTOption(body))
	}

	animateOut(composition) {
		if (composition === 'Select composition') return

		const body = [
			{
				compositionId: composition,
				animation: {
					action: 'play',
					to: 'Out',
				},
			},
		]

		fetch(url + this.token, this.PUTOption(body))
	}

  setPayload(composition, value) {
		if (composition === 'Select composition') return

    let payload = JSON.parse(value);

		const body = [
			{
				compositionId: composition,
				controlNode: {
						payload
				},
			},
		]

    console.log(JSON.stringify(body))

		fetch(url + this.token, this.PUTOption(body))
	}

	updateControlNode(controlnode, value) {
		if (controlnode === 'Select control node') return

		const body = [
			{
				compositionId: controlnode.split('&!&!&')[0],
				controlNode: {
					payload: {
						[controlnode.split('&!&!&')[1]]: value,
					},
				},
			},
		]

		fetch(url + this.token, this.PUTOption(body))
	}

	updateButtonNode(controlnode) {
		if (controlnode === 'Select button node') return

		const body = [
			{
				compositionId: controlnode.split('&!&!&')[0],
				controlNode: {
					payload: {
						[controlnode.split('&!&!&')[1]]: 'execute',
					},
				},
			},
		]

		fetch(url + this.token, this.PUTOption(body))
	}

	updateCheckboxNode(controlnode, value) {
		if (controlnode === 'Select checkbox node') return

		const body = [
			{
				compositionId: controlnode.split('&!&!&')[0],
				controlNode: {
					payload: {
						[controlnode.split('&!&!&')[1]]: value,
					},
				},
			},
		]

		fetch(url + this.token, this.PUTOption(body))
	}

	updateTimerNode(controlnode, value) {
		if (controlnode === 'Select timer control' || value === 'Select action') return

		const body = [
			{
				compositionId: controlnode.split('&!&!&')[0],
				controlNode: {
					payload: {
						[controlnode.split('&!&!&')[1]]: {
							command: value,
						},
					},
				},
			},
		]

		fetch(url + this.token, this.PUTOption(body))
	}

	BaseOption() {
		return {
			contentType: 'application/json',
			mode: 'cors',
			headers: {
				'content-type': 'application/json',
			},
		}
	}

	GETOption() {
		return Object.assign({}, this.BaseOption(), { method: 'GET' })
	}

	PUTOption(body) {
		return Object.assign({}, this.BaseOption(), { method: 'PUT', body: JSON.stringify(body).replace(/\\\\n/g, '\\n') })
	}
}

exports = module.exports = SingularLive
