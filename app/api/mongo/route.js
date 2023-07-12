import { NextResponse } from "next/server";

const { MongoClient } = require("mongodb");

export async function GET(request) {
  // Replace the uri string with your connection string.
  const uri =
    "mongodb+srv://satyam30patel:%40atlas%232002@mongoreaper.2suachv.mongodb.net/";

  const client = new MongoClient(uri);

  try {
    const database = client.db("nezuko");
    const movies = database.collection("muzan");

    // Query for a movie that has the title 'Back to the Future'
    const query = {};
    const movie = await movies.find(query).toArray();

    console.log(movie);
    return NextResponse.json(movie);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
