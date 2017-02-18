import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatService } from '../chat.service';

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
	banOrKick: string;
	
	
	constructor(private chatService: ChatService,
				private router: Router,
				private route: ActivatedRoute) { }

	ngOnInit() {
		console.log(this.banOrKick);
		this.roomID = this.route.snapshot.params['id'];

		this.chatService.getMessageHistory(this.roomID).subscribe(msgHistory => {
			this.messageHistory = msgHistory;
		});
		this.chatService.getUserList(this.roomID).subscribe(lists => {
			this.users = lists.usersList;
			this.ops = lists.opsList;
		});
		this.chatService.redirectKickedPerson(this.roomID, this.banOrKick).subscribe(user => {
			if (this.chatService.userName === user) {
				this.router.navigate(["../rooms"]);
			}
			else {
				//TODO: láta alla vita
			}
		});
		this.chatService.redirectBannedPerson(this.roomID, this.banOrKick).subscribe(user => {
			console.log(this.chatService.userName);
			if (this.chatService.userName === user) {
				this.router.navigate(["../rooms"]);
			}
			else {
				//TODO: láta alla vita
			}
		});
	}

	ngAfterViewChecked() {
		const objDiv = document.getElementById('messageHistory');
		objDiv.scrollTop = objDiv.scrollHeight;
	}

	sendMessage() {
		console.log('before send message');
		this.chatService.sendMessage(this.roomID, this.newMessage);
		this.newMessage = '';
	}

	back(){
		this.chatService.disconnectFromChatRoom(this.roomID);
		this.router.navigate(["../rooms"]);
		console.log("back: ",this.users);
	}

	getUsers() {
		this.router.navigate(['rooms', this.roomID, 'users']);
	}

	kickOut(){
		this.chatService.kickPersonOut(this.banOrKick, this.roomID).subscribe(succeeded =>{
			if(succeeded){
				console.log(this.banOrKick, " has been kicked out");
			}
		});
	}
	ban(){
		this.chatService.banPerson(this.banOrKick, this.roomID).subscribe(succeeded =>{
			if(succeeded){
				console.log(this.banOrKick, " has been banned");
			}
		});
	}
}
