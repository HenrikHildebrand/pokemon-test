/* eslint-disable @typescript-eslint/no-var-requires */
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Connection URL and Database Name
const url = 'mongodb://mongo:27017';
const dbName = 'pokemon-test';

// Create a new MongoClient
const client = new MongoClient(url);

// Read JSON data from file
const jsonFilePath = path.join(__dirname, 'pokemons.json');
const pokemonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

async function loadPokemonData() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log('Connected successfully to server');

    // Get the database
    const db = client.db(dbName);

    // Get the collection
    const collection = db.collection('Pokemon');

    // Delete all documents
    const deleteResult = await collection.deleteMany({});
    console.log('Deleted documents =>', deleteResult);

    // Insert the data
    const insertResult = await collection.insertMany(pokemonData.pokemon); // Using insertMany for an array of documents
    console.log('Inserted documents =>', insertResult);
  } catch (err) {
    console.error(err);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

loadPokemonData();
