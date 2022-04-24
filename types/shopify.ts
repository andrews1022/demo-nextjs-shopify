export type ShopifyProduct = {
  title: string;
  handle: string;
  description: string;
  tags: string[];
  priceRange: {
    minVariantPrice: {
      amount: string;
    };
  };
  images: {
    nodes: {
      altText: string;
      height: number;
      id: string;
      url: string;
      width: number;
    }[];
  };
};
