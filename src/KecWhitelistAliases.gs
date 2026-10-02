/**
 * KecWhitelistAliases.gs
 * Alias-Funktionen: Frontend ruft "Kec" (kleines c), Backend definiert "KeC" (großes C).
 * Diese Wrapper vermeiden Änderungen am bestehenden WebApp.gs.
 */
function apiGetKecWhitelist() {
  return apiGetKeCWhitelist();
}
function apiAddKecWhitelist(email) {
  return apiAddKeCWhitelist(email);
}
function apiRemoveKecWhitelist(email) {
  return apiRemoveKeCWhitelist(email);
}