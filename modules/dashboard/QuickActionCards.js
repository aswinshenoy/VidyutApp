import React from "react";
const shortid = require('shortid');
import QuickActionCard from "../../components/dashboard/QuickActionCard";

const QuickActionCards = ({ status }) => (
    <div>
        <h4 className="px-4 mt-4 section-heading">Quick Actions</h4>
        <div className="row m-0 p-0">
            {
                status.enableTicketing ? (
                    <div className="col-md-3 col-6 p-2">
                        <QuickActionCard
                            photo={require('../../images/icons/tickets-qa.png')}
                            text="Concert, Choreo, Expo & More"
                            title="Buy Passes"
                            link="/shows"
                            key={shortid.generate()}
                        />
                    </div>
                ) : null
            }
            {
                status.enableCompetitionRegistration ? (
                    <div className="col-md-3 col-6 p-2">
                        <QuickActionCard
                            photo={require('../../images/icons/trophy-events.png')}
                            text="Exciting Competitions with cash prizes"
                            title="Participate in Competitions"
                            link="/competitions"
                            key={shortid.generate()}
                        />
                    </div>
                ) : null
            }
            {
                status.enableWorkshopRegistration ? (
                    <div className="col-md-3 col-6 p-2">
                        <QuickActionCard
                            photo={require('../../images/icons/classroom.png')}
                            text="Wide variety of professional workshops"
                            title="Register for Workshops"
                            link="/workshops"
                            key={shortid.generate()}
                        />
                    </div>
                ) : null
            }
            {
                status.enableMerchandiseShopping ? (
                    <div className="col-md-3 col-6 p-2">
                        <QuickActionCard
                            photo={require('../../images/icons/t-shirt.png')}
                            text="T-shirts, goodies and more"
                            title="Buy Merchandise"
                            link="/merchandise"
                            key={shortid.generate()}
                        />
                    </div>
                ) : null
            }
        </div>
    </div>
);

export default QuickActionCards;