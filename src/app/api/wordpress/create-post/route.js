import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        // Handle JSON request
        let fullName, email, mobileNumber, title, description, content, categories, tags, metaTitle, metaDescription, imageLink;

        try {
            const jsonData = await req.json();
            fullName = jsonData.fullName;
            email = jsonData.email;
            mobileNumber = jsonData.mobileNumber;
            title = jsonData.title;
            description = jsonData.description;
            content = jsonData.content;
            categories = jsonData.categories || [];
            tags = jsonData.tags || [];
            metaTitle = jsonData.metaTitle;
            metaDescription = jsonData.metaDescription;
            imageLink = jsonData.imageLink || '';

        } catch (jsonError) {
            console.error('Error parsing request:', jsonError);
            return NextResponse.json({
                success: false,
                message: 'Failed to parse request data. Please check if form data is being sent correctly.',
                error: jsonError.message
            }, { status: 400 });
        }

        const WORDPRESS_URL = 'https://docs.techy-blog.com';
        const WORDPRESS_USERNAME = (process.env.WORDPRESS_USERNAME || '').trim();
        let WORDPRESS_PASSWORD = (process.env.WORDPRESS_APPLICATION_PASSWORD || '').trim();

        if (!WORDPRESS_USERNAME || !WORDPRESS_PASSWORD) {
            console.error('WordPress credentials not configured');
            console.error('Missing:', {
                WORDPRESS_USERNAME: !WORDPRESS_USERNAME,
                WORDPRESS_APPLICATION_PASSWORD: !WORDPRESS_PASSWORD,
                availableEnvKeys: Object.keys(process.env).filter(k => k.includes('WORDPRESS'))
            });
            return NextResponse.json(
                {
                    success: false,
                    message: 'WordPress credentials not configured. Please add WORDPRESS_USERNAME and WORDPRESS_APPLICATION_PASSWORD to your .env file and restart the server.',
                    details: 'Missing environment variables. Make sure to restart your Next.js dev server after adding them.'
                },
                { status: 500 }
            );
        }

        // Remove spaces from Application Password if present (WordPress generates them with spaces like "xxxx xxxx xxxx")
        WORDPRESS_PASSWORD = WORDPRESS_PASSWORD.replace(/\s+/g, '');

        // Step 1: Get all categories and match by name to get IDs
        const categoriesResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/categories?per_page=100`);
        if (!categoriesResponse.ok) {
            throw new Error('Failed to fetch WordPress categories');
        }
        const wpCategories = await categoriesResponse.json();

        const categoryIds = [];
        categories.forEach(categoryName => {
            if (!categoryName || !categoryName.trim()) return;

            // Try to match by exact name first
            let wpCategory = wpCategories.find(cat =>
                cat.name.toLowerCase().trim() === categoryName.toLowerCase().trim()
            );

            // If not found, try matching by slug
            if (!wpCategory) {
                const categorySlug = categoryName.toLowerCase().trim().replace(/\s+/g, '-');
                wpCategory = wpCategories.find(cat =>
                    cat.slug.toLowerCase() === categorySlug
                );
            }

            // If still not found, try partial match
            if (!wpCategory) {
                wpCategory = wpCategories.find(cat =>
                    cat.name.toLowerCase().includes(categoryName.toLowerCase().trim()) ||
                    categoryName.toLowerCase().trim().includes(cat.name.toLowerCase())
                );
            }

            if (wpCategory) {
                categoryIds.push(wpCategory.id);
            } else {
                console.warn(`Category not found: ${categoryName}`);
            }
        });

        if (categoryIds.length === 0 && categories.length > 0) {
            console.warn('No matching categories found. Post will be created without categories.');
        }

        // Step 2: Get or create tags and ensure they exist (use tag IDs, not names)
        const tagIds = [];
        if (tags && tags.length > 0) {
            const authHeader = 'Basic ' + Buffer.from(`${WORDPRESS_USERNAME}:${WORDPRESS_PASSWORD}`).toString('base64');

            for (const tagName of tags) {
                if (!tagName.trim()) continue;

                const trimmedTagName = tagName.trim();
                const tagSlug = trimmedTagName.toLowerCase().replace(/\s+/g, '-');

                // Try to find existing tag
                const existingTagsResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/tags?slug=${tagSlug}`);
                const existingTags = await existingTagsResponse.json();

                if (existingTags && existingTags.length > 0) {
                    // Tag exists, use the tag ID
                    tagIds.push(existingTags[0].id);
                } else {
                    // Create new tag
                    const createTagResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/tags`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': authHeader,
                        },
                        body: JSON.stringify({
                            name: trimmedTagName,
                            slug: tagSlug,
                        }),
                    });

                    if (createTagResponse.ok) {
                        // Tag created successfully, get the ID
                        const createdTag = await createTagResponse.json();
                        tagIds.push(createdTag.id);
                    } else {
                        const errorText = await createTagResponse.text();
                        console.warn(`⚠️ Failed to create tag: ${trimmedTagName}`, errorText);
                    }
                }
            }
        }

        // Step 3: Format content properly (just the actual blog content)
        // Convert newlines to HTML breaks
        const formattedContent = content ? content.replace(/\n/g, '<br>') : '';

        // Step 4: Test authentication first with multiple methods
        const authHeader = 'Basic ' + Buffer.from(`${WORDPRESS_USERNAME}:${WORDPRESS_PASSWORD}`).toString('base64');

        // Try to authenticate
        const authTestResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/users/me`, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Accept': 'application/json',
            },
        });

        const authResponseText = await authTestResponse.text();
        let authErrorData = {};

        try {
            authErrorData = JSON.parse(authResponseText);
        } catch (e) {
            authErrorData = { message: authResponseText, raw: authResponseText };
        }

        if (!authTestResponse.ok) {
            console.error('❌ Authentication test failed:', {
                status: authTestResponse.status,
                statusText: authTestResponse.statusText,
                headers: Object.fromEntries(authTestResponse.headers.entries()),
                error: authErrorData,
                responseText: authResponseText.substring(0, 500)
            });

            // Provide detailed error message
            let detailedMessage = 'WordPress authentication failed. ';
            let troubleshooting = [];

            if (authTestResponse.status === 401) {
                detailedMessage += 'Invalid credentials. ';
                troubleshooting.push('1) Verify username is the LOGIN username (not display name)');
                troubleshooting.push('2) Application Password should be 24 characters (you have ' + WORDPRESS_PASSWORD.length + ')');
                troubleshooting.push('3) Create a NEW Application Password in WordPress Admin → Users → Your Profile → Application Passwords');
                troubleshooting.push('4) Copy the FULL password (remove all spaces when adding to .env)');
                troubleshooting.push('5) Make sure Application Password is not revoked in WordPress');
                troubleshooting.push('6) Restart Next.js server after updating .env file');

                // Check if password length is wrong
                if (WORDPRESS_PASSWORD.length !== 24) {
                    detailedMessage += `Your password is ${WORDPRESS_PASSWORD.length} characters, but WordPress Application Passwords are always 24 characters. `;
                }
            } else if (authTestResponse.status === 403) {
                detailedMessage += 'Access forbidden. ';
                troubleshooting.push('1) Application Password might be revoked');
                troubleshooting.push('2) User might not have REST API access');
            }

            return NextResponse.json(
                {
                    success: false,
                    message: detailedMessage,
                    error: authErrorData,
                    troubleshooting: troubleshooting.join('\n'),
                    debugInfo: {
                        usernameProvided: WORDPRESS_USERNAME,
                        passwordLength: WORDPRESS_PASSWORD.length,
                        expectedPasswordLength: 24,
                        statusCode: authTestResponse.status,
                        wordpressResponse: authResponseText.substring(0, 200),
                        testEndpoint: 'Visit /api/wordpress/test-auth to test authentication separately'
                    }
                },
                { status: authTestResponse.status }
            );
        }

        const currentUser = authErrorData.id ? authErrorData : await JSON.parse(authResponseText);

        // Step 5: Process image link (no upload needed, just save the URL)

        // Step 6: Create WordPress post directly
        const postData = {
            title: title,
            content: formattedContent, // Just the blog content, no author info
            status: 'pending', // Create as pending for review
            categories: categoryIds.length > 0 ? categoryIds : [],
            tags: tagIds.length > 0 ? tagIds : [], // WordPress REST API requires tag IDs (integers), not names
            excerpt: description || metaDescription || '',
        };

        const createPostResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader,
            },
            body: JSON.stringify(postData),
        });

        const responseText = await createPostResponse.text();
        let errorData = {};

        // Check if WordPress returned a critical error (HTML response instead of JSON)
        if (responseText.includes('critical error') || responseText.includes('Fatal error') || responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
            console.error('❌ WordPress Critical Error:', {
                status: createPostResponse.status,
                responsePreview: responseText.substring(0, 500)
            });

            return NextResponse.json(
                {
                    success: false,
                    message: 'WordPress returned a critical error. This is likely caused by an error in your theme\'s functions.php file. Check your WordPress error logs.',
                    error: 'WordPress critical error detected',
                    troubleshooting: '1) Check WordPress error logs, 2) Review the functions.php code you added, 3) Temporarily remove the functions.php code to test, 4) Check WordPress admin → Tools → Site Health for errors',
                    responsePreview: responseText.substring(0, 300)
                },
                { status: 500 }
            );
        }

        try {
            errorData = JSON.parse(responseText);
        } catch (e) {
            errorData = { message: responseText, raw: responseText.substring(0, 500) };
        }

        if (!createPostResponse.ok) {
            console.error('❌ WordPress API Error:', {
                status: createPostResponse.status,
                statusText: createPostResponse.statusText,
                error: errorData
            });

            // Check if it's an authentication issue
            if (createPostResponse.status === 401) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'WordPress authentication failed. Please check your username and Application Password in .env file.',
                        error: errorData,
                        troubleshooting: 'Verify: 1) WORDPRESS_USERNAME is correct, 2) WORDPRESS_APPLICATION_PASSWORD is correct, 3) Application Password is active in WordPress'
                    },
                    { status: 401 }
                );
            }

            // Check if it's a permission issue
            if (createPostResponse.status === 403 || errorData.code === 'rest_cannot_create' || (errorData.message && errorData.message.includes('not allowed'))) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Permission denied. The WordPress user needs to have Author, Editor, or Administrator role. You may need to add the functions.php code snippet to allow draft creation.',
                        error: errorData,
                        code: errorData.code,
                        troubleshooting: '1) Go to WordPress Admin → Users → Edit the user → Change role to Author or higher, 2) If you added functions.php code, check for syntax errors, 3) Check WordPress error logs'
                    },
                    { status: 403 }
                );
            }

            // Check for PHP/WordPress errors
            if (createPostResponse.status === 500 && (errorData.message?.includes('Fatal') || errorData.message?.includes('error'))) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'WordPress server error. This might be caused by functions.php code or a plugin conflict.',
                        error: errorData,
                        troubleshooting: '1) Check WordPress error logs, 2) Temporarily disable the functions.php code you added, 3) Check WordPress admin → Tools → Site Health'
                    },
                    { status: 500 }
                );
            }

            return NextResponse.json(
                {
                    success: false,
                    message: errorData.message || 'Failed to create WordPress post',
                    error: errorData,
                    code: errorData.code,
                    status: createPostResponse.status
                },
                { status: createPostResponse.status }
            );
        }

        // Parse the successful response
        let createdPost;
        try {
            createdPost = JSON.parse(responseText);
        } catch (e) {
            throw new Error('Failed to parse WordPress response');
        }

        // Note: Image upload is now done BEFORE creating post (Step 5 above)
        // This ensures we can set featured_media directly when creating the post

        // Step 7: Update ACF fields using correct field names
        try {
            // First, try to update via ACF REST API (preferred method)
            const acfFields = {
                fields: {
                    'post_author_name': fullName || '',
                    'author_email': email || '',
                    'author_mobile_number': mobileNumber || '',
                    'meta_title': metaTitle || '',
                    'meta_description': metaDescription || '',
                }
            };

            // Add image link to ACF field
            if (imageLink) {
                acfFields.fields['image_link'] = imageLink;
            }

            const acfUpdateResponse = await fetch(`${WORDPRESS_URL}/wp-json/acf/v3/posts/${createdPost.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authHeader,
                },
                body: JSON.stringify(acfFields),
            });

            if (acfUpdateResponse.ok) {
            } else {
                const acfErrorText = await acfUpdateResponse.text();
                console.warn('⚠️ ACF REST API failed, trying alternative method:', acfErrorText);

                // Alternative: Try updating via standard REST API with meta fields
                // ACF fields are stored as meta with field keys
                const metaUpdateData = {
                    excerpt: metaDescription || description || '',
                    meta: {}
                };

                // Try to update ACF fields via meta (ACF stores them as meta fields)
                // ACF field keys typically follow the pattern: field_xxxxx
                // But we can also try the field names directly
                const acfMetaFields = {};

                if (fullName) acfMetaFields['post_author_name'] = fullName;
                if (email) acfMetaFields['author_email'] = email;
                if (mobileNumber) acfMetaFields['author_mobile_number'] = mobileNumber;
                if (metaTitle) acfMetaFields['meta_title'] = metaTitle;
                if (metaDescription) acfMetaFields['meta_description'] = metaDescription;
                // Save banner image - try both ID and URL
                if (imageLink) {
                    acfMetaFields['image_link'] = imageLink;
                }

                // Also try with acf_ prefix
                Object.keys(acfMetaFields).forEach(key => {
                    metaUpdateData.meta[`acf_${key}`] = acfMetaFields[key];
                    metaUpdateData.meta[key] = acfMetaFields[key];
                });

                const metaUpdateResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/posts/${createdPost.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': authHeader,
                    },
                    body: JSON.stringify(metaUpdateData),
                });

                if (metaUpdateResponse.ok) {
                } else {
                    const metaErrorText = await metaUpdateResponse.text();
                    console.warn('⚠️ Meta update also failed:', metaErrorText);
                    console.warn('⚠️ You may need to update ACF fields manually in WordPress admin');
                }
            }
        } catch (metaError) {
            console.warn('⚠️ Failed to update ACF fields:', metaError);
            // Continue even if ACF update fails - post is already created
        }

        return NextResponse.json({
            success: true,
            message: 'Blog post created successfully in WordPress and submitted for review',
            data: {
                postId: createdPost.id,
                postUrl: createdPost.link,
                status: createdPost.status,
            },
        });

    } catch (error) {
        console.error('Error creating WordPress post:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to create WordPress post' },
            { status: 500 }
        );
    }
}

