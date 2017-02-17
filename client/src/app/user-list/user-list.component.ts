import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

	users: string[];
  constructor(
	  private chatService : ChatService,) { }

	ngOnInit() {
		this.chatService.getUserList().subscribe(lis => {
			this.users = lis;
		});
	}
	
}