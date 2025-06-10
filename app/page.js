async function getPosts() {
  try {
    const res = await fetch('https://eslhiring.com/wp-json/wp/v2/posts', {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }

    const posts = await res.json();
    return posts;
  } catch (err) {
    console.error('Error fetching posts:', err.message);
    return []; // fallback to empty list
  }
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <main style={{ padding: 20 }}>
      <h1>WordPress Blog Posts</h1>
      {posts.length === 0 ? (
        <p>No blog posts available right now.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <h3 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
              <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
