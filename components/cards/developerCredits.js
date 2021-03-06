import React from "react";
import Link from "next/link";

const DeveloperCredits = () => {
    return (
        <div className="developer-credits text-center">
            <div className="amfoss-credit">
                <div className="pb-2 small-text">Proudly Powered by</div>
                <a href="https://amfoss.in/">
                    <img
                        src={require('../../images/logos/amfoss_logo_light.png')}
                        style={{
                            filter: 'brightness(0.1)'
                        }}
                    />
                </a>
                <div className="pb-4 pt-2">
                    <div className="pb-4 pt-2">
                        <a href="/coc">Code of Conduct</a>|
                        <a href="/terms">Terms</a>|
                        <a href="/privacy">Privacy</a>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default DeveloperCredits;