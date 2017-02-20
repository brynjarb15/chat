import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-room-list',
	templateUrl: './room-list.component.html',
	styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {

	rooms: string[];
	allUsers: string[];
	allUsersExceptCurrent: string[];
	newRoomName = '';
	privateMessage: string;
	sendPrivateMessageTo: string;
	newestPrivateMessage: string;
	privateMessages: any;

	constructor(private chatService: ChatService,
		private router: Router,
		private toastrService: ToastrService) { }


	ngOnInit() {
		console.log('username', this.chatService.userName);
		if (this.chatService.checkIfSignedIn()) {
			this.router.navigate(['login']);
		}
		this.chatService.getRoomList().subscribe(roomList => {
			this.rooms = roomList;
		});

		this.chatService.getAllUsers().subscribe(userList => {
			this.allUsers = userList;
			this.allUsersExceptCurrent = [];
			for (let i = 0; i < this.allUsers.length; i++) {
				if (this.chatService.userName !== this.allUsers[i]) {
					this.allUsersExceptCurrent.push(this.allUsers[i]);
				}
			}
		});

		this.chatService.listenForPrivateMessage().subscribe(message => {
			console.log('herna');
			const fromUser = message[message.length - 1].fromUser;
			this.toastrService.success('You recived a private message from ' + fromUser, 'Private message');
			this.privateMessages = message;
		});
		if (this.privateMessages === undefined) {
			this.privateMessages = this.chatService.privateMessages;
		}
	}

	sendPrivateMsg() {
		this.chatService.sendPrivateMessage(this.sendPrivateMessageTo, this.privateMessage).subscribe(succeeded => {
			if (succeeded) {
				const privateMsg = {
					fromUser: 'You->' + this.sendPrivateMessageTo,
					message: this.privateMessage
				};

				this.chatService.privateMessages.push(privateMsg);
				this.toastrService.success('Private message was sent to ' + this.sendPrivateMessageTo, 'Private message');
				console.log('Private message was sent to', this.sendPrivateMessageTo);
			} else {
				this.toastrService.error('Private message was not sent to ' + this.sendPrivateMessageTo, 'Private message');
				console.log('Private message was not sent to ', this.sendPrivateMessageTo);
			}
		});
	}

	onNewRoom() {
		if (this.newRoomName.length < 1) {
			this.toastrService.warning('Room name can\'t be empty');
			return;
		}
		this.chatService.addRoom(this.newRoomName).subscribe(succeeded => {
			if (succeeded === true) {
				this.router.navigate(['rooms', this.newRoomName]);
			} else {
				this.toastrService.error(this.newRoomName + ' could not be created');
			}
		});
	}

	joinRoom(rName: string) {
		this.newRoomName = rName;
		this.onNewRoom();
	}

	selectUser(user: string) {
		this.sendPrivateMessageTo = user;
	}

	/*disconnectFromApp() {
		this.chatService.disconnectFrom();
		this.router.navigate(['login']);
	}*/
}
