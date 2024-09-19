import {
	Button,
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from 'ui-library';
import { Logo } from './logo';

export const Navigation: React.FC = () => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button className='px-1' variant='ghost' size='sm'>
					<Logo className='w-7 h-7' fillColor='red' />
				</Button>
			</SheetTrigger>
			<SheetContent className='sm:max-w-7xl' side='left'>
				<SheetHeader>
					<SheetTitle>Edit profile</SheetTitle>
					<SheetDescription>
						Make changes to your profile here. Click save when you're done.
					</SheetDescription>
				</SheetHeader>
				<div>content</div>
				<SheetFooter>
					<SheetClose asChild>
						<Button type='submit'>Save changes</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
};
