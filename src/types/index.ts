export interface User {
  id: string;
  email: string;
}

export interface Link {
  id: string;
  url: string;
  title?: string;
  userId: string;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  userId: string;
}

export interface AuthResponse {
  token: string;
}
