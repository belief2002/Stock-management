import { NextResponse } from "next/server";

const { MongoClient } = require("mongodb");

export async function GET(request) {
  // Replace the uri string with your connection string.


  const client = new MongoClient(MONGODB_URI);

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
