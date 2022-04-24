import Head from 'next/head';
import type { ReactNode } from 'react';

// components
import Footer from './Footer';
import Nav from './Nav';

// props type
type LayoutProps = {
  children: ReactNode;
  description?: string;
  title?: string;
};

const defaultDescription = 'Next.js + Shopify Ecommerce Site by Andrew Shearer';

const Layout = ({ children, description = defaultDescription, title }: LayoutProps) => (
  <>
    <Head>
      <title>{title ? `${title} | ` : null} Next.js + Shopify</title>
      <meta name='description' content={description} />
      <link rel='icon' href='/favicon.ico' />
    </Head>

    <Nav />

    <main>{children}</main>

    <Footer />
  </>
);

export default Layout;
