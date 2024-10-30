import { Pool } from "pg";
import {
  PhotographerAccount,
  JobDetails,
  Customer,
  s3Images,
  Application,
  Ratings,
  Rating,
  LandingPageImage,
} from "./types";
import { getImages } from "./fetchImages";

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const pool = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10, // Reduced from 20 to 10
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000, // Added connection timeout
});

// Helper function to execute queries
async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export async function isPGClerk(clerkid: string): Promise<boolean> {
  const result = await query(
    "SELECT clerk_id FROM photographer_account where clerk_id = $1",
    [clerkid]
  );
  return result.rows.length > 0;
}

export async function isVisible(clerkID: string): Promise<boolean> {
  const result = await query(
    "SELECT visible FROM photographer_account WHERE clerk_id = $1",
    [clerkID]
  );
  return result.rows[0].visible;
}

export async function isCustomer(email: string): Promise<boolean> {
  const result = await query(
    "SELECT email FROM customer_account WHERE email = $1",
    [email]
  );
  return result.rows.length > 0;
}

export async function hasRating(convoID: string): Promise<boolean> {
  const result = await query(
    "SELECT * FROM ratings where conversation_id = $1",
    [convoID]
  );

  return result.rows.length > 0;
}

export async function applicationSubmitted(clerkID: string): Promise<boolean> {
  const result = await query("SELECT * FROM applications WHERE clerk_id= $1", [
    clerkID,
  ]);

  return result.rows.length > 0;
}

export async function createCustomer(
  email: string,
  fullName: string,
  clerkid: string
): Promise<void> {
  // Check if email or clerkid already exist
  const checkResult = await query(
    "SELECT * FROM customer_account WHERE email = $1 OR clerkid = $2",
    [email, clerkid]
  );

  if (checkResult.rows.length === 0) {
    // If no existing record found, insert new customer
    await query(
      "INSERT INTO customer_account (email, full_name, clerkid) VALUES ($1, $2, $3)",
      [email, fullName, clerkid]
    );
  }
}

