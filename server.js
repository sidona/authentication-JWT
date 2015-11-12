/**
 * Created by sdonose on 11/12/2015.
 */
var express=require('express');
var faker=require('faker');
var cors=require('cors');
var bodyParser=require('body-parser');
var jwt=require('jsonwebtoken');
var expressJwt=require('express-jwt');

var jwtSecret='fjksdksdskmdsk296300/3dAD'

var user={
  username:'test',
  password:'test'
}

var app=express();

app.use(cors());
app.use(bodyParser.json());
app.use(expressJwt({secret:jwtSecret}).unless({path:['/login']}));

app.get('/random',function(req,res){
  var user=faker.helpers.createCard();
  console.log(user);
  //user.avatar=faker.Image.avatar();
  res.json(user);
})

app.post('/login',authenticate,function(req,res){
  //res.json(user);

  //create token
  var token=jwt.sign({
    username:user.username
  },jwtSecret)
    res.send({
      token:token,
      user:user

    });

})

app.get('/me',function(req,res){
  res.send(req.user)
})


app.listen(3000,function(){
  console.log('app listen on 3000')
})

//util function


function authenticate(req,res,next){
  var body=req.body;
  if(!body.username || !body.password){
    res.status(400).end('must provide username or password');
  }
  if(body.username !==user.username ||body.password !==user.password){
    res.status(401).end('username or password incorrect');
  }
  next();
}