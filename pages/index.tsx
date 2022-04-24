import Link from 'next/link';
import type { GetStaticProps, NextPage } from 'next';

// react-bootstrap
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

// utils
import { gql } from '../utils/gql';

// custom types
import type { ShopifyProduct } from '../types/shopify';
import formatPrice from '../utils/formatPrice';

type PropsGraphQLResponse = {
  data: {
    products: {
      nodes: ShopifyProduct[];
    };
  };
};

export const getStaticProps: GetStaticProps = async () => {
  const response = await fetch(`${process.env.API_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': `${process.env.ACCESS_TOKEN}`
    },
    body: JSON.stringify({
      query: gql`
        query ProductsQuery {
          products(first: 6, sortKey: TITLE) {
            nodes {
              description
              featuredImage {
                altText
                height
                id
                url
                width
              }
              handle
              priceRange {
                minVariantPrice {
                  amount
                }
              }
              tags
              title
            }
          }
        }
      `
    })
  });

  const { data }: PropsGraphQLResponse = await response.json();

  return {
    props: {
      data
    }
  };
};

type HomeProps = PropsGraphQLResponse;

const Home: NextPage<HomeProps> = ({ data }) => (
  <>
    <Container className='mt-5 text-center'>
      <h1>Welcome to Next.js + Shopify!</h1>
    </Container>

    <Container className='mt-5 mb-5'>
      <h2 className='mb-3'>Our Products:</h2>

      <Row xs={1} md={2} lg={3} className='g-4'>
        {data.products.nodes.map((product) => (
          <Col key={product.title}>
            <Card className='h-100'>
              <Card.Img
                src={product.featuredImage.url}
                style={{ maxHeight: '25vw', objectFit: 'cover' }}
                variant='top'
              />
              <Card.Body>
                {product.tags.map((tag) => (
                  <Badge key={tag} pill bg='warning' text='dark'>
                    {tag}
                  </Badge>
                ))}
                <Card.Title as='h3'>{product.title}</Card.Title>

                <Card.Title as='h4' style={{ color: '#198754' }}>
                  {formatPrice(product.priceRange.minVariantPrice.amount)}
                </Card.Title>

                <Card.Text>{product.description}</Card.Text>

                <Link href={`/product/${product.handle}`}>View Product</Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  </>
);

export default Home;
