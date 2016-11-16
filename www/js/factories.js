app.factory('socket', function ($rootScope) {
  // var socket = io.connect();
  var socket = io({path:'https://10.8.67.47'});
    socket.on('connect', function(data){
      socket.emit('screen')
    })
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});
