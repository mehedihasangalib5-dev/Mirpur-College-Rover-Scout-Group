/* ---------------------------------------------------------
   EMAILJS-CONFIG.JS
   -----------------------------------------------------------
   Used by admin/js/pages2.js (sendEmail) to actually deliver the
   message typed into "Send Email" — this is a static site with no
   mail server, so EmailJS's client-side API is used instead.

   1. Create a free account at https://www.emailjs.com
   2. Email Services → Add New Service (e.g. Gmail) → copy its
      Service ID.
   3. Email Templates → Create New Template with these variables
      used somewhere in the template body: {{to_email}} {{subject}}
      {{message}} → copy its Template ID.
   4. Account → General → copy your Public Key.
   5. Paste all three values below.
   6. See admin/EMAIL-SETUP.md in this project for the full guide.
--------------------------------------------------------- */
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

if (typeof emailjs !== "undefined" && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

function emailjsReady() {
  return typeof emailjs !== "undefined"
    && EMAILJS_SERVICE_ID !== "YOUR_SERVICE_ID"
    && EMAILJS_TEMPLATE_ID !== "YOUR_TEMPLATE_ID"
    && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY";
}
