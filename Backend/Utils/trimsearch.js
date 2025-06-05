export const trimSearch = (search) => {
  if (typeof search !== 'string') return ''; 
  return search.trim();
}