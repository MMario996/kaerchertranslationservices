/**
 * KecWhitelistAliases.gs
 * Alias-Funktionen: Frontend ruft "Kec" (kleines c), Backend definiert "KeC" (gro?es C).
 * Diese Wrapper vermeiden ?nderungen am bestehenden WebApp.gs.
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