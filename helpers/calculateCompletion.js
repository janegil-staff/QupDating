function calculateCompletion(user) {
  const fields = ["name", "email", "birthdate", "profileImage", "bio", "interests"];
  const total = fields.length;
  let filled = 0;

  fields.forEach((f) => {
    if (user[f] && (Array.isArray(user[f]) ? user[f].length > 0 : user[f] !== "")) {
      filled++;
    }
  });

  return Math.round((filled / total) * 100);
}
