

import BlogDetails from "@/components/BlogDetails";

const Page = ({ params }) => {
  const id = params.id;

  return <BlogDetails id={id} />
};

export default Page;
