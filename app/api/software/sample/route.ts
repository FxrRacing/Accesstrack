import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Fetch one real row from your software table
  const row = await prisma.software.findFirst();
  if (!row) {
    return NextResponse.json({ error: "No data found" }, { status: 404 });
  }
 
  // Exclude 'iconUrl' from the CSV
  const headers = Object.keys(row).filter((key) => 
    key !== "iconUrl" && 
    !key.includes("createdAt") && 
    !key.includes("updatedAt") && 
    (key === "id" || !key.includes("Id"))
  );
    //name description category status are required
    
  const values = headers.map((key) => {

    const value = row[key as keyof typeof row];

    
    // Escape commas and quotes
    if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  });
  const csv = `${headers.join(",")}\n${values.join(",")}`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=software_sample_data.csv",
    },
  });
}