declare interface SearchParamProps {
  params?: Promise<SegmentParams>;
  children?: React.ReactElement;
}

declare interface createUserProps {
  name: string;
  email: string;
  password: string;
}

declare interface signInProps {
  email: string;
  password: string;
}

declare interface JWTUserProps {
  id: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}
