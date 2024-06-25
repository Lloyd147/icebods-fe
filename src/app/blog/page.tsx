'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Blogs from '../../components/Blogs/index';
import { toast } from 'react-toastify';

export interface BlogPost {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  enclosure: any;
  categories: string[];
  'content:encoded': string;
}

const Blog = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const blogs = JSON.parse(localStorage.getItem('blogs')!);

    if (blogs) setBlogs(blogs);
    else {
      setLoading(true);
      axios
        .get('/api/blog')
        .then((res) => {
          setBlogs(res?.data?.parsedRss?.items);
          localStorage.setItem('blogs', JSON.stringify(res?.data?.parsedRss?.items));
        })
        .catch(() => {
          toast.error('Something went wrong');
        })
        .finally(() => setLoading(false));
    }
  }, []);

  return (
    <div className="blog-wrapper">
      <div className="container-item">Blogs</div>
      {loading ? (
        <div className="loader-gif">
          <img src="/images/loading.gif" alt="" />
        </div>
      ) : (
        <div className="blogger_container">
          {blogs?.map((item, index) => (
            <Blogs item={item} key={index} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
