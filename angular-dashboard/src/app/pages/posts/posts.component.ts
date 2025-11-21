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
  selectedPost: Post | null = null;
  loading = true;
  userId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'] ? +params['userId'] : null;

      if (this.userId) {
        this.loadPostsByUser(this.userId);
      } else {
        this.loadAllPosts();
      }
    });
  }

  loadAllPosts(): void {
    this.postsService.getAllPosts().subscribe({
      next: (posts: Post[]) => {
        this.posts = posts;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadPostsByUser(id: number): void {
    this.postsService.getPostsByUser(id).subscribe({
      next: (posts: Post[]) => {
        this.posts = posts;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  openModal(post: Post) {
    this.selectedPost = post;
  }

  closeModal() {
    this.selectedPost = null;
  }
}
