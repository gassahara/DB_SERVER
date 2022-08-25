const funciones = require("./functions.js");
const http = require("http");
const host = 'localhost'; //direccion del servidor
const { Readable } = require('stream');

const port = 5001;
const requestListener = function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    var continuar=0;
    let data = '';
    try {
	req.on('data', chunk => {
	    data += chunk;
	});
	req.on('error', error => {
	    console.error(error);
	});
	req.on('end', () => {
	    if(req.url == "/") {
		funciones.getcollections().then(function f(files) {
		    var enes=new Array();
		    for (var n in files) {
			enes.push(files[n].name);
		    }
		    d=JSON.stringify(enes);
		    res.writeHead(200, {'Content-Length': d.length,'Content-Type': 'application/json' });
		    res.write(d);
		    res.end();
		});
	    }
	    
	    if(req.url == "/insert") {
		continuar=0;
		try {
		    if(data) {
			continuar=0;
			search=JSON.parse(data);
			if(search.collection) {
			    continua=0;
			    funciones.searchCompound(search.collection, search.insertion).then(function f(files) {
				if(files) {
				    continua=0;
				    if(files.length) {
					continua=1;
				    }
				}
				if(!continua) {
				    search.insertion.dateinsertion=new Date();
				    funciones.insertdata(search.collection, search.insertion).then(function f(files) {
					d=JSON.stringify(files);
					res.writeHead(200, {'Content-Length': d.length,'Content-Type': 'application/json' });
					res.write(d);
					res.end();
				    });
				} else {
				    console.log(files);
				    d=JSON.stringify({"error" : "Data Exists"});
				    res.writeHead(200, {'Content-Length': d.length,'Content-Type': 'application/json' });
				    res.write(d);
				    res.end();
				}
			    });
			} else {
			    d=JSON.stringify({"error" : "Missing Collection"});
			    res.writeHead(200, {'Content-Length': d.length,'Content-Type': 'application/json' });
			    res.write(d);
			    res.end();
			}
		    }
		} catch (e) {
		    continuar=1;
		    console.log(e);
		    d=JSON.stringify({"error" : e});
		    res.writeHead(200, {'Content-Length': d.length,'Content-Type': 'application/json' });
		    res.write(d);
		    res.end();
		}
	    }
	    if(req.url == "/search") {
		try {
		    console.log(data);
		    console.log(req.body);
		    if(data) {
			search=JSON.parse(data);
			continuar=1;
			try {
			    console.log("C"+search.collection);
			    console.log("S"+JSON.stringify(search.search));
			    if(search.collection) {
				if(search.search) {
				    if(search.search.length||typeof search.search == "object") {
					funciones.searchdata(search.collection, search.search).then(function f(files) {
					    if(search.start==undefined || search.start>=files.length) search.start=0;
					    if(search.end==undefined || search.end>=files.length ) search.end=files.length;
					    d=JSON.stringify(files.slice(search.start, search.end));
					    res.writeHead(200, {'Content-Length': d.length,'Content-Type': 'application/json' });
					    res.write(d);
					    res.end();
					});
				    } else {
					funciones.getdata(search.collection).then(function f(files) {
					    d=JSON.stringify(files);
					    res.writeHead(200, {'Content-Length': d.length,'Content-Type': 'application/json' });
					    res.write(d);
					    res.end();
					});
				    }
				} else {
				    funciones.getdata(search.collection).then(function f(files) {
					console.log();
					d=JSON.stringify(files);
					res.writeHead(200, {'Content-Length': d.length,'Content-Type': 'application/json' });
					res.write(d);
					res.end();
				    });
				}
			    } else {
				d=JSON.stringify({"error" : "Missing Collection"});
				res.writeHead(200, {'Content-Length': d.length,'Content-Type': 'application/json' });
				res.write(d);
				res.end();
			    }
			} catch (e) {
			    continuar=1;
			    console.log(e);
			    d=JSON.stringify({"error" : e});
			    res.writeHead(200, {'Content-Length': d.length,'Content-Type': 'application/json' });
			    res.write(d);
			    res.end();
			}
		    }
		} catch (e) {
		    continuar=1;
		    console.log(e);
		    d=JSON.stringify({"error" : e});
		    res.writeHead(200, {'Content-Length': d.length,'Content-Type': 'application/json' });
		    res.write(d);
		    res.end();
		}
	    }
	    if(!continuar) {
		console.log("continuar" + continuar);
		console.log(data);
		d=JSON.stringify({"error" : "Empty"});
		res.writeHead(200, {'Content-Length': d.length,'Content-Type': 'application/json' });
		res.write(d);
		res.end();
	    }
	});
    } catch (e) {
	continuar=1;
	console.log(e);
	d=JSON.stringify({"error" : e});
	res.writeHead(200, {'Content-Length': d.length,'Content-Type': 'application/json' });
	res.write(d);
	res.end();
    }
    console.log("OK");
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Corriendo http://${host} en puerto ${port}`);
});

