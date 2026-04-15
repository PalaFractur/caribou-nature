import { supabase } from "./supabase";

export interface UserReview {
  slug: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

function fromDb(row: Record<string, unknown>): UserReview {
  return {
    slug: row.product_slug as string,
    author: row.author as string,
    rating: Number(row.rating),
    comment: row.comment as string,
    date: row.date as string,
  };
}

export async function getUserReviews(slug: string): Promise<UserReview[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_slug", slug)
    .order("date", { ascending: false });
  if (error || !data) return [];
  return data.map(fromDb);
}

export async function saveUserReview(review: UserReview): Promise<void> {
  await supabase.from("reviews").insert({
    product_slug: review.slug,
    author: review.author,
    rating: review.rating,
    comment: review.comment,
  });
}
