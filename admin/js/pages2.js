/* ---------------------------------------------------------
   PAGES2.JS — remaining admin pages (email, push, export,
   audit log, users, permissions, roles, settings) —
   continues js/pages.js
--------------------------------------------------------- */

/* sendEmail() used to just flip a "sent" flag without reading the form or
   contacting anything — this is a static site with no mail server, so the
   fix wires the real field values into EmailJS's client-side send API. See
   admin/js/emailjs-config.js and admin/EMAIL-SETUP.md for the one-time setup. */
function sendEmail() {
  const lang = state.lang;
  const recipientEl = document.getElementById("emailRecipient");
  const subjectEl = document.getElementById("emailSubject");
  const messageEl = document.getElementById("emailMessage");
  const recipient = (recipientEl.value || "").trim();
  const subject = (subjectEl.value || "").trim();
  const message = (messageEl.value || "").trim();

  db.ui.emailSent = false;
  db.ui.emailError = "";

  if (!recipient || !subject || !message) {
    db.ui.emailError = lang === "bn"
      ? "প্রাপকের ইমেইল, বিষয় ও বার্তা — সবগুলো পূরণ করুন।"
      : "Please fill in the recipient, subject, and message.";
    render();
    return;
  }

  if (!emailjsReady()) {
    db.ui.emailError = lang === "bn"
      ? "ইমেইল সার্ভিস এখনও কনফিগার করা হয়নি। admin/EMAIL-SETUP.md দেখে js/emailjs-config.js এ EmailJS তথ্য বসান।"
      : "Email service isn't configured yet. See admin/EMAIL-SETUP.md and add your EmailJS details to js/emailjs-config.js.";
    render();
    return;
  }

  db.ui.emailSending = true;
  render();

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { to_email: recipient, subject, message })
    .then(() => {
      db.ui.emailSending = false;
      db.ui.emailSent = true;
      recipientEl.value = ""; subjectEl.value = ""; messageEl.value = "";
      logActivity("email_sent", recipient, subject);
      render();
    })
    .catch((err) => {
      console.error(err);
      db.ui.emailSending = false;
      db.ui.emailError = lang === "bn" ? "ইমেইল পাঠানো যায়নি। আবার চেষ্টা করুন।" : "Could not send the email. Please try again.";
      render();
    });
}

function pageEmail() {
  const lang = state.lang;
  const sending = db.ui.emailSending;
  return `
    <div>
      ${pageHeader(T.m_email)}
      <div class="card p-5 max-w-lg flex flex-col gap-3">
        <input id="emailRecipient" class="input-field" placeholder="${L(T.emailRecipientPh, lang)}" ${sending ? "disabled" : ""} />
        <input id="emailSubject" class="input-field" placeholder="${L(T.emailSubjectPh, lang)}" ${sending ? "disabled" : ""} />
        <textarea id="emailMessage" class="input-field" rows="4" placeholder="${L(T.emailMessagePh, lang)}" ${sending ? "disabled" : ""}></textarea>
        <button class="btn-primary flex items-center gap-2 w-fit" ${sending ? "disabled" : ""} onclick="sendEmail()">${icon("send", 'style="width:16px;height:16px"')} ${sending ? L(T.sending, lang) : L(T.send, lang)}</button>
        ${db.ui.emailSent ? `<div class="text-ok text-sm flex items-center gap-2">${icon("check", 'style="width:14px;height:14px"')} ${L(T.emailSentMsg, lang)}</div>` : ""}
        ${db.ui.emailError ? `<div class="text-danger text-sm flex items-center gap-2">${icon("alert-triangle", 'style="width:14px;height:14px"')} ${db.ui.emailError}</div>` : ""}
      </div>
    </div>`;
}

