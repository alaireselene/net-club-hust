import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	return {
		breadcrumb: [
			{
				text: 'Về chúng tôi',
				href: '/about'
			}
		]
	};
};
