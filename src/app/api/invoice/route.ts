import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { promises as fs } from "fs";
import {getJobDetails, getCustomerInfo, getAccountByClerkId} from '@/src/utils/db'
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { jobId } = await req.json();
    const jobData = await getJobDetails(jobId);
    const customer = await getCustomerInfo(jobData.customer_clerk_id);
    const photographer = await getAccountByClerkId(jobData.photographer_clerk_id)

    const templatePath = path.join(
      process.cwd(),
      "public",
      "Invoice_Template.pdf"
    );
    const templateBytes = await fs.readFile(templatePath);

    const pdfDoc = await PDFDocument.load(templateBytes);
    const form = pdfDoc.getForm();

    const jobPrice = Number(jobData.job_price);
    const total = jobPrice * 1.1;
    const serviceFee = jobPrice * 0.1;
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

    const invoiceNumber = String(jobData.invoice_number).padStart(4, "0");
    form.getTextField("InvNumber").setText(`#${invoiceNumber}`);
    form.getTextField("InvDate").setText(currentDate);
    form.getTextField("Total").setText(`$ ${total.toFixed(2)}`);
    form.getTextField("CustomerName").setText(customer.full_name);
    form.getTextField("CustomerEmail").setText(customer.email);
    form.getTextField("PhotographerName").setText(photographer.full_name);
    form.getTextField("EventName").setText(jobData.event_title);
    form.getTextField("Price").setText(`$ ${jobPrice.toFixed(2)}`);
    form.getTextField("ServF").setText(`$ ${serviceFee.toFixed(2)}`);
    form.getTextField("JobID").setText(jobData.conversation_id)

    form.flatten();
    const pdfBytes = await pdfDoc.save();
    const fileName = `${jobData.event_title.replace(/\s+/g, "-")}-invoice.pdf`;

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Error generating invoice: ", error);
    return NextResponse.json(
      { error: "Failed to generate invoice" },
      { status: 500 }
    );
  }
}
