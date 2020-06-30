require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
const { ExpressOIDC }= require('@okta/oidc-middleware');
const session = require('express-session');
const OktaJwtVerifier = require('@okta/jwt-verifier');
const cors = require('cors');

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: 'https://dev-640827.okta.com/oauth2/default',
  clientId: '0oafy98r98FnOnmkY4x6'
});

function authenticationRequired(req, res, next){
	const authHeader = req.headers.authorization || '';
	const match = authHeader.match(/Bearer (.+)/);
	
	if(!match){
		return res.status(401).end();
	}
	console.log(match[0]);
	const accessToken = match[1];
	console.log(match[1]);
	//const expectedAudience =  'api://default'; 
	return oktaJwtVerifier.verifyAccessToken(accessToken, 'api://default')
		.then((jwt) => {
			console.log("Inside JWT");
			console.log(jwt.claims);
			//req.jwt = jwt;
			next();
		})
		.catch((err) => {
			console.log(err);
			res.status(401).send(err.message);
		});
}

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

var task = []
var complete = ["finish jquery"];
app.set('view-engine', 'ejs');


app.get('/', authenticationRequired, (req, res) => {
	console.log("dsjvnsd");
	console.log(task);
	return res.json(task);
});

app.post('/addtask',authenticationRequired, (req, res) => {
	console.log("fjsdnfjsd");
	var newTask = req.body.text;
	//var id = len(task)+1;
	task.push(newTask);
	console.log(newTask);
	return res.json({task: newTask});

	//res.redirect("/");
});

app.post('/removetask', authenticationRequired, (req, res) => {
	var completeTask = req.body;
	if( typeof completeTask === 'string') {
		complete.push(completeTask);
		task.splice(task.indexOf(completeTask), 1);
	} else if(typeof completeTask === 'object'){
		for(var i=0;i<completeTask.length;i++){
			complete.push(completeTask[i]);
			task.splice(task.indexOf(completeTask[i]), 1);
		}
	}
	return res.json(task);
});

app.listen(3000, () => {
	console.log("Server running")
});
