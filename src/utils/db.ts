let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

import { Client } from "pg";
import { PhotographerAccount, JobDetails, Customer, s3Images } from "./types";
import { getImages } from "./fetchImages";

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
  await client.query(
    "UPDATE photographer_account SET clerk_id = $1 WHERE email = $2",
    [newClerkid, email]
  );
}

export async function isPG_noClerk(email: string): Promise<boolean> {
  const result = await client.query(
    "SELECT email FROM photographer_account WHERE email = $1 AND clerk_id is NULL",
    [email]
  );
  return result.rows.length > 0;
}

export async function isCustomer(email: string): Promise<boolean> {
  const result = await client.query(
    "SELECT email FROM customer_account WHERE email = $1",
    [email]
  );
  return result.rows.length > 0;
}

export async function isPG(email: string): Promise<boolean> {
  const result = await client.query(
    "SELECT email FROM photographer_account WHERE email = $1",
    [email]
  );
  return result.rows.length > 0;
}

export async function isPGClerk(clerkid: string): Promise<boolean> {
  const result = await client.query(
    "SELECT clerk_id FROM photographer_account where clerk_id = $1",
    [clerkid]
  );
  return result.rows.length > 0;
}

export async function isVisible(accountID: number): Promise<boolean> {
  const result = await client.query(
    'SELECT visible FROM photographer_account WHERE "id" = $1',
    [accountID]
  );
  return result.rows[0].visible;
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

export async function getAllAccounts(): Promise<PhotographerAccount[]> {
  const result = await client.query("SELECT * FROM photographer_account");
  return result.rows;
}

export async function getAccountByEmail(
  email: string
): Promise<PhotographerAccount> {
  const result = await client.query(
    "SELECT * FROM photographer_account WHERE email = $1",
    [email]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function getAccountByClerkId(
  clerkId: string
): Promise<PhotographerAccount> {
  const result = await client.query(
    "SELECT * FROM photographer_account WHERE clerk_id = $1",
    [clerkId]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function getAccountByPhotographerId(
  pgId: number
): Promise<PhotographerAccount> {
  const result = await client.query(
    "SELECT * FROM photographer_account WHERE id = $1",
    [pgId]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function getPortfolioPictures(
  clerkId: string
): Promise<s3Images[]> {
  return getImages(`portfolio-pictures/${clerkId}/`);
}

export async function getAccountDetailsByName(
  name: string
): Promise<PhotographerAccount> {
  const result = await client.query(
    "SELECT * FROM photographer_account WHERE full_name = $1",
    [name]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function getAllJobIDs(): Promise<JobDetails[]> {
  const result = await client.query("SELECT conversation_id FROM jobs");
  return result.rows;
}

export async function getAllPhotographers(
  searchParam?: string
): Promise<PhotographerAccount[]> {
  let query = "SELECT * FROM photographer_account";
  let values: string[] = [];

  if (searchParam) {
    query += " WHERE $1 = ANY(skills)";
    values.push(searchParam);
  }

  const result = await client.query(query, values);
  return result.rows;
}

export async function getPGClerkId(email: string): Promise<string> {
  const result = await client.query(
    "SELECT clerk_id FROM photographer_account WHERE email = $1",
    [email]
  );
  return result.rows.length > 0 ? result.rows[0].clerkid : null;
}

export async function getPGGalleries(clerkID: string): Promise<string[]> {
  const result = await client.query(
    "SELECT jobs FROM photographer_account WHERE clerk_id = $1",
    [clerkID]
  );
  return result.rows[0].jobs;
}

export async function getEmailByClerk(clerkID: string): Promise<string> {
  const result = await client.query(
    "SELECT email FROM photographer_account WHERE clerk_id = $1",
    [clerkID]
  );
  return result.rows[0].email;
}

export async function getJobDetails(convoID: string): Promise<JobDetails> {
  const result = await client.query(
    "SELECT * FROM jobs j JOIN job_detail jd ON j.conversation_id = jd.conversation_id WHERE j.conversation_id = $1",
    [convoID]
  );
  return result.rows[0];
}

export async function getCustomerInfo(clerkID: string): Promise<Customer> {
  const result = await client.query(
    "SELECT * FROM customer_account WHERE clerkid = $1",
    [clerkID]
  );
  return result.rows[0];
}

export async function getCustomerGalleries(clerkID: string): Promise<string[]> {
  const result = await client.query(
    "SELECT jobs FROM customer_account WHERE clerkid = $1",
    [clerkID]
  );
  return result.rows[0].jobs;
}

export async function updateProfilePicture(clerkID: string, pfpURL: string) {
  await client.query(
    "UPDATE photographer_account SET pfp_url = $1 WHERE clerk_id = $2",
    [pfpURL, clerkID]
  );
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

export async function updatePaid(convoID: string) {
  await client.query("UPDATE jobs set paid = true WHERE conversation_id = $1", [
    convoID,
  ]);
}

export async function updateJobPictures(convoID: string, currentDate: Date) {
  const isoDate = currentDate.toISOString();
  await client.query(
    "UPDATE jobs SET pictures_uploaded = true, picture_upload_time = $1 WHERE conversation_id = $2",
    [isoDate, convoID]
  );
}

export async function updateHires(clerkID: string) {
  await client.query(
    "UPDATE photographer_account SET hires = hires + 1 WHERE clerk_id = $1",
    [clerkID]
  );
}
