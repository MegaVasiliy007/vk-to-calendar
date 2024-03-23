import ics from 'ics';

export default events => {
	const calendar = ics.createEvents(events);
	if (calendar.error) return console.log(calendar.error);
	return calendar.value;
};
