function readExcelFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("Please select both Excel files."));
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      resolve(rows.map(normalizeMemberRow));
    };

    reader.onerror = () => reject(new Error("Unable to read Excel file."));
    reader.readAsArrayBuffer(file);
  });
}

function normalizeMemberRow(row) {
  return {
    sl: getValue(row, ["Sl", "SL"]),
    name: getValue(row, ["Name", "NAME", "Teacher Name"]),
    school: getValue(row, ["School", "SCHOOL", "School Name"]),
    designation: getValue(row, ["Designation", "DESIGNATION"]),
    subject: getValue(row, ["Subject", "SUBJECT"]),
    phone: getValue(row, ["Phone", "PHONE", "Mobile", "WHATSAPP NO"]),
    membershipFee: Number(getValue(row, ["Membership Fee"]) || 0),
    voiceMagazine: Number(getValue(row, ["Voice Magazine"]) || 0),
    workingFund: Number(getValue(row, ["Working Fund"]) || 0),
    specialFund: Number(getValue(row, ["Special Fund"]) || 0),
    total: Number(getValue(row, ["Total", "TOTAL"]) || 0),
  };
}
