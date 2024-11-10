import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-center">
        <h1 className="text-4xl font-bold text-center sm:text-center">
          dIB59's Blog
        </h1>
        <p className="text-lg text-center sm:text-left">
          A blog about software development and other things.
        </p>
        <h2 className="text-2xl font-bold text-center sm:text-left">
          Recent Posts
        </h2>
        <ul className="flex flex-col gap-4">
          {/* 
          here we will map over the posts and render a list item for each post
          */}
         

        </ul>
        
      
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
