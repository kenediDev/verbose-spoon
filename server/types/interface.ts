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

export interface Upload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: any;
  size: number;
}
