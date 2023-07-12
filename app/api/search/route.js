import { NextResponse } from "next/server";

import { MongoClient } from "mongodb";

export async function GET(request) {
  // Replace the uri string with your connection string.
  const query = request.nextUrl.searchParams.get("query");
  const uri =
    "mongodb+srv://satyam30patel:%40atlas%232002@mongoreaper.2suachv.mongodb.net/";

  const client = new MongoClient(uri);

  try {
    const database = client.db("stock");
    const inventory = database.collection("inventory");
    // const pipeline = [
    //   {
    //     $match: {
    //       $or: [
    //         { productSlug: { $regex: query, $options: "i" } },
    //         { productPrice: { $regex: "your_text_query", $options: "i" } },
    //         { productQuantity: { $regex: "your_text_query", $options: "i" } },
    //       ],
    //     },
    //   },
    // ];

    // Query for a movie that has the title 'Back to the Future'
    const result = await inventory
      .aggregate([{
        $match: {
          $or: [
            { productSlug: { $regex: query, $options: "i" } },
            { productPrice: { $regex: "your_text_query", $options: "i" } },
            { productQuantity: { $regex: "your_text_query", $options: "i" } },
          ],
        },
      }])
      .toArray();

    return NextResponse.json(result);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
