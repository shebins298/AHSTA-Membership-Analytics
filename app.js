const oldFileInput = document.getElementById("oldFileInput");
const newFileInput = document.getElementById("newFileInput");
const analyzeButton = document.getElementById("analyzeButton");
const downloadReportButton = document.getElementById("downloadReportButton");
const printReportButton = document.getElementById("printReportButton");

let currentAnalytics = null;

analyzeButton.addEventListener("click", analyzeFiles);

downloadReportButton.addEventListener("click", () => {
  if (!currentAnalytics) {
    alert("Please analyze files first.");
    return;
  }

  downloadAnalyticsReport(currentAnalytics);
});

printReportButton.addEventListener("click", () => {
  window.print();
});

async function analyzeFiles() {
  try {
    analyzeButton.textContent = "Analyzing...";
    analyzeButton.disabled = true;

    const oldMembers = await readExcelFile(oldFileInput.files[0]);
    const newMembers = await readExcelFile(newFileInput.files[0]);

    currentAnalytics = createAnalytics(oldMembers, newMembers);
    renderAnalytics(currentAnalytics);
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