function togglePushSubscribed() { db.pushSubscribed = !db.pushSubscribed; render(); }
function setPushRecipient(v) { db.ui.pushRecipient = v; }
function setPushTitle(v) { db.ui.pushTitle = v; }
function setPushMessage(v) { db.ui.pushMessage = v; }
function markNotificationRead(id) { db.notifications = db.notifications.map(x => x.id === id ? { ...x, read: true } : x); render(); }

function sendPush() {
  const lang = state.lang;
  if (!db.ui.pushTitle.trim()) return;
  const deviceCount = db.ui.pushRecipient === "all" ? db.members.length + 6 : 1;
  db.ui.pushSentInfo = deviceCount;
  logActivity("push_sent", db.ui.pushTitle, `recipient=${db.ui.pushRecipient}`);
  db.notifications.unshift({ id: Date.now(), title: db.ui.pushTitle, body: db.ui.pushMessage, read: false, time: L(T.today, lang) });
  db.ui.pushTitle = ""; db.ui.pushMessage = "";
  render();
  setTimeout(() => { db.ui.pushSentInfo = null; render(); }, 2500);
}

function pagePushSettings() {
  const lang = state.lang;
  return `
    <div>
      ${pageHeader(T.m_pushsettings, T.pushSub)}

      <div class="card p-5 max-w-lg mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <div class="bg-forest rounded-lg p-2.5 shrink-0">${icon("bell-ring", 'style="width:18px;height:18px" class="text-cream"')}</div>
          <div class="min-w-0">
            <div class="text-forest font-medium truncate">${L(T.pushThisDevice, lang)}</div>
            <div class="text-xs ${db.pushSubscribed ? "text-ok" : "text-rope"}">${db.pushSubscribed ? L(T.pushSubscribed, lang) : L(T.pushUnsubscribed, lang)}</div>
          </div>
        </div>
        <button onclick="togglePushSubscribed()" class="${db.pushSubscribed ? "btn-danger" : "btn-primary"} text-sm w-full sm:w-auto">${db.pushSubscribed ? L(T.pushUnsubscribeBtn, lang) : L(T.pushSubscribeBtn, lang)}</button>
      </div>

      <div class="card p-5 max-w-lg mb-6">
        <div class="ap-eyebrow text-xs text-rope mb-3">${L(T.pushCompose, lang)}</div>
        <div class="flex flex-col gap-3">
          <div>
            <label class="text-sm text-rope block mb-1">${L(T.pushRecipient, lang)}</label>
            <select class="input-field" onchange="setPushRecipient(this.value)">
              <option value="all" ${db.ui.pushRecipient === "all" ? "selected" : ""}>${L(T.pushRecipientAll, lang)}</option>
              ${db.members.map(m => `<option value="${m.id}" ${db.ui.pushRecipient === m.id ? "selected" : ""}>${L(m.name, lang)}</option>`).join("")}
            </select>
          </div>
          <input class="input-field" placeholder="${L(T.pushTitleLabel, lang)}" value="${db.ui.pushTitle}" oninput="setPushTitle(this.value)" />
          <textarea class="input-field" rows="3" placeholder="${L(T.pushMessageLabel, lang)}" oninput="setPushMessage(this.value)">${db.ui.pushMessage}</textarea>
          <button class="btn-primary flex items-center gap-2 w-fit" ${db.ui.pushTitle.trim() ? "" : "disabled"} onclick="sendPush()">${icon("send", 'style="width:16px;height:16px"')} ${L(T.send, lang)}</button>
          ${db.ui.pushSentInfo ? `<div class="text-ok text-sm flex items-center gap-2">${icon("check-circle-2", 'style="width:14px;height:14px"')} ${L(T.pushSent, lang)} ${db.ui.pushSentInfo} ${L(T.pushDevices, lang)}</div>` : ""}
        </div>
      </div>

      ${pageHeader(T.pushRecent)}
      <div class="flex flex-col gap-2 max-w-lg">
        ${db.notifications.map(n => `
          <div class="card p-4 flex items-start justify-between gap-3">
            <div>
              <div class="text-forest font-medium text-sm">${n.title}</div>
              ${n.body ? `<div class="text-rope text-xs mt-0.5">${n.body}</div>` : ""}
              <div class="text-rope text-xs mt-1 opacity-70">${n.time}</div>
            </div>
            <div class="flex flex-col items-end gap-2">
              <span class="${n.read ? "tag-info" : "tag-ok"}">${n.read ? L(T.read, lang) : L(T.unread, lang)}</span>
              ${!n.read ? `<button class="text-xs text-ember" style="background:none;border:none;text-decoration:underline;cursor:pointer" onclick="markNotificationRead(${n.id})">${L(T.markRead, lang)}</button>` : ""}
            </div>
          </div>`).join("")}
      </div>
    </div>`;
}

