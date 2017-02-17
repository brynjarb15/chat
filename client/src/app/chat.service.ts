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
					if (lst.hasOwnProperty(x)) {
						strArr.push(x);
					}
				}
				observer.next(strArr);
			});
		});
		return observable;
	}

	getUserList(): Observable<string[]> {
		console.log('getuserlist function!');
		const observable = new Observable(observer => {
			this.socket.on('updateusers', (room, lis, ops) => {
				// console.log('room: ', room);
				console.log('lis: ', lis);
				// console.log('ops: ' , ops);
				const strArr: string[] = [];
				for (const x in lis) {
					if (lis.hasOwnProperty(x)) {
						console.log('everyuser: ', x);
						strArr.push(x);
					}
				}
				console.log(strArr);
				observer.next(strArr);
			});
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

	sendMessage(roomName: string, message: string) {
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

	leaveRoom(roomName: string) {
		this.socket.emit('partroom', roomName);
	}

	getData(): Observable<any> {
		const user = {
			name: 'hmm',
			age: 10
		};
		const observable = new Observable(observer => {
			observer.next(user);
		});

		return observable;

	}
	listenForPrivateMessage(): Observable<any> {
		const observable = new Observable(observer => {
			this.socket.on('recv_privatemsg', (username, message) => {
				observer.next(message);
			});
		});
		return observable;
	}

	sendPrivateMessage(sendTo: string, msg: string): Observable<boolean> {
		const observable = new Observable(observer => {
			const param = {
				nick: sendTo,
				message: msg
			};
			this.socket.emit('privatemsg', param, function(succeeded: boolean) {
				observer.next(succeeded);
			});
		});
		return observable;
	}

}

