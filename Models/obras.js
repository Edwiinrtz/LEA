const mongoose = require('mongoose');
const schema = mongoose.Schema;


const ObrasSchema = new schema({
	titulo:String,
	autor:String,
	descripcion:{
		type:String,
		default:""
	},
	preguntas:[],

	presentaciones:[{
		fecha:String,
		respuestas:[{
			pregunta:String,
			si:Number,
			no:Number
		}],
		activada:Boolean
	}],
	presentando:{
		type:Boolean,
		default:false
	},
	img:{
		data:Buffer,
		contentType:String
	}
});

const obraModel = mongoose.model('obraModel', ObrasSchema);
// const pregunta = mongoose.model('',preguntasSchema);

module.exports=	obraModel;