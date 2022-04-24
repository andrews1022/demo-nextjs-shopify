/* eslint-disable react/jsx-props-no-spreading */

import type { AppProps } from 'next/app';

import 'bootstrap/dist/css/bootstrap.min.css';

const MyApp = ({ Component, pageProps }: AppProps) => <Component {...pageProps} />;

export default MyApp;
