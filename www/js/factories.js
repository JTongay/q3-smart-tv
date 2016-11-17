app.factory('socket', function($rootScope) {
  // var socket = io.connect();

  console.log('im in');
  var socket = io('http://10.8.67.47:8080'); //connect

  console.log(socket);


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
      socket.emit('video', 'booyah');
      console.log('hello');

    }
  }
});
