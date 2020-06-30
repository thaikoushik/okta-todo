import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { FormBuilder } from '@angular/forms';
import { task } from '../models/task';
import { switchMap, tap } from 'rxjs/operators';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-add-task',

  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  taskText: string;
  tasks: Array<task> = [];
  username: string;

  constructor(private taskService: TaskService, private fb: FormBuilder) {

  }

  ngOnInit(): void {this.getListOfTasks();}

  addTaskClicked(event) {
    const taskToCreate = new task();
    taskToCreate.text = this.taskText;
    this.taskService.addTask(taskToCreate).subscribe(a => {
      this.getListOfTasks();
    });
  }

  removeTasks() {
    this.taskService.removeTasks(this.tasks.filter(x => x.checked)).subscribe(t => {
      this.getListOfTasks();
    });
    //console.log(this.tasks.filter(x => x.checked));
  }

  private getListOfTasks() {
    this.taskService
        .get()
        .pipe(

          tap(z => {
            const obj = z.map(str=>{
             const tas= new task();
             tas.text = str;
             tas.checked = false;
             return tas;
            } );
            this.tasks = obj;
          })
        )
        .subscribe(p => {
          this.taskText = '';
        });
  }
}
