/**
 * --- Storage.gs ---
 * Enth?lt Helfer f?r Statistiken und Sheet-Zugriffe
 */

// HINWEIS: getQueueSheet_() ist kanonisch in AutoSync.js / WebApp.js definiert.
// Duplikat hier entfernt.

/**
 * Berechnet Dashboard-Statistiken direkt aus dem Sheet
 */
function getDashboardStatsFromSheet_(userEmail, isAdmin) {
  const sh = getQueueSheet_();
  if (!sh) return { totalProjects: 0, completed: 0, overdue: 0, active: 0, topTemplates: [] };

  const data = sh.getDataRange().getValues();
  // Header ?berspringen
  if (data.length < 2) return { totalProjects: 0, completed: 0, overdue: 0, active: 0, topTemplates: [] };

  const stats = {
    totalProjects: 0,
    completed: 0,
    overdue: 0,
    active: 0,
    templateCounts: {}
  };

  const now = new Date();
  const user = String(userEmail || "").toLowerCase().trim();

  // Indizes basierend auf HeaderRepair (A=0, B=1, etc.)
  // 1: User Email, 7: Status, 11: ProjectName, 12: DueDate, 17: SharedWith, 18: TemplateName
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const rowUser = String(row[1] || "").toLowerCase().trim();
    const status = String(row[7] || "").toUpperCase();
    const dueDate = row[12] ? new Date(row[12]) : null;
    const sharedWith = String(row[17] || "").toLowerCase();
    const template = String(row[18] || "Unknown Template").trim(); // Spalte S = Index 18

    // Filter: Wenn nicht Admin, zeige nur Eigene oder Geteilte
    if (!isAdmin) {
      const isOwner = rowUser === user;
      const isShared = sharedWith.includes(user);
      if (!isOwner && !isShared) continue;
    }

    stats.totalProjects++;

    // Status Logik
    const isDone = ["COMPLETED", "DELIVERED", "NOTIFIED", "DONE"].includes(status);
    const isCancelled = ["CANCELLED", "CANCELED", "REJECTED"].includes(status);

    if (isDone) {
        stats.completed++;
    } else if (!isCancelled) {
        stats.active++;
        if (dueDate && dueDate < now) {
            stats.overdue++;
        }
    }

    // Template Stats
    if (template) {
        stats.templateCounts[template] = (stats.templateCounts[template] || 0) + 1;
    }
  }

  // Top 10 Templates formatieren
  const topTemplates = Object.keys(stats.templateCounts)
    .map(name => ({ name: name, count: stats.templateCounts[name] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalProjects: stats.totalProjects,
    completed: stats.completed,
    overdue: stats.overdue,
    active: stats.active,
    topTemplates: topTemplates
  };
}