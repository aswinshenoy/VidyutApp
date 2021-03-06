import React, {useEffect, useState} from 'react'
import Head from "next/head";

import '../styles/style.sass';

import ProtectedPage from "./protected";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const Base = ({ children, loginRequired, adminRequired }) => {
    const hours = new Date().getHours();
    const isDayTime = hours > 6 && hours < 20;
    let theme;

    useEffect(() => {
        theme = cookies.get('theme', '/');
    });

    const page = (
        <React.Fragment>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1, user-scalable=no" />
                <meta name="keywords" content="Multifest, College, Fest, Techfest, Cultural Fest, Amrita, Students" />
                <link rel="icon" href={require('../images/favicon.png')} />
                <meta name="theme-color" content="#4A148C" />
                <script src="https://cdnjs.cloudflare.com/ajax/libs/zuck.js/1.3.0/zuck.min.js" />
                <script async src="https://www.googletagmanager.com/gtag/js?id=UA-151530910-1" />
                <script async src="https://www.googletagmanager.com/gtag/js?id=UA-156677900-1" />
                <script dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'UA-151530910-1');`
                }} />
                <script dangerouslySetInnerHTML={{ __html: ` window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'UA-156677900-1');`
                }} />
            </Head>
            {/*<div className={theme === "dark" || !isDayTime && theme === undefined ? "dark-theme" : `${theme}-theme`}>*/}
            <div>
                {children}
            </div>
        </React.Fragment>
    );

    return loginRequired ?
        <ProtectedPage>
            {page}
        </ProtectedPage> : page

};

export default Base;