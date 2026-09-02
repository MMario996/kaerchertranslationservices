/**
 * GermanHolidays.gs
 * Bundesweite gesetzliche Feiertage in Deutschland (KEINE Bundesland-spezifischen
 * wie Fronleichnam, Reformationstag, Allerheiligen etc.). Wird aktuell f?r die
 * Due-Date-Validierung im Documentation Import (DocImport.gs) genutzt.
 */

function ghComputeEasterSunday_(year) {
  // Gau?sche Osterformel
  var a = year % 19;
  var b = Math.floor(year / 100);
  var c = year % 100;
  var d = Math.floor(b / 4);
  var e = b % 4;
  var f = Math.floor((b + 8) / 25);
  var g = Math.floor((b - f + 1) / 3);
  var h = (19 * a + b - d - g + 15) % 30;
  var i = Math.floor(c / 4);
  var k = c % 4;
  var l = (32 + 2 * e + 2 * i - h - k) % 7;
  var m = Math.floor((a + 11 * h + 22 * l) / 451);
  var month = Math.floor((h + l - 7 * m + 114) / 31);
  var day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function ghAddDays_(date, days) {
  var d = new Date(date.getTime());
  d.setDate(d.getDate() + days);
  return d;
}

function ghDateKey_(date) {
  var mm = String(date.getMonth() + 1);
  var dd = String(date.getDate());
  if (mm.length < 2) mm = "0" + mm;
  if (dd.length < 2) dd = "0" + dd;
  return date.getFullYear() + "-" + mm + "-" + dd;
}

/**
 * Liefert die bundesweiten gesetzlichen Feiertage f?r ein Jahr als Array von
 * { date: "YYYY-MM-DD", name: "..." }.
 */
function getGermanHolidays_(year) {
  var easter = ghComputeEasterSunday_(year);
  var holidays = [
    { date: new Date(year, 0, 1),  name: "Neujahr" },
    { date: ghAddDays_(easter, -2), name: "Karfreitag" },
    { date: ghAddDays_(easter, 1),  name: "Ostermontag" },
    { date: new Date(year, 4, 1),  name: "Tag der Arbeit" },
    { date: ghAddDays_(easter, 39), name: "Christi Himmelfahrt" },
    { date: ghAddDays_(easter, 50), name: "Pfingstmontag" },
    { date: new Date(year, 9, 3),  name: "Tag der Deutschen Einheit" },
    { date: new Date(year, 11, 25), name: "1. Weihnachtstag" },
    { date: new Date(year, 11, 26), name: "2. Weihnachtstag" }
  ];
  return holidays.map(function(h) {
    return { date: ghDateKey_(h.date), name: h.name };
  });
}

/**
 * Pr?ft, ob ein Date-Objekt (Server-Zeitzone Europe/Berlin, siehe appsscript.json)
 * auf ein Wochenende oder einen bundesweiten Feiertag f?llt.
 * Gibt { blocked: bool, reason: string } zur?ck.
 */
function checkGermanNonWorkingDay_(date) {
  var day = date.getDay(); // 0 = Sonntag, 6 = Samstag
  if (day === 0 || day === 6) {
    return { blocked: true, reason: "ein Wochenende" };
  }
  var holidays = getGermanHolidays_(date.getFullYear());
  var key = ghDateKey_(date);
  var match = null;
  for (var idx = 0; idx < holidays.length; idx++) {
    if (holidays[idx].date === key) { match = holidays[idx]; break; }
  }
  if (match) return { blocked: true, reason: match.name };
  return { blocked: false, reason: "" };
}

/**
 * API: liefert Feiertage f?r ein oder mehrere Jahre ans Frontend, damit dort
 * ohne Server-Roundtrip pro Datumsauswahl validiert werden kann.
 */
function apiGetGermanHolidays(years) {
  try {
    var list = (Array.isArray(years) && years.length) ? years : [new Date().getFullYear(), new Date().getFullYear() + 1];
    var out = [];
    list.forEach(function(y) { out = out.concat(getGermanHolidays_(y)); });
    return { success: true, holidays: out };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}