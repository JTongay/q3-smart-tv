const express = require('express');
const app = express();
const server = require('http').createServer(app);
const path = require('path');
const io = require('socket.io').listen(server);
const spawn = require('child_process').spawn;
const omx = require('omxcontrol');



// all environments
app.set('port', process.env.TEST_PORT || 8080);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, '/')));
app.use(omx());

console.log(__dirname);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Routes
app.get('/', function(req, res) {
  res.sendfile('index.html');
});

// app.get('/remote', function(req, res) {
//   res.sendfile(__dirname + '/public/remote.html');
// });

app.get('/play/:video_id', function(req, res) {

});


//Socket.io Config
io.set('log level', 1);

server.listen(app.get('port'), function() {
  console.log('piTV is running on port ' + app.get('port'));
});

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

    if (data.action === "play") {
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
