function findeUserId() {
  const email = "frederike.wegner@karcher.com"; // <-- Hier die E-Mail eintragen!
  
  try {
    const user = AdminDirectory.Users.get(email);
    console.log("? Die ID lautet: users/" + user.id);
  } catch(e) {
    console.log("? Nutzer nicht gefunden: " + e.message);
  }
}