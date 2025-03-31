export function highlightText(text: string, query: string): string {
  if (!query) return text;
  
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  
  return text.replace(regex, '<mark class="bg-yellow-200 rounded-sm">$1</mark>');
}