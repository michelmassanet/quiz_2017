var models = require("../models");
var Sequelize = require('sequelize');
var n=0;
var paginate = require('../helpers/paginate').paginate;

// Autoload el quiz asociado a :quizId
exports.load = function (req, res, next, quizId) {

    models.Quiz.findById(quizId)
    .then(function (quiz) {
        if (quiz) {
            req.quiz = quiz;
            next();
        } else {
            throw new Error('No existe ningún quiz con id=' + quizId);
        }
    })
    .catch(function (error) {
        next(error);
    });
};


// GET /quizzes
exports.index = function (req, res, next) {

    var countOptions = {};

    // Busquedas:
    var search = req.query.search || '';
    if (search) {
        var search_like = "%" + search.replace(/ +/g,"%") + "%";

        countOptions.where = {question: { $like: search_like }};
    }

    models.Quiz.count(countOptions)
    .then(function (count) {

        // Paginacion:

        var items_per_page = 10;

        // La pagina a mostrar viene en la query
        var pageno = parseInt(req.query.pageno) || 1;

        // Crear un string con el HTML que pinta la botonera de paginacion.
        // Lo añado como una variable local de res para que lo pinte el layout de la aplicacion.
        res.locals.paginate_control = paginate(count, items_per_page, pageno, req.url);

        var findOptions = countOptions;

        findOptions.offset = items_per_page * (pageno - 1);
        findOptions.limit = items_per_page;

        return models.Quiz.findAll(findOptions);
    })
    .then(function (quizzes) {
        res.render('quizzes/index.ejs', {
            quizzes: quizzes,
            search: search
        });
    })
    .catch(function (error) {
        next(error);
    });
};


// GET /quizzes/:quizId
exports.show = function (req, res, next) {
	//var quizId = Number(req.params.quizId);
	//var quiz = models.Quiz.findById(quizId);

	
    		res.render('quizzes/show', {quiz: req.quiz});

};




// GET /quizzes/new
exports.new = function (req, res, next) {

    var quiz = {question: "", answer: ""};

    res.render('quizzes/new', {quiz: quiz});
};



// POST /quizzes/create
exports.create = function (req, res, next) {

    var quiz = models.Quiz.build({
        question: req.body.question,
        answer: req.body.answer
    });


//validar que no estan vacios

if(!quiz.question || !quiz.answer){
	res.render('quizzes/new', {quiz:quiz});
	return;
}

    //guarda en DB los campos pregunta y respuesta de quiz
  quiz.save({fields: ["question", "answer"]})
    .then(function (quiz) {
        req.flash('success', 'Quiz creado con éxito.');
        res.redirect('/quizzes/' + quiz.id);
    })
    .catch(Sequelize.ValidationError, function (error) {

        req.flash('error', 'Errores en el formulario:');
        for (var i in error.errors) {
            req.flash('error', error.errors[i].value);
        }

        res.render('quizzes/new', {quiz: quiz});
    })
    .catch(function (error) {
        req.flash('error', 'Error al crear un Quiz: ' + error.message);
        next(error);
    });

//guarda el nuevo quiz
//quiz =models.Quiz.create(quiz);
//res.redirect('/quizzes/' + quiz.id);

};


// GET /quizzes/:quizId/edit
exports.edit = function (req, res, next) {

    res.render('quizzes/edit', {quiz: req.quiz});
};


// PUT /quizzes/:quizId
exports.update = function (req, res, next) {

    req.quiz.question = req.body.question;
    req.quiz.answer = req.body.answer;

    req.quiz.save({fields: ["question", "answer"]})
    .then(function (quiz) {
        req.flash('success', 'Quiz editado con éxito.');
        res.redirect('/quizzes/' + req.quiz.id);
    })
    .catch(Sequelize.ValidationError, function (error) {

        req.flash('error', 'Errores en el formulario:');
        for (var i in error.errors) {
            req.flash('error', error.errors[i].value);
        }

        res.render('quizzes/edit', {quiz: req.quiz});
    })
    .catch(function (error) {
        req.flash('error', 'Error al editar el Quiz: ' + error.message);
        next(error);
    });
};


// DELETE /quizzes/:quizId
exports.destroy = function (req, res, next) {


	//var quizId=Numer(req.params.quizId);
	//var quiz= models.Quiz.findById(quizId);

	

//esto pa bajo (tema 8) no está

    req.quiz.destroy()
    .then(function () {
        req.flash('success', 'Quiz borrado con éxito.');
        res.redirect('/quizzes');
    })
    .catch(function (error) {
        req.flash('error', 'Error al editar el Quiz: ' + error.message);
        next(error);
    });

};


// GET /quizzes/:quizId/play
exports.play = function (req, res, next) {
//var quizId = Number(req.params.quizId);
	//var quiz = models.Quiz.findById(quizId);
    var answer = req.query.answer || '';

    res.render('quizzes/play', {
        quiz: req.quiz,
        answer: answer
    });
};


// GET /quizzes/:quizId/check
exports.check = function (req, res, next) {

    var answer = req.query.answer || "";

    var result = answer.toLowerCase().trim() === req.quiz.answer.toLowerCase().trim();

	//if(result) score++;

    res.render('quizzes/result', {
        quiz: req.quiz,
        result: result,
        answer: answer
    });
};




var nojugados;
//GET /quizzes/randomplay

exports.random = function (req, res, next) {

models.Quiz.findAll().then(function(quizzes){

req.session.score=req.session.score ||0;

if(n==0){
req.session.score=0;
}

req.session.nojugados=req.session.nojugados || quizzes;
if(req.session.nojugados.length>n){

res.render('quizzes/random_play.ejs',{quiz:req.session.nojugados[n],
					score:req.session.score});
}else{
	res.render('quizzes/random_none.ejs', {score: req.session.score});
	n=0;
	req.session.score=0;
}





}).catch(function(error){
	next(error);
});


//var rnd = Math.floor((Math.random()* array.length)+1);
//var newId = models.Quiz.findById(rnd);
};



// GET /quizzes/randomcheck/:quizId?answer=respuesta

exports.randomcheck = function (req, res, next) {

    var answer = req.query.answer || "";

    var result = answer.toLowerCase().trim() === req.quiz.answer.toLowerCase().trim();

	
if(result){ req.session.score++;
		n++;}
    res.render('quizzes/random_result.ejs', {
        score: req.session.score,
	result: result,
        answer: answer
    });
if(!result){ req.session.score=0;}
};
