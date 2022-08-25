const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
require('dotenv').config()
const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}/en0`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const database = client.db("en0");
const INCORRECT_PARAMETERS="Uso incorrecto de los parametros";
const COLLECTION_NOT_FOUND="Coleccion no se encuentra";
const FIELD_NOT_FOUND="Campo no se encuentra";

const personSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    sexo: { type: String, enum: {values: ['Masculino', 'Femenino'], message: 'Sexo Invalido'}, required: true },
    estado: { type: String, values: [ null, 'Embarazo', 'Lactancia'], required: true },
    nacimiento: { type: Date, required: true },
    telefono: { type: Number, min: [10000000, 'Telefono Invalido'], max: [ 99999999, 'Telefono Invalido' ], required: true },
    edad: { type: Number, min: [18, 'Edad Invalida'], max: [ 99, 'Edad Invalida' ], required: true }
});

const Persona = mongoose.model('Persona', personSchema);

async function insert(data, collection) {
    const filesCollection = database.collection(collection);
    ret=null;
    try {
	await filesCollection.insertOne( JSON.parse(data));
    } catch (e) {
	console.log (e);
    };
    person.save();
}
async function getdata(collection, start=0, end=20) {
    const filesCollection = database.collection(collection);
    try {
	return filesCollection.find().toArray();
    } catch (err) {
	console.log(err);
	return { error: err };
    }
}
async function getcollections() {
    const filesCollection = database.listCollections();
    try {
	return filesCollection.toArray();
    } catch (err) {
	console.log(err);
	return { "error" : err.toString() };
    }
}
async function getfields(collection) {
    continua=0;
    database.listCollections({name: collection}).next(function(err, collinfo) {
        if (collinfo) {
	    continua=1;
        }
    });
    if(continua) {
	const filesCollection = database.collection(collection);
	try {
	    data='[';
	    var cursor=filesCollection.find();
	    await cursor.forEach(function(doc) { data+= JSON.stringify(doc) + "," ; });
	    data +="null ]";
	    console.log("[" + traverse(JSON.parse(data), '" " , ') + "]");
	    return JSON.parse("[" + traverse(JSON.parse(data), '"" ') + "]");
	} catch (err) {
	    console.log(err);
	    return { "error": err };
	}
    } else {
	return { "error": '"' + COLLECTION_NOT_FOUND + '"' };
    }
}
async function searchdata(collection, data) {
    try {
	console.log(collection);
	const filesCollection = database.collection(collection);
	console.log(data);
	return filesCollection.find( data ).toArray();
    } catch (err) {
	console.log(err);
	return { "error": err };
    }
}
async function searchCompound(collection, data) {
    const filesCollection = database.collection(collection);
    try {
	return filesCollection.find( data ).toArray();
    } catch (err) {
	console.log(err);
	return { "error": err };
    }
}
async function insertdata(collection, data) {
    const person = new Persona(data);
    const error = person.validateSync();
    if(error) {
	if(error.errors) {
	    if(error.errors.length) {
		return { "error" : error.errors };
	    }
	}
    }
    try {
	console.log(collection);
	console.log(data);
	var regresa=database.collection(collection).insertOne(data);
	return regresa;
    } catch (err) {
	console.log(err);
	return { "error": err };
    }
}
module.exports = { getcollections, searchCompound, insert, getdata, insertdata, searchdata, getfields, INCORRECT_PARAMETERS, COLLECTION_NOT_FOUND, FIELD_NOT_FOUND } ;