function pageExportTools() {
  const lang = state.lang;
  return `
    <div>
      ${pageHeader(T.m_exporttools)}
      <div class="grid sm:grid-cols-2 gap-4 max-w-lg">
        <button onclick="exportToExcel()" class="card p-5 flex items-center gap-3 text-forest" style="border:1px solid var(--surface-border);cursor:pointer">${icon("file-spreadsheet", 'class="text-ember"')} ${L(T.exportExcel, lang)}</button>
        <button onclick="exportBackup()" class="card p-5 flex items-center gap-3 text-forest" style="border:1px solid var(--surface-border);cursor:pointer">${icon("database", 'class="text-ember"')} ${L(T.exportBackup, lang)}</button>
      </div>
    </div>`;
}

/* ---------------- Export / Backup ---------------- */

function backupTimestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}`;
}

function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* Turns a Firestore-style row (which may contain {bn,en} label objects or
   nested arrays/objects) into a flat, spreadsheet-friendly row. */
function flattenForExcel(obj) {
  const out = {};
  Object.keys(obj || {}).forEach((k) => {
    const v = obj[k];
    if (v && typeof v === "object" && !Array.isArray(v) && (v.bn !== undefined || v.en !== undefined)) {
      out[k] = L(v, state.lang);
    } else if (v && typeof v === "object") {
      out[k] = JSON.stringify(v);
    } else {
      out[k] = v;
    }
  });
  return out;
}

function exportToExcel() {
  if (typeof XLSX === "undefined") {
    alert(state.lang === "bn"
      ? "এক্সেল লাইব্রেরি লোড হয়নি — ইন্টারনেট সংযোগ পরীক্ষা করুন।"
      : "Excel library failed to load — please check your internet connection.");
    return;
  }
  try {
    const wb = XLSX.utils.book_new();
    const sheets = [
      { name: "Members", rows: db.members },
      { name: "Applications", rows: db.applications },
      { name: "Events", rows: db.events },
      { name: "Gallery", rows: db.gallery },
      { name: "Notices", rows: db.notices },
      { name: "Users", rows: [
          ...db.invitedSuperAdmins.map((u) => ({ ...u, role: "superadmin" })),
          ...db.invitedAdmins.map((u) => ({ ...u, role: "leader" })),
          ...db.invitedEditors.map((u) => ({ ...u, role: "editor" })),
        ] },
    ];
    sheets.forEach(({ name, rows }) => {
      const cleanRows = (rows && rows.length ? rows : [{}]).map(flattenForExcel);
      const ws = XLSX.utils.json_to_sheet(cleanRows);
      XLSX.utils.book_append_sheet(wb, ws, name);
    });
    XLSX.writeFile(wb, `mirpur-scout-export-${backupTimestamp()}.xlsx`);
    logActivity("data_exported_excel", (state.session && state.session.identifier) || "—",
      `${db.members.length} members, ${db.applications.length} applications, ${db.events.length} events`);
  } catch (err) {
    console.error(err);
    alert(state.lang === "bn" ? "এক্সেল এক্সপোর্ট ব্যর্থ হয়েছে।" : "Excel export failed. Please try again.");
  }
}

function exportBackup() {
  try {
    const backup = {
      exportedAt: new Date().toISOString(),
      exportedBy: (state.session && state.session.identifier) || "—",
      members: db.members,
      applications: db.applications,
      events: db.events,
      gallery: db.gallery,
      notices: db.notices,
      settings: db.settings,
      invitedSuperAdmins: db.invitedSuperAdmins,
      invitedAdmins: db.invitedAdmins,
      invitedEditors: db.invitedEditors,
      auditLog: db.auditLog,
    };
    downloadFile(`mirpur-scout-backup-${backupTimestamp()}.json`, JSON.stringify(backup, null, 2), "application/json");
    logActivity("database_backup_downloaded", (state.session && state.session.identifier) || "—",
      `${db.members.length} members, ${db.events.length} events, ${db.notices.length} notices`);
  } catch (err) {
    console.error(err);
    alert(state.lang === "bn" ? "ব্যাকআপ তৈরি করা যায়নি।" : "Could not create the backup. Please try again.");
  }
}

function setAuditFilter(v) { db.auditFilter = v; db.auditPage = 0; render(); }
function toggleAuditDetails(id) { db.ui.auditOpenDetails = db.ui.auditOpenDetails === id ? null : id; render(); }
function auditPrevPage() { db.auditPage = Math.max(0, db.auditPage - 1); render(); }
function auditNextPage(totalFiltered, pageSize) { if ((db.auditPage + 1) * pageSize < totalFiltered) { db.auditPage++; render(); } }

function pageAuditLog() {
  const lang = state.lang;
  const pageSize = 8;
  const log = db.auditLog || [];
  const actions = Array.from(new Set(log.map(l => l.action)));
  const filtered = db.auditFilter ? log.filter(l => l.action === db.auditFilter) : log;
  const pageRows = filtered.slice(db.auditPage * pageSize, db.auditPage * pageSize + pageSize);
  return `
    <div>
      ${pageHeader(T.m_auditlog, T.auditSub)}
      ${!fbContentReady() ? `<div class="card p-4 mb-4 text-rope text-sm flex items-center gap-2">${icon("alert-triangle", 'style="width:14px;height:14px" class="text-ember flex-shrink-0"')}${L(T.auditNeedsFirebase, lang)}</div>` : ""}
      <div class="flex items-center gap-3 mb-4">
        ${icon("shield-alert", 'style="width:16px;height:16px" class="text-ember"')}
        <select class="input-field max-w-xs" onchange="setAuditFilter(this.value)">
          <option value="" ${db.auditFilter === "" ? "selected" : ""}>${L(T.all, lang)} — ${L(T.filterByAction, lang)}</option>
          ${actions.map(a => `<option value="${a}" ${db.auditFilter === a ? "selected" : ""}>${a}</option>`).join("")}
        </select>
      </div>

      ${pageRows.length === 0 ? `<div class="text-rope text-sm">${L(T.auditEmpty, lang)}</div>` : `
        <div class="card overflow-hidden overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-canvas text-forest"><tr>
              <th class="text-left p-3">${L(T.colTime, lang)}</th>
              <th class="text-left p-3">${L(T.colUser, lang)}</th>
              <th class="text-left p-3">${L(T.colActionCol, lang)}</th>
              <th class="text-left p-3">${L(T.colTarget, lang)}</th>
              <th class="text-left p-3">${L(T.colDetails, lang)}</th>
            </tr></thead>
            <tbody>
              ${pageRows.map(l => `
                <tr class="border-t border-rope border-opacity-20 align-top">
                  <td class="p-3 text-rope whitespace-nowrap">${l.time}</td>
                  <td class="p-3 text-forest">${l.user}</td>
                  <td class="p-3"><span class="tag-${ACTION_TAG[l.action] || "info"}">${l.action}</span></td>
                  <td class="p-3 text-rope">${l.target}</td>
                  <td class="p-3">
                    ${l.details ? `
                    <button class="text-ember text-xs flex items-center gap-1" style="background:none;border:none;text-decoration:underline;cursor:pointer" onclick="toggleAuditDetails('${l.id}')">${icon("eye", 'style="width:12px;height:12px"')} ${L(T.view, lang)}</button>
                    ${db.ui.auditOpenDetails === l.id ? `<pre class="text-xs bg-canvas rounded p-2 mt-1 max-w-xs overflow-x-auto">${l.details}</pre>` : ""}` : ""}
                  </td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>`}

      <div class="flex items-center gap-2 mt-4">
        <button class="btn-outline text-xs" ${db.auditPage === 0 ? "disabled" : ""} onclick="auditPrevPage()">${L(T.prev, lang)}</button>
        <button class="btn-outline text-xs" ${(db.auditPage + 1) * pageSize >= filtered.length ? "disabled" : ""} onclick="auditNextPage(${filtered.length}, ${pageSize})">${L(T.next, lang)}</button>
      </div>
    </div>`;
}

