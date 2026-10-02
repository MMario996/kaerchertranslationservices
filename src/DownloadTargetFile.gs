/** Download: returns base64 + filename so UI can download without Drive */
function apiDownloadTargetFile(projectUid, jobUid) {
  const access = apiCheckAccess();
  if (!access.allowed) throw new Error("Not authorized.");

  const blob = phraseDownloadTargetFile_(String(projectUid).trim(), String(jobUid).trim());
  const bytes = blob.getBytes();
  const b64 = Utilities.base64Encode(bytes);

  return {
    ok: true,
    fileName: blob.getName() || ("target_" + jobUid),
    mimeType: blob.getContentType() || "application/octet-stream",
    base64: b64
  };
}