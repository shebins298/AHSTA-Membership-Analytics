function downloadAnalyticsReport(analytics) {
  const workbook = XLSX.utils.book_new();

  addSheet(workbook, "Summary", createSummaryRows(analytics.summary));
  addSheet(workbook, "School Comparison", createComparisonRows(analytics.schools, "School"));
  addSheet(workbook, "Subject Comparison", createComparisonRows(analytics.subjects, "Subject"));
  addSheet(workbook, "New Members", createMemberRows(analytics.newMembers));
  addSheet(workbook, "Not Renewed", createMemberRows(analytics.missingMembers));
  addSheet(workbook, "Data Issues", createIssueRows(analytics.dataIssues));

  XLSX.writeFile(workbook, "AHSTA_Membership_Analytics_Report.xlsx");
}

function addSheet(workbook, sheetName, rows) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
}

function createSummaryRows(summary) {
  return [
    { Item: "Members 2024-25", Value: summary.oldTotal },
    { Item: "Members 2025-26", Value: summary.newTotal },
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
