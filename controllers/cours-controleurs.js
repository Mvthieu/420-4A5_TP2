const { response } = require("express");
const { default: mongoose, mongo } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const HttpErreur = require("../models/http-erreur");

const Cours = require("../models/cours");
const Professeur = require("../models/professeur");

const getCoursById = async (req, res, next) => {
    const coursId = req.params.coursId;
    let cours;
    try {
        cours = await Cours.findById(coursId);
    } catch (erreur){
        return next(
            new HttpErreur("Erreur lors de la récupération du cours", 500)
        );
    }
    if(!cours){
        return next(new HttpErreur("Aucun cours trouvé pour l'id fourni", 404));
    };
    rep.json({cours: cours.toObject({getters: true})});
};