var irc = require("tmi.js");
var options = {
    options: {
        debug: true
    },
    connection: {
        random: "chat",
        reconnect: true
    },
    identity: {
        username: "BattleBetsBot",
        password: "oauth:2ixa3ewx16hcuj96kzbaxux69huhr8"
    },
    channels: ["#joindotared"],
    logger: { info(){}, warn(){}, error:console.log }
};

module.exports = function(onMessage){
	var client = new irc.client(options);
	client.addListener('message', onMessage)
	// Connect the client to the server..
	client.connect();
}
