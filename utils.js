function cleanText(value) {
  return String(value ?? "").trim();
}

function normalizeText(value) {
  return cleanText(value).toUpperCase().replace(/\s+/g, " ");
}

function normalizePhone(value) {
  return cleanText(value).replace(/\D/g, "");
}

function getValue(row, possibleKeys) {
  for (const key of possibleKeys) {
    if (row[key] !== undefined) {
      return cleanText(row[key]);
    }
  }

  return "";
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString("en-IN");
}
