
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
require('./helpers');

//Body-parser configuraciones
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Cookies
const CookieSession = require('cookie-session')


//Data base
mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/lea',{useNewUrlParser: true},(err,conected)=>{
	if (err) {
		console.log(err)
	}else{
		console.log('conectado a DataBase')
	}
});
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

//Create, Read, Update, Delete
const crud = require('./adm/configuraciones.js');

//Models
const obras = require('./Models/obras');


//obre en presentacion
obras_presentacion={
		'titulo':"",
		'autor':"",
		'desc':""
	}

haypresentacion=()=>{
	

	obras.findOne({presentando:true},(err,success)=>{
		if (err) {
			console.log(err)
		}else{
			if(success){
				// presentaciones = success.presentaciones;
				// presentaciones.findOne({_id})
				setTimeout(function() {
					obras_presentacion = {
						'titulo':success.titulo,
						'autor':success.autor,
						'desc':success.descripcion
					}
					console.log(obras_presentacion)
				}, 500);
			}else{
				obras_presentacion={
					'titulo':"",
					'autor':"",
					'desc':""
				}
			}		
		}
	})	
}





app.use(CookieSession({
	name:"testing_cookies",
	keys:['gato','perro'],
	maxAge:86400000
}))

//página inicio
app.get('/', (req, res)=>{
	if (req.confirmacion) {
		console.log(req.confirmacion)
	}
	datos = req.session.datos
	if (datos) {
		if (datos.rol=='adm') {
			if (datos.user == 'admin') {
				res.render('administrador')
			}else{
				res.render('grafica')
			}
		}else{
			haypresentacion()
			res.render("waitingroom",{
				'datos':req.session.datos,
				'obra':obras_presentacion
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
	// client.on('graficar',req=>{
	// 	console.log(req)
	// 	io.emit('grafica',req)
	// })
	client.on('preguntaServer',(pregunta)=>{
		console.log(pregunta)
		io.emit('pregunta',pregunta);
	});
	client.on('resultado',(valores)=>{
		io.emit('mostrarResultado',valores)
	})
	client.on('mostrar',valores=>{
		console.log('valores:',valores.valores)
		obras.findOne({id:valores.idPregunta},(err,respues)=>{
			if(err){
				console.log(err)
			}else{
				preguntas = respues.preguntas
			}

		})
		io.emit('mostrando',valores.valores)
	});
})

//Redirección sala de espera
app.post("/", (req, res)=>{
	req.session.datos = req.body
	if (req.session.datos.rol == 'adm') {
		if (req.body.user == 'admin' && req.body.pass=="admin") {
			res.render('administrador');
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
		haypresentacion()
		res.render("waitingroom",{
				'datos':req.session.datos,
				'obra':obras_presentacion
			})
		// setTimeout(function() {
		// 	io.emit('datosUsuario',req.session.datos);
		// }, 800);
	}
})

//Creando obras
app.post('/crearObra',(req,res)=>{
	console.log(req.body)
	crud.crearObra(req.body)
	res.redirect('/')
})
//obras
app.post('/obras',(req,res)=>{
	let obrasCreadas;
	obras.find({},(err,respuesta)=>{
		if (err) {
			console.log('err')
		}else{
			// console.log(respuesta)
			res.render('obras',{
				'obras':respuesta
			})
		}
	});	
})
app.post('/presentar',(req,res)=>{
	idObra = req.body.obra;
	date = new Date();
	fecha = date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()+" "+date.getHours()+":"+date.getMinutes();
	nuevaPresentacion={
		'fecha':fecha,
		respuestas:[],
		'activada':true,
	};
	obras.findOne({_id:idObra},(err,resp)=>{
		if (err) {
			console.log(err)
		}else{
			obras.findOneAndUpdate({_id:idObra,},{presentando:true},(err,success)=>{
				if (err) {
					console.log(err)
				}else{
					console.log('presentando')
				}
			});
			presentaciones = resp.presentaciones;
			presentaciones.push(nuevaPresentacion);
			obras.findOneAndUpdate({_id:idObra},{presentaciones:presentaciones},(err,respuesta)=>{
				if (err) {
					console.log(err)
				}else{
					res.render('Control',{
						'obra':respuesta
					});
					// res.redirect('/obras')
				}
			});

		}
	})
})
app.post('/cerrarPresentacion',(req,res)=>{
	let id = req.body.id;
	obras.findOne({_id:id},(err,success)=>{
		if (err) {
			console.log(err);
		}else{
			
			presentaciones=success.presentaciones;
			activada=presentaciones.find(esta=>esta.activada===true)

			obras.findOneAndUpdate({_id:id},{presentaciones:presentaciones, presentando:false},(err,success)=>{
				if(err){
			 		console.log(err);
			 	}else{
			 		console.log("obra:", success);
			 		console.log("terminado");
			 	}
			});

			setTimeout(function() {
				res.redirect('/');
			}, 500);
		}
	})
});
app.post('/obra',(req,res)=>{
	let id = req.body.id;
	obras.findOne({_id:id},(err,respuesta)=>{
		if (err) {
			console.log(err)
		}else{
			console.log(respuesta);
			res.render('Control',{
				'obra':respuesta
			});
		};
	});
});

app.post('/addPregunta',(req,res)=>{
	let datos = req.body;
	obras.findOne({_id:datos._id},(err,respuesta)=>{
		if (err) {
			console.log(err);
		}else{
			// console.log("estas son las preguntas que tiene esa obra: \n"+respuesta.preguntas)
			preg = respuesta.preguntas;
			lon = preg.length;
			nuevaPregunta = {
				'idPregunta':respuesta._id,
				'pregunta':datos.pregunta,
				'n':lon+=1
			}
			// console.log(nuevaPregunta);
			preg.push(nuevaPregunta);
			// console.log(preg)
			obras.findOne({_id:datos._id},(err,respuesta)=>{
				if (err) {
					console.log('En la linea 200 \n', err)
				}else{
					obras.updateOne({_id:datos._id},{preguntas:preg},(err,respues)=>{
						if (err) {
							console.log('En la linea 252',err)
						}else{
							res.render('Control',{
						 		'obra':respuesta
							 });
						}
					})
					res.redirect('/obras')
				}
			});
		}
	})
})
app.post('/obraPresentada',(req,res)=>{

	res.render('preguntas');
})

//Preguntas
app.post('/preguntar',(req,res)=>{
	io.emit('pregunta',req.body)
	res.render('administrador')
})

//Respuesta usuarios
app.post('/respuesta',(req,res)=>{
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