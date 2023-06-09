import Image from "next/image";
import { useState } from "react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import CrossIcon from "../public/cross.svg";

const AddPost = ({
  addPostHandler,
  updateHandler,
  postId,
  reversePosts,
  loading,
  categories,
}) => {
  const findPost = reversePosts.find((post) => post._id === postId);

  const [posts, setPosts] = useState({
    title: findPost?.title || "",
    description: findPost?.description || "",
    category: findPost?.category || "",
    image: null,
  });
  const [imageUrl, setImageUrl] = useState(findPost?.image.url || "");

  const changeHandler = (event) => {
    setPosts({
      ...posts,
      [event.target.name]: event.target.value,
    });
  };

  const quillChangeHanlder = (value) => {
    setPosts({
      ...posts,
      description: value,
    });
  };

  const imageHandler = (event) => {
    setPosts({
      ...posts,
      image: event.target.files[0],
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", posts.title);
    formData.append("category", posts.category);
    formData.append("description", posts.description);
    if (typeof postId === "string") {
      posts.image
        ? formData.append("image", posts.image)
        : formData.append("imageUrl", imageUrl);
      updateHandler(formData, postId);
    } else {
      formData.append("image", posts.image);
      addPostHandler(formData);
    }
  };

  const imageView = () => {
    if (imageUrl) {
      return (
        <div className="relative">
          <Image
            unoptimized
            alt="not found"
            className="rounded shadow-sm"
            src={imageUrl}
            width={200}
            height={200}
          />
          <div>
            <Image
              src={CrossIcon}
              alt="clear"
              className="cursor-pointer border absolute top-0 -right-10"
              onClick={() => setImageUrl(null)}
              width={40}
              height={40}
            />
          </div>
        </div>
      );
    } else if (posts.image) {
      return (
        <div className="relative">
          <Image
            alt="not found"
            className="rounded shadow-sm"
            src={URL.createObjectURL(posts.image)}
            width={200}
            height={200}
          />
          <div>
            <Image
              src={CrossIcon}
              alt="clear"
              className="cursor-pointer border absolute top-0 -right-10"
              onClick={() => setPosts({ ...posts, image: null })}
              width={40}
              height={40}
            />
          </div>
        </div>
      );
    } else {
      return (
        <label>
          <div className="rounded shadow-sm w-full h-full cursor-pointer bg-primary">
            <input type="file" className="hidden" onChange={imageHandler} />
          </div>
        </label>
      );
    }
  };

  return (
    <form className="space-y-5" onSubmit={onSubmitHandler}>
      <p className="text-xl font-semibold">
        {typeof postId === "string" ? "Update Post" : "Add Post"}
      </p>
      <div>
        <label>Title</label>
        <input
          type="text"
          placeholder="Enter title"
          className="px-5 py-4 outline-0 rounded shadow-sm w-full focus:ring appearance bg-primary"
          name="title"
          value={posts.title}
          onChange={changeHandler}
        />
      </div>
      <div>
        <label>Description</label>
        <ReactQuill
          theme="snow"
          value={posts.description}
          onChange={quillChangeHanlder}
          placeholder="Enter description"
          className="bg-primary h-56 pb-10"
        />
      </div>
      <div>
        <label>Category</label>
        <select
          className="px-5 py-4 outline-0 rounded shadow-sm w-full focus:ring appearance bg-primary"
          name="category"
          value={posts.category}
          onChange={changeHandler}
        >
          <option>Default</option>
          {categories.map((cat) => (
            <option key={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div className="w-40 h-40">
        <label>Image</label>
        {imageView()}
      </div>
      <div className="pt-10">
        <button
          className={
            loading
              ? "bg-blue-900 text-white px-5 py-2 rounded-sm hover:bg-blue-800 shadow-sm w-full opacity-50 cursor-not-allowed"
              : "bg-blue-900 text-white px-5 py-2 rounded-sm hover:bg-blue-800 shadow-sm w-full"
          }
        >
          {typeof postId === "string" ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
};

export default AddPost;
