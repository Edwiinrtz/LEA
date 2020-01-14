server = io()

var si=0;
var	no=0;

disabled=()=>{
    document.getElementById("aff").disabled = true; 
    document.getElementById("neg").disabled = true; 
}

contar=(resp)=>{
    alert(resp)
    if(resp){
        si++
    }else{
        no++
    }
    disabled();
}


calcular=(idPregunta,pregunta)=>{
    alert('calculado')

    valores={
        'si':si,
        'no':no
    }
    preguntaObra={
        pregunta:pregunta,
        idPregunta:idPregunta,
        respuesta:valores
    }
    server.emit('mostrar',preguntaObra)
    si=0
    no=0
}
