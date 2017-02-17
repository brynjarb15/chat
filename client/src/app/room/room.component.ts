import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { ChatService } from '../chat.service';

@Component({
	selector: 'app-room',
	templateUrl: './room.component.html',
	styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

	roomID : string;

	constructor(private chatService : ChatService,
				private router: Router,
				private route: ActivatedRoute) { }

	ngOnInit() {
		this.roomID = this.route.snapshot.params['id'];
	}

	back(){
		this.router.navigate(["../rooms"]);
	}
	user(){
		this.router.navigate(["rooms", this.roomID, "users"]);
	}
}
