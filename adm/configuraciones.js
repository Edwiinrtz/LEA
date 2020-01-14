const obra = require('../Models/obras');
crearObra=(datos)=>{
	crear = new obra({
		titulo:datos.titulo,
		autor:datos.autor,
		descripcion:datos.descripcion,
		preguntas:[]
	})
	crear.save((err)=>{
		if (err) {
			console.log(err)
		}else{
			console.log('todo cool')
		}
	})
}

module.exports = {
	crearObra
}