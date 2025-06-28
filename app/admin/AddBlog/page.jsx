'use client'

const page = () => {
  return (
    <div>
        <h1 className="text-2xl font-bold mb-4">Add New Blog</h1>
        <form className="space-y-4">
            <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input type="text" className="w-full p-2 border rounded" placeholder="Enter blog title" />
            </div>
            <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea className="w-full p-2 border rounded" rows="5" placeholder="Write your blog content here"></textarea>
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Blog</button>
        </form>
    </div>
  )
}

export default page