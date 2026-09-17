function findeUserId() {
  const email = "frederike.wegner@karcher.com"; // <-- Hier die E-Mail eintragen!
  
  try {
    const user = AdminDirectory.Users.get(email);
    console.log("\u2022 Die ID lautet: users/" + user.id);
  } catch(e) {
    console.log("\u2022 Nutzer nicht gefunden: " + e.message);
  }
}