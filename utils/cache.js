let events;

export default {
	get() {
		return events;
	},
	set(e) {
		events = e;
	},
};
