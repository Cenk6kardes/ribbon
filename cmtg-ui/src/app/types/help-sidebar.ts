import { SideBar } from 'rbn-common-lib/lib/models/sidebar';
import { PREFIX_HELP_URL } from './const';

const PREFIX = PREFIX_HELP_URL + '/';

export const HelpSidebarData: SideBar[] = [
  {
    path: PREFIX + 'overview',
    data: {
      menu: {
        title: 'Overview',
        sidebarLabel: 'Overview',
        topLevel: true
      }
    }
  },
  {
    path: PREFIX + 'network-configuration',
    data: {
      menu: {
        title: 'Network Configuration',
        sidebarLabel: 'Network Configuration',
        topLevel: true
      }
    }
  },
  {
    path: PREFIX + 'maintenance',
    data: {
      menu: {
        title: 'Maintenance',
        sidebarLabel: 'Maintenance',
        topLevel: true
      }
    }
  },
  {
    path: PREFIX + 'provisioning',
    data: {
      menu: {
        title: 'Provisioning',
        sidebarLabel: 'Provisioning',
        topLevel: true
      }
    }
  },
  {
    path: PREFIX + 'controller',
    data: {
      menu: {
        title: 'Controller',
        sidebarLabel: 'Controller',
        topLevel: true
      }
    }
  },
  {
    path: PREFIX + 'gateways',
    data: {
      menu: {
        title: 'Gateways',
        sidebarLabel: 'Gateways',
        topLevel: true
      }
    }
  },
  {
    path: PREFIX + 'lines',
    data: {
      menu: {
        title: 'Lines',
        sidebarLabel: 'Lines',
        topLevel: true
      }
    }
  },
  {
    path: PREFIX + 'carriers',
    data: {
      menu: {
        title: 'Carriers',
        sidebarLabel: 'Carriers',
        topLevel: true
      }
    }
  },
  {
    path: PREFIX + 'qos-collectors',
    data: {
      menu: {
        title: 'Qos Collectors',
        sidebarLabel: 'Qos Collectors',
        topLevel: true
      }
    }
  },
  {
    path: PREFIX + 'procedures',
    data: {
      menu: {
        title: 'Procedures',
        sidebarLabel: 'Procedures',
        topLevel: true
      }
    }
  },
  {
    path: PREFIX + 'audit',
    data: {
      menu: {
        title: 'Audit',
        sidebarLabel: 'Audit',
        topLevel: true
      }
    }
  },
  {
    path: PREFIX + 'v52',
    data: {
      menu: {
        title: 'V5.2',
        sidebarLabel: 'V5.2',
        topLevel: true
      }
    }
  }
];
