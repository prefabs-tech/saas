import type { AccountInvitation } from "../types";

const isInvitationValid = (invitation: AccountInvitation): boolean => {
  if (
    invitation.acceptedAt ||
    invitation.revokedAt ||
    Date.now() > invitation.expiresAt
  ) {
    return false;
  }

  return true;
};

export default isInvitationValid;
