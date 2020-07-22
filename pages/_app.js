import React, { Fragment } from 'react'
import App from 'next/app';
import Router from 'next/router';
import Head from 'next/head';
import { app } from '../env.json'
import { TOKEN } from '../services/auth';
import 'semantic-ui-css/semantic.min.css'
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Show from '../components/show';
import LoaderPage from '../components/loaderPage';
import { authentication } from '../services/apis';

Router.onRouteChangeStart = () => {
    let pageChange = document.getElementById('page_change');
    pageChange.className = 'page_loading';
};

Router.onRouteChangeComplete = () => {
    let pageChange = document.getElementById('page_change');
    pageChange.className = 'page_end';
};
  
Router.onRouteChangeError = () => {
    let pageChange = document.getElementById('page_change');
    pageChange.className = 'page_end';
};

export default class MyApp extends App {

    static getInitialProps = async ({ Component, ctx}) => {
        let pageProps = {};
        let is_render = false;
        let message = "";
        let __app = {};
        // obtenemos los datos del app-client
        await authentication.get('app/me')
        .then(res => {
            let { data } = res;
            if (!data.success) throw new Error(data.message); 
            __app = data.app;
            is_render = true;
        }).catch( err => {
            is_render = false;
            message = err.message;
            __app = {};
        });
        // initial props de los child page
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }
        // pages
        let { pathname } = ctx;
        // isloggin 
        let isLoggin = await TOKEN(ctx) || false;
        return { pageProps, pathname, isLoggin, is_render, __app, message };
    }

    state = {
        loading: false
    }

    render() {

        let { Component, pageProps, isLoggin, is_render, __app, message } = this.props;

        return (
            <Fragment>
                <Head>
                    <title>{__app.name || `Convocatorias`}</title>
                    <meta charSet="utf-8"/>
                    <meta lang="es"/>
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                    <meta name="description" content="Convocatoria de trabajos"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <link rel="shortcut icon" type="image/x-icon" href={__app.icon || '/img/loading_page.png'}></link>
                    {/* embedido */}
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossOrigin="anonymous"/>
                    {/* styles themplate */}
                    <link rel="stylesheet" id="google-fonts-1-css" href="https://fonts.googleapis.com/css?family=Roboto%3A100%2C100italic%2C200%2C200italic%2C300%2C300italic%2C400%2C400italic%2C500%2C500italic%2C600%2C600italic%2C700%2C700italic%2C800%2C800italic%2C900%2C900italic&amp;ver=5.4.1" type="text/css" media="all"/>
                    {/* styles para el preloader de la página */}
                    <link rel="stylesheet" href="/font-awesome/css/all.min.css" media="all"/>
                    <link rel="stylesheet" type="text/css" href="/css/app.css"/>
                    <link rel="stylesheet" type="text/css" href="/css/page_loading.css"/>
                </Head>
                
                <div id="page_change"></div>

                <Show condicion={!is_render}>
                    <LoaderPage message={message}/>
                </Show>
                
                <Show condicion={is_render}>
                    <div className={`theme-${app.theme || 'default'}`}>
                        <Navbar app={__app}/>
                        
                        <div className={`mt-5 pt-4`}>
                            <Component {...pageProps} isLoggin={isLoggin}/>
                        </div>
                    </div>

                    <Footer app={__app}/>
                </Show>
            
            </Fragment>
        )
    }

}