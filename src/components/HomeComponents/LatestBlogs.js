'use client'
import React, { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Link from 'next/link';
import { getBlogImageUrl } from '../../utils/imageUtils';

const LatestBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const swiperRef = useRef(null);

    const fetchWordPressTags = async (tagIds) => {
        if (!tagIds || tagIds.length === 0) return [];
        try {
            const ids = tagIds.join(',');
            const response = await fetch(
                `https://docs.techy-blog.com/wp-json/wp/v2/tags?include=${ids}`,
                { cache: 'no-store' }
            );
            if (!response.ok) return [];
            const tags = await response.json();
            // Return array of tag names
            return tags.map(tag => tag.name);
        } catch (error) {
            console.error('Error fetching WordPress tags:', error);
            return [];
        }
    };

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch(
                    'https://docs.techy-blog.com/wp-json/wp/v2/posts?per_page=10&status=publish&_embed=true',
                    { cache: 'no-store' }
                );
                if (!response.ok) throw new Error('Failed to fetch blogs');

                const wpPosts = await response.json();

                // Transform WordPress posts to match expected blog structure
                const transformedBlogs = await Promise.all(wpPosts.map(async (wpPost) => {
                    const featuredImage = wpPost._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;
                    const wpCategories = wpPost._embedded?.['wp:term']?.[0] || [];
                    
                    // Fetch tags to get tag names
                    const wpTagNames = await fetchWordPressTags(wpPost.tags || []);
                    
                    // Fetch post_author_name from ACF or meta fields, fallback to embedded author
                    const postAuthorName = wpPost.acf?.post_author_name || 
                                         wpPost.meta?.post_author_name || 
                                         wpPost._embedded?.author?.[0]?.name || 
                                         'Unknown Author';

                    return {
                        _id: wpPost.id.toString(),
                        title: wpPost.title?.rendered || '',
                        description: wpPost.content?.rendered || '',
                        slug: wpPost.slug,
                        status: wpPost.status,
                        publishedDate: wpPost.date,
                        updatedAt: wpPost.modified,
                        authorName: postAuthorName,
                        banner: featuredImage,
                        thumbnail: featuredImage,
                        categoryIds: wpCategories.map(cat => ({
                            _id: cat.id.toString(),
                            name: cat.name,
                            slug: cat.slug
                        })),
                        tags: wpTagNames || []
                    };
                }));

                setBlogs(transformedBlogs);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const handleMouseEnter = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.autoplay.pause();
        }
    };

    const handleMouseLeave = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.autoplay.resume();
        }
    };

    if (isLoading) return <div className="text-center text-lg mt-10">Loading...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">Error: {error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 relative">
            <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent mb-12">
                Latest Blog Posts
            </h2>

            {blogs.length === 0 ? (
                <p className="text-center text-gray-500">No published blogs available.</p>
            ) : (
                <div
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="relative"
                >
                    <Swiper
                        ref={swiperRef}
                        spaceBetween={30}
                        slidesPerView={1}
                        loop={true}
                        navigation={{
                            nextEl: '.custom-next',
                            prevEl: '.custom-prev',
                        }}
                        pagination={{ clickable: true }}
                        autoplay={{
                            delay: 3000,
                            pauseOnMouseEnter: true,
                            disableOnInteraction: false
                        }}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        modules={[Navigation, Autoplay]}
                    >
                        {blogs.map((blog) => (
                            <SwiperSlide key={blog._id} className="p-3">
                                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out h-full flex flex-col group">
                                    {/* Image or fallback */}
                                    {getBlogImageUrl(blog) ? (
                                        <div className="overflow-hidden">
                                            <img
                                                src={getBlogImageUrl(blog)}
                                                alt={blog.title}
                                                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
                                                onError={(e) => {
                                                    console.error('Image failed to load:', e.target.src);
                                                    e.target.style.display = 'none';
                                                }}
                                                onLoad={() => {
                                                    console.log('Image loaded successfully:', getBlogImageUrl(blog));
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-48 flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 shadow-lg group-hover:scale-110 transition-transform duration-300 ease-in-out">
                                            <span className="drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                                                {blog.categoryIds?.[0]?.name || 'TechyBlog'}
                                            </span>
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="text-lg font-semibold text-blue-700 mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-purple-600 transition-colors duration-300">
                                            {blog.title}
                                        </h3>
                                        <div
                                            className="text-gray-600 text-sm mb-4 line-clamp-3 min-h-[4.5rem]"
                                            dangerouslySetInnerHTML={{ __html: blog.description }}
                                        />

                                        <div className="mt-auto">
                                            <div className="text-sm text-gray-400 mb-2 flex justify-between">
                                                <span>{blog?.publishedDate ? new Date(blog.publishedDate).toLocaleDateString() : 'No Date'}</span>
                                                <span className="text-purple-600 font-medium">
                                                    By: {blog?.authorName || 'Unknown'}
                                                </span>
                                            </div>
                                            <Link
                                                href={`/${blog.categoryIds?.[0]?.slug || 'blog'}/${blog.slug}`}
                                                className="text-sm font-semibold text-purple-600 hover:text-purple-800 group-hover:scale-105 transition-all duration-300 inline-block"
                                            >
                                                Read More →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Navigation Arrows */}
                    <div className="custom-prev absolute top-1/2 -left-5 transform -translate-y-1/2 cursor-pointer z-10">
                        <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center shadow hover:bg-purple-800 transition">
                            &#8592;
                        </div>
                    </div>
                    <div className="custom-next absolute top-1/2 -right-5 transform -translate-y-1/2 cursor-pointer z-10">
                        <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center shadow hover:bg-purple-800 transition">
                            &#8594;
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LatestBlogs;
