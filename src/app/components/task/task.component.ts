import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Task } from 'src/app/interfaces/task';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from 'src/app/service/task.service';
import { Completed } from 'src/app/interfaces/task';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements OnInit {
  listaTareas: Task[] = [];
  formularioTarea: FormGroup;
  taskComplete: number = 0;
  showForm:boolean=false;

  dataSource!: MatTableDataSource<Task>;
  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  columnas: string[] = [
    'nombre',
    'descripcion',
    'prioridad',
    'estado',
    'acciones',
  ];

  constructor(
    private _tareaServicio: TaskService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.formularioTarea = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      prioridad: ['', Validators.required],
    });
  }

  obtenerTareas() {
    this._tareaServicio.getList().subscribe({
      next: (data) => {
        this.listaTareas = data;
        this.dataSource = new MatTableDataSource(this.listaTareas);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (e) => {},
    });
  }

  ngOnInit(): void {
    this.obtenerTareas();

    this._tareaServicio.actualizarTabla$.subscribe(() => {
      this.obtenerTareas();
    });
  }

  aplicarFiltro(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  agregarTarea() {
    const request: Task = {
      idTarea: 0,
      nombre: this.formularioTarea.value.nombre,
      descripcion: this.formularioTarea.value.descripcion,
      prioridad: this.formularioTarea.value.prioridad,
      taskComplete: this.taskComplete,
    };

    this._tareaServicio.add(request).subscribe({
      next: (data) => {
        this.listaTareas.push(data);
        this.formularioTarea.patchValue({
          nombre: '',
          descripcion: '',
          prioridad: '',
        });
        this.hiddenForm();
        this.alertAddTask();
        this.obtenerTareas();
      },
      error: (e) => {},
    });
  }

  abrirModalEditar(tarea: Task) {
    const dialogRef = this.dialog.open(EditTaskComponent, {
      width: '400px',
      data: tarea,
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  alertTaskCompleted(tarea: Task) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas marcar esta tarea como completada?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, completar tarea',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        tarea.taskComplete = 1;
        const tareaActualizada: Completed = {
          taskComplete: tarea.taskComplete,
        };

        this._tareaServicio
          .Completed(tarea.idTarea, tareaActualizada)
          .subscribe({
            next: (data) => {
              this.obtenerTareas();
            },
            error: (e) => {},
          });
      }
    });
  }

  alertAddTask(){
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Tarea agregada exitosamente',
      showConfirmButton: false,
      timer: 1500
    })
  }

  mostrarForm(){
    this.showForm=true;
  }

  hiddenForm(){
    this.showForm=false;
    this.formularioTarea.patchValue({
      nombre: '',
      descripcion: '',
      prioridad: '',
    });
  }
}
