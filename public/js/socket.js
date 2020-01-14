var server = io();
/*graficar=(valores)=>{
	alert('Llamó a la funcion graficar')
	var ctx = document.getElementById('myChart').getContext('2d');
	var chart = new Chart(ctx, {
	    // The type of chart we want to create
	    type: 'doughnut',
	    // The data for our dataset
	    data: {
	        labels: ['Sí', 'No'],
	        datasets: [{
	            backgroundColor: ['#53C44F','#B43C54'], 
	            data: [valores.si,valores.no],
	            // hoverBackgroundColor:'#f2e1de'
	        }]
	    },
	    // Configuration options go here
	    options: {
	        // animation.animateRotate:'True'
	    }
	});
}*/

server.emit('connection',()=>{});

presentacion = "";
server.on('definirPresentación',(idPresentacion)=>{
	presentacion = idPresentacion;
});

enabled=()=>{
	document.getElementById("aff").disabled = false; 
	document.getElementById("neg").disabled = false; 
}
disabled=()=>{
    document.getElementById("aff").disabled = true; 
    document.getElementById("neg").disabled = true; 
}

server.on('pregunta',(datosP)=>{


	var div = document.getElementById('divPregunta');
		// div.removeChild();
	/*var affirm = document.createElement('input');
		affirm.setAttribute('name','affirm');
		affirm.setAttribute('type','submit');
		affirm.setAttribute('value','sí');
		// affirm.setAttribute('id','btnRIGHT');
		affirm.className='btn btn-primary';

	var negat = document.createElement('input');
		negat.setAttribute('name','negat');
		negat.setAttribute('type','submit');
		negat.setAttribute('value','no');
		// negat.setAttribute('id','btnLEFT');
		negat.className='btn btn-danger';
	*/
	var affirm = document.getElementById('aff');
	var negat = document.getElementById('neg');

	var idPre = document.getElementById('idPre');
		idPre.setAttribute('value',datosP.id);
	

	var formulario = document.getElementById('formPregunta');
		// formulario.removeChild();
		// formulario.appendChild(timer2);
		// formulario.appendChild(affirm);
		// formulario.appendChild(negat);
		formulario.appendChild(idPre);

	enabled();
	setTimeout(function() {
		disabled();
	}, 10000);
	document.getElementById('texto').innerHTML="<h6 style='color:rbga(0,0,0,.5);'>"+datosP.pregunta+"</h6>"
	// document.getElementById('divPregunta').innerHTML="";
	document.getElementById('divPregunta').appendChild(formulario)
});

//mostrar respuestas del usuario
server.on('mostrarRespuesta',(valores)=>{
	var affirm = document.getElementById('aff');
		affirm.setAttribute('value',valores.si);
	var negat = document.getElementById('neg');
		negat.setAttribute('value',valores.no);

	if(valores.si > valores.no){
		affirm.style="background-color:rgb(40,140,40)";
	}else{
		negat.style="background-color:rgb(40,140,40)";
	}

})