import { VERIFICATION_EMAIL_TEMPLATE } from "../mailtrap/emailTemplates.js";
import { client, sender } from "../mailtrap/mailtrap.js";
export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];
  try {
    const res = await client.send({
      from: sender,
      to: recipient,
      subject: "verify Your Email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken,
      ),
      category: "Email Verification",
    });
    console.log("Email send successfully", res);
  } catch (error) {
    throw new Error(`Error sending verification  email ${error} `);
  }
};
export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];
  try {
    const res = await client.send({
      from: sender,
      to: recipient,
      template_uuid: "8769ec63-9aef-4386-98d1-54d216b8e04f",
      template_variables: { company_info_name: "MoveIn inc ", name: name },
    });
    console.log("Welcome Email send Successfully", res);
  } catch (error) {
    console.log("Error happened while Sending welcome Email", error);
    throw new Error(`Failed at  Sending Welcome Email to the user ${error}`);
  }
};
