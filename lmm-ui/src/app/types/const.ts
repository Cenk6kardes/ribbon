import { ITableConfig, PaginatorMode } from 'rbn-common-lib';

export const PREFIX_URL = 'main';
export const DEFAULT_LANGUAGE = 'en';
export const PROJECT_NAME = 'Line Maintenance Manager';

const parsedUrl = window.location.origin.split(':');
const baseURL = `${parsedUrl[0]}:${parsedUrl[1]}`;
export const LMM_HELP_URL = `${baseURL}/sesm/lmmhelp/lmm_onlinehelp.html`;

export const tableConfigCommon: ITableConfig = {
  paginatorMode: PaginatorMode.Client,
  showCloseTableButton: false,
  tableOptions: {
    hideTableButtons: false,
    hideCheckboxAll: false,
    hideColumnInLib: true
  },
  tableName: 'tbl',
  useManualColWidth: true,
  rowsPerPageOptions: [10, 15, 20]
};

export const topDropdownItems = {
  CreateOnDemandReport: 'createDemandReport',
  ReportsSchedulingOptions: 'reportsSchedulingOptions'
};
