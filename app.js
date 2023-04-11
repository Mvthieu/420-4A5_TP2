const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


mongoose.set('strictQuery', true);

const HttpErreur = require("./models/http-erreur");

