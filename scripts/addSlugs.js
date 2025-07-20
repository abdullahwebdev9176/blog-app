import { connectDB } from "../lib/config/db.js";
import { BlogModel } from "../lib/models/BlogModel.js";
import slugify from "slugify";

// Generate unique slug for blog posts
const generateUniqueSlug = async (title, excludeId = null) => {
    const baseSlug = slugify(title, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g
    });
    
    let slug = baseSlug;
    let counter = 1;
    
    const query = excludeId ? { slug, _id: { $ne: excludeId } } : { slug };
    
    while (await BlogModel.findOne(query)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
    
    return slug;
};

const migrateBlogSlugs = async () => {
    try {
        console.log("Connecting to database...");
        await connectDB();
        
        console.log("Finding blogs without slugs...");
        const blogsWithoutSlugs = await BlogModel.find({ 
            $or: [
                { slug: { $exists: false } },
                { slug: null },
                { slug: "" }
            ]
        });
        
        console.log(`Found ${blogsWithoutSlugs.length} blogs without slugs`);
        
        if (blogsWithoutSlugs.length === 0) {
            console.log("All blogs already have slugs!");
            return;
        }
        
        for (const blog of blogsWithoutSlugs) {
            console.log(`Generating slug for: "${blog.title}"`);
            const slug = await generateUniqueSlug(blog.title, blog._id);
            
            await BlogModel.findByIdAndUpdate(blog._id, { slug });
            console.log(`✓ Updated blog "${blog.title}" with slug: "${slug}"`);
        }
        
        console.log(`✅ Successfully updated ${blogsWithoutSlugs.length} blogs with slugs!`);
        
    } catch (error) {
        console.error("❌ Error during migration:", error);
    } finally {
        process.exit(0);
    }
};

// Run the migration
migrateBlogSlugs();
