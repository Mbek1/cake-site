# WordPress + Vue Cake Ordering Integration Guide

## Quick Setup

### Step 1: Deploy Vue App to Subdomain
Follow the **SUBDOMAIN_DEPLOYMENT.md** guide to deploy your Vue app to `orders.yourcakeshop.com`

### Step 2: Add to WordPress

#### Method A: Direct Iframe in Page
1. In WordPress Admin → Pages → Edit your Cakes/Ordering page
2. Add this HTML code:

```html
<iframe 
  src="https://orders.yourcakeshop.com" 
  width="100%" 
  height="1000" 
  style="border:none; display:block; margin: 30px 0;"
  title="Cake Ordering System"
  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
>
</iframe>
```

#### Method B: Shortcode (Recommended)
1. Add this to your WordPress theme's `functions.php`:

```php
/**
 * Embed Cake Ordering System
 */
function embed_cake_ordering_system($atts) {
    $atts = shortcode_atts([
        'height' => '1000',
        'subdomain' => 'orders'
    ], $atts);
    
    $domain = isset($_SERVER['HTTP_HOST']) ? str_replace('www.', '', $_SERVER['HTTP_HOST']) : 'yourcakeshop.com';
    $iframe_url = 'https://' . $atts['subdomain'] . '.' . $domain;
    
    return sprintf(
        '<iframe src="%s" width="100%%" height="%s" style="border:none; display:block; margin: 30px 0;" title="Cake Ordering System" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>',
        esc_url($iframe_url),
        intval($atts['height'])
    );
}
add_shortcode('cake_ordering', 'embed_cake_ordering_system');
```

2. Use shortcode in any page/post:
```
[cake_ordering height="1000"]
```

#### Method C: Widget
Create a WordPress widget to display the iframe in sidebar:

```php
class Cake_Ordering_Widget extends WP_Widget {
    public function __construct() {
        parent::__construct('cake_ordering_widget', 'Cake Ordering System');
    }
    
    public function widget($args, $instance) {
        echo $args['before_widget'];
        echo sprintf(
            '<iframe src="https://orders.%s" width="100%%" height="800" style="border:none;"></iframe>',
            str_replace('www.', '', $_SERVER['HTTP_HOST'])
        );
        echo $args['after_widget'];
    }
    
    public function form($instance) {
        echo '<p>Cake Ordering System Widget</p>';
    }
}
add_action('widgets_init', function() {
    register_widget('Cake_Ordering_Widget');
});
```

---

## Communication Between WordPress and Vue App

### Get WordPress Site Info in Vue
```javascript
// In src/services/orderService.js
export const getWordPressSiteInfo = () => {
    return {
        siteName: document.title,
        siteUrl: window.parent.location.origin,
        isEmbedded: window.self !== window.top
    };
};
```

### Send Data from Vue to WordPress
```javascript
// Send data to parent WordPress window
if (window.parent !== window) {
    window.parent.postMessage({
        type: 'order_submitted',
        data: orderData
    }, '*');
}
```

### Listen in WordPress
```php
// In your WordPress page/post, add script tag:
?>
<script>
window.addEventListener('message', (event) => {
    if (event.data.type === 'order_submitted') {
        console.log('Order received:', event.data.data);
        // Handle order in WordPress (e.g., trigger webhook, send notification)
    }
});
</script>
```

---

## Styling Integration

### Match WordPress Theme Colors

Update `src/style.css` to use WordPress theme colors:

```css
:root {
  --primary-color: var(--wp-primary, #f093fb);
  --secondary-color: var(--wp-secondary, #f5576c);
  --text-color: var(--wp-text, #333);
}
```

Or pass colors from WordPress:
```php
// In WordPress functions.php
function enqueue_cake_app_colors() {
    $custom_css = "
        :root {
            --wp-primary: " . get_option('primary_color') . ";
            --wp-secondary: " . get_option('secondary_color') . ";
        }
    ";
    wp_add_inline_style('wp-admin', $custom_css);
}
add_action('wp_enqueue_scripts', 'enqueue_cake_app_colors');
```

---

## Database Integration (Optional)

### WordPress Database for Orders

Connect Vue app to WordPress database:

```php
// In WordPress theme or plugin
add_action('rest_api_init', function() {
    register_rest_route('cake/v1', '/orders', [
        'methods' => 'POST',
        'callback' => 'handle_cake_order',
        'permission_callback' => '__return_true',
    ]);
});

function handle_cake_order($request) {
    global $wpdb;
    $data = $request->get_json_params();
    
    $wpdb->insert('wp_cake_orders', [
        'customer_name' => $data['customer']['name'],
        'customer_email' => $data['customer']['email'],
        'customer_phone' => $data['customer']['phone'],
        'order_data' => json_encode($data['items']),
        'total' => $data['total'],
        'created_at' => current_time('mysql'),
    ]);
    
    return rest_ensure_response(['success' => true]);
}
```

Then update Vue app:
```javascript
// src/services/orderService.js
export const submitOrder = async (orderData) => {
    const response = await axios.post(
        'https://yourcakeshop.com/wp-json/cake/v1/orders',
        orderData
    );
    return response.data;
};
```

---

## Email Notifications

### WordPress + Vue Integration

1. Vue app collects order
2. Sends to WordPress API
3. WordPress sends email via wp_mail()

```php
function handle_cake_order($request) {
    $data = $request->get_json_params();
    
    // Send email to baker
    wp_mail(
        get_option('admin_email'),
        'New Cake Order',
        format_cake_order_email($data)
    );
    
    // Send confirmation to customer
    wp_mail(
        $data['customer']['email'],
        'Order Confirmation',
        'Thank you for your order!'
    );
    
    return rest_ensure_response(['success' => true]);
}
```

---

## Security

### Protect Admin Routes
Add WordPress nonce verification:

```php
add_action('wp_head', function() {
    echo '<script>';
    echo 'window.wordPressNonce = "' . wp_create_nonce('wp_rest') . '";';
    echo '</script>';
});
```

Use in Vue:
```javascript
axios.post('/wp-json/cake/v1/orders', orderData, {
    headers: {
        'X-WP-Nonce': window.wordPressNonce
    }
});
```

### CORS Settings
Ensure subdomain can communicate with WordPress domain.

Add to WordPress `wp-config.php`:
```php
define('ALTERNATE_WP_CRON', true);
define('ENABLE_REST_API', true);
```

---

## Troubleshooting

**Iframe not showing?**
- Check HTTPS certificate on subdomain
- Verify DNS records are correct
- Check browser console for errors

**Data not syncing?**
- Verify CORS headers
- Check API endpoints
- Test with browser DevTools Network tab

**Styles conflicting?**
- Use CSS scoping
- Check z-index issues
- Test in incognito mode

**Admin not accessible in iframe?**
- Ensure localStorage works in iframe
- Check same-site cookie settings
- Verify authentication token

---

## Deployment Checklist

- [ ] Vue app deployed to subdomain with HTTPS
- [ ] Subdomain DNS records configured
- [ ] Iframe embedded in WordPress page
- [ ] Cross-domain communication tested
- [ ] Email notifications working
- [ ] Admin authentication verified
- [ ] Product sync tested
- [ ] Order submission working
- [ ] Mobile responsive tested
- [ ] Performance optimized

---

## Support

For issues:
1. Check browser console (F12)
2. Check WordPress error logs
3. Verify subdomain accessibility
4. Test CORS headers
5. Clear browser cache
