import { useEffect } from "react";

/**
 * Custom hook to dynamically update document title and optional meta description
 * @param {string} title 
 * @param {string} [description] 
 */
export default function useDocumentTitle(title, description) {
  useEffect(() => {
    const previousTitle = document.title;
    if (title) {
      document.title = `${title} | ZeroWaste`;
    }

    let metaDesc = document.querySelector('meta[name="description"]');
    const previousDesc = metaDesc ? metaDesc.getAttribute("content") : "";
    if (description && metaDesc) {
      metaDesc.setAttribute("content", description);
    }

    return () => {
      document.title = previousTitle;
      if (metaDesc && previousDesc) {
        metaDesc.setAttribute("content", previousDesc);
      }
    };
  }, [title, description]);
}
