import React, {useState} from 'react'
import Head from "next/head";

import '../styles/style.sass';

import ProtectedPage from "./protected";


const Base = ({ children, loginRequired, adminRequired }) => {

    const page = (
        <React.Fragment>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1, user-scalable=no, autoRotate:disabled" />
                <meta name="keywords" content="Multifest, College, Fest, Techfest, Cultural Fest, Amrita, Students" />
                <link rel="icon" href={require('../images/favicon.png')} />
                <meta name="theme-color" content="#999999" />
                <script async src="https://www.googletagmanager.com/gtag/js?id=UA-151530910-1" />
                <script dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', 'UA-151530910-1');`}} />
            </Head>
            {children}
        </React.Fragment>
    );


    return loginRequired ?
        <ProtectedPage>
            {page}
        </ProtectedPage> : page

};

export default Base;