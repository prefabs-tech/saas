/**
 * Thrown by `discoverAccount` when no account matches the request. Mapped
 * to a 404 and not logged as an error, while other errors propagate as 500s.
 */
class AccountNotFoundError extends Error {
  constructor(message = "Account not found") {
    super(message);

    this.name = "AccountNotFoundError";

    // Preserve `instanceof` across transpilation targets that downlevel classes.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default AccountNotFoundError;
