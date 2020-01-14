server = io()

EnviarPregunta=(idPregunta,pregunta)=>{
	infoPregunta={
		'id':idPregunta,
		'pregunta':pregunta

	}
	alert(infoPregunta.pregunta)
	server.emit('preguntaServer',infoPregunta);
}

definirPresentacion=()=>{
	server.emit('defPresentacion',)
}
