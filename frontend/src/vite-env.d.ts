/// <reference types="vite/client" />

// CSS side-effect imports (for regular CSS files)
declare module '*.css';

// CSS Module declarations (for .module.css files)
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Made with Bob