function invitedTable(list, revokeFn) {
  const lang = state.lang;
  if (!list.length) return "";
  return `
    <div class="card overflow-hidden overflow-x-auto mt-4">
      <table class="w-full text-sm">
        <thead class="bg-canvas text-forest"><tr>
          <th class="text-left p-3">${L(T.colEmail, lang)}</th>
          <th class="text-left p-3">${L(T.colAddedBy, lang)}</th>
          <th class="text-left p-3">${L(T.colAction, lang)}</th>
        </tr></thead>
        <tbody>
          ${list.map(u => `
            <tr class="border-t border-rope border-opacity-20">
              <td class="p-3 text-forest">${u.email} <span class="tag-ok text-[10px] ml-1">${L(T.unlocked, lang)}</span></td>
              <td class="p-3 text-rope">${u.addedBy}</td>
              <td class="p-3"><button class="btn-outline text-xs flex items-center gap-1" onclick="${revokeFn}('${u.email}')">${icon("lock", 'style="width:12px;height:12px"')}${L(T.revoke, lang)}</button></td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

function inviteSuperAdminBlock() {
  const lang = state.lang;
  return `
    <div class="card p-5">
      <div class="flex items-center gap-2 mb-1 text-forest font-semibold">${icon("shield-check", 'style="width:17px;height:17px" class="text-ember"')}${L(T.inviteSuperAdminTitle, lang)}</div>
      <p class="text-rope text-xs mb-3">${L(T.inviteSuperAdminSub, lang)}</p>
      <div class="flex gap-2 flex-wrap">
        <input id="inviteSuperAdminInput" class="input-field flex-1 min-w-[220px]" placeholder="${L(T.inviteEmailPh, lang)}" value="${db.inviteSuperAdminInput}" oninput="db.inviteSuperAdminInput=this.value" />
        <button class="btn-primary text-sm" onclick="addInvitedSuperAdmin()">${L(T.inviteBtn, lang)}</button>
      </div>
      ${db.inviteSuperAdminError ? `<div class="text-danger text-xs mt-2">${db.inviteSuperAdminError}</div>` : ""}
      ${db.invitedSuperAdmins.length ? invitedTable(db.invitedSuperAdmins, "revokeInvitedSuperAdmin") : `<p class="text-rope text-xs mt-3">${L(T.noInvitedSuperAdmins, lang)}</p>`}
    </div>`;
}

function inviteAdminBlock() {
  const lang = state.lang;
  return `
    <div class="card p-5">
      <div class="flex items-center gap-2 mb-1 text-forest font-semibold">${icon("user-plus", 'style="width:17px;height:17px" class="text-ember"')}${L(T.inviteAdminTitle, lang)}</div>
      <p class="text-rope text-xs mb-3">${L(T.inviteAdminSub, lang)}</p>
      <div class="flex gap-2 flex-wrap">
        <input id="inviteAdminInput" class="input-field flex-1 min-w-[220px]" placeholder="${L(T.inviteEmailPh, lang)}" value="${db.inviteAdminInput}" oninput="db.inviteAdminInput=this.value" />
        <button class="btn-primary text-sm" onclick="addInvitedAdmin()">${L(T.inviteBtn, lang)}</button>
      </div>
      ${db.inviteAdminError ? `<div class="text-danger text-xs mt-2">${db.inviteAdminError}</div>` : ""}
      ${db.invitedAdmins.length ? invitedTable(db.invitedAdmins, "revokeInvitedAdmin") : `<p class="text-rope text-xs mt-3">${L(T.noInvitedAdmins, lang)}</p>`}
    </div>`;
}

function inviteEditorBlock() {
  const lang = state.lang;
  return `
    <div class="card p-5">
      <div class="flex items-center gap-2 mb-1 text-forest font-semibold">${icon("user-plus", 'style="width:17px;height:17px" class="text-ember"')}${L(T.inviteEditorTitle, lang)}</div>
      <p class="text-rope text-xs mb-3">${L(T.inviteEditorSub, lang)}</p>
      <div class="flex gap-2 flex-wrap">
        <input id="inviteEditorInput" class="input-field flex-1 min-w-[220px]" placeholder="${L(T.inviteEmailPh, lang)}" value="${db.inviteEditorInput}" oninput="db.inviteEditorInput=this.value" />
        <button class="btn-primary text-sm" onclick="addInvitedEditor()">${L(T.inviteBtn, lang)}</button>
      </div>
      ${db.inviteEditorError ? `<div class="text-danger text-xs mt-2">${db.inviteEditorError}</div>` : ""}
      ${db.invitedEditors.length ? invitedTable(db.invitedEditors, "revokeInvitedEditor") : `<p class="text-rope text-xs mt-3">${L(T.noInvitedEditors, lang)}</p>`}
    </div>`;
}

function pageUsers(role) {
  return `
    <div>
      ${pageHeader(T.m_users, T.usersSub)}
      <div class="flex flex-col gap-5 max-w-2xl">
        ${role === "superadmin" ? inviteSuperAdminBlock() : ""}
        ${role === "superadmin" ? inviteAdminBlock() : ""}
        ${role === "superadmin" || role === "leader" ? inviteEditorBlock() : ""}
      </div>
    </div>`;
}

function setSettingsSiteName(v) { db.ui.settingsSiteName = v; }
function setSettingsContactEmail(v) { db.ui.settingsContactEmail = v; }

function saveSettings() {
  const siteName = (db.ui.settingsSiteName || "").trim();
  const contactEmail = (db.ui.settingsContactEmail || "").trim();
  if (!siteName || !contactEmail) return;
  const payload = { siteName, contactEmail };

  if (fbContentReady()) {
    db.ui.settingsSaving = true; render();
    fbSaveSettings(payload)
      .then(() => logActivity("settings_updated", "general info", `siteName="${siteName}", contactEmail="${contactEmail}"`))
      .then(() => {
        db.ui.settingsSaving = false; db.ui.settingsSaved = true; render();
        setTimeout(() => { db.ui.settingsSaved = false; render(); }, 2500);
      })
      .catch((e) => { db.ui.settingsSaving = false; render(); contentErr(e); });
  } else {
    db.settings = { ...db.settings, ...payload };
    db.ui.settingsSaved = true; render();
    setTimeout(() => { db.ui.settingsSaved = false; render(); }, 2500);
  }
}

function triggerLogoUpload() { document.getElementById("logoFileInput").click(); }

function handleLogoFileSelected(event) {
  const file = event.target.files && event.target.files[0];
  event.target.value = "";
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    alert(state.lang === "bn" ? "শুধু ছবি ফাইল আপলোড করা যাবে।" : "Only image files can be uploaded.");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = reader.result;
    if (fbContentReady()) {
      if (dataUrl.length > 900000) {
        alert(state.lang === "bn"
          ? "ছবিটি অনেক বড় (Firestore-এর ১MB সীমার কাছাকাছি)। আরেকটু ছোট/কম রেজ্যুলেশনের ছবি দিয়ে আবার চেষ্টা করুন।"
          : "This image is too large for Firestore's ~1MB document limit. Please try a smaller/lower-resolution photo.");
        return;
      }
      db.ui.settingsLogoUploading = true; render();
      fbSaveSettings({ logoUrl: dataUrl })
        .then(() => logActivity("settings_updated", "logo/banner", "logo image changed"))
        .then(() => { db.ui.settingsLogoUploading = false; render(); })
        .catch((e) => { db.ui.settingsLogoUploading = false; render(); contentErr(e); });
    } else {
      db.settings.logoUrl = dataUrl; render();
    }
  };
  reader.onerror = () => {
    alert(state.lang === "bn" ? "ছবি পড়তে সমস্যা হয়েছে, আবার চেষ্টা করো।" : "Couldn't read that image, please try again.");
  };
  reader.readAsDataURL(file);
}

