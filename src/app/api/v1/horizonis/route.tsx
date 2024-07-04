// ->> api/v1/airtable

import { NextRequest, NextResponse } from "next/server";
import Airtable from "airtable";
import axios from "axios";

// Response Data
type ResponseData = {
  message?: string;
  data?: any;
  error?: {
    message: string;
    status?: number;
  };
};

// **GET** - Retrieve airtable data
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const coin = req.nextUrl.searchParams.get("coin");

    const response = await axios.get(
      `https://coins.llama.fi/prices/current/coingecko:${coin}?searchWidth=4h`,
    );

    // Extract only the necessary data from the response
    const data = response.data.coins[`coingecko:${coin}`];
    const price = data.price;

    return NextResponse.json<ResponseData>({
      data: price,
    });
  } catch (err) {
    console.error("Error fetching price data: \n", err);
    return NextResponse.json({
      message: "Error fetching price data.",
      error: "An unknown error occurred.",
    });
  }
}
