#!/bin/bash
sed -i "s/import { UserProvider } from '@auth0\/nextjs-auth0\/client';/import { UserProvider } from '@auth0\/nextjs-auth0\/client';/g" src/app/layout.tsx
sed -i "s/import { handleAuth } from '@auth0\/nextjs-auth0';/import { handleAuth } from '@auth0\/nextjs-auth0';/g" src/app/api/auth/\[auth0\]/route.ts
