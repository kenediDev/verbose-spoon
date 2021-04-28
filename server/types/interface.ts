export interface UserDecode {
  user: {
    id: string;
    username: string;
    email: string;
    password: string;
    createAt: Date;
    updateAt: Date;
  };
  ait: string;
}
