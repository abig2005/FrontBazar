export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  role?: string[];
  isMainParent?: boolean;
}

export const NavigationItems: NavigationItem[] = [
  // {
  //   id: 'dashboard',
  //   title: 'Dashboard',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'default',
  //       title: 'Dashboard',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/admin/default',
  //       icon: 'ti ti-dashboard',
  //       breadcrumbs: false
  //     }
  //   ]
  // },
  // {
  //   id: 'page',
  //   title: 'Pages',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'Authentication',
  //       title: 'Authentication',
  //       type: 'collapse',
  //       icon: 'ti ti-key',
  //       children: [
  //         {
  //           id: 'login',
  //           title: 'Login',
  //           type: 'item',
  //           // url: '/login',
  //           target: true,
  //           breadcrumbs: false
  //         },
  //         {
  //           id: 'register',
  //           title: 'Register',
  //           type: 'item',
  //           // url: '/register',
  //           target: true,
  //           breadcrumbs: false
  //         }
  //       ]
  //     }
  //   ]
  // },
  // {
  //   id: 'elements',
  //   title: 'Elements',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'typography',
  //       title: 'Typography',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/admin/typography',
  //       icon: 'ti ti-typography'
  //     },
  //     {
  //       id: 'color',
  //       title: 'Colors',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/admin/color',
  //       icon: 'ti ti-brush'
  //     }
  //   ]
  // },
  {
    id: 'other',
    title: 'Productos',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Productos',
        title: 'Productos',
        type: 'item',
        url: '/admin/productos',
        classes: 'nav-item',
        icon: 'ti ti-building-store'
      }
    ]
  },
  {
    id: 'categoria',
    title: 'Categorías',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'categoria',
        title: 'Categorías',
        type: 'item',
        url: '/admin/categoria',
        classes: 'nav-item',
        icon: 'ti ti-category'
      }
    ]
  },
  {
    id: 'ventas',
    title: 'Ventas',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'ventas',
        title: 'Ventas',
        type: 'item',
        url: '/admin/venta',
        classes: 'nav-item',
        icon: 'ti ti-shopping-bag'
      }
    ]
  }
];