function pageSettings() {
  const lang = state.lang;
  return `
    <div>
      ${pageHeader(T.m_settings)}
      <div class="grid md:grid-cols-2 gap-6">
        <div class="card p-5">
          <div class="flex items-center gap-2 mb-3 text-forest font-semibold">${icon("image-plus", 'style="width:18px;height:18px" class="text-ember"')} ${L(T.logoChange, lang)}</div>
          ${db.settings.logoUrl ? `<img src="${db.settings.logoUrl}" class="w-16 h-16 rounded-lg object-cover mb-3" alt="logo" />` : ""}
          <input type="file" id="logoFileInput" accept="image/*" style="display:none" onchange="handleLogoFileSelected(event)" />
          <button class="btn-primary text-sm" ${db.ui.settingsLogoUploading ? "disabled" : ""} onclick="triggerLogoUpload()">${db.ui.settingsLogoUploading ? L(T.saving, lang) : L(T.upload, lang)}</button>
        </div>
        <div class="card p-5 md:col-span-2">
          <div class="flex items-center gap-2 mb-3 text-forest font-semibold">${icon("settings", 'style="width:18px;height:18px" class="text-ember"')} ${L(T.generalInfo, lang)}</div>
          <div class="grid sm:grid-cols-2 gap-3">
            <input class="input-field" placeholder="${L(T.siteNamePh, lang)}" value="${db.ui.settingsSiteName}" oninput="setSettingsSiteName(this.value)" />
            <input class="input-field" placeholder="${L(T.contactEmailPh, lang)}" value="${db.ui.settingsContactEmail}" oninput="setSettingsContactEmail(this.value)" />
          </div>
          <div class="flex items-center gap-3 mt-4">
            <button class="btn-primary text-sm flex items-center gap-2" ${db.ui.settingsSaving ? "disabled" : ""} onclick="saveSettings()">${icon("save", 'style="width:14px;height:14px"')} ${db.ui.settingsSaving ? L(T.saving, lang) : L(T.save, lang)}</button>
            ${db.ui.settingsSaved ? `<span class="text-ok text-sm flex items-center gap-1">${icon("check-circle-2", 'style="width:14px;height:14px"')} ${L(T.settingsSaved, lang)}</span>` : ""}
          </div>
          ${!fbContentReady() ? `<p class="text-rope text-xs mt-3">${L(T.settingsLocalOnly, lang)}</p>` : ""}
        </div>
      </div>
    </div>`;
}

const PAGE_RENDERERS = {
  dashboard: pageDashboard, analytics: pageAnalytics, members: pageMembers, registrations: pageRegistrations,
  events: pageEvents, gallery: pageGallery, notices: pageNotices,
  email: pageEmail, pushsettings: pagePushSettings, exporttools: pageExportTools,
  auditlog: pageAuditLog, users: pageUsers, settings: pageSettings,
};

render();
