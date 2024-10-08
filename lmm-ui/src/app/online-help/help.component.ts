import { SideBar } from 'rbn-common-lib/lib/models/sidebar';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPageTop } from 'rbn-common-lib';
import { HelpItem } from '../types/sidebar';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  menuItemsSidebar: SideBar[] = [];
  pageTop: IPageTop;
  sidebarConfig = {
    usePathForActiveItem: true,
    useSearch: true,
    useFavorites: false
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.initTopbar();
    this.menuItemsSidebar = HelpItem;
  }

  menuItemClicked(routeData: any) {
    if (routeData?.path) {
      console.log(routeData?.path);
      this.router.navigateByUrl(routeData.path);
    }
  }

  initTopbar() {
    this.pageTop = {
      logo: {
        productName: 'ONLINE HELP | ',
        noneUppercase: true
      },
      productInfo: {
        productTitle: 'LINE MAINTENANCE MANAGER'
      },
      profiles:[]
    };
  }

}
