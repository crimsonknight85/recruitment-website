async function getPosts() {
  const res = await fetch('https://eslhiring.com/wp-json/wp/v2/posts', {
    next: { revalidate: 60 }
  });
  const posts = await res.json();
  return posts;
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <main style={{ padding: 20 }}>
      <h1>WordPress Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h3 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
          </li>
        ))}
      </ul>
    </main>
  );
}
