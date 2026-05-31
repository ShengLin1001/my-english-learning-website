import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const dbPath = path.join(process.cwd(), "data", "dev.db");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  try {
    const bytes = await fs.readFile(dbPath);
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="english-learning-${timestamp}.db"`
      }
    });
  } catch {
    return NextResponse.json({ error: "SQLite database file was not found. Run npm run db:push first." }, { status: 404 });
  }
}
