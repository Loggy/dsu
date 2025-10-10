# Environment Variables Examples

## API (.env.example)

```
NODE_ENV=development
PORT=3001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=dsu

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=1d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Email (Resend)
RESEND_API_KEY=your-resend-api-key
```

## App (.env.example)

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Landing (.env.example)

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
``` 