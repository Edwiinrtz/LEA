
server = io()

server.emit('connection',()=>{});

server.emit('mensaje','listo');

server.on('pregunta',(datosP)=>{
	// var div = document.getElementById('divPregunta')
	// div.removeChild(div.firstChild)
	
	pregunta = datosP.pregunta

	var affirm = document.createElement('input');
		affirm.setAttribute('name','affirm');
		affirm.setAttribute('type','submit');
		affirm.setAttribute('value','sí');
		affirm.className='btn btn-primary';

	var negat = document.createElement('input');
		negat.setAttribute('name','negat');
		negat.setAttribute('type','submit');
		negat.setAttribute('value','no');
		negat.className='btn btn-danger';
	
	document.getElementById('texto').innerHTML=pregunta

	var formulario = document.createElement('form')

		formulario.method='post';
		formulario.action='respuesta';
		formulario.className='form-group';
		formulario.appendChild(affirm);
		formulario.appendChild(negat);

		document.getElementById('divPregunta').appendChild(formulario)
});
