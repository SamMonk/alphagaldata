// Public MVP routes stay login-free.
// Operator auth only protects moderation/editorial workflows that already exist.
// If member accounts ship later, they should come in as explicit new protected flows
// rather than being retrofitted into today's public routes.

export const MODERATOR_GROUPS = ['moderators', 'editors'] as const;
export const EDITOR_GROUPS = ['editors'] as const;

export const hasAllowedGroup = (
  groups: string[] | undefined,
  allowedGroups: readonly string[]
): boolean => {
  if (!groups || groups.length === 0) return false;
  return groups.some((group) => allowedGroups.includes(group));
};
