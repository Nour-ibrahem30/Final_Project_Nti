import { TestBed } from '@angular/core/testing'; import { provideHttpClient } from '@angular/common/http'; import { NotificationService } from './notification-service';
describe('NotificationService',()=>{it('creates',()=>{TestBed.configureTestingModule({providers:[NotificationService,provideHttpClient()]});expect(TestBed.inject(NotificationService)).toBeTruthy();});});
