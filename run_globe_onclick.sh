#!/bin/bash
sed -i "s/return (/return (\n        <div className=\"cursor-pointer transition-transform hover:scale-105\" onClick={() => {toast.success('Globe Uplink Initialized', { description: 'Secure channel bound.' })}}>/" src/app/dashboard/page.tsx
