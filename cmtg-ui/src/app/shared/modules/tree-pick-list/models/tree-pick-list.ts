export interface ITreeNodePickList<T = any> {
  label: string;
  data?: T;
  icon?: string;
  expandedIcon?: any;
  collapsedIcon?: any;
  children?: ITreeNodePickList<T>[];
  leaf?: boolean;
  expanded?: boolean;
  type?: string;
  parent?: ITreeNodePickList<T>;
  partialSelected?: boolean;
  style?: string;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
  selectable?: boolean;
  key: string;
}

export interface IChangeDataPickList {
  source: ITreeNodePickList<any>[],
  target: ITreeNodePickList<any>[],
  disabled: boolean,
  changeBySetDefault: boolean,
  nodeLeafSelectedItemsSource: ITreeNodePickList<any>[]
}
