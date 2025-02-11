import type { CustomerInvitation } from "../types";

const isInvitationValid = (invitation: CustomerInvitation): boolean => {
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
