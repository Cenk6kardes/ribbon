import { SideBar } from 'rbn-common-lib/lib/models/sidebar';
import { PREFIX_URL } from './const';
import { CSidebarPathAudit } from '../modules/audit/models/audit';

const PREFIX = PREFIX_URL + '/';

// We add extra object and hide them on rootview to succeed the same ui on wiki

export const SidebarData: SideBar[] = [
  {
    path: PREFIX + 'gateway-controllers',
    data: {
      menu: {
        title: 'Gateway Controllers',
        sidebarLabel: 'Gateway Controllers',
        icon: 'fa fa-server',
        topLevel: true
      }
    }
  },
  {
    path: PREFIX + 'network-configuration',
    data: {
      menu: {
        title: 'Network',
        sidebarLabel: 'Network',
        icon: 'fa fa-network-wired',
        topLevel: true
      }
    },
    children: [{
      path: PREFIX + 'network-configuration',
      routeType: 'INTERNAL',
      data: {
        menu: {
          title: 'Devices',
          sidebarLabel: 'Devices'
        }
      }
    },
    {
      path: PREFIX + 'network-configuration',
      routeType: 'INTERNAL',
      data: {
        menu: {
          title: 'Devices',
          sidebarLabel: 'Devices'
        }
      }
    },
    {
      path: PREFIX + 'network-configuration/codec-profile',
      routeType: 'INTERNAL',
      data: {
        menu: {
          title: 'Codec Profile',
          sidebarLabel: 'Codec Profile'
        }
      }
    }],
    routeType: 'PARENT'
  },
  {
    path: PREFIX + 'audit',
    data: {
      menu: {
        title: 'Audit',
        sidebarLabel: 'Audit',
        icon: 'fa fa-file',
        topLevel: true
      }
    },
    children: [],
    routeType: 'PARENT'
  }
];

export const InterfaceBrowserItem= {
  path: PREFIX + 'interface-browser',
  data: {
    menu: {
      title: 'V5.2',
      sidebarLabel: 'V5.2',
      icon: 'fa fa-gear',
      topLevel: true
    }
  },
  children: [{
    path: PREFIX + 'interface-browser',
    routeType: 'INTERNAL',
    data: {
      menu: {
        title: 'V5.2',
        sidebarLabel: 'V5.2'
      }
    }
  },
  {
    path: PREFIX + 'interface-browser/prov',
    routeType: 'INTERNAL',
    data: {
      menu: {
        title: 'V5PROV',
        sidebarLabel: 'V5PROV'
      }
    }
  },
  {
    path: PREFIX + 'interface-browser/ring',
    routeType: 'INTERNAL',
    data: {
      menu: {
        title: 'V5RING',
        sidebarLabel: 'V5RING'
      }
    }
  },
  {
    path: PREFIX + 'interface-browser/sig',
    routeType: 'INTERNAL',
    data: {
      menu: {
        title: 'V5SIG',
        sidebarLabel: 'V5SIG'
      }
    }
  },
  {
    path: PREFIX + 'interface-browser/maintenance',
    routeType: 'INTERNAL',
    data: {
      menu: {
        title: 'V5.2 Maintenance',
        sidebarLabel: 'V5.2 Maintenance'
      }
    }
  }],
  routeType: 'PARENT'
};

export const AuditChildrenItem = [
  {
    path: PREFIX + CSidebarPathAudit.c20DataIntegrityAudit,
    routeType: 'INTERNAL',
    data: {
      menu: {
        title: 'C20 Data Integrity',
        sidebarLabel: 'C20 Data Integrity'
      }
    }
  },
  {
    path: PREFIX + CSidebarPathAudit.lineDataIntegrityAudit,
    routeType: 'INTERNAL',
    data: {
      menu: {
        title: 'Line Data Integrity',
        sidebarLabel: 'Line Data Integrity'
      }
    }
  },
  {
    path: PREFIX + CSidebarPathAudit.trunkDataIntegrityAudit,
    routeType: 'INTERNAL',
    data: {
      menu: {
        title: 'Trunk Data Integrity',
        sidebarLabel: 'Trunk Data Integrity'
      }
    }
  },
  {
    path: PREFIX + CSidebarPathAudit.currentAudit,
    routeType: 'INTERNAL',
    data: {
      menu: {
        title: 'Current Audit',
        sidebarLabel: 'Current Audit'
      }
    }
  },
  {
    path: PREFIX + CSidebarPathAudit.scheduledAudits,
    routeType: 'INTERNAL',
    data: {
      menu: {
        title: 'Scheduled Audits',
        sidebarLabel: 'Scheduled Audits'
      }
    }
  },
  {
    path: PREFIX + CSidebarPathAudit.V52DataIntegrityAudit,
    routeType: 'INTERNAL',
    data: {
      menu: {
        title: 'V5.2 Data Integrity',
        sidebarLabel: 'V5.2 Data Integrity'
      }
    }
  },
  {
    path: PREFIX + CSidebarPathAudit.smallLineDataIntegrityAudit,
    routeType: 'INTERNAL',
    data: {
      menu: {
        title: 'Small Line Audit',
        sidebarLabel: 'Small Line Audit'
      }
    }
  }
];
