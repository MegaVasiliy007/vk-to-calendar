import axios from 'axios';
import delay from '../utils/delay.js';

const instance = axios.create({ baseURL: 'https://api.vk.com/method' });

instance.interceptors.request.use(config => {
	config.headers.Authorization = `Bearer ${process.env.TOKEN}`;
	if (!config.params) config.params = {};
	config.params.v = '5.199';
	// config.params.lang = 'en';
	console.log(`Making request to ${config.url}`);
	return config;
});

export default async () => {
	let { data } = await instance.get(
		'/groups.get?extended=1&filter=events&fields=description,start_date,finish_date,addresses,fixed_post'
	);
	data = data.response;

	console.log('Fetched all:', data.count === data.items.length);

	const events = [];
	for (const i of data.items.sort((a, b) => a.start_date - b.start_date)) {
		let address = i.addresses.main_address;
		if (i.addresses.is_enabled) {
			const { data } = await instance.get(`/groups.getAddresses?group_id=${i.id}`);
			address = data.response.items[0];
		}

		events.push({
			start: i.start_date * 1000,
			startInputType: 'utc',
			...(i.finish_date ? { end: i.finish_date * 1000 } : { duration: { hours: 6 } }),
			title: i.name,
			description: i.description.replaceAll('"', ''),
			...(i.addresses.is_enabled && {
				location: `${address.title}\n${address.address}, ${address.city.title}, ${address.country.title}`.replaceAll(
					'"',
					''
				),
				geo: { lat: address.latitude, lon: address.longitude },
				appleStructuredLocation: { title: address.title.replaceAll('"', ''), radius: 100 },
			}),
			url: i.fixed_post ? `https://vk.com/wall-${i.id}_${i.fixed_post}` : `https://vk.com/${i.screen_name}`,
			uid: `${i.id}`,
		});

		await delay(250);
	}

	return events;
};
