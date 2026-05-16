export const useSanitize = () => {
  // This composable would be used if rich HTML content is displayed
  // Implementation requires: npm install dompurify @types/dompurify

  const sanitize = (html: string): string => {
    // For now, return as-is since we're not using rich HTML content
    // If needed, integrate DOMPurify:
    // import DOMPurify from 'dompurify'
    // return DOMPurify.sanitize(html)

    return html;
  };

  return { sanitize };
};
