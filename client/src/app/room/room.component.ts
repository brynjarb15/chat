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
	newMessage: string;
	messageHistory: any;
	users: string[];
	ops: string[];
	username: string;
	IAmAnOp = false;
	banOrKick: string;
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
		this.chatService.getUserList(this.roomID).subscribe(lists => {
			this.users = lists.usersList;
			this.ops = lists.opsList;
			for (let i = 0; i < this.ops.length; i++) {
				if (this.ops[i] === this.chatService.userName) {
					this.IAmAnOp = true;
				}
			}
		});
		this.chatService.redirectKickedPerson(this.roomID).subscribe(user => {
			if (this.chatService.userName === user) {
				this.toastrService.warning('You got kicked out of the room ' + this.roomID, 'Kick message');
				this.router.navigate(['../rooms']);

			} else {
				this.toastrService.info(user + ' got kicked out of the room', 'Kick message');
			}

		});
		this.chatService.redirectBannedPerson(this.roomID).subscribe(user => {
			console.log(this.chatService.userName);
			if (this.chatService.userName === user) {
				this.toastrService.error('You got banned from the room ' + this.roomID, 'Ban message');
				this.router.navigate(['../rooms']);
			} else {
				this.toastrService.info(user + ' got banned from the room', 'Ban message');
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
		const objDiv = document.getElementById('messageHistory');
		objDiv.scrollTop = objDiv.scrollHeight;
	}

	sendMessage() {
		this.chatService.sendMessage(this.roomID, this.newMessage);
		this.newMessage = '';
	}

	back() {
		this.chatService.disconnectFromChatRoom(this.roomID);
		this.router.navigate(['../rooms']);
		console.log('back: ', this.users);
	}

	getUsers() {
		this.router.navigate(['rooms', this.roomID, 'users']);
	}

	kickOut() {
		this.chatService.kickPersonOut(this.banOrKick, this.roomID).subscribe(succeeded => {
			if (succeeded) {
				console.log(this.banOrKick, ' has been kicked out');
			}
		});
	}
	ban() {
		this.chatService.banPerson(this.banOrKick, this.roomID).subscribe(succeeded => {
			if (succeeded) {
				console.log(this.banOrKick, ' has been banned');
			}
		});
	}
	disconnectFromApp() {
		this.chatService.disconnectFrom();
		this.router.navigate(['../login']);
	}
}
