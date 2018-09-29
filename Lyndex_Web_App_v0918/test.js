const exec = require('child_process').exec;
var filename = 'insert.py'
exec('python'+' '+filename,function(err,stdout,stderr){
    if(stdout){console.log(stdout);}
    if(err){console.log(err);}
})