import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router'

@Component({
	selector: 'app-room',
	templateUrl: './room.component.html',
	styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

	roomID : string;

	constructor(private router: Router,
				private route: ActivatedRoute) { }

	ngOnInit() {
		this.roomID = this.route.snapshot.params['id'];
	}

}
