import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import type { ParsedUrlQuery } from 'querystring';

import { gql } from '../../utils/gql';

type PathsGraphQLResponse = {
  data: {
    products: {
      nodes: {
        handle: string;
      }[];
    };
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(`${process.env.API_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': `${process.env.ACCESS_TOKEN}`
    },
    body: JSON.stringify({
      query: gql`
        query ProductHandlesQuery {
          products(first: 6) {
            nodes {
              handle
            }
          }
        }
      `
    })
  });

  const { data }: PathsGraphQLResponse = await response.json();

  const paths = data.products.nodes.map((product) => ({
    params: { handle: product.handle }
  }));

  return {
    paths,
    fallback: false // show 404 page
  };
};

type IParams = ParsedUrlQuery & {
  handle: string;
};

type PropsGraphQLResponse = {
  data: {
    product: {
      title: string;
    };
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { handle } = params as IParams;

  const response = await fetch(`${process.env.API_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': `${process.env.ACCESS_TOKEN}`
    },
    body: JSON.stringify({
      query: gql`
        query SingleProductQuery($handle: String!) {
          product(handle: $handle) {
            title
          }
        }
      `,
      variables: {
        handle
      }
    })
  });

  const { data }: PropsGraphQLResponse = await response.json();

  return {
    props: {
      data
    }
  };
};

type ProductPageProps = PropsGraphQLResponse;

const ProductPage: NextPage<ProductPageProps> = ({ data }) => {
  return (
    <div>
      <h1>Product Page for {data.product.title}</h1>
    </div>
  );
};

export default ProductPage;
