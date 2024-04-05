let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

import { Client } from "pg";

const client = new Client({
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

export async function setPhotographerClerkid(
  email: string,
  newClerkid: string
) {
  const result = await client.query(
    "UPDATE account SET clerkid = $1 WHERE email = (SELECT email FROM account WHERE email = $2)",
    [newClerkid, email]
  );
  return result;
}

export async function isPG_noClerk(email: string) {
  const result = await client.query(
    "SELECT email FROM account WHERE email = $1 AND clerkid is NULL",
    [email]
  );
  return result.rows.length > 0;
}

export async function isCustomer(email: string) {
  const result = await client.query(
    "SELECT email FROM customer_account WHERE email = $1",
    [email]
  );
  return result.rows.length > 0;
}

export async function createCustomer(
  email: string,
  fullName: string,
  clerkid: string
) {
  await client.query(
    "INSERT INTO customer_account (email, full_name, clerkid) VALUES ($1, $2, $3)",
    [email, fullName, clerkid]
  );
}

export async function isPG(email: string) {
  const result = await client.query(
    "SELECT email FROM account WHERE email = $1",
    [email]
  );
  return result.rows.length > 0;
}

export async function getPGinfo(email: string) {
  const result = await client.query(
    'SELECT p.location, p."hourlyPriceLow", p."hourlyPriceHigh", p.school, p.skills, p.about, p.hires FROM photographer p JOIN account a ON p.id = a.id WHERE a.email = $1',
    [email]
  );
  return result.rows[0];
}

export async function getAccountByEmail(email: string) {
  const result = await client.query("SELECT * FROM account WHERE email = $1", [
    email,
  ]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function getAllJobIDs() {
  const result = await client.query('SELECT job_id FROM jobs')
  return result.rows
}

export async function createJob(photographerClerkID: string, customerClerkID: string, convoID: string) {
  await client.query(
    "INSERT INTO jobs (photographer_clerk_id, customer_clerk_id, conversation_id) VALUES ($1, $2, $3)",
    [photographerClerkID, customerClerkID, convoID]
  );
}

export async function getPGClerkId(email: string) {
  const result = await client.query(
    "SELECT clerkid FROM account WHERE email = $1",
    [email]
  );
  return result.rows.length > 0 ? result.rows[0].clerkid : null;
}