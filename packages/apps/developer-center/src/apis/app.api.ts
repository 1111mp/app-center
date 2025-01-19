import { http } from '@/libs/http';

interface App {
  _id: string;
  key: string;
  name: string;
  admins: [];
  createBy: string;
  owner: string;
  publishedAt: string;
  testUsers: string[];
  token: string;
  type: 1;
  versions: [];
  updatedAt: string;
  createdAt: string;
}

export interface QueryAppListData {
  total: number;
  data: App[];
}

export function queryAppList() {
  return http.get<QueryAppListData>('app');
}
