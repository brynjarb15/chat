import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	userName = '';

	constructor(private chatService: ChatService,
				private router: Router,
				private toastrService: ToastrService) {	}

	ngOnInit() {
	}

	onLogin() {
		if (this.userName.length < 1) {
			this.toastrService.warning('Username can\'t be empty');
			return;
		}
		this.chatService.login(this.userName).subscribe(succeeded => {
			if (succeeded === true) {
				this.chatService.setUserName(this.userName);
				this.router.navigate(['/rooms']);
			} else {
				this.toastrService.warning('Sorry, but this username is already taken or it is to long');
			}
		});
	}

}
