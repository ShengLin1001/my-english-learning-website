import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const dbPath = resolveSqlitePath(process.env.DATABASE_URL);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  if (!dbPath) {
    return NextResponse.json({ error: "SQLite backup requires DATABASE_URL to use a file: path." }, { status: 400 });
  }

  try {
    const bytes = await fs.readFile(dbPath);
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="english-learning-${timestamp}.db"`
      }
    });
  } catch {
    return NextResponse.json({ error: `SQLite database file was not found at ${dbPath}. Run npm run db:push first.` }, { status: 404 });
  }
}

function resolveSqlitePath(databaseUrl: string | undefined) {
  if (!databaseUrl?.startsWith("file:")) {
    return null;
  }

  const rawPath = databaseUrl.slice("file:".length);

  if (!rawPath) {
    return null;
  }

  return path.isAbsolute(rawPath) ? rawPath : path.resolve(process.cwd(), "prisma", rawPath);
}
