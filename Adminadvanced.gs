/**
 * AdminAdvanced.gs (v2 ? Token-Safe)
 *
 * Script Properties Management via Admin UI.
 * 
 * SECURITY: Sensitive keys (TOKEN, KEY, SECRET, PASSWORD) can NEVER be revealed.
 * Admins can only OVERWRITE them with a new value. To read the actual token,
 * you must go to the Apps Script editor ? Project Settings ? Script Properties.
 */

var SENSITIVE_PATTERNS_ = ["token", "key", "secret", "password", "private"];
var PROTECTED_KEYS_     = ["ACCESS_SHEET_ID", "OPS_SHEET_ID", "ADMIN_EMAILS", "PHRASE_API_TOKEN"];

function isSensitiveKey_(key) {
  var k = String(key || "").toLowerCase();
  return SENSITIVE_PATTERNS_.some(function(p) { return k.indexOf(p) !== -1; });
}

// ??? API: List all Script Properties (sensitive values always masked) ??????????

function apiGetAllScriptProperties() {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) throw new Error("Not authorized. Admin only.");

  var props  = PropertiesService.getScriptProperties().getProperties();
  var result = [];

  var keys = Object.keys(props).sort();
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];

    // Skip internal mappings
    if (key.indexOf("CHAT_USER_MAP__") === 0) continue;
    if (key.indexOf("oauth2.") === 0) continue;

    var sensitive   = isSensitiveKey_(key);
    var isProtected = PROTECTED_KEYS_.indexOf(key) !== -1;

    result.push({
      key:        key,
      value:      sensitive ? "????????" : props[key],
      sensitive:  sensitive,
      protected:  isProtected,
      length:     props[key] ? props[key].length : 0
    });
  }

  return { properties: result };
}

// ??? API: Set / Update a single property ??????????????????????????????????????

function apiSetScriptProperty(key, value) {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) throw new Error("Not authorized. Admin only.");

  key = String(key || "").trim();
  if (!key) throw new Error("Key cannot be empty.");

  if (PROTECTED_KEYS_.indexOf(key) !== -1 && !String(value || "").trim()) {
    throw new Error("Cannot set critical key '" + key + "' to an empty value.");
  }

  PropertiesService.getScriptProperties().setProperty(key, String(value != null ? value : ""));
  logAuditEvent_(caller, "PROP_EDIT", "Updated script property: " + key);
  return { success: true, key: key };
}

// ??? API: Delete a property ???????????????????????????????????????????????????

function apiDeleteScriptProperty(key) {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) throw new Error("Not authorized. Admin only.");

  key = String(key || "").trim();
  if (!key) throw new Error("Key cannot be empty.");

  if (PROTECTED_KEYS_.indexOf(key) !== -1) {
    throw new Error("Cannot delete protected key: " + key + ". Edit its value instead.");
  }

  PropertiesService.getScriptProperties().deleteProperty(key);
  logAuditEvent_(caller, "PROP_DELETE", "Deleted script property: " + key);
  return { success: true, key: key };
}

// ??? API: Reveal ? BLOCKED for sensitive keys ?????????????????????????????????

function apiRevealScriptProperty(key) {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) throw new Error("Not authorized. Admin only.");

  key = String(key || "").trim();

  // ? SECURITY: Never reveal tokens/keys/secrets
  if (isSensitiveKey_(key)) {
    return { 
      key: key, 
      value: "????????",
      blocked: true,
      message: "Sensitive values cannot be revealed. Use 'Edit' to overwrite with a new value, or view in Apps Script Editor ? Project Settings ? Script Properties."
    };
  }

  var value = PropertiesService.getScriptProperties().getProperty(key);
  return { key: key, value: value || "", blocked: false };
}

// ??? API: Add a brand-new property ????????????????????????????????????????????

function apiAddScriptProperty(key, value) {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) throw new Error("Not authorized. Admin only.");

  key = String(key || "").trim();
  if (!key) throw new Error("Key cannot be empty.");
  if (!/^[A-Za-z0-9_]+$/.test(key)) throw new Error("Key may only contain letters, numbers and underscores.");

  var existing = PropertiesService.getScriptProperties().getProperty(key);
  if (existing !== null) throw new Error("Key '" + key + "' already exists. Use Edit instead.");

  PropertiesService.getScriptProperties().setProperty(key, String(value != null ? value : ""));
  logAuditEvent_(caller, "PROP_ADD", "Added script property: " + key);
  return { success: true, key: key };
}