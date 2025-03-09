import type { PageLoad } from './$types';

export const load: PageLoad = () => {
  return {
    breadcrumb: [
      {
        text: 'Về chúng tôi',
        href: '/about'
      },
      {
        text: 'Cơ cấu tổ chức',
        href: '/about/structure'
      }
    ]
  };
};