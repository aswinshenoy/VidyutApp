import React, {useEffect, useState} from "react";
import dataFetch from "../../utils/dataFetch";
import Link from "next/link";

const RegistrationsCard = () =>
{
    const [isQueried, setQueried] = useState(false);
    const [data, setData] = useState(false);

    const query = `{
      myRegistrations
      {
        registrationTimestamp
        regID
        event
        {
           name
           price
           productID
           product {
              details
            {
              isTotalRate
            }
           }
        }
        team
        {
           name
           isUserLeader
           membersCount
        }
        order
        {
           orderID
           transaction
           {
              isPaid
              isPending
              isProcessed
              amount
           } 
        }
      }
    }`;

    const getRegs = async () => await dataFetch({query});

    useEffect(() => {
        if(!isQueried)
        {
            getRegs().then((response) => {
                setQueried(true);
                if (!Object.prototype.hasOwnProperty.call(response, 'errors')) {
                    setData(response.data.myRegistrations);
                }
            })
        }
    });

    const renderRegistration = (r) => (
        <div className="p-2">
            <div className="card-shadow rounded p-3">
                <div className="row m-0">
                    <div className="col-md-9 p-2">
                        <h6>{r.event.name}</h6>
                        <span className="small-text">Reg#: {r.regID} </span>
                    </div>
                    <div className="col-md-3 p-2">
                        <div className="d-flex align-items-center justify-content-end">
                            {
                                parseInt(r.event.price) === 0 ?
                                    <div className="text-right">
                                        <img src={require('../../images/icons/checked.png')} style={{ maxWidth: '32px'}} />
                                    </div>
                                    : r.order == null ?
                                    <Link href={
                                        `/purchase?product=${r.event.productID}&qty=${r.team !== null  && !r.event.product.details.isTotalRate ? r.team.membersCount : 1}&regID=${r.regID}`
                                    }>
                                        <button className="btn btn-primary">
                                            Pay {r.team !== null ? r.event.product.details.isTotalRate ? parseInt(r.event.price) : parseInt(r.event.price * r.team.membersCount) : parseInt(r.event.price)} + GST
                                        </button>
                                    </Link>
                                    :  r.order.transaction && r.order.transaction.isPaid ? (
                                            <div className="text-right">
                                                <img src={require('../../images/icons/checked.png')} style={{ maxWidth: '32px'}} />
                                                <b>₹{r.order.transaction.amount}</b>
                                            </div>
                                        ) :
                                        r.order.transaction && r.order.transaction.isPending ?
                                            <img src={require('../../images/icons/cancel.png')} style={{ maxWidth: '32px'}} /> :
                                            <Link href={
                                                `/purchase?product=${r.event.productID}&qty=${r.team !== null && !r.event.product.details.isTotalRate ? r.team.membersCount : 1}&regID=${r.regID}`
                                            }>
                                                <button className="btn btn-danger">Retry Payment</button>
                                            </Link>
                            }
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );

    return <div className="registrations-card">{ data ? data.map(r => renderRegistration(r)) : null }</div>
};

export default RegistrationsCard;