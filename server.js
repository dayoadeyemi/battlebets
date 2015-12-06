"use strict";
var request = require('request')
var hl = require('highland')
var restify = require('restify')
var cheerio = require('cheerio')
var bot = require('./bot.js')

var server = restify.createServer({
  name: 'BattleBets',
  version: '1.0.0'
});

server.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  }
);
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

function pluckErrors(json){
	if (json.whoFaults) throw new Error(json.whoFaults[0].faultString);
	return hl([json])
}

var getEvents = () => {
	return hl.wrapCallback(request)({
		url: 'http://sandbox.whapi.com/v1/competitions/types/4739/events',
		method: 'GET',
		headers: {
			'who-apikey': 'l7xx28e190817df14d42817958c51200009e',
			'accept': 'application/vnd.who.Sportsbook+json;v=1;charset=utf-8',
		}
	})
	.pluck('body')
	.map(JSON.parse)
	.flatMap(pluckErrors)
	.pluck('whoCompetitions')
	.pluck('category')
	.pluck('class')
	.pluck('type')
	.pluck('event')
}

var getEventOutcomes = (eventId) => {
	return hl.wrapCallback(request)({
		url: 'http://sandbox.whapi.com/v1/competitions/events/' + eventId + '/markets/outcomes',
		method: 'GET',
		headers: {
			'who-apikey': 'l7xx28e190817df14d42817958c51200009e',
			'accept': 'application/vnd.who.Sportsbook+json;v=1;charset=utf-8',
		}
	})
	.pluck('body')
	.map(JSON.parse)
	.flatMap(pluckErrors)
	.pluck('whoCompetitions')
	.pluck('event')
	.pluck('market')
	.pluck('outcome')
}

var logIn = (user, pass) => {
	return hl.wrapCallback(request)({
		url: 'https://sandbox.whapi.com/v1/sessions/tickets',
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'who-apikey': 'l7xx28e190817df14d42817958c51200009e',
			'who-secret': '8725cdf9f7af45f5ab42dd08dd63b4a0',
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: 'username='+user+'&password='+pass
	})
	.pluck('body')
	.map(JSON.parse)
	.flatMap(pluckErrors)
	.pluck('whoSessions')
}

var placeBet = (props, outcomeId, delayBetId) => {
	console.log(typeof props)
	var stake = props.stake,
		ticket = props.ticket
	var __temp = props.priceFrac.split('/'),
	priceNum = __temp[0],
	priceDen = __temp[1]

	return hl.wrapCallback(request)({
		url: 'https://sandbox.whapi.com/v1/bets/me/multiples',
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'who-apikey': 'l7xx28e190817df14d42817958c51200009e',
			'who-secret': '8725cdf9f7af45f5ab42dd08dd63b4a0',
			'who-ticket': ticket,
			'Content-Type': 'application/json'
		},
		json: {
		    "whoBets": {
		        "bet":[
		            {
		                "betNum": "1",
		                delayBetId,
		                "stake": parseInt(""+stake).toFixed(2),
		                "betTypeCode": "SGL",
		                "leg": {
		                    "legType": "W",
		                    "part": {
		                        "priceType": "L",
		                        priceNum,
		                        priceDen,
		                        outcomeId
		                    }
		                }
		            }
		        ]
		    }
		}
	})
	.pluck('body')
	.flatMap(pluckErrors)
	.pluck('whoBets')
	.flatMap(whoBets => {
		if (whoBets.betDelayed) {
			let delayBetId = whoBets.betDelayed.delayBetId
			return delay(parseInt(whoBets.betDelayed.delayPeriod))
			.flatMap(_ => placeBet(props, outcomeId, delayBetId) )
		}
		return hl([whoBets])
	})
}

var getBets = (props) => {
	var page = props.page || 0
	return hl.wrapCallback(request)({
		url: 'https://sandbox.whapi.com/v1/bets/me?blockSize=100&blockNum=' + page,
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'who-apikey': 'l7xx28e190817df14d42817958c51200009e',
			'who-secret': '8725cdf9f7af45f5ab42dd08dd63b4a0',
			'who-ticket': props.ticket,
		}
	})
	.pluck('body')
	.map(_ => {
		if (typeof _ === 'string') return JSON.parse(_)
		else return _
	})
	.tap(console.log)
	.flatMap(pluckErrors)
	.pluck('whoBets')
}

var delay = hl.wrapCallback((seconds, cb) => {
	setTimeout(cb, seconds*1000)
})

