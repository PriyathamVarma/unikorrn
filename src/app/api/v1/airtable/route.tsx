// ->> api/v1/airtable

import { NextRequest, NextResponse } from "next/server";
import Airtable from "airtable";

// Response Data
type ResponseData = {
  message?: string;
  data?: any;
  error?: {
    message: string;
    status?: number;
  };
};

// Constants
const airtable_pat = process.env.NEXT_PUBLIC_AIRTABLE_PAT;
const base = new Airtable({ apiKey: airtable_pat }).base("appvgeuoxapogEv1a");

// **GET** - Retrieve airtable data
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    console.log("Airtable token:", base);
    console.log("check point 1");
    const records = await base("test2").select().firstPage();
    console.log("check point 2", records);
    const data = records.map((record: any) => ({
      records: record.fields,
    }));
    console.log("check point 3", data);
    return NextResponse.json<ResponseData>({
      //message: "Airtable data fetched",
      data: data,
    });
  } catch (err) {
    console.error("Error fetching airtable data: \n", err);
    return NextResponse.json({
      message: "Error fetching airtable data.",
      error: "An unknown error occurred.",
    });
  }
}
