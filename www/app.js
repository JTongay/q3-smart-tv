require('events');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const path = require('path');
const spawn = require('child_process').spawn;
const omx = require('omxcontrol');
const knex = require('./knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// some stuff may be here




// all environments
app.set('port', process.env.TEST_PORT || 8080);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, '/')));
app.use(omx());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

console.log(__dirname);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Routes
app.get('/', function(req, res) {
  res.sendfile('index.html');
});

app.post('/api/users/new', function(req, res){
  const errors = []

    if (!req.body.username || !req.body.username.trim()) errors.push("Name can't be blank");
    if (!req.body.password || !req.body.password.trim()) errors.push("Password can't be blank");

  if(errors.length){
    res.status(422).json({
      errors: errors
    })
  } else {
    knex('users')
    .whereRaw('lower(email) = ?', req.body.username.toLowerCase())
    .count()
    .first()
    .then(function(result){
      if(result.count === "0"){
        var hashedPassword = bcrypt.hashSync(req.body.password, 10);
        knex('users').insert({
          username: req.body.username,
          password: hashedPassword
        })
        .returning('*')
        .then(function(users){
          const user = users[0];
          const token = jwt.sign({id: user.id}, process.env.JWT_SECRET);

          res.json({
                id: user.id,
                username: user.username,
                token: token
              })
        })
      }
    })
  }

})

app.get('/api/users/:userid/ips', function(req, res){
  knex('users').innerJoin('ips', 'users.id', 'ips.user_id').then(function(list){
    res.json(list)
  })
})
server.listen(app.get('port'), function() {
  console.log('piTV is running on port ' + app.get('port'));
});

const io = require('socket.io').listen(server);

io.set('log level', 1);


var ss;

//Run and pipe shell script output
function run_shell(cmd, args, cb, end) {
  var spawn = require('child_process').spawn,
    child = spawn(cmd, args),
    me = this;
  child.stdout.on('data', function(buffer) {
    cb(me, buffer);
  });
  child.stdout.on('end', end);
}

//Socket.io Server
io.sockets.on('connection', function(socket) {

  console.log('connected');
  socket.on("screen", function(data) {
    socket.type = "screen";
    ss = socket;
    console.log("Screen ready...");
  });
  socket.on("remote", function(data) {
    socket.type = "remote";
    console.log("Remote ready...");
  });

  socket.on("controll", function(data) {
    console.log(data);
    if (socket.type === "remote") {

      if (data.action === "tap") {
        if (ss != undefined) {
          ss.emit("controlling", {
            action: "enter"
          });
        }
      } else if (data.action === "swipeLeft") {
        if (ss != undefined) {
          ss.emit("controlling", {
            action: "goLeft"
          });
        }
      } else if (data.action === "swipeRight") {
        if (ss != undefined) {
          ss.emit("controlling", {
            action: "goRight"
          });
        }
      }
    }
  });

  socket.on("video", function(data) {
    console.log(data);
    console.log('booyah initial');
    if (data.action === "play") {
      console.log('booyah play');
      var id = data.video_id,
        url = "http://www.youtube.com/watch?v=" + id;

      var runShell = new run_shell('youtube-dl', ['-o', '%(id)s.%(ext)s', '-f', '/18/22', url],
        function(me, buffer) {
          me.stdout += buffer.toString();
          socket.emit("loading", {
            output: me.stdout
          });
          console.log(me.stdout);
        },
        function() {
          //child = spawn('omxplayer',[id+'.mp4']);
          omx.start(id + '.mp4');
        });
    }

  });
});
