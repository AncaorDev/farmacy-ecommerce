export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface ProductVariant {
  id: string;
  label: string;
  fromPrice: number;
  images?: string[];
}

export interface AccordionSection {
  id: string;
  title: string;
  content: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  sku: string;
  currency: string;
  breadcrumbs: BreadcrumbItem[];
  priceRegular: number;
  pricePromo?: number;
  promoDiscountPercent?: number;
  priceCardExclusive?: number;
  cardDiscountPercent?: number;
  shortDescription: string;
  thumbnail?: string;
  accordionSections: AccordionSection[];
  images: string[];
  primaryPresentationLabel?: string;
  packBadge?: string;
  variants: ProductVariant[];
  relatedProductIds: string[];
  promoBadge?: string;
}
