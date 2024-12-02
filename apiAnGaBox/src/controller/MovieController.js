const Movie = require("../models/Movie");

const movieController = {
  create: async (req, res) => {
    try {
      const { title, description, gender, awards, img, director } = req.body;
      
      // Cria um novo filme no banco
      const movie = await Movie.create({
        title,
        description,
        gender,
        awards,
        img,
        director,
      });
      
      return res.status(201).json({
        msg: "Movie successfully posted",
        movie,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        msg: "Error creating movie",
        error: error.message,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const movies = await Movie.find(); // Busca todos os filmes

      return res.status(200).json({
        msg: "Movies retrieved successfully",
        movies,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        msg: "Error retrieving movies",
        error: error.message,
      });
    }
  },

  getOne: async (req, res) => {
    try {
      const { id } = req.params;
      const movieFound = await Movie.findById(id); // Busca um filme por ID

      if (!movieFound) {
        return res.status(404).json({
          msg: "Movie not found",
        });
      }

      return res.status(200).json({
        msg: "Movie found",
        movieFound,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        msg: "Error retrieving movie",
        error: error.message,
      });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, gender, awards, img, director } = req.body;
      
      const movieFound = await Movie.findById(id); // Busca o filme por ID
      if (!movieFound) {
        return res.status(404).json({
          msg: "Movie not found",
        });
      }

      // Atualiza o filme com os novos dados
      const movieUpdated = await Movie.findByIdAndUpdate(id, {
        title,
        description,
        gender,
        awards,
        img,
        director
      }, { new: true }); // "new: true" retorna o documento atualizado

      return res.status(200).json({
        msg: "Movie updated successfully",
        movieUpdated,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        msg: "Error updating movie",
        error: error.message,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const movieFound = await Movie.findById(id); // Busca o filme por ID

      if (!movieFound) {
        return res.status(404).json({
          msg: "Movie not found",
        });
      }

      // Exclui o filme do banco
      await Movie.findByIdAndDelete(id);

      return res.status(200).json({
        msg: "Movie deleted successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        msg: "Error deleting movie",
        error: error.message,
      });
    }
  },
};

module.exports = movieController;
