/**
 * Ermittlung der Phrase-IDs und UIDs f?r Client AKW, Domain General Content und BU FTC-D.
 * Kann direkt im Script Editor getestet werden, um die IDs im Log zu sehen.
 */
function apiFindCourseMetadataIds() {
  const authHeader = getPhraseAuthHeader_();
  const headers = { Authorization: authHeader };

  // 1. Client "AKW" abfragen
  const clientUrl = phraseApiUrlV1_('/clients?name=' + encodeURIComponent('AKW'));
  const clientRes = phraseFetchJson_(clientUrl, { method: 'get', headers: headers });
  
  // 2. Domain "General Content" abfragen
  const domainUrl = phraseApiUrlV1_('/domains?name=' + encodeURIComponent('General Content'));
  const domainRes = phraseFetchJson_(domainUrl, { method: 'get', headers: headers });
  
  // 3. Business Unit "FTC-D" abfragen
  const buUrl = phraseApiUrlV1_('/businessUnits?name=' + encodeURIComponent('FTC-D'));
  const buRes = phraseFetchJson_(buUrl, { method: 'get', headers: headers });

  const result = {
    client: clientRes.content && clientRes.content[0] ? {
      name: clientRes.content[0].name,
      id: clientRes.content[0].id,       // Numerische ID
      uid: clientRes.content[0].uid      // Alphanumerische UID
    } : null,
    domain: domainRes.content && domainRes.content[0] ? {
      name: domainRes.content[0].name,
      id: domainRes.content[0].id,
      uid: domainRes.content[0].uid
    } : null,
    businessUnit: buRes.content && buRes.content[0] ? {
      name: buRes.content[0].name,
      id: buRes.content[0].id,
      uid: buRes.content[0].uid
    } : null
  };

  console.log("Gefundene Metadaten-IDs:", JSON.stringify(result, null, 2));
  return result;
}