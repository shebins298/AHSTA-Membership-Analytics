const oldFileInput = document.getElementById("oldFileInput");
const newFileInput = document.getElementById("newFileInput");
const analyzeButton = document.getElementById("analyzeButton");
const downloadReportButton = document.getElementById("downloadReportButton");
const printReportButton = document.getElementById("printReportButton");

let currentAnalytics = null;
let currentReportSettings = getReportSettings();

analyzeButton.addEventListener("click", analyzeFiles);

downloadReportButton.addEventListener("click", () => {
  if (!currentAnalytics) {
    alert("Please analyze files first.");
    return;
  }

  downloadAnalyticsReport(currentAnalytics, currentReportSettings);
});

printReportButton.addEventListener("click", () => {
  window.print();
});

document.querySelectorAll(".separate-download-btn").forEach((button) => {
  button.addEventListener("click", () => {
    if (!currentAnalytics) {
      alert("Please analyze files first.");
      return;
    }

    downloadSeparateReport(button.dataset.report);
  });
});

async function analyzeFiles() {
  try {
    analyzeButton.textContent = "Analyzing...";
    analyzeButton.disabled = true;

    const oldMembers = await readExcelFile(oldFileInput.files[0]);
    const newMembers = await readExcelFile(newFileInput.files[0]);

    currentReportSettings = getReportSettings();
    currentAnalytics = createAnalytics(oldMembers, newMembers, currentReportSettings);
    renderAnalytics(currentAnalytics);
    updateReportHeader(currentReportSettings);
    downloadReportButton.disabled = false;
    printReportButton.disabled = false;
    updateReportDate();
  } catch (error) {
    alert(error.message);
  } finally {
    analyzeButton.textContent = "Analyze Files";
    analyzeButton.disabled = false;
  }
}


function updateReportDate() {
  const reportGeneratedDate = document.getElementById("reportGeneratedDate");
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  reportGeneratedDate.textContent = `Generated on: ${today}`;
}


function downloadSeparateReport(reportType) {
  const reportActions = {
    school: downloadSchoolComparisonReport,
    new: downloadNewMembersReport,
    missing: downloadMissingMembersReport,
    changed: downloadChangedDetailsReport,
    issues: downloadDataIssuesReport,
  };

  reportActions[reportType](currentAnalytics, currentReportSettings);
}


function getReportSettings() {
  return {
    district: document.getElementById("districtInput")?.value.trim() || "ERNAKULAM",
    title: document.getElementById("reportTitleInput")?.value.trim() || "AHSTA Membership Analytics Report",
    oldYear: document.getElementById("oldYearInput")?.value.trim() || "2024-25",
    newYear: document.getElementById("newYearInput")?.value.trim() || "2025-26",
  };
}

function updateReportHeader(settings) {
  document.getElementById("reportTitleText").textContent = settings.title;
  document.getElementById("reportSubtitleText").textContent =
    `Comparison Report: ${settings.oldYear} and ${settings.newYear}`;
  document.getElementById("reportDistrictText").textContent = `District: ${settings.district}`;
}
