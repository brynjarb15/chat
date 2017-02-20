import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChatService {

	socket: any;
	userName: string;
	privateMessages = [];

	constructor() {
		this.socket = io('http://localhost:8080/');
		this.socket.on('connect', function () {
			console.log('connect');
		});
	}

	setUserName(userName: string) {
		this.userName = userName;
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
				for (const i in lst) {
					if (lst.hasOwnProperty(i)) {
						strArr.push(i);
					}
				}
				observer.next(strArr);
			});
		});
		return observable;
	}

	getAllUsers(): Observable<string[]> {
		const observable = new Observable(observer => {
			this.socket.emit('users');
			this.socket.on('userlist', (allUserslist) => {
				observer.next(allUserslist);
			});
		});
		return observable;
	}

	getUserListForRoom(roomName: string): Observable<any> {
		const observable = new Observable(observer => {
			this.socket.on('updateusers', (room, users, ops) => {
				if (room === roomName) {
					// change users and ops into arrays
					const usersList: string[] = [];
					for (const i in users) {
						if (users.hasOwnProperty(i)) {
							usersList.push(i);
						}
					}
					const opsList: string[] = [];
					for (const j in ops) {
						if (ops.hasOwnProperty(j)) {
							opsList.push(j);
						}
					}
					// send forward both the lists
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
			if (roomName.length < 1) {
				return;
			}
			const param = {
				room: roomName
			};
			this.socket.emit('joinroom', param, function (a: boolean, b) {
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
				if (roomName === rName) {
					observer.next(msgHistory);
				}
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
			this.socket.emit('privatemsg', param, function (succeeded: boolean) {
				observer.next(succeeded);
			});
		});
		return observable;
	}

	listenForPrivateMessage(): Observable<any> {
		const observable = new Observable(observer => {
			this.socket.on('recv_privatemsg', (fromUser, message) => {
				const param = {
					fromUser: fromUser,
					message: message
				};
				this.privateMessages.push(param);
				observer.next(this.privateMessages);
			});
		});
		return observable;
	}

	banPerson(name: string, ID: string): Observable<boolean> {
		const observable = new Observable(observer => {
			const param = {
				user: name,
				room: ID
			};
			this.socket.emit('ban', param, function (succeeded: boolean) {
				observer.next(succeeded);
			});
		});
		return observable;
	}
	kickPersonOut(name: string, ID: string): Observable<boolean> {
		const observable = new Observable(observer => {
			const param = {
				user: name,
				room: ID
			};
			this.socket.emit('kick', param, function (succeeded: boolean) {
				observer.next(succeeded);
			});
		});
		return observable;
	}

	kickedPerson(roomName: string): Observable<any> {
		const observable = new Observable(observer => {
			this.socket.on('kicked', (room, user, username) => {
				if (roomName === room) {
					observer.next(user);
				}
			});
		});
		return observable;
	}

	bannedPerson(roomName: string): Observable<any> {
		const observable = new Observable(observer => {
			this.socket.on('banned', (room, user, username) => {
				if (roomName === room) {
					observer.next(user);
				}
			});
		});
		return observable;
	}

	makeOp(roomName: string, userToOp: string): Observable<boolean> {
		const observable = new Observable(observer => {
			const param = {
				room: roomName,
				user: userToOp
			};
			this.socket.emit('op', param, function (succeeded: boolean) {
				observer.next(succeeded);
			});
		});
		return observable;
	}

	removeFromOp(roomName: string, userToOp: string): Observable<boolean> {
		const observable = new Observable(observer => {
			const param = {
				room: roomName,
				user: userToOp
			};
			this.socket.emit('deop', param, function (succeeded: boolean) {
				observer.next(succeeded);
			});
		});
		return observable;
	}

	checkIfOpped(roomName: string): Observable<any> {
		const observable = new Observable(observer => {
			this.socket.on('opped', (room, user, username) => {
				if (roomName === room) {
					observer.next(user);
				}
			});
		});
		return observable;
	}

	checkIfDeOpped(roomName: string): Observable<any> {
		const observable = new Observable(observer => {
			this.socket.on('deopped', (room, user, username) => {
				if (roomName === room) {
					observer.next(user);
				}
			});
		});
		return observable;
	}

	leaveChatRoom(roomID: any) {
		this.socket.emit('partroom', roomID);
	}

	disconnectFrom() {
		this.userName = undefined;
		console.log(this.userName);
		this.socket.emit('quit');
	}

	checkIfSignedIn(): boolean {
		return this.userName === undefined;
	}

	checkForJoinOrLeaveRoom(roomName: string): Observable<any> {
		const observable = new Observable(observer => {
			this.socket.on('servermessage', (info, room, userJoining) => {
				if (roomName === room) {
					if (this.userName !== userJoining) {
						const param = {
							info: info,
							user: userJoining,
							room: room
						};
						observer.next(param);
					}
				}
			});
		});
		return observable;
	}
}
