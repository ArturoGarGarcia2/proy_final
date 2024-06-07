
class ApiService {
	constructor(baseUrl) {
	this.baseUrl = baseUrl;
	}

	async get(endpoint,authToken) {
		const url = `${this.baseUrl}/${endpoint}`;
		const response = await fetch(url, {
		headers: {
			'Accept': 'application/ld+json',
			'Authorization': 'BEARER ' +authToken,
		},
		});
		return await response.json();
	}
	
	
	async post(endpoint, data, authToken) {
		const url = `${this.baseUrl}/${endpoint}`;
		const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/ld+json',
			'Accept': 'application/ld+json',
			'Authorization': 'BEARER ' +authToken,
		},
		body: JSON.stringify(data),
		});
		return await response.json();
	}
	
	async put(endpoint, id, data, authToken) {
		const url = `${this.baseUrl}/${endpoint}/${id}`;
		const response = await fetch(url, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/ld+json',
			'Accept': 'application/ld+json',
			'Authorization': 'BEARER ' +authToken,
		},
		body: JSON.stringify(data),
		});
		return await response.json();
	}
	
	async delete(endpoint, id, authToken) {
		const url = `${this.baseUrl}/${endpoint}/${id}`;
		console.log('3.1',url)
		const response = await fetch(url, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/ld+json',
				'Authorization': 'BEARER ' +authToken,
			},
		});
		console.log('3.2',response)
		return await response;
	}

	async patch(endpoint, id, data, authToken) {
		const url = `${this.baseUrl}/${endpoint}/${id}`;
		const response = await fetch(url, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/merge-patch+json',
			'Authorization': 'BEARER ' +authToken,
		},
		body: JSON.stringify(data),
		});
		return await response.json();
	}
	
}

export default ApiService;
