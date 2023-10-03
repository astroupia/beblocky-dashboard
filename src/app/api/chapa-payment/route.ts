import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );
    return new NextResponse(JSON.stringify({ response: response.data }), {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error:", error?.message);
    return new NextResponse(
      JSON.stringify({ response: "Internal Server Error" }),
      {
        status: 500,
      }
    );
  }
}
