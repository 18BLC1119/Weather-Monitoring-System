const express=require('express');
const app=express();
const port=process.env.PORT || 3000
const fetch = require("node-fetch");
const path=require('path');
const mongoose=require('mongoose');
const methodOverride=require('method-override');
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))






const DB='mongodb+srv://ashish:ashish@cluster0.ex1a9.mongodb.net/(password)?retryWrites=true&w=majority';
mongoose.connect(DB,{
	useNewUrlParser:true,
	useCreateIndex:true,
	useUnifiedTopology:true,
	useFindAndModify:false
}).then(()=>{
	console.log('CONNECTION WITH MONGO ATLAS IS SUCCESSFUL!');
}).catch((err)=>{
	console.log('CONNECTION ERROR IN CONNECTING WITH MONGO ATLAS!');
})
app.get('/connect',async (req,res)=>{
	mongoose.connect(DB,{
	useNewUrlParser:true,
	useCreateIndex:true,
	useUnifiedTopology:true,
	useFindAndModify:false
	}).then(()=>{
		res.send('CONNECTION WITH MONGO ATLAS IS SUCCESSFUL!');
	}).catch((err)=>{
		res.send('CONNECTION ERROR IN CONNECTING WITH MONGO ATLAS!');
	})
})
const client_signup_schema=new mongoose.Schema({
	
	user_name:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	mobile_number:{
		type:String,
		required:true
	},
	password:{
		type:String,
		required:true
	},
	location_to_add:{
		type:String,
		required:true
	}
})
const admin_signup_schema=new mongoose.Schema({
	user_name:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	mobile_number:{
		type:String,
		required:true
	},
	password:{
		type:String,
		required:true
	}
})
const client_signup=mongoose.model('client_signup',client_signup_schema);
const admin_signup=mongoose.model('admin_signup',admin_signup_schema);







app.get('/',(req,res)=>{
	let x="";
	fetch('https://api.thingspeak.com/channels/1374658/feeds.json?results')
	.then(res1=>{
		return res1.json();
	})
	.then(data=>{
		console.log("DATA PARSED")
		//console.log(data);
		let x=data.feeds;
		let weather=[];
		let length=x.length;
		for(let i=length-1;i>length-11;i--){
			weather.push(x[i]);
		}
		let light_intensity=0;
		let temperature=0;
		let humidity=0;
		for(let j=weather.length-1;j>=weather.length-10;j--){
			if(weather[j].field1===null){
				light_intensity=light_intensity;
			}
			else{
				light_intensity=weather[j]['field1'];
			}
			if(weather[j].field2===null){
				temperature=temperature;
			}
			else{
				temperature=weather[j]['field2'];
			}
			if(weather[j]['field3']===null){
				humidity=humidity;
			}
			else{
				humidity=weather[j]['field3'];
			}
		}
		let final=[light_intensity,temperature,humidity];
		res.render('weather',{final});
	})
	.catch(e=>{
		console.log("SOMETHING WENT WRONG !!!");
	})
})
app.get('/client_login',async(req,res)=>{
	res.render('client_login.ejs');
})
app.get('/admin_login',async(req,res)=>{
	res.render('admin_login.ejs');
})
app.get('/signup',async(req,res)=>{
	res.render('signup.ejs');
})
app.listen(port,()=>{
	console.log("APP IS LISTENGING ON PORT 3000");
})







app.post('/signup/new',async(req,res)=>{
	const a=new client_signup(req.body);
	await a.save();
	res.redirect('/client_login');
})
app.post('/client_login',async(req,res)=>{
	const clients=await client_signup.find({});
	let user_name='';
	let password='';
	let mobile_number='';
	let status=false;
	let index=0;
	for(let i=0;i<clients.length;i++){
		if(clients[i]['email']==req.body['email'] && clients[i]['password']==req.body['password']){
			status=true;
			index=i;
		}
	}
	if(status)
	{
		res.render('client_window.ejs',{client:clients[index]});
	}
	else{
		res.send('Sorry wrong credential, please try again');
	}
	
})
app.post('/admin_login',async(req,res)=>{
	const clients=await admin_signup.find({});
	let user_name='';
	let password='';
	let mobile_number='';
	let status=false;
	let index=0;
	for(let i=0;i<clients.length;i++){
		if(clients[i]['email']==req.body['email'] && clients[i]['password']==req.body['password']){
			status=true;
			index=i;
		}
	}
	if(status)
	{
		const all_clients=await client_signup.find({});
		res.render('admin_window.ejs',{all_clients,admin:clients[index]});
	}
	else{
		res.send('Sorry wrong credential, please try again');
	}
})
app.get('/insert',async(req,res)=>{
	const p=new client_signup({
	user_name:'Ashish Kumar',
	email:'ashish.kumar2018b@vitstudent.ac.in',
	mobile_number:'6203755046',
	password:'ashish',
	location_to_add:'Baghauni, Baheri, Darbhanga, Bihar, 847105, India'
	})
	p.save().then(()=>{
	console.log('saved SUCCESSFUL');
	}).catch(e=>{
	console.log(e);
	})
	res.send('Client Signup successful, let us go for login!');
})
app.get('/insert1',async(req,res)=>{
	const p=new admin_signup({
	user_name:'Ashish Kumar',
	email:'ashish.kumar2018b@vitstudent.ac.in',
	mobile_number:'6203755046',
	password:'ashish'
	})
	p.save().then(()=>{
	console.log('saved SUCCESSFUL');
	}).catch(e=>{
	console.log(e);
	})
	res.send('Admin Signup successful, let us go for login!');
})
