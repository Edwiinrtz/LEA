server = io()

server.emit('connection',()=>{});

server.on('datosUsuario',data=>{
	welcome = "Bienvenido "+data.nombre+" esta es la sala de espera.";
	if (data.sexo = 'Hombre') {
		ready = "¿Estás listo?"
	}else{
		ready = "¿estás lista?"
	}

	form = 
	'<form method="post" action="/">'+
        '<label>'+ready+
        '<input type="submit" name="Si" value="Si" class="btn btn-primary">'+
        '<input type="submit" name="no" value="No" class="btn btn-danger">'+
    '</form>';
	
	dialogo = [welcome,'aqui estarás hasta que se te envien las preguntas','cada una de ellas las podras responder con si o no',
	'cuando todos respondan','te diremos cual opción obtuvo más votos','dependiendo de ello continuaremos con la obra.',form];
	txt = document.getElementById('bienvenida');
	c = 0
	if (data.FT=="0") {
		for (var i = 0; i < dialogo.length; i++) {
			setTimeout(function() {txt.innerHTML=dialogo[c];c+=1;}, 2000*i);	
		}
		data.FT = '1'	
	}
	
})
server.on('pregunta',(datosP)=>{
	var div = document.getElementById('divPregunta')
	div.removeChild(div.firstChild)
	
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
