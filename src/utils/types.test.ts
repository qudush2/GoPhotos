import { describe, it, expect } from "vitest";
import { getJobStatus, type JobDetails } from "./types";

// Base job with every field set to a sensible "happy path" value. Individual
// tests override only the fields relevant to the branch under test.
function makeJob(overrides: Partial<JobDetails>): JobDetails {
  return {
    job_id: "job-1",
    customer_clerk_id: "customer-1",
    photographer_clerk_id: "photographer-1",
    conversation_id: "conversation-1",
    job_price: 100,
    price_finalized: true,
    picture_upload_time: "",
    paid: true,
    pictures_uploaded: true,
    picture_url: "",
    closed: true,
    event_title: "Event",
    loc: "",
    start_time: "",
    end_time: "",
    event_date: "",
    organization: "",
    description: "",
    message_sent: false,
    cover_image: "",
    photographer_created: false,
    mit_po: false,
    invoice_number: 1,
    ...overrides,
  };
}

describe("getJobStatus", () => {
  it("returns Job Closed when closed and pictures not uploaded", () => {
    const job = makeJob({ closed: true, pictures_uploaded: false });
    expect(getJobStatus(job)).toEqual({ text: "Job Closed", color: "#E5E7EB" });
  });

  it("the closed check takes precedence over price_finalized/paid: a closed job with no pictures uploaded is 'Job Closed' even if price is not finalized and it isn't paid", () => {
    const job = makeJob({
      closed: true,
      pictures_uploaded: false,
      price_finalized: false,
      paid: false,
    });
    expect(getJobStatus(job)).toEqual({ text: "Job Closed", color: "#E5E7EB" });
  });

  it("returns Awaiting Price when price is not finalized", () => {
    const job = makeJob({ closed: false, price_finalized: false });
    expect(getJobStatus(job)).toEqual({ text: "Awaiting Price", color: "#FEF08A" });
  });

  it("returns Awaiting Payment when price is finalized but not paid", () => {
    const job = makeJob({ closed: false, price_finalized: true, paid: false });
    expect(getJobStatus(job)).toEqual({ text: "Awaiting Payment", color: "#FED7AA" });
  });

  it("returns Awaiting Upload when paid but pictures not uploaded", () => {
    const job = makeJob({
      closed: false,
      price_finalized: true,
      paid: true,
      pictures_uploaded: false,
    });
    expect(getJobStatus(job)).toEqual({ text: "Awaiting Upload", color: "#BFDBFE" });
  });

  it("returns Completed when pictures are uploaded and the job is closed", () => {
    const job = makeJob({
      closed: true,
      price_finalized: true,
      paid: true,
      pictures_uploaded: true,
    });
    expect(getJobStatus(job)).toEqual({ text: "Completed", color: "#BBF7D0" });
  });

  // NOTE: this looks like a possible bug (see PR description). A job with
  // pictures already uploaded that hasn't been closed yet doesn't match any
  // of the five branches, so it falls through to "Unknown" instead of some
  // more descriptive status (e.g. an "awaiting close/review" state). This
  // test pins down the current, actual behavior.
  it("falls through to Unknown when pictures are uploaded but the job is not closed", () => {
    const job = makeJob({
      closed: false,
      price_finalized: true,
      paid: true,
      pictures_uploaded: true,
    });
    expect(getJobStatus(job)).toEqual({ text: "Unknown", color: "#E5E7EB" });
  });
});
