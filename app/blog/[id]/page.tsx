import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';

// Types for the metadata and content
interface BlogMetadata {
  title: string;
  date: string;
}

interface BlogPostProps {
  params: {
    id: string;
  };
}

// Read file asynchronously
const readFile = fs.promises.readFile;

// Generate paths for all blog posts
export async function generateStaticParams() {
  const blogsDir = path.join(process.cwd(), 'content', 'blogs');
  const files = fs.readdirSync(blogsDir);

  const paths = files.map((file) => ({
    id: file.replace('.txt', '') // Remove .txt extension
  }));

  return paths.map((id) => ({ id }));
}

function parseMetadata(metadata: string): BlogMetadata {
    return metadata.split('\n').reduce((acc, line) => {
      const [key, value] = line.split(':').map(str => str.trim());
      if (key && value) acc[key.toLowerCase() as keyof BlogMetadata] = value;
      return acc;
    }, { title: 'Untitled Post', date: 'No Date Available' });
}

// Fetch and process blog post content
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const { id } = params;
  
    if (!id) {
      console.error('Error: Missing id parameter');
      return { title: 'Post Not Found', description: 'No blog post found for this URL.' };
    }
  
    const filePath = path.join(process.cwd(), 'content', 'blogs', `${id}.txt`);
  
    try {
      const fileContent = await fs.promises.readFile(filePath, 'utf-8');
  
      // Parse the metadata and content
      const [metadata, _content] = fileContent.split('\n\n');
      const metadataObject = parseMetadata(metadata);
  
      return {
        title: metadataObject.title,
        description: metadataObject.date
      };
    } catch (error) {
      console.error(`Failed to read file ${filePath}:`, error);
      return { title: 'Post Not Found', description: 'No blog post found for this URL.' };
    }
  }

// Function to parse the text content into paragraphs
const parseTextContent = (content: string) => {
  const paragraphs = content.split('\n').filter(line => line.trim() !== '');
  return paragraphs.map((para, index) => <p key={index}>{para}</p>);
};

// Blog Post Page Component
export default function BlogPost({ params }: BlogPostProps) {
  const { id } = params;
  const filePath = path.join(process.cwd(), 'content', 'blogs', `${id}.txt`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Parse the metadata and content
  const [metadata, content] = fileContent.split('\n\n'); // Split metadata from content
  const metadataObject: BlogMetadata = metadata
  .split('\n')
  .reduce((acc, line) => {
    const [key, value] = line.split(':').map(str => str.trim());
    if (key && value && key.toLowerCase() in acc) {
      acc[key.toLowerCase() as keyof BlogMetadata] = value;
    }
    return acc;
  }, {
    title: 'Untitled Post', // default title if not provided
    date: 'Unknown Date'    // default date if not provided
  });


  return (
    <div>
      <h1>{metadataObject.title}</h1>
      <p><strong>{metadataObject.date}</strong></p>
      <div>{parseTextContent(content)}</div>
    </div>
  );
}
