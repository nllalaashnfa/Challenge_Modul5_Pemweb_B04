export interface Post {
  id: number;
  title: string;
  content?: string | null;
  body?: string;
  author?: { id: number; name: string | null } | string | null;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  body?: string;
}
