export type Account = {
  id: string;
  email: string;
  fullName: string;
  clerkid: string;
  profile_picture_url: string;
};

export type Photographer = {
  id: string;
  accountId: string;
  location: string;
  estimatedHourlyPriceRange: [number, number];
  school: string;
  skills: string[];
  about: string;
  hires: number;
};

export type Asset = {
  id: string;
  ownerAccountId: string;
  cdnPath: string;
  placeholderBase64: string;
  dateUploaded: string;
};

export type JobDetails = {
  job_id: string;
  customer_clerk_id: string;
  photographer_clerk_id: string;
  conversation_id: string;
  job_price: number;
  price_finalized: boolean;
  paid: boolean;
  pictures_uploaded: boolean;
  picture_folder: string;
  job_complete_pg: boolean;
  job_complete_customer: boolean;
  closed: boolean;
  cancelled: boolean;
  event_title: string;
  loc: string;
  start_time: string;
  end_time: string;
  event_date: string;
  organization: string;
  description: string;
  payment_url: string;
  message_sent: boolean;
};

export type Customer = {
  full_name: string;
  email: string;
  clerkid: string;
};
