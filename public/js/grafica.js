server = io()
var si=0;
var	no=0;
server.on('conteo',(res)=>{
	if (res.affirm) {
		si++;
	}else{
		no++;
	}
});
calcular=()=>{
    valores={
        'si':si,
        'no':no
    }
    server.emit('graficar',valores)
    si=0
    no=0
	server.on('grafica',valores=>{
		console.log(valores)
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
	})
}
module.exports:{
	calcular
}
