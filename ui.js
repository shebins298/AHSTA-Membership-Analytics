function renderAnalytics(analytics) {
  renderSummary(analytics.summary, analytics.settings);
  renderSchoolTable(analytics.schools);
  renderSubjectTable(analytics.subjects);
  renderMemberTable("newMembersBody", analytics.newMembers);
  renderMemberTable("missingMembersBody", analytics.missingMembers);
  renderChangedDetails(analytics.changedDetails);
  renderDataIssues(analytics.dataIssues);
  renderCharts(analytics);

  showSections();
  setupSchoolFilters(analytics.schools);
  setupChangedDetailsFilter(analytics.changedDetails);
  setupMemberSchoolFilter("newMembersSchoolFilter", "newMembersBody", analytics.newMembers);
  setupMemberSchoolFilter("missingMembersSchoolFilter", "missingMembersBody", analytics.missingMembers);
}

function renderSummary(summary, settings) {
  const cards = [
    [`Members ${settings.oldYear}`, summary.oldTotal],
    [`Members ${settings.newYear}`, summary.newTotal],
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

function setupSchoolFilters(schoolRows) {
  const searchInput = document.getElementById("schoolSearchInput");
  const statusFilter = document.getElementById("schoolStatusFilter");

  function applyFilters() {
    const searchText = normalizeText(searchInput.value);
    const selectedStatus = statusFilter.value;

    const filteredRows = schoolRows.filter((row) => {
      const matchesSearch = row.name.includes(searchText);
      const matchesStatus =
        selectedStatus === "All" ||
        row.status === selectedStatus ||
        (selectedStatus === "ZeroNew" && row.newCount === 0);

      return matchesSearch && matchesStatus;
    });

    renderSchoolTable(filteredRows);
  }

  searchInput.addEventListener("input", applyFilters);
  statusFilter.addEventListener("change", applyFilters);
}

function showSections() {
  [
    "reportTitleCard",
    "separateDownloadsSection",
    "summarySection",
    "chartsSection",
    "schoolSection",
    "changedDetailsSection",
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


function renderChangedDetails(changes) {
  renderChangedDetailsSummary(changes);

  document.getElementById("changedDetailsBody").innerHTML = changes.map((change) => `
    <tr>
      <td>${change.changeType}</td>
      <td>${change.name}</td>
      <td>${change.oldSchool}</td>
      <td>${change.newSchool}</td>
      <td>${change.oldSubject}</td>
      <td>${change.newSubject}</td>
      <td>${change.oldPhone}</td>
      <td>${change.newPhone}</td>
    </tr>
  `).join("");
}

function renderChangedDetailsSummary(changes) {
  const counts = changes.reduce((summary, change) => {
    summary[change.changeType] = (summary[change.changeType] || 0) + 1;
    return summary;
  }, {});

  document.getElementById("changedDetailsSummary").innerHTML = Object.entries(counts)
    .map(([changeType, count]) => `
      <div class="issue-card">
        <p>${changeType}</p>
        <h3>${count}</h3>
      </div>
    `)
    .join("");
}


function setupChangedDetailsFilter(changes) {
  const filter = document.getElementById("changedTypeFilter");
  const changeTypes = [...new Set(changes.map((change) => change.changeType))].sort();

  filter.innerHTML = `
    <option value="All">All change types</option>
    ${changeTypes.map((type) => `<option value="${type}">${type}</option>`).join("")}
  `;

  filter.addEventListener("change", () => {
    const selectedType = filter.value;
    const filteredChanges = selectedType === "All"
      ? changes
      : changes.filter((change) => change.changeType === selectedType);

    renderChangedDetails(filteredChanges);
  });
}

function setupMemberSchoolFilter(filterId, tableBodyId, members) {
  const filter = document.getElementById(filterId);
  const schools = [...new Set(members.map((member) => member.school).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));

  filter.innerHTML = `
    <option value="All">All schools</option>
    ${schools.map((school) => `<option value="${school}">${school}</option>`).join("")}
  `;

  filter.addEventListener("change", () => {
    const selectedSchool = filter.value;
    const filteredMembers = selectedSchool === "All"
      ? members
      : members.filter((member) => member.school === selectedSchool);

    renderMemberTable(tableBodyId, filteredMembers);
  });
}
