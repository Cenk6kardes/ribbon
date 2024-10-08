import { SideBar } from 'rbn-common-lib/lib/models/sidebar';
import { PREFIX_URL } from './const';

const PREFIX = PREFIX_URL + '/';

export const SidebarData: SideBar[] = [
  {
    path: PREFIX + 'home',
    data: {
      menu: {
        title: 'Home',
        sidebarLabel: 'Home',
        icon: 'fa fa-home',
        topLevel: true
      }
    }
  },
  {
    path: PREFIX + 'reports',
    data: {
      menu: {
        title: 'Reports',
        sidebarLabel: 'Reports',
        icon: 'fa fa-file',
        topLevel: true
      }
    }
  }
];

export const HelpItem: SideBar[] = [
  {
    path: 'help/overview',
    data: {
      menu: {
        title: 'Overview',
        sidebarLabel: 'Overview',
        topLevel: true
      }
    }
  },
  {
    path: 'help/security',
    data: {
      menu: {
        title: 'Security Login',
        sidebarLabel: 'Security Login',
        topLevel: true
      }
    }
  },
  {
    path: 'help/configuration',
    data: {
      menu: {
        title: 'Configuration Login',
        sidebarLabel: 'Configuration Login',
        topLevel: true
      }
    }
  },
  {
    path: 'help/maintenance',
    data: {
      menu: {
        title: 'Maintenance',
        sidebarLabel: 'Maintenance',
        topLevel: true
      }
    }
  },
  {
    path: 'help/reports',
    data: {
      menu: {
        title: 'Reports',
        sidebarLabel: 'Reports',
        topLevel: true
      }
    }
  },
  {
    path: 'help/troubleshooting',
    data: {
      menu: {
        title: 'Troubleshooting',
        sidebarLabel: 'Troubleshooting',
        topLevel: true
      }
    }
  }
];
