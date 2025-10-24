# Simple Admin Subdomain Setup

## 🎯 **The Simple Way**

Instead of running two containers, we can use **one container** with **subdomain detection**:

### **1. Remove the Admin Service**
```bash
# Remove the theqrcode-admin service from docker-compose.yml
# We don't need it!
```

### **2. Update Traefik Labels for Main Service**
```yaml
theqrcode:
  # ... existing config ...
  labels:
    - "traefik.http.routers.theqrcode.entrypoints=websecure"
    - "traefik.http.routers.theqrcode.rule=Host(`theqrcode.io`) || Host(`admin.theqrcode.io`)"
    - "traefik.http.routers.theqrcode.tls=true"
    - "traefik.http.routers.theqrcode.tls.domains[0].sans=theqrcode.io"
    - "traefik.http.routers.theqrcode.tls.domains[1].sans=admin.theqrcode.io"
    - "traefik.http.routers.theqrcode.tls.certresolver=default"
    - "traefik.http.routers.theqrcode.middlewares=compressHeader,ratelimit"
    - "traefik.http.services.theqrcode.loadbalancer.server.port=3000"
```

### **3. The Middleware Handles Everything**
```typescript
// src/middleware.ts
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || ''
  
  // Check if this is the admin subdomain
  if (hostname.startsWith('admin.')) {
    // Rewrite admin subdomain requests to /admin routes
    const adminPath = pathname === '/' ? '/admin' : `/admin${pathname}`
    return NextResponse.rewrite(new URL(adminPath, request.url))
  }
  
  // For main domain, continue normally
  return NextResponse.next()
}
```

## 🎯 **How It Works**

1. **User visits `admin.theqrcode.io`**
2. **Traefik routes to the same container** (theqrcode)
3. **Middleware detects subdomain** and rewrites to `/admin` routes
4. **Admin pages load** with admin-specific layout and components

## ✅ **Benefits of This Approach**

- **Single container** - More efficient
- **Shared resources** - Database, cache, etc.
- **Easier maintenance** - One codebase
- **Automatic SSL** - Traefik handles both domains
- **Simpler deployment** - No duplicate services

## 🚀 **Implementation**

### **Step 1: Update Traefik Labels**
```yaml
labels:
  - "traefik.http.routers.theqrcode.rule=Host(`theqrcode.io`) || Host(`admin.theqrcode.io`)"
  - "traefik.http.routers.theqrcode.tls.domains[0].sans=theqrcode.io"
  - "traefik.http.routers.theqrcode.tls.domains[1].sans=admin.theqrcode.io"
```

### **Step 2: Deploy**
```bash
docker-compose up -d theqrcode
```

### **Step 3: Test**
- Main site: https://theqrcode.io
- Admin: https://admin.theqrcode.io

## 🔧 **Environment Variables**

No need for separate environment variables! The middleware handles the routing automatically.

## 📊 **Result**

- **Same container** serves both domains
- **Middleware** routes based on subdomain
- **Admin features** available at `admin.theqrcode.io`
- **Main features** available at `theqrcode.io`
- **Much simpler** setup!

---

This approach is much more efficient and easier to maintain than running two separate containers.
