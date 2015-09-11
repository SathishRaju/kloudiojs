module.exports = {

  parse: function (params, callback)
  {
    if(params!== null && typeof params !=='object')
    {
      throw 'Parameter is not a key/value pair'
    }

     var request = new Request();
     request.params = JSON.parse(params);

  },
 
 register: function(kfn) {
    var processStdin = function(callback) {
      if (process.stdin.isTTY) {
        var request = new Request;
        callback(request);
      } else {
        var stdIn = '';
        process.stdin.setEncoding('utf8');

        process.stdin.on('readable', function() {
          var chunk = process.stdin.read();
          if (chunk !== null) {
            stdIn = stdIn + chunk;
          }
        });

        process.stdin.on('end', function() {
          this.parse(stdIn, false, callback);
        }.bind(this));
      }
    }.bind(this);

    var processArgs = function(request, callback) {
      for (key in argv) {
        if(['_', '$0'].indexOf(key) === -1) {
          request.params[key] = argv[key];
        }
      }
      callback(request);
    };

    processStdin(function(request){
      processArgs(request, function(request){
        var response = new Response;
        kfn.call({}, request, response);
      });
    });
  
function Request(){
  this.params = {};
}

function Response() {
  this.result ={}

  this.addOutput = function(name, value) {
    this.result.output[name] = value;    
    return this;
  };
 
  this.addError = function(message) {
    this.result.errors.push(message);
      return this;
    };

  this.addLog = function(msg) {
    this.result.logs.push(msg);
    return this;
  };

    this.end = function() {
      console.log(JSON.stringify(this.result));
    };
  }
}

}