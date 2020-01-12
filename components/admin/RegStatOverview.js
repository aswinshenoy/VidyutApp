import React, {useEffect, useState} from "react";
import dataFetch from "../../utils/dataFetch";

const RegStatOverview = () => {
    const [isQueried, setQueried] = useState(false);
    const [isLoaded, setLoaded] = useState(false);
    const [data, setData] = useState(false);

    const query = `{
      registrationCount
      {
        total
        paid
        workshop
        workshopPaid
        competition
        competitionPaid
        insider
        outsider
        insiderPaid
        outsiderPaid
      }
    }`;

    const getStats = async () => await dataFetch({ query });

    useEffect(() => {
        if(!isQueried)
        {
            getStats().then(  response => {
                setQueried(true);
                if (!Object.prototype.hasOwnProperty.call(response, 'errors')) {
                    setData(response.data.registrationCount);
                    setLoaded(true);
                }
            })
        }
    });

    return isLoaded ? (
        <div className="row m-0">
            <div className="col-12 p-2">
                <h4 className="my-4">Overall Statistics</h4>
            </div>
            <div className="col-md-4 p-2 col-6">
                <div className="card-shadow p-2">
                    <h2><span className="text-success">{data.paid}</span> / {data.total}</h2>
                    <h6>Total</h6>
                </div>
            </div>
            <div className="col-md-4 p-2 col-6">
                <div className="card-shadow p-2">
                    <h2><span className="text-success">{data.workshopPaid}</span> / {data.workshop}</h2>
                    <h6>Workshop</h6>
                </div>
            </div>
            <div className="col-md-4 p-2 col-6">
                <div className="card-shadow p-2">
                    <h2><span className="text-success">{data.competitionPaid}</span> / {data.competition}</h2>
                    <h6>Competition</h6>
                </div>
            </div>
            <div className="col-md-4 p-2 col-6">
                <div className="card-shadow p-2">
                    <h2><span className="text-success">{data.insiderPaid}</span> / {data.insider}</h2>
                    <h6>Insiders</h6>
                </div>
            </div>
            <div className="col-md-4 p-2 col-6">
                <div className="card-shadow p-2">
                    <h2><span className="text-success">{data.outsiderPaid}</span> / {data.outsider}</h2>
                    <h6>Outsiders</h6>
                </div>
            </div>
        </div>
    ) : null

};

export default RegStatOverview;