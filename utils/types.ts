export type Account = {
  id: number;
  email: string;
  fullName: string;
  clerkid: string;
  profile_picture_url: string;
};

export type Photographer = {
  id: number;
  accountId: string;
  location: string;
  hourlyPriceLow: number;
  hourlyPriceHigh: number;
  school: string;
  skills: string[];
  about: string;
  hires: number;
  visible: boolean;
};

export type Asset = {
  id: number;
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
