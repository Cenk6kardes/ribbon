import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Tree } from 'primeng/tree';
import { IChangeDataPickList, ITreeNodePickList } from './models/tree-pick-list';

@Component({
  selector: 'app-tree-pick-list',
  templateUrl: './tree-pick-list.component.html',
  styleUrls: ['./tree-pick-list.component.scss']
})
export class TreePickListComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('treeSource', { static: true }) treeSource!: Tree;
  @ViewChild('treeTarget', { static: true }) treeTarget!: Tree;
  @Input() dataSource: ITreeNodePickList[] = [];
  @Input() dataTarget: ITreeNodePickList[] = [];
  @Input() scrollHeight = '250px';
  @Input() blockTree = false;
  @Output() evOnChangeData = new EventEmitter();
  @Output() evOnNodeSelectSource = new EventEmitter();
  @Input() showBtnAngleRight = true;
  @Input() showBtnAngleDoubleRight = true;
  @Input() showBtnAngleLeft = true;
  @Input() showBtnAngleDoubleLeft = true;
  selectedItemsSource: ITreeNodePickList[] = [];
  selectedItemsTarget: ITreeNodePickList[] = [];
  constructor() { }

  ngOnInit(): void {
    this.emitResultData(true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['blockTree'] || changes['dataTarget'] || changes['dataSource']) {
      this.emitResultData(true);
    }
  }

  ngAfterViewInit(): void {
    const wrapperTarget = this.treeTarget.el.nativeElement.querySelector('.p-tree-wrapper');
    const wrapperSource = this.treeSource.el.nativeElement.querySelector('.p-tree-wrapper');
    if (wrapperTarget) {
      wrapperTarget.style.height = this.scrollHeight;
    }
    if (wrapperSource) {
      wrapperSource.style.height = this.scrollHeight;
    }
  }

  pickItemsToRight() {
    if (this.selectedItemsSource.length > 0) {
      // get node leaf selected
      const tempDataTarget: ITreeNodePickList[] = [];
      for (let i = 0; i < this.selectedItemsSource.length; i++) {
        const itemSelected = this.selectedItemsSource[i];
        if (this.isNoChildrenNode(itemSelected) && this.findIndexInDataTarget(itemSelected) === -1) {
          tempDataTarget.push(itemSelected);
        }
      }
      // assign dataTarget
      this.dataTarget = this.dataTarget.concat(tempDataTarget.map(item => Object.assign({}, item)));
      this.emitResultData();
      // reset selected
      this.selectedItemsSource = [];
    }
  }

  pickAllToRight() {
    // get node leaf selected
    const tempDataTarget: ITreeNodePickList[] = this.getAllNodeLeafDataSource();
    // assign dataTarget
    this.dataTarget = tempDataTarget.map(item => Object.assign({}, item)).sort((a, b) => {
      if (a.label && b.label) {
        return (a.label < b.label ? -1 : 1);
      }
      return 1;
    });
    // emit
    this.emitResultData();
  }

  getAllNodeLeafDataSource(): ITreeNodePickList[] {
    // select all node
    for (let i = 0; i < this.dataSource.length; i++) {
      const index = this.treeSource.findIndexInSelection(this.dataSource[i]);
      const selected = index >= 0;
      if (!selected) {
        this.treeSource.onNodeClick({ target: null }, this.dataSource[i]);
      }
    }
    // get node leaf selected
    const tempDataTarget: ITreeNodePickList[] = [];
    for (let i = 0; i < this.selectedItemsSource.length; i++) {
      const itemSelected = this.selectedItemsSource[i];
      if (this.isNoChildrenNode(itemSelected)) {
        tempDataTarget.push(itemSelected);
      }
    }
    // reset selected
    this.selectedItemsSource = [];
    return tempDataTarget;
  }

  getAllNodeLeafSelectedItemsSource(): ITreeNodePickList[] {
    // get node leaf selected
    const tempDataTarget: ITreeNodePickList[] = [];
    for (let i = 0; i < this.selectedItemsSource.length; i++) {
      const itemSelected = this.selectedItemsSource[i];
      if (this.isNoChildrenNode(itemSelected)) {
        tempDataTarget.push(itemSelected);
      }
    }
    return tempDataTarget;
  }

  pickItemsToLeft() {
    this.dataTarget = this.dataTarget.filter(n => !this.selectedItemsTarget.includes(n));
    this.emitResultData();
    this.selectedItemsTarget = [];
  }

  pickAllToLeft() {
    this.dataTarget = [];
    this.emitResultData();
    this.selectedItemsTarget = [];
  }

  findIndexInDataTarget(node: ITreeNodePickList) {
    return this.dataTarget.findIndex(n => n.key === node.key);
  }

  isNoChildrenNode(node: ITreeNodePickList) {
    if (!node.children) {
      return true;
    }
    return false;
  }

  // event change data
  emitResultData(changeBySetDefault = false): void {
    const tempEmitData: IChangeDataPickList = {
      source: this.dataSource,
      target: this.dataTarget,
      disabled: this.blockTree,
      changeBySetDefault: changeBySetDefault,
      nodeLeafSelectedItemsSource: this.getAllNodeLeafSelectedItemsSource()
    };
    this.evOnChangeData.emit(tempEmitData);
  }

  nodeSelectSource(event: {originalEvent: any, node: ITreeNodePickList}) {
    if (!(event?.originalEvent.hasOwnProperty('target') && event?.originalEvent.target === null)) {
      this.evOnNodeSelectSource.emit({nodeLeafSelected: this.getAllNodeLeafSelectedItemsSource()});
    }
  }
}
