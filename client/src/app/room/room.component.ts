import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatService } from '../chat.service';

@Component({
	selector: 'app-room',
	templateUrl: './room.component.html',
	styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

	roomID: string;
	newMessage: string;
	messageHistory: any;
	users: string[];

	constructor(private chatService: ChatService,
				private router: Router,
				private route: ActivatedRoute) { }

	ngOnInit() {
		this.roomID = this.route.snapshot.params['id'];
		this.chatService.getMessageHistory(this.roomID).subscribe(msgHistory => {
			this.messageHistory = msgHistory;
		});
		this.chatService.getUserList().subscribe(lis => {
			this.users = lis;
		});
	}

	sendMessage() {
		console.log('before send message');
		this.chatService.sendMessage(this.roomID, this.newMessage);
		this.newMessage = '';
	}
	
	back(){
		this.router.navigate(["../rooms"]);
	}
	getUsers(){
		this.router.navigate(["rooms", this.roomID, "users"]);
	}
}
