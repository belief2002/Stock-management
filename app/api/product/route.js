import { NextResponse } from "next/server";

import { MongoClient } from "mongodb";

export async function GET(request) {
  // Replace the uri string with your connection string.
  const uri =
    "mongodb+srv://satyam30patel:%40atlas%232002@mongoreaper.2suachv.mongodb.net/";

  const client = new MongoClient(uri);

  try {
    
    const database = client.db("stock");
    const inventory = database.collection("inventory");

    // Query for a movie that has the title 'Back to the Future'
    const query = {};
    const allProducts = await inventory.find(query).toArray();
    return NextResponse.json(allProducts);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}



export async function POST(request) {
  // Replace the uri string with your connection string.
  const uri =
    "mongodb+srv://satyam30patel:%40atlas%232002@mongoreaper.2suachv.mongodb.net/";

  const client = new MongoClient(uri);

  try {
    const body = await request.json();
    // console.log("body", body);

    await client.connect();
    const database = client.db("stock");
    const inventory = database.collection("inventory");

    const product = await inventory.insertOne(body);
    return new Response(JSON.stringify({ product, ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

