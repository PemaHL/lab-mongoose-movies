const router = require("express").Router();
const Movie = require('../models/Movie');
const Celebrity = require('../models/Celebrity');

router.get('/movies', (req, res, next) => {
	// get all the movies
	Movie.find()
        .populate('cast')   
		.then(moviesInDB => {
			// render a view books
			console.log(moviesInDB);
			res.render('movies/index', { moviesInDB });
		})
		.catch(err => {
			console.log(err)
		})
});



router.get('/movies/new', (req, res, next) => {
    //res.render('movies/new');
    Celebrity.find()
		.then(castFromDB => {
			console.log("checkingcast:", castFromDB);
			res.render('movies/new', { castFromDB });
		})
		.catch(err => {
			console.log(err);
		})
  });

//	router.get("/movies/:id", (req, res, next) => {
//		Movie.findById(req.params.id)
//			.populate('cast')
//			.then(movieInDb => {
				// console.log(movie)
//				res.render(`movies/show`, { movieInDb });
//			})
//			.catch(err => {
//				console.log(err)
//			})
//	});

router.post('/movies', (req, res, next) => {
	// console.log(req.body);
	const { title, genre, plot, cast } = req.body;
	console.log("checking:", cast);
	Movie.create({ title, genre, plot, cast })
		.then(createdMovie => {
			console.log(`This movie has just been added: ${createdMovie}`);
			// res.render('bookDetails', { bookDetails: createdBook });
			// this is how you redirect in express
            console.log(`/movies/${createdMovie._id}`);

			res.redirect(`/movies`);
		})
        .catch(err => {
					console.log(err)
			res.render('movies/new');
		})
});

// this displays the edit form
//original code before Jan presented solution
//router.get('/movies/:id/edit', (req, res, next) => {
//	// retrieve the book that should be edited	
//	const movieId = req.params.id;
//	Movie.findById(movieId)
//		.then(moviesInDB => {
//			console.log(moviesInDB);
//			// render a form with the book details
//			res.render('movies/edit', { moviesInDB });
//		})
//		.catch(err => {
//			console.log(err);
//		})
//});

// code from Jan's solution
router.get('/movies/:id/edit', (req, res, next) => {
  Movie.findById(req.params.id).populate('cast')
   .then(moviesInDB => {
      console.log(moviesInDB);
      Celebrity.find().then(celebrities => {
         console.log(moviesInDB.cast);
        let options = '';
        let selected = '';
        celebrities.forEach(actor => {
          selected = moviesInDB.cast.map(el => el._id).includes(actor._id) ? ' selected' : '';
          options += `<option value="${actor._id}" ${selected}>${actor.name}</option>`;
        });
        console.log(options);
        // res.render('movies/edit', { movie, celebrities });
        res.render('movies/edit', { moviesInDB, options });
      })
    })
    .catch(err => {
			console.log("edit page:", err)
      next(err);
    })
});


router.post('/movies/:id', (req, res, next) => {
	const movieId = req.params.id;
	const { title, genre, plot, cast} = req.body;
	Movie.findByIdAndUpdate(movieId, {
		title,
		genre,
		plot,
		cast
	})
		.then(() => {
			res.redirect(`/movies`);
		})
		.catch(err => {
			console.log(err);
		})
});

module.exports = router;
