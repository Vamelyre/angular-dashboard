import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PostsService, Post } from '../../services/posts.service';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  posts: Post[] = [];
  loading = true;
  userId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = +params['userId'];

      if (this.userId) {
        this.loadPosts();
      }
    });
  }

  loadPosts() {
    this.postsService.getPostsByUser(this.userId!).subscribe({
      next: data => {
        this.posts = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
