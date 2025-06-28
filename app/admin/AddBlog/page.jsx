'use client'

const page = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add New Blog</h1>
      <form className="space-y-4">
        <div className="mb-3">
          <label className="mb-1">Title</label>
          <input type="text" className="form-control" placeholder="Enter blog title" />
        </div>
        <div className="mb-3">
          <label className="mb-1">Category</label>
          <input type="text" className="form-control" placeholder="Enter blog Category" />
        </div>
        <div className="mb-3">
          <label className="mb-1">Content</label>
          <textarea className="form-control" rows="5" placeholder="Write your blog content here"></textarea>
        </div>
        <div className="mb-3">
          <label className="mb-1">Author</label>
          <input type="text" className="form-control" placeholder="Enter blog Author" />
        </div>

        <div className="mb-3">
          <label className="mb-1" htmlFor="">Thumbnail Image</label>
          <input type="file" id="thumbnail-image" className="form-control" placeholder="Enter blog Author" />
        </div>

        <button type="submit" className="btn btn-primary">Add Blog</button>
      </form>
    </div>
  )
}

export default page