export async function createJob(
  photographerClerkID: string,
  customerClerkID: string,
  convoID: string
) {
  await query(
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
  description: string,
  photographer_created: boolean,
  mit_po:boolean
) {
  await query(
    "INSERT INTO job_detail (conversation_id, event_title, loc, start_time, end_time, event_date, organization, description, photographer_created, mit_po) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
    [
      convoID,
      eventTitle,
      location,
      startTime,
      endTime,
      eventDate,
      organization,
      description,
      photographer_created,
      mit_po
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
  await query(
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

export async function createRating(
  convoID: string,
  pg_clerk: string,
  customer_clerk: string,
  rating: number,
  comment?: string
) {
  const queryText = comment
    ? "INSERT INTO ratings (conversation_id, photographer_clerk_id, customer_clerk_id, rating, comment) VALUES ($1, $2, $3, $4, $5)"
    : "INSERT INTO ratings (conversation_id, photographer_clerk_id, customer_clerk_id, rating) VALUES ($1, $2, $3, $4)";

  const values = comment
    ? [convoID, pg_clerk, customer_clerk, rating, comment]
    : [convoID, pg_clerk, customer_clerk, rating];

  await query(queryText, values);
}

export async function getAllAccounts(): Promise<PhotographerAccount[]> {
  const result = await query("SELECT * FROM photographer_account");
  return result.rows;
}

export async function getAccountByEmail(
  email: string
): Promise<PhotographerAccount> {
  const result = await query(
    "SELECT * FROM photographer_account WHERE email = $1",
    [email]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function getAccountByClerkId(
  clerkId: string
): Promise<PhotographerAccount> {
  const result = await query(
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
  const result = await query(
    "SELECT * FROM photographer_account WHERE custom_url = $1",
    [custom_url]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function getAllJobIDs(): Promise<JobDetails[]> {
  const result = await query("SELECT conversation_id FROM jobs");
  return result.rows;
}

export async function getAllPhotographerJobsFiltered(
  clerkID: string,
  searchTerm: string = "",
  sortBy: "date" | "title" = "date",
  filterStatus: string = "all"
): Promise<JobDetails[]> {
  let queryText = `
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
    queryText += ` AND (jd.event_title ILIKE $${paramCount} OR jd.loc ILIKE $${paramCount})`;
    queryParams.push(`%${searchTerm}%`);
  }

  if (filterStatus !== "all") {
    paramCount++;
    queryText += ` AND (
      ($${paramCount} = 'awaiting price' AND NOT j.price_finalized) OR
      ($${paramCount} = 'awaiting payment' AND j.price_finalized AND NOT j.paid) OR
      ($${paramCount} = 'awaiting upload' AND j.paid AND NOT j.pictures_uploaded) OR
      ($${paramCount} = 'completed' AND j.pictures_uploaded AND j.closed) OR
      ($${paramCount} = 'closed' AND j.closed AND NOT j.pictures_uploaded)
    )`;
    queryParams.push(filterStatus);
  }

  queryText += ` ORDER BY ${sortBy === "date" ? "jd.event_date" : "jd.event_title"}`;

  const result = await query(queryText, queryParams);
  return result.rows;
}

export async function getAllCustomerBookingsFiltered(
  clerkID: string,
  searchTerm: string = "",
  sortBy: "date" | "title" = "date",
  filterStatus: string = "all"
): Promise<JobDetails[]> {
  let queryText = `
    SELECT j.*, jd.*, pa.full_name as photographer_name
    FROM jobs j 
    JOIN job_detail jd ON j.conversation_id = jd.conversation_id
    JOIN photographer_account pa ON j.photographer_clerk_id = pa.clerk_id
    WHERE j.customer_clerk_id = $1
  `;

  const queryParams: any[] = [clerkID];
  let paramCount = 1;

  if (searchTerm) {
    paramCount++;
    queryText += ` AND (jd.event_title ILIKE $${paramCount} OR jd.loc ILIKE $${paramCount})`;
    queryParams.push(`%${searchTerm}%`);
  }

  if (filterStatus !== "all") {
    paramCount++;
    queryText += ` AND (
      ($${paramCount} = 'awaiting price' AND NOT j.price_finalized) OR
      ($${paramCount} = 'awaiting payment' AND j.price_finalized AND NOT j.paid) OR
      ($${paramCount} = 'awaiting upload' AND j.paid AND NOT j.pictures_uploaded) OR
      ($${paramCount} = 'completed' AND j.pictures_uploaded AND j.closed)
    )`;
    queryParams.push(filterStatus);
  }

  queryText += ` ORDER BY ${
    sortBy === "date" ? "jd.event_date" : "jd.event_title"
  }`;

  const result = await query(queryText, queryParams);
  return result.rows;
}

export async function getAllPhotographers(
  photographyType?: string,
  location?: string
): Promise<PhotographerAccount[]> {
  let queryText = "SELECT * FROM photographer_account";
  let conditions: string[] = [];
  let values: string[] = [];

  if (photographyType) {
    conditions.push("$1 = ANY(skills)");
    values.push(photographyType);
  }

  if (location) {
    conditions.push("location = $" + (values.length + 1));
    values.push(location);
  }

  if (conditions.length > 0) {
    queryText += " WHERE " + conditions.join(" AND ");
  }

  const result = await query(queryText, values);
  return result.rows;
}

export async function getPGGalleries(clerkID: string): Promise<string[]> {
  const result = await query(
    "SELECT paid_jobs FROM photographer_account WHERE clerk_id = $1",
    [clerkID]
  );
  return result.rows[0].paid_jobs;
}

export async function getJobDetails(convoID: string): Promise<JobDetails> {
  const result = await query(
    "SELECT * FROM jobs j JOIN job_detail jd ON j.conversation_id = jd.conversation_id WHERE j.conversation_id = $1",
    [convoID]
  );
  return result.rows[0];
}

export async function getCustomerInfo(clerkID: string): Promise<Customer> {
  const result = await query(
    "SELECT * FROM customer_account WHERE clerkid = $1",
    [clerkID]
  );
  return result.rows[0];
}

export async function getCustomerInfoEmail(email: string): Promise<Customer> {
  const result = await query(
    "SELECT * FROM customer_account WHERE email = $1",
    [email]
  );

  return result.rows[0];
}

export async function getCustomerGalleries(clerkID: string): Promise<string[]> {
  const result = await query(
    "SELECT paid_jobs FROM customer_account WHERE clerkid = $1",
    [clerkID]
  );
  return result.rows[0].paid_jobs;
}

export async function getAllApplications(): Promise<Application[] | null> {
  const result = await query("SELECT * FROM applications");

  return result.rows;
}

export async function getApplication(clerkID: string): Promise<Application> {
  const result = await query("SELECT * FROM applications WHERE clerk_id = $1", [
    clerkID,
  ]);

  return result.rows[0];
}

export async function getPhotographerRatings(
  clerkID: string
): Promise<Ratings> {
  const result = await query(
    `
    SELECT 
      AVG(rating) as "avgRating",
      COUNT(*) as "totalRatings"
    FROM ratings 
    WHERE photographer_clerk_id = $1
  `,
    [clerkID]
  );

  const { avgRating, totalRatings } = result.rows[0];
  return { avgRating: Number(avgRating), totalRatings: Number(totalRatings) };
}

export async function getJobRating(convoID: string): Promise<Rating> {
  const result = await query(
    "SELECT rating, comment FROM ratings WHERE conversation_id = $1",
    [convoID]
  );

  return result.rows[0];
}

export async function getLandingPageImages() {
  const result = await query("SELECT * from landing_page_images");
  return result.rows;
}

export async function updateProfilePicture(clerkID: string, pfpURL: string) {
  await query(
    "UPDATE photographer_account SET pfp_url = $1 WHERE clerk_id = $2",
    [pfpURL, clerkID]
  );
}

export async function updateJobPrice(convoID: string, job_price: string) {
  await query(
    "UPDATE jobs SET job_price = $1, price_finalized = true WHERE conversation_id = $2",
    [job_price, convoID]
  );
  return {
    isSent: true,
    hasError: true,
  };
}

export async function updateMessageSent(convoID: string) {
  await query(
    "UPDATE jobs set message_sent = true WHERE conversation_id = $1",
    [convoID]
  );
}

export async function updatePaid(
  convoID: string,
  customer_clerkID: string,
  pg_clerkID: string
) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "UPDATE jobs SET paid = true WHERE conversation_id = $1",
      [convoID]
    );
    await client.query(
      `UPDATE customer_account 
      SET paid_jobs = ARRAY_APPEND(paid_jobs, $1) 
      WHERE clerkid = $2`,
      [convoID, customer_clerkID]
    );
    await client.query(
      `UPDATE photographer_account 
      SET paid_jobs = ARRAY_APPEND(paid_jobs, $1) 
      WHERE clerk_id = $2`,
      [convoID, pg_clerkID]
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating paid status:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function updateJobPictures(convoID: string, currentDate: Date) {
  const isoDate = currentDate.toISOString();
  await query(
    "UPDATE jobs SET pictures_uploaded = true, closed = true, picture_upload_time = $1 WHERE conversation_id = $2",
    [isoDate, convoID]
  );
}

export async function updateCoverImage(convoID: string, coverImageURL: string) {
  await query("UPDATE jobs SET cover_image = $1 WHERE conversation_id = $2", [
    coverImageURL,
    convoID,
  ]);
}

export async function closeJob(convoID: string) {
  await query("UPDATE jobs SET closed = true WHERE conversation_id = $1", [
    convoID,
  ]);
}

export async function updateHires(clerkID: string) {
  await query(
    "UPDATE photographer_account SET hires = hires + 1 WHERE clerk_id = $1",
    [clerkID]
  );
}

export async function updateStripeID(stripeID: string, clerkID: string) {
  await query(
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
  await query(
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
  const client = await pool.connect();
  try {
    await client.query(
      `
      WITH base_custom_url AS (
        SELECT 
          email, full_name, clerk_id, location, price_low, price_high, school, skills, about, hires,
          REPLACE(full_name, ' ', '') AS base_url
        FROM applications
        WHERE clerk_id = $1
      ),
      numbered_custom_url AS (
        SELECT *,
          base_url || 
          CASE 
            WHEN ROW_NUMBER() OVER (PARTITION BY base_url ORDER BY clerk_id) = 1 THEN ''
            ELSE ROW_NUMBER() OVER (PARTITION BY base_url ORDER BY clerk_id)::text
          END AS custom_url
        FROM base_custom_url
      )
      INSERT INTO photographer_account (
        email, full_name, clerk_id, location, price_low, price_high, school, skills, about, hires, custom_url, visible
      )
      SELECT 
        email, full_name, clerk_id, location, price_low, price_high, school, skills, about, hires, custom_url, true
      FROM numbered_custom_url`,
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
  } finally {
    client.release();
  }
}
