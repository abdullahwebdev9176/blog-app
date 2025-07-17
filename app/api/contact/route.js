export const runtime = "nodejs";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  if (!name || !email || !message) {
    return NextResponse.json({ success: false, error: "All fields are required." }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "abdullah.webdev9176@gmail.com",
      pass: "tgyh hgeb xjxw jctb",
    },
  });

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: "abdullah.webdev9176@gmail.com",
      subject: "New Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<b>Name:</b> ${name}<br/><b>Email:</b> ${email}<br/><b>Message:</b><br/>${message}`,
    });

    return NextResponse.json({ success: true, message: "Message received and email sent!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to send email." }, { status: 500 });
  }
}
