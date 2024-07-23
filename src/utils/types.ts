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
  job_complete_customer: boolean;
  closed: boolean;
  event_title: string;
  loc: string;
  start_time: string;
  end_time: string;
  event_date: string;
  organization: string;
  description: string;
  message_sent: boolean;
};

export type Customer = {
  full_name: string;
  email: string;
  clerkid: string;
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

export type Ratings = {
  avgRating: number;
  totalRatings: number;
};

export type Rating = {
  rating: number;
  comment: string;
};
