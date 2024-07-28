let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

import { Client } from "pg";
import {
  PhotographerAccount,
  JobDetails,
  Customer,
  s3Images,
  Application,
} from "./types";
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

export async function isPGClerk(clerkid: string): Promise<boolean> {
  const result = await client.query(
    "SELECT clerk_id FROM photographer_account where clerk_id = $1",
    [clerkid]
  );
  return result.rows.length > 0;
}

export async function isVisible(clerkID: string): Promise<boolean> {
  const result = await client.query(
    "SELECT visible FROM photographer_account WHERE clerk_id = $1",
    [clerkID]
  );
  return result.rows[0].visible;
}

export async function applicationSubmitted(clerkID: string): Promise<boolean> {
  const result = await client.query(
    "SELECT * FROM applications WHERE clerk_id= $1",
    [clerkID]
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

export async function createApplication(
  email: string,
  full_name: string,
  clerk_id: string,
  location: string,
  price_low: number,
  price_high: number,
  school: string,
  skills: string[],
  about: string,
  hires: number,
  other: string | null
) {
  await client.query(
    "INSERT INTO applications (email, full_name, clerk_id, location, price_low, price_high, school, skills, about, hires, other) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
    [
      email,
      full_name,
      clerk_id,
      location,
      price_low,
      price_high,
      school,
      skills,
      about,
      hires,
      other,
    ] as any[]
  );
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

export async function getPortfolioPictures(
  clerkId: string,
  photographyType?: string
): Promise<s3Images[]> {
  return getImages(`portfolio-pictures/${clerkId}/`, photographyType);
}

export async function getAccountByCustomURL(
  custom_url: string
): Promise<PhotographerAccount> {
  const result = await client.query(
    "SELECT * FROM photographer_account WHERE custom_url = $1",
    [custom_url]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function getAllJobIDs(): Promise<JobDetails[]> {
  const result = await client.query("SELECT conversation_id FROM jobs");
  return result.rows;
}

export async function getAllPhotographerJobsFiltered(
  clerkID: string,
  searchTerm: string = "",
  sortBy: "date" | "title" = "date",
  filterStatus: string = "all"
): Promise<JobDetails[]> {
  let query = `
    SELECT j.*, jd.*, c.full_name as customer_name
    FROM jobs j 
    JOIN job_detail jd ON j.conversation_id = jd.conversation_id
    JOIN customer_account c ON j.customer_clerk_id = c.clerkid
    WHERE j.photographer_clerk_id = $1
  `;

  const queryParams: any[] = [clerkID];
  let paramCount = 1;

  if (searchTerm) {
    paramCount++;
    query += ` AND (jd.event_title ILIKE $${paramCount} OR jd.loc ILIKE $${paramCount})`;
    queryParams.push(`%${searchTerm}%`);
  }

  if (filterStatus !== "all") {
    paramCount++;
    query += ` AND (
      ($${paramCount} = 'awaiting price' AND NOT j.price_finalized) OR
      ($${paramCount} = 'awaiting payment' AND j.price_finalized AND NOT j.paid) OR
      ($${paramCount} = 'awaiting upload' AND j.paid AND NOT j.pictures_uploaded) OR
      ($${paramCount} = 'completed' AND j.pictures_uploaded AND j.closed) OR
      ($${paramCount} = 'closed' AND j.closed AND NOT j.pictures_uploaded)
    )`;
    queryParams.push(filterStatus);
  }

  query += ` ORDER BY ${sortBy === "date" ? "jd.event_date" : "jd.event_title"}`;

  const result = await client.query(query, queryParams);
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

export async function getPGGalleries(clerkID: string): Promise<string[]> {
  const result = await client.query(
    "SELECT paid_jobs FROM photographer_account WHERE clerk_id = $1",
    [clerkID]
  );
  return result.rows[0].paid_jobs;
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
    "SELECT paid_jobs FROM customer_account WHERE clerkid = $1",
    [clerkID]
  );
  return result.rows[0].paid_jobs;
}

export async function getAllApplications(): Promise<Application[] | null> {
  const result = await client.query("SELECT * FROM applications");

  return result.rows;
}

export async function getApplication(clerkID: string): Promise<Application> {
  const result = await client.query(
    "SELECT * FROM applications WHERE clerk_id = $1",
    [clerkID]
  );

  return result.rows[0];
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

export async function updatePaid(
  convoID: string,
  customer_clerkID: string,
  pg_clerkID: string
) {
  await client.query("BEGIN");
  try {
    await client.query(
      "UPDATE jobs SET paid = true WHERE conversation_id = $1",
      [convoID]
    );

    await client.query(
      `
      UPDATE customer_account 
      SET paid_jobs = ARRAY_APPEND(paid_jobs, $1) 
      WHERE clerkid = $2
    `,
      [convoID, customer_clerkID]
    );

    await client.query(
      `
      UPDATE photographer_account 
      SET paid_jobs = ARRAY_APPEND(paid_jobs, $1) 
      WHERE clerk_id = $2
    `,
      [convoID, pg_clerkID]
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating paid status:", error);
    throw error;
  }
}

export async function updateJobPictures(convoID: string, currentDate: Date) {
  const isoDate = currentDate.toISOString();
  await client.query(
    "UPDATE jobs SET pictures_uploaded = true, closed = true, picture_upload_time = $1 WHERE conversation_id = $2",
    [isoDate, convoID]
  );
}

export async function updateCoverImage(convoID: string, coverImageURL: string) {
  await client.query(
    "UPDATE jobs SET cover_image = $1 WHERE conversation_id = $2",
    [coverImageURL, convoID]
  );
}

export async function closeJob(convoID: string) {
  await client.query(
    "UPDATE jobs SET closed = true WHERE conversation_id = $1",
    [convoID]
  );
}

export async function updateHires(clerkID: string) {
  await client.query(
    "UPDATE photographer_account SET hires = hires + 1 WHERE clerk_id = $1",
    [clerkID]
  );
}

export async function updateStripeID(stripeID: string, clerkID: string) {
  await client.query(
    "UPDATE photographer_account SET stripe_id = $1 WHERE clerk_id = $2",
    [stripeID, clerkID]
  );
}

export async function updatePhotographerAccount(
  clerkID: string,
  about: string,
  location: string,
  price_low: number,
  price_high: number,
  school: string,
  skills: string[],
  visible: boolean,
  custom_url: string
) {
  await client.query(
    `UPDATE photographer_account 
     SET about = $2, 
         location = $3, 
         price_low = $4, 
         price_high = $5, 
         school = $6, 
         skills = $7, 
         visible = $8, 
         custom_url = $9 
     WHERE clerk_id = $1`,
    [
      clerkID,
      about,
      location,
      price_low,
      price_high,
      school,
      skills,
      visible,
      custom_url,
    ]
  );
}

export async function moveApplication(clerkID: string) {
  await client.query("BEGIN");

  try {
    await client.query(
      `
      WITH ranked_applications AS (
        SELECT 
          email, full_name, clerk_id, location, price_low, price_high, school, skills, about, hires,
          REGEXP_REPLACE(full_name, '\s+', '', 'g') AS base_url,
          ROW_NUMBER() OVER (PARTITION BY REGEXP_REPLACE(full_name, '\s+', '', 'g') ORDER BY clerk_id) AS rn
        FROM applications
        WHERE clerk_id = $1
      ),
      custom_url_generated AS (
        SELECT *,
          CASE 
            WHEN rn = 1 THEN base_url
            ELSE base_url || rn::text
          END AS custom_url
        FROM ranked_applications
      )
      INSERT INTO photographer_account (
        email, full_name, clerk_id, location, price_low, price_high, school, skills, about, hires, custom_url
      )
      SELECT 
        email, full_name, clerk_id, location, price_low, price_high, school, skills, about, hires, custom_url
      FROM custom_url_generated`,
      [clerkID]
    );

    await client.query(
      `INSERT INTO customer_account (
        email, full_name, clerkid
      )
      SELECT email, full_name, clerk_id
      FROM applications
      WHERE clerk_id = $1
      `,
      [clerkID]
    );

    await client.query("DELETE FROM applications WHERE clerk_id = $1", [
      clerkID,
    ]);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error moving application:", error);
    throw error;
  }
}
