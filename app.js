
//express configuraciones
const express = require('express')
const app = express()

//Socket inicializacion
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//Path configuraciones
const path = require('path')
const directorioPublico = path.join(__dirname, '/public');
app.use(express.static(directorioPublico));
// Hbs configuraciones
const hbs = require('hbs')
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/partials');
//Body-parser configuraciones
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// const Dict = require('Dict')
//página inicio
app.get('/', (req, res)=>{
  res.render('index.hbs')

})
app.get('/adminlog',(req,res)=>{
	res.render('loginadm')
})
io.on('connection', client=>{
	client.on('mensaje',(msn)=>{
		console.log(msn + " HOLA")
	});
	client.on('graficar',req=>{
		console.log(req)
		io.emit('grafica',req)
	})
	client.on('prueba',msj=>{
		console.log(msj)
	})
})
datos=""
session=""
//Redirección sala de espera
app.post("/wr", (req, res)=>{
	datos=req.body
	if ((req.body.user && req.body.pass)) {
		if (req.body.user == 'admin' && req.body.pass=="edwin123") {
			res.render('administrador')
			session='adm'
		}else{
			if (req.body.user=='grafica' && req.body.pass=="grafica") {
				res.render('grafica')
			}else{
				console.log('usuario o contraseña incorrectos')
				res.redirect('/adminlog')
			}
		}
	}
	else{
		session='us'
		res.render("waitingroom",{
		'datos':datos
		})
	}
})

app.get('/wr',(req,res)=>{
	res.render('waitingroom',{
		'datos':datos
	})
})

//Preguntas
app.post('/preguntar',(req,res)=>{
	io.emit('pregunta',req.body)
	res.render('administrador')
})

//Respuesta usuarios
app.post('/respuesta',(req,res)=>{
	console.log(req.body)
	io.emit('conteo',req.body)
	res.redirect('/wr')
})
app.get('/respuestaPrueba',(req,res)=>{
	console.log(req.query)
	io.emit('conteoPrueba',req.query)
})
app.get('/',(req,res)=>{
	if (session=='adm') {
		res.render('administrador')
	}else{
		if (session=='us') {
			res.render('waitingroom')
		}else{
			res.render('index')
		}
	}
})
//Servidor
server.listen(3000,()=>{
	console.log('conectado en el puerto 3000')
})