import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function POST(request) {
  // console.log(request)
 
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const database = client.db("stock");
    const inventory = database.collection("inventory");

    const body = await request.json();
    console.log(body)
    const { slug, action, initialQuantity } = body;

    const filter = { productSlug: slug };
    const newQuantity =
      action === "plus"
        ? parseInt(initialQuantity) + 1
        : parseInt(initialQuantity) - 1;

    const updateDoc = {
      $set: {
        productQuantity: newQuantity,
      },
    };

    const result = await inventory.updateOne(filter, updateDoc, {});

    return new Response(
      JSON.stringify({
        success: true,
        message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
      }),
      {
        status: 200, // Set the appropriate HTTP status code here
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, // Set the appropriate HTTP status code for error responses
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await client.close();
  }
}
