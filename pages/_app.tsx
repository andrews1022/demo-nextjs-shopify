/* eslint-disable react/jsx-props-no-spreading */

import type { AppProps } from "next/app";

import "bootstrap/dist/css/bootstrap.min.css";

import Layout from "../components/Layout";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <Layout>
    <Component {...pageProps} />
  </Layout>
);

export default MyApp;
