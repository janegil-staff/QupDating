export function calculateCompletion(profile) {
  const fields = [
    profile.name,
    profile.birthdate,
    profile.bio,
    profile.relationshipStatus,
    profile.location,
    profile.education,
    profile.occupation,
    profile.appearance,
    profile.bodyType,
    profile.height,
    profile.hasChildren,
    profile.wantsChildren,
    profile.smoking,
    profile.drinking,
    profile.willingToRelocate,
    profile.lookingFor,
  ];

  const filledFields = fields.filter(Boolean).length;
  const totalFields = fields.length;

  const imagesCount = profile.images?.length || 0;
  const imageWeight = 5; // give images extra importance

  const completion = Math.min(
    100,
    Math.round(((filledFields + imagesCount * imageWeight) / (totalFields + imageWeight * 3)) * 100)
  );

  return completion;
}

