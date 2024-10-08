import { ITableConfig, PaginatorMode } from 'rbn-common-lib';

export const PREFIX_URL = 'main';
export const DEFAULT_LANGUAGE = 'en';
export const PROJECT_NAME = 'Trunk Maintenance Manager';

const baseURL = window.location.origin;
const parsedUrl = baseURL.split(':');
const baseURLForLoginHelp = `${parsedUrl[0]}:${parsedUrl[1]}`;
export const TMM_HELP_URL = `${baseURL}/tmm/tmm_onlinehelp.html`;

export const tableConfigCommon: ITableConfig = {
  paginatorMode: PaginatorMode.Client,
  showCloseTableButton: false,
  tableOptions: {
    hideTableButtons: false,
    hideCheckboxAll: false,
    hideColumnInLib: true
  },
  tableName: '',
  useManualColWidth: true,
  rowsPerPageOptions: [10, 15, 20]
};

export const topDropdownItems = {
  ItemOptions: 'ItemOptions'
};

