import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const POST = async (req: NextRequest) => {
  try {
    const { student, studentEmail, complaintSubject, mainComplaint } = await req.json();
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: studentEmail,
      to: process.env.USER,
      subject: `Complaint Submission: ${complaintSubject}`,
      replyTo: studentEmail,
      html: `
        <p><strong>Student Name:</strong> ${student}</p>
        <p><strong>Email:</strong> ${studentEmail}</p>
        <p><strong>Subject:</strong> ${complaintSubject}</p>
        <p><strong>Complaint:</strong> ${mainComplaint}</p>
      `,
      text: `${mainComplaint} (Sent from ${studentEmail})`,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ status: "Ok" });

  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Error sending email" }, { status: 500 });
  }
};