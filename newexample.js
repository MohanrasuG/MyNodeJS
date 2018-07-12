
var obj = {
    Name: 'Mohan',
    Language: 'Node js'
}   

function Display(xname){
    console.log(xname);
}

Display(obj.Name + " " + obj.Language);
//Display(process.execpath);

exports.log = {
    console: function (msg) {
        console.log(msg);
    },
    file: function (msg) {
        // log to file here
    }
}



