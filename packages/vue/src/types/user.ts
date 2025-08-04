export interface User {
  id: string;
  email: string;
  givenName?: string;
  middleNames?: string;
  surname?: string;
  createdAt: number;
  updatedAt: number;
}

export interface UserSignupData {
  email: string;
  givenName?: string;
  middleNames?: string;
  password: string;
  surname?: string;
}

export interface UserSigninData {
  email: string;
  password: string;
}