var getStats = () => {
	return hl.wrapCallback(request)('http://www.datdota.com/head_to_head.php?team1=66&team2=1409&team_side1=0&patch=0&season=0&event=&day_after=&month_after=&year_after=&day_before=&month_before=&year_before=&p=match')
	.pluck('body')
	.map(html => {
		var $ = cheerio.load(html)
		var table = $('table.dataTable')
		return $('table.dataTable thead ')
		.html()
	})
}

var tickets = { tc_989uw: "TGT-1084-plgnYncZ9gYesK05H6PUE2CFmbTzbywfPYhnp5ccuQk2ZFEKSr-brsux5711" };
var twitchUsers = { battlebetsbot: 'tc_989uw' };
var setTwitchUserName = (props, user) => {
	return hl.wrapCallback(request)({
		url: 'https://sandbox.whapi.com/v1/sessions/tickets/' + props.ticket,
		method: 'HEAD',
		headers: {
			'Accept': 'application/json',
			'who-apikey': 'l7xx28e190817df14d42817958c51200009e',
			'who-secret': '8725cdf9f7af45f5ab42dd08dd63b4a0',
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
	.pluck('statusCode')
	.flatMap(statusCode => {
		if (statusCode === 204) {
			tickets[user] = props.ticket
			twitchUsers[props.twitchUserName] = user
			return hl({ ticket: props.ticket });
		}
		else throw new restify.NotAuthorizedError('Authentication Failed')
	})
}

server.get('/', function (req, res, next) {
	res.send({
		'GET /login/:user/:pass':'',
		'POST /users/:user/twitchUserName': {
			'example': {
				"ticket": "TGT-725-mo0M7Y97PFgHRZ7cSmfKQqVUugmVaw6jf4qcIPv0mroGGcLZk6-brsux5712"
			}
		},
		'GET /events':'',
		'GET /events/:id/outcomes':'',
		'POST /bets': {
			'example': {
				"ticket": "TGT-864-clCQS3Ql41ebST4ngNA2hactn09sjT4JGxgrngbqoFVWvClxBy-brsux5712"
			}
		},
		'POST /bets/:outcomeId':{
			'example': {
			    "ticket": "TGT-847-GLVdA0sJutQSapTCTKpH3JOobdLc62y1gTqPsncuFuVXVRgqum-brsux5711",
			    "priceFrac": "1/1",
			    "stake": 20
			}
		}
	})
})


server.get('/login/:user/:pass', function (req, res, next) {
	logIn(req.params.user, req.params.pass)
	.pull((err, ticket) => {
		if (err) next(err)
		else res.send(ticket)
	})
})

server.post('/users/:user/twitchUserName', function (req, res, next) {
	setTwitchUserName(req.body, req.params.user)
	.pull((err, ticket) => {
		if (err) next(err)
		else res.send(ticket)
	})
})

server.get('/events', function (req, res, next) {
	getEvents()
	.pull((err, events) => {
		if (err) next(err)
		else {
			res.send(events.map(event => {
				event.twitchUrl = 'http://www.twitch.tv/joindotared'
				return event
			}))
		}
	})
})

server.get('/events/:id/outcomes', function (req, res, next) {
	getEventOutcomes(req.params.id)
	.pull((err, ticket) => {
		if (err) next(err)
		else res.send(ticket)
	})
})

server.post('/bets', function (req, res, next) {
	console.log(req.body);
	console.log(typeof req.body)
	getBets(req.body, req.params.outcomeId)
	.pull((err, ticket) => {
		if (err) next(err)
		else res.send(ticket)
	})
})

server.post('/bets/:outcomeId', function (req, res, next) {
	placeBet(req.body, req.params.outcomeId)
	.pull((err, ticket) => {
		if (err) next(err)
		else res.send(ticket)
	})
})

bot((channel, user, message, self) => {
	var match;
	if (twitchUsers[user.username] &&
		(match = message.match(/BET (\d+) on (RADIANT|DIRE) to WIN/))) {
		console.log(twitchUsers[user.username], "BETTING", match[1], match[2], 'from', 2180718)
		getEventOutcomes('2180718')
		.pluck(match[2] === 'RADIANT' ? 0 : 1)
		.flatMap(outcome => {
			return placeBet({
				ticket: tickets[twitchUsers[user.username]],
				stake: match[1],
				priceFrac: outcome.odds.livePrice.priceFrac
			}, outcome.id)
		})
		.each(console.log)
	}
})

server.listen(80, function () {
	console.log('%s listening at %s', server.name, server.url);
})
