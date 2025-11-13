export function getAgeFromDate(input) {
  const date = typeof input === "string" ? new Date(input) : input;

  if (!(date instanceof Date) || isNaN(date.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate());

  if (!hasHadBirthdayThisYear) age--;

  return age;
}
