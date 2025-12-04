
export function calculateProfileCompletion(user) {
  const fields = [
    user.name,
    user.birthdate,
    user.bio,
    user.relationshipStatus,
    user.location,
    user.education,
    user.occupation,
    user.appearance,
    user.bodyType,
    user.height,
    user.hasChildren,
    user.wantsChildren,
    user.smoking,
    user.drinking,
    user.willingToRelocate,
    user.lookingFor,
  ];

  const filledFields = fields.filter(Boolean).length;
  const totalFields = fields.length;

  const imagesCount = user.images?.length || 0;
  const imageWeight = 5; // give images extra importance

  const completion = Math.min(
    100,
    Math.round(((filledFields + imagesCount * imageWeight) / (totalFields + imageWeight * 3)) * 100)
  );

  return completion;
}

