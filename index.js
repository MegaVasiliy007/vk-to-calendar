import express from 'express';
import cron from './services/cron.js';
import cache from './utils/cache.js';

if (!process.env.TOKEN) {
	console.log(
		`https://oauth.vk.com/authorize?client_id=51881210&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=offline,groups&response_type=token&v=5.199`
	);
}

cron.start();

const app = express();
app.get('/events.ics', (req, res) => res.setHeader('Content-Type', 'text/calendar').send(cache.get()));
app.listen(process.env.PORT || 3000, () => console.log(`Listen on :${process.env.PORT || 3000}`));
