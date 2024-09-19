import { useMemo } from 'react';
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	Separator,
} from 'ui-library';
import { ThemeToggle } from './theme-toggle';
import { Navigation } from './navigation';

import { useAppStore } from '@/stores/apps.store';

export const Header: React.FC = () => {
	const { activeApp, appListMap } = useAppStore();

	const activeAppData = useMemo(
		() => appListMap[activeApp ?? ''],
		[appListMap, activeApp]
	);

	return (
		<header className='sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='flex h-14 items-center p-3'>
				<div className='mr-4 hidden md:flex gap-4'>
					<div className='flex items-center gap-2'>
						<Navigation />
						<Separator className='h-5' orientation='vertical' />
					</div>
					<div className='flex items-center gap-2 text-lg font-bold'>
						{activeAppData?.logo && (
							<img className='w-6 h-6' src={activeAppData.logo} />
						)}
						{activeAppData?.name}
					</div>
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
