import './global.css';

import { Button, Avatar, AvatarImage, AvatarFallback } from 'ui-library';

export const App: React.FC = () => {
  return (
    <div className='text-orange-500'>
      developer-center
      <Avatar>
        <AvatarImage src='https://github.com/shadcn.png' />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Button variant='destructive'>button</Button>
    </div>
  );
};
