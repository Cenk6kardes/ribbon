import { SideBar } from 'rbn-common-lib/lib/models/sidebar';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPageTop } from 'rbn-common-lib';
import { HelpSidebarData } from '../types/help-sidebar';
import { TranslateInternalService } from '../services/translate-internal.service';

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

  translateResults: any;
  constructor(
    private router: Router,
    private translateInternalService: TranslateInternalService
  ) {
    this.translateResults = this.translateInternalService.translateResults;
  }

  ngOnInit(): void {
    this.menuItemsSidebar = HelpSidebarData;
    this.initTopbar();
  }

  menuItemClicked(routeData: any) {
    if (routeData?.path) {
      this.router.navigateByUrl(routeData.path);
    }
  }

  initTopbar() {
    this.pageTop = {
      logo: {
        productName:this.translateResults.HELP.TITLE,
        noneUppercase: true
      },
      productInfo: {
        productTitle:this.translateResults.HELP.PRODUCT_TITLE
      },
      profiles: []
    };
  }
}
