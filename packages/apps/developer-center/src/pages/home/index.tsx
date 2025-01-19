import { queryAppList, type QueryAppListData } from '@/apis/app.api';
import { useLoaderData } from 'react-router-dom';

export async function loader() {
  const applist = await queryAppList();
  return applist;
}

export const Component: React.FC = () => {
  const applist = useLoaderData<QueryAppListData>();
  console.log(applist);
  return <div>developer-center</div>;
};

Component.displayName = 'Home';
