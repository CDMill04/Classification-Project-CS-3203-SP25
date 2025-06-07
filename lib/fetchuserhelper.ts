import clientPromise from "@/lib/mongodb";

export async function getUserByEmail(email: string) {
  const client = await clientPromise;
  const db = client.db("classification");
  return db.collection("users").findOne({ email });
}