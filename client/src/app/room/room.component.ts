import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatService } from '../chat.service';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-room',
	templateUrl: './room.component.html',
	styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, AfterViewChecked {

	roomID: string;
	newMessage = '';
	messageHistory: any;
	users: string[];
	ops: string[];
	allUsers: string[];
	IAmAnOp = false;
	selectedUser: string;

	constructor(private chatService: ChatService,
		private router: Router,
		private route: ActivatedRoute,
		private toastrService: ToastrService) { }

	ngOnInit() {
		if (this.chatService.checkIfSignedIn()) {
			this.router.navigate(['login']);
		}

		this.roomID = this.route.snapshot.params['id'];

		this.chatService.getMessageHistory(this.roomID).subscribe(msgHistory => {
			this.messageHistory = msgHistory;
		});

		this.chatService.getUserListForRoom(this.roomID).subscribe(lists => {
			this.users = lists.usersList;
			this.ops = lists.opsList;
			this.allUsers = this.ops.concat(this.users);
			for (let i = 0; i < this.ops.length; i++) {
				if (this.ops[i] === this.chatService.userName) {
					this.IAmAnOp = true;
					break;
				}
			}
		});

		this.chatService.kickedPerson(this.roomID).subscribe(user => {
			if (this.chatService.userName === user) {
				this.toastrService.warning('You got kicked out of the room ' + this.roomID, 'Kick message');
				this.router.navigate(['rooms']);

			} else {
				this.toastrService.info(user + ' got kicked out of the room', 'Kick message');
			}

		});

		this.chatService.bannedPerson(this.roomID).subscribe(user => {
			if (this.chatService.userName === user) {
				this.toastrService.error('You got banned from the room ' + this.roomID, 'Ban message');
				this.router.navigate(['rooms']);
			} else {
				this.toastrService.info(user + ' got banned from the room', 'Ban message');
			}
		});

		this.chatService.checkIfOpped(this.roomID).subscribe(user => {
			if (this.chatService.userName === user) {
				this.toastrService.success('You got opped in the room ' + this.roomID, 'Op message');
				this.IAmAnOp = true;
			}
		});

		this.chatService.checkIfDeOpped(this.roomID).subscribe(user => {
			if (this.chatService.userName === user) {
				this.toastrService.warning('You got deopped in the room ' + this.roomID, 'Op message');
				this.IAmAnOp = false;
			}
		});

		this.chatService.checkForJoinOrLeaveRoom(this.roomID).subscribe((InfoAndUserAndRoom) => {
			const whatHappened = InfoAndUserAndRoom.info;
			const user = InfoAndUserAndRoom.user;
			const room = InfoAndUserAndRoom.room;
			if (whatHappened === 'join') {
				this.toastrService.info(user + ' joined the room ' + room, 'Join message');
			} else if (whatHappened === 'part' || whatHappened === 'quit') {
				this.toastrService.info(user + ' left the room ' + room, 'Leaving message');
			}
		});
	}

	ngAfterViewChecked() {
		// Keep the scrollbar at the bottom so you can see the newest messages
		const objDiv = document.getElementById('messageHistory');
		objDiv.scrollTop = objDiv.scrollHeight;
	}

	sendMessage() {
		this.chatService.sendMessage(this.roomID, this.newMessage);
		this.newMessage = '';
	}

	leaveChatRoom() {
		this.chatService.leaveChatRoom(this.roomID);
		this.router.navigate(['rooms']);
	}

	kickOut() {
		this.chatService.kickPersonOut(this.selectedUser, this.roomID).subscribe(succeeded => {
			if (succeeded) {
				console.log(this.selectedUser, ' has been kicked out');
			} else {
				this.toastrService.warning('Failed to kick out ' + this.selectedUser);
			}
		});
	}

	ban() {
		this.chatService.banPerson(this.selectedUser, this.roomID).subscribe(succeeded => {
			if (succeeded) {
				console.log(this.selectedUser, ' has been banned');
			} else {
				this.toastrService.warning('Failed to ban ' + this.selectedUser);
			}
		});
	}

	selectUser(user: string) {
		this.selectedUser = user;
	}

	// make someone an op
	op() {
		this.chatService.makeOp(this.roomID, this.selectedUser).subscribe(succeeded => {
			if (succeeded) {
				this.toastrService.success(this.selectedUser, ' has been made op');
				console.log(this.selectedUser, ' has been made op');
			} else {
				this.toastrService.warning('Failed to make ' + this.selectedUser + ' an op');
			}
		});
	}

	//remove someone from op
	deOp() {
		this.chatService.removeFromOp(this.roomID, this.selectedUser).subscribe(succeeded => {
			if (succeeded) {
				this.toastrService.success(this.selectedUser, ' has been removed from op');
				console.log(this.selectedUser, ' has been removed from op');
			} else {
				this.toastrService.warning('Failed to remove ' + this.selectedUser + ' from op');
			}
		});
	}

}
