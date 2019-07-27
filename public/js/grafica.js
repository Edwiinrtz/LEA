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
server.on('conteoPrueba',(respuesta)=>{
    console.log(respuesta.affirm)    
})

calcular=()=>{
    valores={
        'si':si,
        'no':no
    }
    server.emit('graficar',valores)
    si=0
    no=0
}
