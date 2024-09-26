import './global.css';

import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

export const App: React.FC = () => {
  return <RouterProvider router={router} />;
};
