/**
 * Smoothly scrolls to an element by ID with a top offset for sticky headers.
 */
export const scrollToElement = (id: string, offset: number = 80) => {
  const elementId = id.startsWith('#') ? id.substring(1) : id;
  const element = document.getElementById(elementId);
  
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: 'smooth'
    });
  }
};
