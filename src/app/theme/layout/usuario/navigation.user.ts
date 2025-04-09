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

export const NavigationUserItems: NavigationItem[] = [
  {
    id: 'inicio',
    title: 'Inicio',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Inicio',
        title: 'Inicio',
        type: 'item',
        url: '/user/inicio',
        classes: 'nav-item',
        icon: 'ti ti-home'
      }
    ]
  },
  {
    id: 'compras',
    title: 'Mis compras',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'compras',
        title: 'Mis compras',
        type: 'item',
        url: '/user/compras',
        classes: 'nav-item',
        icon: 'ti ti-businessplan'
      }
    ]
  },
  {
    id: 'carrito',
    title: 'Carrito',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'carrito',
        title: 'Carrito',
        type: 'item',
        url: '/user/carrito',
        classes: 'nav-item',
        icon: 'ti ti-shopping-cart'
      }
    ]
  }
];
