import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import {  PREFIX_URL } from 'src/app/types/const';
import { AuthenticationService } from '../services/authentication.service';
import { PreferencesService } from 'src/app/services/preferences.service';
import { CommonService } from 'src/app/services/common.service';
import { StatusLogService } from 'src/app/services/status-log.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  showTerms = false;
  showVersion = false;
  showGroup = true;
  groupName = '';

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private preferencesService: PreferencesService,
    private titleService: Title,
    private commonService: CommonService,
    private statusLogService: StatusLogService
  ) {}

  ngOnInit(): void {
    this.authService.getCLLI().subscribe(rs => {
      this.groupName = rs;
      this.titleService.setTitle('LMM | ' + rs);
    }, err => {
      this.commonService.showAPIError(err);
    });
  }

  onSuccessfulLogin(res: HttpResponse<any>) {
    const preferences = this.preferencesService.handlePreferencesStorage();
    if (preferences) {
      this.router.navigateByUrl( PREFIX_URL + '/home');
      this.statusLogService.pushLogs('VRB: Connected to the ORB');
    } else {
      this.router.navigateByUrl(PREFIX_URL + '/reports');
    }
  }
}
