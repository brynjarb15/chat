import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ChatService {

	socket: any;

	constructor() {
		this.socket = io('http://localhost:8080/');
		this.socket.on('connect', function(){
			console.log('connect');
		});
	}

	login(userName: string): Observable<boolean> {
		const observable = new Observable(observer => {
			this.socket.emit('adduser', userName, succeeded => {
				observer.next(succeeded);
			});
		});

		return observable;

	}

	getRoomList(): Observable<string[]> {
		const observable = new Observable(observer => {
			this.socket.emit('rooms');
			this.socket.on('roomlist', (lst) => {
				const strArr: string[] = [];
				for ( const x in lst ) {
					strArr.push(x);
				}
				observer.next(strArr);
			});
		});
		return observable;
	}

	getUserList() : Observable<string[]>{
		console.log("getuserlist function!");
		let observable = new Observable(observer =>{
			this.socket.on("updateusers", (room, lis, ops) =>{
				//console.log("room: ", room);
				console.log("lis: ", lis);
				//console.log("ops: " , ops);
				let strArr :string[] = [];
				for (var x in lis){
					console.log("everyuser: ", x)
					strArr.push(x);
				}
				console.log(strArr);
				observer.next(strArr);
			})
		});
		return observable;
	}

	addRoom(roomName: string): Observable<boolean> {
		const observable = new Observable(observer => {
			// TODO: validate that the room name is valid
			const param = {
				room: roomName
			};
			this.socket.emit('joinroom', param, function(a: boolean, b) {
				observer.next(a);
			});

		});

		return observable;
	}

	sendMessage(roomName: string, message: string)/*: Observable<any> */	{
		const param = {
			roomName: roomName,
			msg: message
		};
		this.socket.emit('sendmsg', param);
	}

	getMessageHistory(roomName: string): Observable<any> {
		const observable = new Observable(observer => {
			this.socket.on('updatechat', (rName, msgHistory) => {
				if ( roomName === rName ) {
					observer.next(msgHistory);
				}
			});
		});

		return observable;
	}
}
