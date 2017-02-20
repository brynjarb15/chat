import { Component, ViewChild, OnInit, OnDestroy, AfterContentChecked } from '@angular/core';
import { ChatService } from './chat.service';
import { Router } from '@angular/router';
import { ToastrService, ToastContainerDirective, ToastrConfig } from 'ngx-toastr';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterContentChecked {

	@ViewChild(ToastContainerDirective) toastContainer: any;
	public username: string;
	loggedIn = false;

	constructor(private chatService: ChatService,
		private router: Router,
		private toastrService: ToastrService,
		private toastrConfig: ToastrConfig) {
		// Used so there will not show the same toast twice
		toastrConfig.preventDuplicates = true;
	}

	ngOnInit() {
		this.username = this.chatService.userName;
	}

	ngAfterContentChecked() {
		this.username = this.chatService.userName;
		this.loggedIn = true;
		if (this.username === undefined) {
			this.loggedIn = false;
		}
	}

	disconnectFromApp() {
		this.chatService.disconnectFrom();
		this.router.navigate(['login']);
	}

}
