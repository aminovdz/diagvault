export function generateSchemaOrg(type: 'TechArticle' | 'Product', data: any) {
  if (type === 'TechArticle') {
    return {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": data.title,
      "description": data.description,
      "author": {
        "@type": "Organization",
        "name": data.author || "DiagVault"
      },
      "datePublished": data.published_date,
      "dateModified": data.updated_date,
      "proficiencyLevel": data.difficulty
    };
  }
  
  if (type === 'Product') {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": data.name,
      "description": data.description,
      "brand": {
        "@type": "Brand",
        "name": data.brand
      },
      "review": {
        "@type": "Review",
        "author": {
          "@type": "Organization",
          "name": "DiagVault"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": data.ratings.qualitePrix,
          "bestRating": "5"
        }
      }
    };
  }

  return {};
}
