const SPREADSHEET_ID = '1FUSEOjIIXRIg4n8987FuCIRHn3YvD1_zHbPLH4TufcI';
const SHEET_NAME = 'Registrations';

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function normalizePhone(value) {
  let digits = String(value || '').replace(/\D/g, '');

  if (digits.indexOf('880') === 0 && digits.length >= 13) {
    digits = '0' + digits.slice(3);
  } else if (digits.indexOf('88') === 0 && digits.length >= 13) {
    digits = '0' + digits.slice(2);
  } else if (digits.length === 10 && digits.indexOf('1') === 0) {
    digits = '0' + digits;
  }

  return digits;
}

function phoneCandidates(value) {
  const normalized = normalizePhone(value);
  const candidates = {};

  if (normalized) {
    candidates[normalized] = true;
  }

  if (/^01\d{9}$/.test(normalized)) {
    candidates[normalized.slice(1)] = true;
    candidates['88' + normalized] = true;
    candidates['+88' + normalized] = true;
  }

  return Object.keys(candidates);
}

function findDuplicate(sheet, phone, email) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  const phoneRange = sheet.getRange(2, 3, lastRow - 1, 1);
  const emailRange = sheet.getRange(2, 4, lastRow - 1, 1);

  const candidates = phoneCandidates(phone);
  for (let i = 0; i < candidates.length; i++) {
    const phoneMatch = phoneRange
      .createTextFinder(candidates[i])
      .matchEntireCell(true)
      .findNext();

    if (phoneMatch) {
      return { field: 'phone', row: phoneMatch.getRow() };
    }
  }

  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (normalizedEmail) {
    const emailMatch = emailRange
      .createTextFinder(normalizedEmail)
      .matchCase(false)
      .matchEntireCell(true)
      .findNext();

    if (emailMatch) {
      return { field: 'email', row: emailMatch.getRow() };
    }
  }

  return null;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  let locked = false;

  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    const name = String(data.name || '').trim().slice(0, 100);
    const rawPhone = String(data.phone || '').trim().slice(0, 40);
    const phone = normalizePhone(rawPhone);
    const email = String(data.email || '').trim().toLowerCase().slice(0, 150);
    const gender = String(data.gender || '').trim().toLowerCase();

    if (!name || !phone || !email) {
      throw new Error('Required fields are missing');
    }

    if (!['male', 'female'].includes(gender)) {
      throw new Error('Invalid gender');
    }

    locked = lock.tryLock(10000);
    if (!locked) {
      throw new Error('Registration is busy. Please try again.');
    }

    const sheet = SpreadsheetApp
      .openById(SPREADSHEET_ID)
      .getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error('Registrations sheet not found');
    }

    const duplicate = findDuplicate(sheet, phone, email);

    if (duplicate) {
      return jsonResponse({
        success: true,
        duplicate: true,
        matched: duplicate.field
      });
    }

    sheet.appendRow([
      new Date(),
      name,
      phone,
      email,
      gender,
      String(data.group || ''),
      String(data.utm_source || ''),
      String(data.utm_campaign || ''),
      String(data.utm_adset || ''),
      String(data.utm_content || '')
    ]);

    return jsonResponse({
      success: true,
      duplicate: false
    });

  } catch (error) {
    return jsonResponse({
      success: false,
      error: String(error)
    });

  } finally {
    if (locked) {
      lock.releaseLock();
    }
  }
}
