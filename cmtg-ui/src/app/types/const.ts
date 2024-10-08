import { ITableConfig, PaginatorMode } from 'rbn-common-lib';

export const PREFIX_URL = 'main';
export const PREFIX_HELP_URL='help';
export const DEFAULT_LANGUAGE = 'en';
export const PROJECT_NAME = 'C20 Management Tools';

export const CMTG_HELP_URL ='/help';


export const tableConfigCommon: ITableConfig = {
  paginatorMode: PaginatorMode.Client,
  showCloseTableButton: false,
  tableOptions: {
    hideTableButtons: false,
    hideCheckboxAll: false,
    hideColumnInLib: true,
    show3DotsButton: true,
    btn3DotsConfig: {
      exportCSVByLib: true
    }
  },
  isResizableColumns: true,
  isUsingAppendTo: false,
  enableFilter: true,
  tableName: 'tbl',
  useManualColWidth: true,
  numberRowPerPage: 10,
  rowsPerPageOptions: [10, 15, 20]
  /**
    numberRowPerPage: 5,
    rowsPerPageOptions: [5, 10, 15]
   */
};

export const topDropdownItems = {
  CreateOnDemandReport: 'createDemandReport',
  ReportsSchedulingOptions: 'reportsSchedulingOptions'
};
