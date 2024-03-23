import { CronJob } from 'cron';
import vk from './vk.js';
import cache from '../utils/cache.js';
import toIcs from '../utils/to-ics.js';

async function job() {
	console.log('Cron start');

	const events = await vk();
	cache.set(toIcs(events));

	console.log('Cron end');
}

export default {
	start: () => {
		job();
		new CronJob('0 0 1 * * *', job).start();
	},
};
