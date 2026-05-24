function renderAnalytics(analytics) {
  renderSummary(analytics.summary);
  renderSchoolTable(analytics.schools);
  renderSubjectTable(analytics.subjects);
  renderMemberTable("newMembersBody", analytics.newMembers);
  renderMemberTable("missingMembersBody", analytics.missingMembers);
  renderDataIssues(analytics.dataIssues);
  renderCharts(analytics);

  showSections();
  setupSchoolSearch(analytics.schools);
}

function renderSummary(summary) {
  const cards = [
    ["Members 2024-25", summary.oldTotal],
    ["Members 2025-26", summary.newTotal],
    ["Difference", summary.difference],
    ["Growth", `${summary.growth}%`],
    ["Collection Difference", `₹${formatMoney(summary.newCollection - summary.oldCollection)}`],
  ];

  document.getElementById("summarySection").innerHTML = cards
    .map(([label, value]) => `
      <div class="card summary-card">
        <p>${label}</p>
        <h3>${value}</h3>
      </div>
    `)
    .join("");
}

function renderSchoolTable(rows) {
  const tableBody = document.getElementById("schoolTableBody");

  tableBody.innerHTML = rows.map((row) => `
    <tr>
      <td>${row.name}</td>
      <td>${row.oldCount}</td>
      <td>${row.newCount}</td>
      <td>${row.difference}</td>
      <td><span class="badge ${row.status.toLowerCase()}">${row.status}</span></td>
    </tr>
  `).join("");
}

function renderSubjectTable(rows) {
  document.getElementById("subjectTableBody").innerHTML = rows.map((row) => `
    <tr>
      <td>${row.name}</td>
      <td>${row.oldCount}</td>
      <td>${row.newCount}</td>
      <td>${row.difference}</td>
    </tr>
  `).join("");
}

function renderMemberTable(tableBodyId, members) {
  document.getElementById(tableBodyId).innerHTML = members.map((member) => `
    <tr>
      <td>${member.name}</td>
      <td>${member.school}</td>
      <td>${member.subject}</td>
      <td>${member.phone}</td>
    </tr>
  `).join("");
}

function setupSchoolSearch(schoolRows) {
  const searchInput = document.getElementById("schoolSearchInput");

  searchInput.addEventListener("input", () => {
    const searchText = normalizeText(searchInput.value);
    const filteredRows = schoolRows.filter((row) => row.name.includes(searchText));
    renderSchoolTable(filteredRows);
  });
}

function showSections() {
  [
    "reportTitleCard",
    "summarySection",
    "chartsSection",
    "schoolSection",
    "newMembersSection",
    "missingMembersSection",
    "dataIssuesSection",
    "subjectSection",
  ].forEach((id) => document.getElementById(id).classList.remove("hidden"));
}


function renderDataIssues(issues) {
  renderIssueSummary(issues);

  document.getElementById("dataIssuesBody").innerHTML = issues.map((issue) => `
    <tr>
      <td>${issue.issue}</td>
      <td>${issue.year}</td>
      <td>${issue.name}</td>
      <td>${issue.school}</td>
      <td>${issue.subject}</td>
      <td>${issue.phone}</td>
    </tr>
  `).join("");
}

function renderIssueSummary(issues) {
  const counts = issues.reduce((summary, issue) => {
    summary[issue.issue] = (summary[issue.issue] || 0) + 1;
    return summary;
  }, {});

  document.getElementById("issueSummary").innerHTML = Object.entries(counts)
    .map(([issue, count]) => `
      <div class="issue-card">
        <p>${issue}</p>
        <h3>${count}</h3>
      </div>
    `)
    .join("");
}
