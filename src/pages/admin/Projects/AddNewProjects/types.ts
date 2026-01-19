export interface MediaType {
  id: number;
  project_id: number;
  name: string | null;
  image_type: string;
  filename: string;
  filepath: string;
  fileurl: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ClientType {
  id: number;
  project_id: number;
  fullName: string;
  email: string;
  mobile: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface DataType {
  key: string;
  id: number;
  name: string;
  project_type_id: number;
  location: string;
  site_area: string;
  description: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  client: ClientType;
  media: MediaType[];
}

export interface ProjectType {
  id: number;
  title: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
} 