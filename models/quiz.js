// Definicion del modelo Quiz:
//Modelo de quizzes
//var quizzes;
/*var quizzes =[

{	id:0,
	question: "Capital de Italia",
	answer: "Roma"
},
{	id:1,
	question: "Capital de Filipinas",
	answer: ""
},
{	id:3,
	question: "Capital de Italia",
	answer: "Roma"
},
{	id:4,
	question: "Capital de Italia",
	answer: "Roma"
},
{	id:5,
	question: "Capital de Italia",
	answer: "Roma"
},
{	id:6,
	question: "Capital de Italia",
	answer: "Roma"
},
{	id:7,
	question: "Capital de Italia",
	answer: "Roma"
}];
*/
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Quiz',
        {
	
            question: {
                type: DataTypes.STRING,
                validate: {notEmpty: {msg: "Falta Pregunta"}}
            },
            answer: {
                type: DataTypes.STRING,
                validate: {notEmpty: {msg: "Falta Respuesta"}}
            }
        });
};

//var nextId= quizzes.length +1;
var nextId= 0;
//Crea un nuevo quiz con los valores pasados como parametro

exports.create =function(quiz){
	var quiz ={
		id: nextId++,
		question: (quiz, question || "").trim(),
		answer: (quiz.answer || "").trim()
	};
	
	quizzes.push(quiz);
	return quiz;
};


//Actualiza el quiz pasado como parametro,
exports.update=function(quiz){

	var index = quizzes.findIndex(function(q){
		return quiz.id === q.id;
	});

	if (index>=0){
		quizzes[index]={
			id:quiz.id,
			question:(quiz.question || "").trim(),
			answer: (quiz.answer || "").trim()
		};
	}
};

//devuelve todos los quizzes
exports.findAll =function(){
	return quizzes;
};

//Busca un quiz por su id
exports.findById =function(id){

	return quizzes.find(function(quiz){
		return quiz.id ===id;
	});
};

//elimina un quiz
exports.destroy=function(quiz){
	var index = quizzes.findIndex(function(q){
		return quiz.id === q.id;
	});
	
	if (index >=0){
		quizzes.splice(index,1);
	}
};				
		


