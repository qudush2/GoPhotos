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

export async function isPG(email: string) {
  const result = await client.query(
    "SELECT email FROM account WHERE email = $1",
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

export async function createJob(
  photographerClerkID: string,
  customerClerkID: string,
  convoID: string
) {
  await client.query(
    "INSERT INTO jobs (photographer_clerk_id, customer_clerk_id, conversation_id) VALUES ($1, $2, $3)",
    [photographerClerkID, customerClerkID, convoID]
  );

  return {
    isSent: true,
    hasError: true,
  };
}

export async function createJobDetails(
  convoID: string,
  eventTitle: string,
  location: string,
  startTime: string,
  endTime: string,
  eventDate: string,
  organization: string,
  description: string
) {
  await client.query(
    "INSERT INTO job_detail (conversation_id, event_title, loc, start_time, end_time, event_date, organization, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
    [
      convoID,
      eventTitle,
      location,
      startTime,
      endTime,
      eventDate,
      organization,
      description,
    ]
  );
}

export async function getPGinfo(email: string) {
  const result = await client.query(
    'SELECT p.location, p."hourlyPriceLow", p."hourlyPriceHigh", p.school, p.skills, p.about, p.hires FROM photographer p JOIN account a ON p.id = a.id WHERE a.email = $1',
    [email]
  );
  return result.rows[0];
}

export async function getPhotographer(id: string) {
  const result = await client.query(
    'SELECT * FROM photographer WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

export async function getAccountByEmail(email: string) {
  const result = await client.query("SELECT * FROM account WHERE email = $1", [
    email,
  ]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function getAccountByClerkId(clerkId: string) {
  const result = await client.query("SELECT * FROM account WHERE clerkid = $1", [
    clerkId,
  ]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function getAccountDetailsByName(name : string) {
  const result = await client.query("SELECT * FROM account WHERE \"fullName\" = $1", [
    name,
  ]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function getAllJobIDs() {
  const result = await client.query("SELECT job_id FROM jobs");
  return result.rows;
}

export async function getPGClerkId(email: string) {
  const result = await client.query(
    "SELECT clerkid FROM account WHERE email = $1",
    [email]
  );
  return result.rows.length > 0 ? result.rows[0].clerkid : null;
}

export async function getEmailByClerk(clerkID: string) {
  const result = await client.query(
    "SELECT email FROM account WHERE clerkid = $1",
    [clerkID]
  );
  return result.rows[0].email;
}

export async function getJobDetails(convoID: string) {
  const result = await client.query(
    "SELECT * FROM jobs j JOIN job_detail jd ON j.conversation_id = jd.conversation_id WHERE j.conversation_id = $1",
    [convoID]
  );
  return result.rows[0];
}

export async function getCustomerInfo(clerkID: string) {
  const result = await client.query(
    "SELECT * FROM customer_account WHERE clerkid = $1",
    [clerkID]
  );
  return result.rows[0];
}

export async function updateJobPrice(convoID: string, job_price: string) {
  await client.query(
    "UPDATE jobs SET job_price = $1, price_finalized = true WHERE conversation_id = $2",
    [job_price, convoID]
  );
  return {
    isSent: true,
    hasError: true,
  };
}

export async function updateMessageSent(convoID: string) {
  await client.query(
    "UPDATE jobs set message_sent = true WHERE conversation_id = $1",
    [convoID]
  );
}
