import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router} from '@angular/router';
@Component({
	selector: 'app-room-list',
	templateUrl: './room-list.component.html',
	styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {

	rooms: string[];
	allUsers: string[];
	newRoomName = '';
	privateMessage: string;
	sendPrivateMessageTo: string;
	newestPrivateMessage: string;

	constructor(private chatService: ChatService,
				private router: Router) { }


	ngOnInit() {
		this.chatService.getRoomList().subscribe(roomList => {
			this.rooms = roomList;
		});

		this.chatService.getAllUsers().subscribe(userList => {
			this.allUsers = userList;
		});

		this.chatService.listenForPrivateMessage().subscribe(message => {
			this.newestPrivateMessage = message;
		});
	}

	sendPrivateMsg() {
		this.chatService.sendPrivateMessage(this.sendPrivateMessageTo, this.privateMessage).subscribe(succeeded => {
			if ( succeeded ) {
				console.log('Private message was sent to', this.sendPrivateMessageTo);
			} else {
				console.log('Private message was not sent to ', this.sendPrivateMessageTo);
			}
		});
	}
	onNewRoom() {
		if (this.newRoomName.length < 1) {
			// give user feedback about the error
			console.log('room name cant be empty');
			return;
		}
		this.chatService.addRoom(this.newRoomName).subscribe(succeeded => {
			if ( succeeded === true ) {
				this.router.navigate(['rooms', this.newRoomName]);
			}
		});
	}

	joinRoom(rName: string) {
		console.log('joinRoom');
		this.newRoomName = rName;
		this.onNewRoom();
	}

	disconnectFromApp() {
		this.chatService.disconnectFrom();
		this.router.navigate(['../login']);
	}
}
