import { connectToDatabase } from "@/lib/database";

export async function POST() {
  try {
    await connectToDatabase();
    return new Response(JSON.stringify({ message: "The route is working" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in POST route:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
