app.factory('socket', function($rootScope) {
  // var socket = io.connect();

  console.log('im in');
  var socket = io();
  socket.on('connect', function(data) {
    console.log('connecting');
    socket.emit('screen')
  })


  return {
    on: function(eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          callback.apply(socket, args);
        });
      });
    },
    emit: function(eventName, data, callback) {
      console.log('booyah factory');
      socket.emit(eventName, data, function() {
        console.log('booyah emit');
        var args = arguments;
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  }
});


//   emit: function(id){
//     console.log('in emit factory');
//     var url = "http://www.youtube.com/watch?v=" + id;
//     var runShell = new run_shell('youtube-dl', ['-o', '%(id)s.%(ext)s', '-f', '/18/22', url],
//     function(me, buffer) {
//       console.log('first function');
//       me.stdout += buffer.toString();
//       socket.emit("loading", {
//         output: me.stdout
//       });
//       console.log(me.stdout);
//     },
//     function() {
//       console.log('second function');
//       //child = spawn('omxplayer',[id+'.mp4']);
//       omx.start(id + '.mp4');
//     });
//   }
// };
