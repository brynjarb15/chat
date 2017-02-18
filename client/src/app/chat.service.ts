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

	disconnectFromChatRoom(roomID: any){
		this.socket.emit('partroom', roomID);
	}

	getUserList(roomName: string) : Observable<any>{
		console.log("getuserlist function!");
		let observable = new Observable(observer =>{
			this.socket.on("updateusers", (room, users, ops) =>{
				if (room === roomName){
					console.log("lis: ", users);
					console.log("ops: ", ops);
					let usersList: string[] = [];
					let opsList: string[] = [];
					for (var i in users) {
						if (users.hasOwnProperty(i)) {
							usersList.push(i);
						}
					}
					for (var j in ops) {
						if (ops.hasOwnProperty(j)) {
							opsList.push(j);
						}
					}
					const lists = {
						usersList: usersList,
						opsList: opsList
					};
					observer.next(lists);
				}
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

	kickPersonOut(name: string, ID: string, obs: string): Observable<boolean>{
		const observable = new Observable(observer =>{
			const param = {
				user: name,
				room: ID,
				username: obs
			}
			this.socket.emit("kick", param, function(succeeded: boolean){
				observer.next(succeeded);
			});
		});
		return observable;
	}

	/*redirectKickedPerson(): Observable<any>{
		const observable = new Observable(observer => {
			this.socket.on('kicked', (room, user, username) => {
				
			});
		});
		return Observable;
	}*/
}