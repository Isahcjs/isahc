
import { createClient, get, post } from '../index.js';

async function clientExample() {
  // Using global functions
  try {
    const response = await get('https://jsonplaceholder.typicode.com/posts/1');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }

  // Using client instance
  const client = createClient('https://jsonplaceholder.typicode.com');
  
  try {
    const posts = await client.get('/posts');
    console.log('Posts count:', posts.data.length);

    const newPost = await client.post('/posts', {
      title: 'My New Post',
      body: 'This is the body',
      userId: 1
    });
    console.log('Created post:', newPost.data);
  } catch (error) {
    console.error('Client error:', error);
  }
}

clientExample();
