function createAnalytics(oldMembers, newMembers) {
  const oldValidMembers = oldMembers.filter((member) => member.name && member.school);
  const newValidMembers = newMembers.filter((member) => member.name && member.school);

  return {
    summary: createSummary(oldValidMembers, newValidMembers),
    schools: compareByField(oldValidMembers, newValidMembers, "school"),
    subjects: compareByField(oldValidMembers, newValidMembers, "subject"),
    newMembers: findNewMembers(oldValidMembers, newValidMembers),
    missingMembers: findMissingMembers(oldValidMembers, newValidMembers),
    dataIssues: findDataIssues(oldMembers, newMembers),
  };
}

function createSummary(oldMembers, newMembers) {
  const oldTotal = oldMembers.length;
  const newTotal = newMembers.length;
  const difference = newTotal - oldTotal;
  const growth = oldTotal ? ((difference / oldTotal) * 100).toFixed(2) : "0.00";

  return {
    oldTotal,
    newTotal,
    difference,
    growth,
    oldCollection: sumTotal(oldMembers),
    newCollection: sumTotal(newMembers),
  };
}

function sumTotal(members) {
  return members.reduce((sum, member) => sum + Number(member.total || 0), 0);
}

function compareByField(oldMembers, newMembers, fieldName) {
  const oldCounts = countByField(oldMembers, fieldName);
  const newCounts = countByField(newMembers, fieldName);
  const allKeys = new Set([...Object.keys(oldCounts), ...Object.keys(newCounts)]);

  return [...allKeys]
    .map((key) => {
      const oldCount = oldCounts[key] || 0;
      const newCount = newCounts[key] || 0;
      const difference = newCount - oldCount;

      return {
        name: key,
        oldCount,
        newCount,
        difference,
        status: getStatus(difference),
      };
    })
    .sort((a, b) => b.difference - a.difference || a.name.localeCompare(b.name));
}

function countByField(members, fieldName) {
  return members.reduce((counts, member) => {
    const key = normalizeText(member[fieldName] || "Not specified");
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function getMemberKey(member) {
  const phone = normalizePhone(member.phone);

  if (phone.length >= 10) {
    return `PHONE:${phone.slice(-10)}`;
  }

  return `NAME_SCHOOL:${normalizeText(member.name)}|${normalizeText(member.school)}`;
}

function findNewMembers(oldMembers, newMembers) {
  const oldKeys = new Set(oldMembers.map(getMemberKey));
  return newMembers.filter((member) => !oldKeys.has(getMemberKey(member)));
}

function findMissingMembers(oldMembers, newMembers) {
  const newKeys = new Set(newMembers.map(getMemberKey));
  return oldMembers.filter((member) => !newKeys.has(getMemberKey(member)));
}

function getStatus(difference) {
  if (difference > 0) return "Increased";
  if (difference < 0) return "Decreased";
  return "Same";
}


function findDataIssues(oldMembers, newMembers) {
  const issues = [
    ...findBasicIssues(oldMembers, "2024-25"),
    ...findBasicIssues(newMembers, "2025-26"),
    ...findDuplicatePhoneIssues(oldMembers, "2024-25"),
    ...findDuplicatePhoneIssues(newMembers, "2025-26"),
    ...findPossibleDuplicateIssues(oldMembers, "2024-25"),
    ...findPossibleDuplicateIssues(newMembers, "2025-26"),
  ];

  return issues;
}

function findBasicIssues(members, year) {
  const issues = [];

  members.forEach((member) => {
    if (!member.name) issues.push(createIssue("Missing name", year, member));
    if (!member.school) issues.push(createIssue("Missing school", year, member));
    if (!member.subject) issues.push(createIssue("Missing subject", year, member));
    if (!normalizePhone(member.phone)) issues.push(createIssue("Missing phone", year, member));
  });

  return issues;
}

function findDuplicatePhoneIssues(members, year) {
  const phoneGroups = groupMembersBy(members, (member) => normalizePhone(member.phone));
  const issues = [];

  Object.entries(phoneGroups).forEach(([phone, groupedMembers]) => {
    if (!phone || groupedMembers.length < 2) return;

    groupedMembers.forEach((member) => {
      issues.push(createIssue("Duplicate phone number", year, member));
    });
  });

  return issues;
}

function findPossibleDuplicateIssues(members, year) {
  const nameSchoolGroups = groupMembersBy(
    members,
    (member) => `${normalizeText(member.name)}|${normalizeText(member.school)}`
  );

  const issues = [];

  Object.entries(nameSchoolGroups).forEach(([key, groupedMembers]) => {
    if (key === "|" || groupedMembers.length < 2) return;

    groupedMembers.forEach((member) => {
      issues.push(createIssue("Possible duplicate teacher", year, member));
    });
  });

  return issues;
}

function groupMembersBy(members, getKey) {
  return members.reduce((groups, member) => {
    const key = getKey(member);
    groups[key] = groups[key] || [];
    groups[key].push(member);
    return groups;
  }, {});
}

function createIssue(issue, year, member) {
  return {
    issue,
    year,
    name: member.name,
    school: member.school,
    subject: member.subject,
    phone: member.phone,
  };
}
