export interface Task {
    idTarea:number,
    nombre:string,
    descripcion:string,
    prioridad:string,
    taskComplete:number,
}

export interface Completed{
    taskComplete:number,
}