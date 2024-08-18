#!/usr/bin/env node

function bootstrap() {
  console.log('bootstrap');
  import('../dist/index.mjs');
}

bootstrap();
