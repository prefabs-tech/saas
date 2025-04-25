import type { RouteComponent } from "vue-router";

interface RouteOverride {
  component?: RouteComponent;
  meta?: {
    layout?: RouteComponent;
  };
  path?: string;
}

interface RouteOverrides {
  acceptInvitation: RouteOverride;
  changePassword: RouteOverride;
  google?: RouteOverride;
  home?: string;
  login: RouteOverride;
  signup: RouteOverride & { disabled?: boolean };
  signupFirstUser: RouteOverride & { disabled?: boolean };
  passwordReset: RouteOverride;
  passwordResetRequest: RouteOverride;
  passwordResetRequestAcknowledge: RouteOverride;
  profile?: RouteOverride;
  roles?: RouteOverride;
  verifyEmail?: RouteOverride;
  verifyEmailReminder?: RouteOverride;
}

export type { RouteOverride, RouteOverrides };
