<?php
// WordPress REST API Authentication Fix
// Copy ONLY the code below to your WordPress functions.php file

// Allow Application Password authentication
add_filter('determine_current_user', function($user_id) {
    if ($user_id) return $user_id;
    
    if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])) {
        return $user_id;
    }
    
    $username = $_SERVER['PHP_AUTH_USER'];
    $password = $_SERVER['PHP_AUTH_PW'];
    
    $user = wp_authenticate_application_password(null, $username, $password);
    if (!is_wp_error($user) && $user && isset($user->ID)) {
        wp_set_current_user($user->ID);
        return $user->ID;
    }
    
    return $user_id;
}, 20);

// Allow pending/draft posts via REST API
add_filter('rest_pre_insert_post', function($prepared_post, $request) {
    if (!is_array($prepared_post)) return $prepared_post;
    
    $user = wp_get_current_user();
    if (!$user || !isset($user->ID) || $user->ID == 0) {
        return $prepared_post;
    }
    
    if (isset($prepared_post['post_status'])) {
        $status = $prepared_post['post_status'];
        if ($status == 'pending' || $status == 'draft') {
            if (!isset($prepared_post['post_author'])) {
                $prepared_post['post_author'] = $user->ID;
            }
        }
    }
    
    return $prepared_post;
}, 10, 2);

// Allow authenticated users to upload media via REST API
add_filter('rest_pre_insert_attachment', function($prepared_post, $request) {
    $user = wp_get_current_user();
    if ($user && isset($user->ID) && $user->ID > 0) {
        // Ensure the attachment author is set to current user
        if (!isset($prepared_post['post_author'])) {
            $prepared_post['post_author'] = $user->ID;
        }
    }
    return $prepared_post;
}, 10, 2);

// Ensure authenticated users can upload media
add_filter('upload_mimes', function($mimes) {
    // Allow WebP if not already allowed
    if (!isset($mimes['webp'])) {
        $mimes['webp'] = 'image/webp';
    }
    return $mimes;
});
?>