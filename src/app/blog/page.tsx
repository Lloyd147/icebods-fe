"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Blogs from "../../components/Blogs/index";
import { toast } from "react-toastify";
import Footer from "../../components/Footer/index";
import { findItemByKey } from "@/lib/utils";
import { API_ENDPOINT } from "@/lib/constants";

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
  "content:encoded": string;
}

const Blog = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const blogs = JSON.parse(localStorage.getItem("blogs")!);

    if (blogs) setBlogs(blogs);
    else {
      setLoading(true);
      axios
        .get("/api/blog")
        .then((res) => {
          setBlogs(res?.data?.parsedRss?.items);
          localStorage.setItem(
            "blogs",
            JSON.stringify(res?.data?.parsedRss?.items)
          );
        })
        .catch(() => {
          toast.error("Something went wrong");
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const [footers, setFooters] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_ENDPOINT}/footer/footers`)
      .then((response: { data: any }) => {
        const footers = response?.data;
        //  dispatch(setOdds(odds));
        setFooters(footers);
      })
      .catch((error: any) => {
        console.log("Odds error: ", error);
      });
    const blogs = JSON.parse(localStorage.getItem("blogs")!);
  }, []);

  const item = findItemByKey(footers, "name", "Blog footer");
  const itemAllFooters = findItemByKey(footers, "name", "Set All Footers");

  return (
    <>
      {" "}
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
      {item?.status == "active" ? (
        <Footer data={item} />
      ) : itemAllFooters?.status == "active" ? (
        <Footer data={itemAllFooters} />
      ) : null}
    </>
  );
};

export default Blog;
