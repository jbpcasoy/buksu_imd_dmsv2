import nodemailer, { Transporter } from "nodemailer";

var mailTransporter: Transporter;
if (process.env.NODE_ENV === "production") {
  if (
    !process.env.PRODUCTION_NODEMAILER_HOST ||
    !process.env.PRODUCTION_NODEMAILER_PORT ||
    !process.env.PRODUCTION_NODEMAILER_USER ||
    !process.env.PRODUCTION_NODEMAILER_PASS
  ) {
    throw new Error(
      "Please make sure nodemailer configuration were properly set in environment variables."
    );
  }
  // all emails are catched by ethereal.email
  mailTransporter = nodemailer.createTransport(
    {
      host: process.env.PRODUCTION_NODEMAILER_HOST as any,
      port: process.env.PRODUCTION_NODEMAILER_PORT as any,
      auth: {
        user: process.env.PRODUCTION_NODEMAILER_USER as any,
        pass: process.env.PRODUCTION_NODEMAILER_PASS as any,
      },
    },
    {
      from: "imd-dms@buksu.edu.ph",
    }
  );
} else {
  if (
    !process.env.DEVELOPMENT_NODEMAILER_HOST ||
    !process.env.DEVELOPMENT_NODEMAILER_PORT ||
    !process.env.DEVELOPMENT_NODEMAILER_USER ||
    !process.env.DEVELOPMENT_NODEMAILER_PASS
  ) {
    throw new Error(
      "Please make sure nodemailer configuration were properly set in environment variables."
    );
  }
  // all emails are catched by ethereal.email
  mailTransporter = nodemailer.createTransport(
    {
      host: process.env.DEVELOPMENT_NODEMAILER_HOST as any,
      port: process.env.DEVELOPMENT_NODEMAILER_PORT as any,
      auth: {
        user: process.env.DEVELOPMENT_NODEMAILER_USER as any,
        pass: process.env.DEVELOPMENT_NODEMAILER_PASS as any,
      },
    },
    {
      from: "imd-dms@buksu.edu.ph",
    }
  );
}

export default mailTransporter;
