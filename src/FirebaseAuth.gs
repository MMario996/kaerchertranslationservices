/**
 * FirebaseAuth.gs
 *
 * Erzeugt (und cached fuer ~50 Minuten) ein OAuth-Access-Token fuer den
 * Service Account, mit dem die Firebase Hosting REST API angesprochen
 * wird. Das ist bewusst ein ANDERER Flow als der ID-Token-Flow aus dem
 * urspruenglichen Cloud-Run-Bridge-Projekt (dort: target_audience -> 
 * id_token; hier: scope -> access_token) - beides sind Standard-Google-
 * Server-zu-Server-Auth-Muster, nur fuer unterschiedliche Zwecke.
 *
 * Script Property "SERVICE_ACCOUNT_JSON" muss den kompletten Inhalt des
 * Service-Account-Key-JSON enthalten (siehe README).
 */

var FIREBASE_SCOPE_ =
  "https://www.googleapis.com/auth/firebase.hosting " +
  "https://www.googleapis.com/auth/cloud-platform";

function getFirebaseAccessToken_() {
  var cache = CacheService.getScriptCache();
  var cacheKey = "firebase_access_token";
  var cached = cache.get(cacheKey);
  if (cached) return cached;

  var serviceAccountJsonRaw = PropertiesService.getScriptProperties().getProperty(
    "SERVICE_ACCOUNT_JSON"
  );
  if (!serviceAccountJsonRaw) {
    throw new Error("Script Property 'SERVICE_ACCOUNT_JSON' ist nicht gesetzt.");
  }
  var sa = JSON.parse(serviceAccountJsonRaw);

  var nowSeconds = Math.floor(Date.now() / 1000);
  var header = { alg: "RS256", typ: "JWT" };
  var claimSet = {
    iss: sa.client_email,
    scope: FIREBASE_SCOPE_,
    aud: "https://oauth2.googleapis.com/token",
    iat: nowSeconds,
    exp: nowSeconds + 3600,
  };

  var signedJwt = signJwtRs256_(header, claimSet, sa.private_key);

  var response = UrlFetchApp.fetch("https://oauth2.googleapis.com/token", {
    method: "post",
    contentType: "application/x-www-form-urlencoded",
    payload: {
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: signedJwt,
    },
    muteHttpExceptions: true,
  });

  var body = JSON.parse(response.getContentText());
  if (!body.access_token) {
    throw new Error(
      "Konnte kein Access-Token holen. Antwort von Google: " +
        response.getContentText()
    );
  }

  cache.put(cacheKey, body.access_token, 50 * 60);
  return body.access_token;
}

function signJwtRs256_(header, claimSet, privateKeyPem) {
  var encodedHeader = base64UrlEncodeString_(JSON.stringify(header));
  var encodedClaimSet = base64UrlEncodeString_(JSON.stringify(claimSet));
  var signingInput = encodedHeader + "." + encodedClaimSet;

  var signatureBytes = Utilities.computeRsaSha256Signature(
    signingInput,
    privateKeyPem
  );
  var encodedSignature = base64UrlEncodeBytes_(signatureBytes);

  return signingInput + "." + encodedSignature;
}

function base64UrlEncodeString_(str) {
  return base64UrlEncodeBytes_(Utilities.newBlob(str).getBytes());
}

function base64UrlEncodeBytes_(bytes) {
  return Utilities.base64EncodeWebSafe(bytes).replace(/=+$/, "");
}
