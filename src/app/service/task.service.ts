import { Injectable } from '@angular/core';

import{HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {Observable} from 'rxjs';
import { Task } from '../interfaces/task';
import { Completed } from '../interfaces/task';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private actualizarTablaSubject = new BehaviorSubject<boolean>(false);

  actualizarTabla$ = this.actualizarTablaSubject.asObservable();

  private endpoint:string = environment.endPoint;
  private apiUrl:string = this.endpoint + "Tarea/";

  constructor(private http:HttpClient) { }

  getList():Observable<Task[]>{
    return this.http.get<Task[]>(`${this.apiUrl}Lista`);
  }

  add(request:Task):Observable<Task>{
    return this.http.post<Task>(`${this.apiUrl}Agregar`,request);
  }
  delete(idTarea:number):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}Eliminar/${idTarea}`);
  }
  update(idTarea: number, tareaActualizada: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}Actualizar/${idTarea}`, tareaActualizada);
  }

  Completed(idTarea: number, tareaActualizada: Completed): Observable<Completed> {
    return this.http.put<Completed>(`${this.apiUrl}Realizar/${idTarea}`, tareaActualizada);
  }

  notificarActualizacionTabla() {
    this.actualizarTablaSubject.next(true);
  }

}