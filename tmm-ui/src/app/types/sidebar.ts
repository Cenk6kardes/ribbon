import { SideBar } from 'rbn-common-lib/lib/models/sidebar';
import { PREFIX_URL } from './const';

const PREFIX = PREFIX_URL + '/';

export const SidebarData: SideBar[] = [
  {
    path: PREFIX + 'maintenance-by-gateways',
    abbr: 'GWY',
    data: {
      menu: {
        title: 'Maintenance by Gateways',
        sidebarLabel: 'Maintenance by Gateways',
        topLevel: true
      }
    }
  },
  {
    path: PREFIX + 'maintenance-by-carrier',
    abbr: 'CAR',
    data: {
      menu: {
        title: 'Maintenance by Carrier',
        sidebarLabel: 'Maintenance by Carrier',
        topLevel: true
      }
    }
  },
  {
    path: PREFIX + 'maintenance-by-trunk-clli',
    abbr: 'TRK',
    data: {
      menu: {
        title: 'Maintenance by Trunk Clli',
        sidebarLabel: 'Maintenance by Trunk Clli',
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
    path: 'help/gateway-name',
    data: {
      menu: {
        title: 'Maintenance By Gateway Name',
        sidebarLabel: 'Maintenance By Gateway Name',
        topLevel: true
      }
    }
  },
  {
    path: 'help/carrier',
    data: {
      menu: {
        title: 'Maintenance By Carrier',
        sidebarLabel: 'Maintenance By Carrier',
        topLevel: true
      }
    }
  },
  {
    path: 'help/trunk',
    data: {
      menu: {
        title: 'Maintenance By Trunk CLLI',
        sidebarLabel: 'Maintenance By Trunk CLLI',
        topLevel: true
      }
    }
  },
  {
    path: 'help/preferences',
    data: {
      menu: {
        title: 'Preferences',
        sidebarLabel: 'Preferences',
        topLevel: true
      }
    }
  },
  {
    path: 'help/launch',
    data: {
      menu: {
        title: 'Launch',
        sidebarLabel: 'Launch',
        topLevel: true
      }
    }
  }
];
