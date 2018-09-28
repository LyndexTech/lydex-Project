var exec = require('child_process').exec;
var filename = 'test.py'
exec('python'+' '+filename,function(err,stdout,stderr){
    if(stdout){console.log(stdout);}
    if(err){console.log(err);}
})
