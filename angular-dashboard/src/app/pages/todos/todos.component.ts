import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {

  todos: Todo[] = [];
  userId: number | null = null;
  loading = true;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['userId'];
      if (this.userId) {
        this.loadTodos();
      }
    });
  }

  loadTodos(): void {
    this.http.get<Todo[]>(`https://jsonplaceholder.typicode.com/todos?userId=${this.userId}`)
      .subscribe({
        next: data => {
          this.todos = data;
          this.loading = false;
        },
        error: () => this.loading = false
      });
  }
}
