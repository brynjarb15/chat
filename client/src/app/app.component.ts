import { Component } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'app works!';
	privateMessage: string;
	sendPrivateMessageTo: string;
	newestPrivateMessage: string;

	constructor(private chatService: ChatService) {

	}

	ngOnInit() {
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


}


