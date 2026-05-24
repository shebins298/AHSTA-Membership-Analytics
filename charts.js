let chartInstances = [];

function renderCharts(analytics) {
  destroyExistingCharts();

  renderTotalMembersChart(analytics.summary);
  renderTopIncreaseChart(analytics.schools);
  renderTopDecreaseChart(analytics.schools);
  renderSubjectChart(analytics.subjects);
}

function destroyExistingCharts() {
  chartInstances.forEach((chart) => chart.destroy());
  chartInstances = [];
}

function createChart(canvasId, config) {
  const context = document.getElementById(canvasId);
  const chart = new Chart(context, config);
  chartInstances.push(chart);
}

function renderTotalMembersChart(summary) {
  createChart("totalMembersChart", {
    type: "bar",
    data: {
      labels: ["2024-25", "2025-26"],
      datasets: [{
        label: "Members",
        data: [summary.oldTotal, summary.newTotal],
      }],
    },
    options: getDefaultChartOptions(),
  });
}

function renderTopIncreaseChart(schools) {
  const rows = schools
    .filter((school) => school.difference > 0)
    .sort((a, b) => b.difference - a.difference)
    .slice(0, 10);

  createChart("topIncreaseChart", {
    type: "bar",
    data: {
      labels: rows.map((row) => shortenLabel(row.name)),
      datasets: [{
        label: "Increase",
        data: rows.map((row) => row.difference),
      }],
    },
    options: getDefaultChartOptions(),
  });
}

function renderTopDecreaseChart(schools) {
  const rows = schools
    .filter((school) => school.difference < 0)
    .sort((a, b) => a.difference - b.difference)
    .slice(0, 10);

  createChart("topDecreaseChart", {
    type: "bar",
    data: {
      labels: rows.map((row) => shortenLabel(row.name)),
      datasets: [{
        label: "Decrease",
        data: rows.map((row) => Math.abs(row.difference)),
      }],
    },
    options: getDefaultChartOptions(),
  });
}

function renderSubjectChart(subjects) {
  const rows = subjects
    .sort((a, b) => b.newCount - a.newCount)
    .slice(0, 10);

  createChart("subjectChart", {
    type: "bar",
    data: {
      labels: rows.map((row) => shortenLabel(row.name)),
      datasets: [{
        label: "Members 2025-26",
        data: rows.map((row) => row.newCount),
      }],
    },
    options: getDefaultChartOptions(),
  });
}

function getDefaultChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };
}

function shortenLabel(label) {
  return label.length > 24 ? `${label.slice(0, 24)}...` : label;
}
