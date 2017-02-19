import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule} from '@angular/router';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomComponent } from './room/room.component';
import { ChatService } from './chat.service';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		RoomListComponent,
		RoomComponent,
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		ToastrModule.forRoot(),
		ToastContainerModule.forRoot(),
		RouterModule.forRoot([{
			path: '',
			redirectTo: 'login',
			pathMatch: 'full'

		}, {
			path: 'login',
			component: LoginComponent

		}, {
			path: 'rooms',
			component: RoomListComponent
		}, {
			path: 'rooms/:id',
			component: RoomComponent
		}
		])
	],
	providers: [ChatService],
	bootstrap: [AppComponent]
})
export class AppModule { }
