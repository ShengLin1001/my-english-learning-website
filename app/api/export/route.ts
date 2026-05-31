import { NextResponse } from "next/server";
import { readData } from "@/lib/store";

export async function GET() {
  const data = await readData();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="english-learning-export-${timestamp}.json"`
    }
  });
}
