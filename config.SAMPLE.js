//You'll need to fill in your own info here.
// store workplace and tagID as numbers, not strings
module.exports = {
	
	//asana api key
	api :'XXXXXXXXXXXXXXXXXXXXXXXXXXXX',
	
	//workspace id 
	//list as number, not as string
	workspace : 1234567890123,
	
	//tag used to track timecard entries, set to '0' to get all tasks
	tag: 0987654321987654321,

	//get tasks since this date 
	// any string format listed here: http://momentjs.com/docs/#/parsing/
	fromDate: '2014-01-11',

	//optional, if left blank, will get until today
	//again, any string format listed here: http://momentjs.com/docs/#/parsing/
	toDate: '2014-30-11'

}  