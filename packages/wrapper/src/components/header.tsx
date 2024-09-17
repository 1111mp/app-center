import { Avatar, AvatarFallback, AvatarImage, Button } from 'ui-library';
import { ThemeToggle } from './theme-toggle';
import { Logo } from './logo';

export const Header: React.FC = () => {
  return (
    <header className='sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex h-14 items-center p-3'>
        <div className='mr-4 hidden md:flex'>
          <Button className='px-1' variant='ghost' size='sm'>
            <Logo className='w-7 h-7' fillColor='red'/>
          </Button>
        </div>
        <div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
          <ThemeToggle />
          <Avatar size='md'>
            <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};
