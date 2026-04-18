const API_URL = import.meta.env.VITE_API_URL || "";

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  image: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  isFeatured: boolean;
  createdAt: string;
}

const getAuthHeaders = () => {
  const savedUser = localStorage.getItem("vishal_user");
  if (savedUser) {
    const user = JSON.parse(savedUser);
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    };
  }
  return { "Content-Type": "application/json" };
};

export const listBlogs = async () => {
  try {
    const res = await fetch(`${API_URL}/api/blogs`);
    const data = await res.json();
    if (!res.ok) return { error: data.message || "Failed to fetch blogs", data: [] as BlogPost[] };
    return { data: data as BlogPost[], error: null };
  } catch (err: any) {
    return { error: err.message || "Server connection error", data: [] as BlogPost[] };
  }
};

export const fetchBlogBySlug = async (slug: string) => {
  try {
    const res = await fetch(`${API_URL}/api/blogs/${slug}`);
    const data = await res.json();
    if (!res.ok) return { error: data.message || "Failed to fetch blog post", data: null };
    return { data: data as BlogPost, error: null };
  } catch (err: any) {
    return { error: err.message || "Server connection error", data: null };
  }
};

export const createBlog = async (payload: Partial<BlogPost>) => {
  try {
    const res = await fetch(`${API_URL}/api/blogs`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.message || "Failed to create blog post" };
    return { error: null, data };
  } catch (err: any) {
    return { error: err.message || "Server connection error" };
  }
};

export const updateBlog = async (id: string, payload: Partial<BlogPost>) => {
  try {
    const res = await fetch(`${API_URL}/api/blogs/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.message || "Failed to update blog post" };
    return { error: null, data };
  } catch (err: any) {
    return { error: err.message || "Server connection error" };
  }
};

export const deleteBlog = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/api/blogs/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.message || "Failed to delete blog post" };
    return { error: null };
  } catch (err: any) {
    return { error: err.message || "Server connection error" };
  }
};
