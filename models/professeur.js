const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const professeurSchema = new Schema({
  prenom: { type: String, required: true },
  nom: { type: String, required: true },
  embauche: { type: Date, required: true },
  cours: [{ type: mongoose.Types.ObjectId, required: true, ref: "Cours" }],
});

module.exports = mongoose.model("Professeur", professeurSchema);
