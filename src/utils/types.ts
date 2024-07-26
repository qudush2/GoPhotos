export type PhotographerAccount = {
  id: number;
  email: string;
  full_name: string;
  clerk_id: string;
  pfp_url: string;
  location: string;
  price_low: number;
  price_high: number;
  school: string;
  skills: string[];
  about: string;
  hires: number;
  visible: boolean;
  paid_jobs: string[];
};

export type s3Images = {
  key: string;
  url: string;
  size: number;
  skills: string[];
};

export type JobDetails = {
  job_id: string;
  customer_clerk_id: string;
  photographer_clerk_id: string;
  conversation_id: string;
  job_price: number;
  price_finalized: boolean;
  picture_upload_time: string;
  paid: boolean;
  pictures_uploaded: boolean;
  picture_url: string;
  closed: boolean;
  event_title: string;
  loc: string;
  start_time: string;
  end_time: string;
  event_date: string;
  organization: string;
  description: string;
  message_sent: boolean;
  cover_image: string;
};

export type Customer = {
  full_name: string;
  email: string;
  clerkid: string;
  pfp_url: string;
  paid_jobs: string[];
};

export type Application = {
  email: string;
  full_name: string;
  clerk_id: string;
  location: string;
  price_low: number;
  price_high: number;
  school: string;
  skills: string[];
  about: string;
  hires: number;
  other: string;
};
