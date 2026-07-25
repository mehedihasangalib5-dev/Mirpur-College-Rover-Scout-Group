# Email Sender Setup (EmailJS)

The admin panel's **Send Email** page (Notices/News → Send Email) needed a
real way to deliver mail. Since this whole project is a static site with no
backend server, it uses **EmailJS** — a free service that lets plain
client-side JavaScript send an email without a mail server, an API key
secret, or a build step.

## One-time setup (~5 minutes)

1. Create a free account at https://www.emailjs.com
2. **Email Services** → **Add New Service** → connect a Gmail/Outlook/SMTP
   account of your choice → copy the **Service ID** it gives you.
3. **Email Templates** → **Create New Template**. Use these variable names
   somewhere in the template (subject line and body), so the admin panel's
   form fields land in the right place:
   - `{{to_email}}` — the recipient the admin typed in
   - `{{subject}}` — the subject the admin typed in
   - `{{message}}` — the message body the admin typed in

   Copy the **Template ID**.
4. **Account** (top-right) → **General** → copy your **Public Key**.
5. Open `admin/js/emailjs-config.js` in this project and paste your three
   values in place of `YOUR_SERVICE_ID`, `YOUR_TEMPLATE_ID`, and
   `YOUR_PUBLIC_KEY`.
6. Reload the admin panel. The Send Email page will now actually deliver
   messages, and every send is recorded in the Activity Log.

## Free tier limits

EmailJS's free plan allows a limited number of emails per month (check their
pricing page for the current number). For a scout group's occasional notices
this is normally enough; upgrade on EmailJS's site if you outgrow it.

## Troubleshooting

- **"Email service isn't configured yet"** — one or more of the three values
  in `admin/js/emailjs-config.js` is still the `YOUR_...` placeholder.
- **Send fails after configuring** — double-check the Service ID/Template ID
  are copied exactly, and that the connected email account in EmailJS hasn't
  been disconnected or hit its sending limit.
