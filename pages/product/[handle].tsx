import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/image";
import type { ParsedUrlQuery } from "querystring";

import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import type { ShopifyProduct } from "../../types/shopify";
import formatPrice from "../../utils/formatPrice";

import { gql } from "../../utils/gql";

type PathsGraphQLResponse = {
  data: {
    products: {
      nodes: ShopifyProduct[];
    };
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(`${process.env.API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": `${process.env.ACCESS_TOKEN}`
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
    product: ShopifyProduct;
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { handle } = params as IParams;

  const response = await fetch(`${process.env.API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": `${process.env.ACCESS_TOKEN}`
    },
    body: JSON.stringify({
      query: gql`
        query SingleProductQuery($handle: String!) {
          product(handle: $handle) {
            description
            images(first: 2) {
              nodes {
                altText
                height
                id
                url
                width
              }
            }
            priceRange {
              minVariantPrice {
                amount
              }
            }
            tags
            title
            variants(first: 1) {
              nodes {
                sku
              }
            }
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
  const { product } = data;

  return (
    <Container className="mt-5 mb-5">
      <Row xs={1} md={2} className="align-items-center g-4">
        <Col>
          {product.images.nodes.map((image) => (
            <Image
              key={image.id}
              src={image.url}
              alt={image.altText}
              placeholder="blur"
              blurDataURL={image.url}
              height={image.height}
              width={image.width}
            />
          ))}
        </Col>

        <Col>
          {product.tags.map((tag) => (
            <Badge key={tag} pill bg="warning" text="dark">
              {tag}
            </Badge>
          ))}
          <h1>{product.title}</h1>
          <p>{product.description}</p>

          <p>{formatPrice(product.priceRange.minVariantPrice.amount)}</p>

          <Button variant="primary">Add to Cart</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductPage;
