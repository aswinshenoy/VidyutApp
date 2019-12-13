import React, {useEffect, useState} from "react";
import Link from "next/link";

import '../styles/bootstrap.sass';
import Cookies from "universal-cookie";
import dataFetch from "../utils/dataFetch";

const cookies = new Cookies();

const TitleBar = () => {
    const token = cookies.get('token');
    const isLoggedIn = token != null;
    const [menuOpen, setMenuState] = useState(false);


    const renderDropdownMenu = () => (
      <div id="topbar-dropdown">
          <img src={require('../images/icons/user.png')} onClick={() => setMenuState(!menuOpen)}/>
          {
              menuOpen ?
                  <div className="menu card-shadow">
                      <div className="link"><Link href="/profile/edit-profile"><a>Edit Profile</a></Link></div>
                      <div className="link"><Link href="/logout"><a>Logout</a></Link></div>
                  </div> : null
          }

      </div>
    );

    return <nav id="titlebar">
        <div className="row m-0">
            <div className="col-lg-2 col-md-3 col-8">
                <Link href="/dashboard"><img src={require('../images/logos/vidyut-dark-logo.png')} /></Link>
            </div>
            <div className="col text-right">
                {
                   isLoggedIn ?
                           renderDropdownMenu()
                       :  <Link href="/login"><a>Login</a></Link>
                }
            </div>
        </div>
    </nav>
};

export default TitleBar;