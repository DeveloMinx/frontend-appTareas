import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from 'src/app/service/task.service';
import { Task } from 'src/app/interfaces/task';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {

  formularioEditar: FormGroup;
  taskComplete!: number;
  listaTareas:Task[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public tareaEditar: Task,
    private fb: FormBuilder,
    private taskService: TaskService
    
  ) {

    this.formularioEditar = this.fb.group({
      nombre: [tareaEditar.nombre, Validators.required],
      descripcion: [tareaEditar.descripcion],
      prioridad: [tareaEditar.prioridad]
    });
  }
  
  ngOnInit(): void {
    
  }

  guardarCambios() {
    if (this.formularioEditar.valid) {
      if (this.tareaEditar) {
        const request: Task = {
          idTarea: this.tareaEditar.idTarea, 
          nombre: this.formularioEditar.value.nombre,
          descripcion: this.formularioEditar.value.descripcion,
          prioridad: this.formularioEditar.value.prioridad,
          taskComplete: this.tareaEditar.taskComplete 
        };
        this.taskService.update(this.tareaEditar.idTarea, request).subscribe(updatedTask => {
          this.dialogRef.close(updatedTask);
          this.obtenerTareas();
          this.taskService.notificarActualizacionTabla();
        });
      }
    }
  }
  
  eliminarTarea() {
    if (this.tareaEditar && this.tareaEditar.idTarea) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas eliminar esta tarea?',
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar tarea',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.taskService.delete(this.tareaEditar.idTarea).subscribe(() => {
            this.dialogRef.close({ eliminado: true });
            this.alertEliminar()
            this.taskService.notificarActualizacionTabla();
          });
        }
      });
    }
  }
  

  obtenerTareas(){
    this.taskService.getList().subscribe({
      next:(data) => {
        this.listaTareas = data;
      },error:(e) => {}
    });

  }
  
  

  cancelar() {
    this.dialogRef.close();
  }



  alertActualizar(){
    this.guardarCambios();
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Tarea actualizada correctamente',
      showConfirmButton: false,
      timer: 1500
    })
  }

  alertEliminar(){
    this.guardarCambios();
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Tarea eliminada correctamente',
      showConfirmButton: false,
      timer: 1500
    })
  }
}