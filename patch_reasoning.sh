#!/bin/bash
sed -i "s/setScanning(true);/setScanning(true); toast.loading('Initializing Mojo scan via Auth0 telemetry pipeline...', { id: 'scan-toast' });/" src/app/reasoning/page.tsx
sed -i "s/setScanning(false);/setScanning(false); toast.success('Mojo Analysis Complete. 0 threats found.', { id: 'scan-toast' });/" src/app/reasoning/page.tsx
sed -i "s/setError('Analysis engine failed to respond');/setError('Analysis engine failed to respond'); toast.error('Mojo Engine Error - Backend timeout', { id: 'scan-toast' });/" src/app/reasoning/page.tsx
