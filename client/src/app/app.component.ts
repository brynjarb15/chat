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

	constructor(private chatService: ChatService,
				private toastrService: ToastrService,
				private toastrConfig: ToastrConfig) {
					// toastrConfig.timeOut = 100000;
	}

	ngOnInit() {
		// this.toastrService.overlayContainer = this.toastContainer;
	}


}


