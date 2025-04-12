export class CreateUserRequest {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  empolyeeNumber: string;
  userRoleId: string;
}

export class CreateUserResponse {
  username: string;
  email: string;
}
