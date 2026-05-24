function downloadAnalyticsReport(analytics, settings) {
  const workbook = XLSX.utils.book_new();

  addSheet(workbook, "Summary", createSummaryRows(analytics.summary, settings));
  addSheet(workbook, "School Comparison", createComparisonRows(analytics.schools, "School"));
  addSheet(workbook, "Subject Comparison", createComparisonRows(analytics.subjects, "Subject"));
  addSheet(workbook, "New Members", createMemberRows(analytics.newMembers));
  addSheet(workbook, "Not Renewed", createMemberRows(analytics.missingMembers));
  addSheet(workbook, "Changed Details", createChangedDetailRows(analytics.changedDetails));
  addSheet(workbook, "Data Issues", createIssueRows(analytics.dataIssues));

  XLSX.writeFile(workbook, createFileName(settings, "Full_Report"));
}

function addSheet(workbook, sheetName, rows) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
}

function createSummaryRows(summary, settings) {
  return [
    { Item: "District", Value: settings.district },
    { Item: "Report Title", Value: settings.title },
    { Item: `Members ${settings.oldYear}`, Value: summary.oldTotal },
    { Item: `Members ${settings.newYear}`, Value: summary.newTotal },
    { Item: "Difference", Value: summary.difference },
    { Item: "Growth Percentage", Value: `${summary.growth}%` },
    { Item: "Collection 2024-25", Value: summary.oldCollection },
    { Item: "Collection 2025-26", Value: summary.newCollection },
    { Item: "Collection Difference", Value: summary.newCollection - summary.oldCollection },
  ];
}

function createComparisonRows(rows, label) {
  return rows.map((row) => ({
    [label]: row.name,
    "2024-25": row.oldCount,
    "2025-26": row.newCount,
    Difference: row.difference,
    Status: row.status,
  }));
}

function createMemberRows(members) {
  return members.map((member, index) => ({
    "Sl No": index + 1,
    Name: member.name,
    School: member.school,
    Designation: member.designation,
    Subject: member.subject,
    Phone: member.phone,
    "Membership Fee": member.membershipFee,
    "Voice Magazine": member.voiceMagazine,
    "Working Fund": member.workingFund,
    "Special Fund": member.specialFund,
    Total: member.total,
  }));
}


function createIssueRows(issues) {
  return issues.map((issue, index) => ({
    "Sl No": index + 1,
    Issue: issue.issue,
    Year: issue.year,
    Name: issue.name,
    School: issue.school,
    Subject: issue.subject,
    Phone: issue.phone,
  }));
}


function createChangedDetailRows(changes) {
  return changes.map((change, index) => ({
    "Sl No": index + 1,
    "Change Type": change.changeType,
    Name: change.name,
    "2024-25 School": change.oldSchool,
    "2025-26 School": change.newSchool,
    "2024-25 Subject": change.oldSubject,
    "2025-26 Subject": change.newSubject,
    "2024-25 Phone": change.oldPhone,
    "2025-26 Phone": change.newPhone,
  }));
}


function downloadSingleSheetReport(sheetName, rows, fileName) {
  const workbook = XLSX.utils.book_new();
  addSheet(workbook, sheetName, rows);
  XLSX.writeFile(workbook, fileName);
}

function downloadSchoolComparisonReport(analytics, settings) {
  downloadSingleSheetReport(
    "School Comparison",
    createComparisonRows(analytics.schools, "School"),
    createFileName(settings, "School_Comparison")
  );
}

function downloadNewMembersReport(analytics, settings) {
  downloadSingleSheetReport(
    "New Members",
    createMemberRows(analytics.newMembers),
    createFileName(settings, "New_Members")
  );
}

function downloadMissingMembersReport(analytics, settings) {
  downloadSingleSheetReport(
    "Not Renewed",
    createMemberRows(analytics.missingMembers),
    createFileName(settings, "Not_Renewed_Members")
  );
}

function downloadChangedDetailsReport(analytics, settings) {
  downloadSingleSheetReport(
    "Changed Details",
    createChangedDetailRows(analytics.changedDetails),
    createFileName(settings, "Changed_Details")
  );
}

function downloadDataIssuesReport(analytics, settings) {
  downloadSingleSheetReport(
    "Data Issues",
    createIssueRows(analytics.dataIssues),
    createFileName(settings, "Data_Issues")
  );
}


function createFileName(settings, reportType) {
  const district = sanitizeReportPart(settings.district);
  const oldYear = sanitizeReportPart(settings.oldYear);
  const newYear = sanitizeReportPart(settings.newYear);

  return `AHSTA_${district}_${oldYear}_vs_${newYear}_${reportType}.xlsx`;
}

function sanitizeReportPart(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[\\/:*?"<>|]/g, "");
}
