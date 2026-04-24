import type { MenuItem } from 'primevue/menuitem';
import type { NavItemNavbar } from 'ui';

export interface AppNavigationGroup extends MenuItem {
    label: string;
    items: NavItemNavbar[];
    visible?: boolean; 
}