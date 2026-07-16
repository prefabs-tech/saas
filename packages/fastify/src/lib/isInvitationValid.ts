import type { AccountInvitation } from "../types";

const isInvitationValid = (invitation: AccountInvitation): boolean => {
  return !(
    invitation.acceptedAt ||
    invitation.revokedAt ||
    Date.now() > invitation.expiresAt
  );
};

export default isInvitationValid;
