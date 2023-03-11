const CLIENT_ID = 'a8a0d341a3a04941a8bb1a72a8ebfc7f';
const CLIENT_SECRET = '8fab784b77674c52bda7e38fd0a17cf3';

const AUTH_URL = 'https://accounts.spotify.com/api/token';
const SEARCH_URL = 'https://api.spotify.com/v1/search';

const searchForm = document.querySelector('form');
const searchInput = document.querySelector('#search-input');
const resultsList = document.querySelector('#results-list');

searchForm.addEventListener('submit', e => {
	e.preventDefault(); 
	const query = searchInput.value.trim(); 
	if (query !== '') {
		searchSpotify(query);
	}
});

async function searchSpotify(query) {
	const accessToken = await getAccessToken();
	const headers = {
		'Authorization': `Bearer ${accessToken}`
	};
	const params = {
		q: query,
		type: 'track',
		limit: 10
	};
	const url = new URL(SEARCH_URL);
	url.search = new URLSearchParams(params).toString();
	const response = await fetch(url, { headers });
	const data = await response.json();
	updateResults(data.tracks.items);
}

async function getAccessToken() {
	const headers = {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Authorization': `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
	};

	const params = {
		grant_type: 'client_credentials'
	};

	const url = new URL(AUTH_URL);
	const response = await fetch(url, { method: 'POST', headers, body: new URLSearchParams(params) });
	const data = await response.json();
	return data.access_token;
}

function updateResults(results) {
	resultsList.innerHTML = '';
	results.forEach(result => {
		const artist = result.artists[0].name;
		const track = result.name;
		const image = result.album.images[0].url;
		const li = document.createElement('li');

		li.innerHTML = `<img src="${image}" alt="${track} by ${artist}">
						<div>
							<h3>${artist}</h3>
							<p>${track}</p>
						</div>`;

		resultsList.appendChild(li);
	});
}
