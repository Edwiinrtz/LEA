
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

//Cookies
const CookieSession = require('cookie-session')

app.use(CookieSession({
	name:"testing_cookies",
	keys:['gato','perro'],
	maxAge:86400000
}))

//página inicio
app.get('/', (req, res)=>{
	datos = req.session.datos
	if (datos) {
		if (datos.rol=='adm') {
			if (datos.user == 'admin') {
				res.render('administrador')
			}else{
				res.render('grafica')
			}
		}else{
			res.render('waitingroom',{
				'datos':req.session.datos
			})
		}
	}else{
	res.render('index')
	}
})
app.get('/adminlog',(req,res)=>{
	res.render('loginadm')
})

io.on('connection', client=>{
	client.on('graficar',req=>{
		console.log(req)
		io.emit('grafica',req)
	})
})

//Redirección sala de espera
app.post("/", (req, res)=>{
	req.session.datos = req.body
	if (req.session.datos.rol == 'adm') {
		if (req.body.user == 'admin' && req.body.pass=="admin") {
			res.render('administrador')
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
		res.render("waitingroom",{
		'datos':req.session.datos
		})
		setTimeout(function() {

			io.emit('datosUsuario',req.session.datos);
		}, 800);
	}
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
	res.redirect('/')
})

app.get('/respuestaPrueba',(req,res)=>{
	console.log(req.query)
	io.emit('conteoPrueba',req.query)
})

app.post('/cerrar',(req,res)=>{
	req.session = null
	res.redirect('/')
})
//Servidor
server.listen(3000,()=>{
	console.log('conectado en el puerto 3000')
})