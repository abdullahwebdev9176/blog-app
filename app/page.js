"use client";

import BlogList from "@/components/BlogList";

export default function HomePage() {
  return (
    <main className="container-fluid">
      <div className="row">
        <div className="col-xl-10 mx-auto">
            <BlogList />
        </div>
      </div>
    </main>
  );
}
