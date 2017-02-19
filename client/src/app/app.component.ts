import { Component, ViewChild, OnInit } from '@angular/core';
import { ChatService } from './chat.service';
import { ToastrService, ToastContainerDirective, ToastrConfig} from 'ngx-toastr';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	@ViewChild(ToastContainerDirective) toastContainer: any;

	title = 'app works!';
	privateMessage: string;
	sendPrivateMessageTo: string;
	newestPrivateMessage: string;

	constructor(private chatService: ChatService,
				private toastrService: ToastrService,
				private toastrConfig: ToastrConfig) {
					// toastrConfig.timeOut = 100000;
	}

	ngOnInit() {
		this.chatService.listenForPrivateMessage().subscribe(message => {
			this.newestPrivateMessage = message;
		});
		// this.toastrService.overlayContainer = this.toastContainer;
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


