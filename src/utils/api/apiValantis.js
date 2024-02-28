import CryptoJS from 'crypto-js';

const apiUrl = 'https://api.valantis.store:41000';

function ApiValantis() {
	// Функция создающая зашифрованный ключ для обращения к api.
	const creatingAuthorizationString = () => {
		// Делаю key "магическим значением", дабы не усложнять, потому как в данном случае не планируеться его изменение или получение откуда либо.
		const key = 'Valantis';
		const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
		const payload = `${key}_${date}`;
		return CryptoJS.MD5(payload).toString();
	};

	// Функция со стандартной обработкой ответа от api.
	const checkResponse = (res) => {
		if (res.ok) {
			return res.json();
		}
		return Promise.reject(res.status);
	};

	// Стандартный запрос.
	const getItems = ({ action, params }) => {
		const authorization = creatingAuthorizationString();
		return fetch(apiUrl, {
			method: 'POST',
			headers: {
				'X-Auth': authorization,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ action, params }),
		}).then((res) => checkResponse(res));
	};

	return { getItems };
}

export default ApiValantis;
