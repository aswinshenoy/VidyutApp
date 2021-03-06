import React, {useState} from "react";
import ContentCard from "../events/contentCard";
import dataFetch from "../../utils/dataFetch";
import RegProfileCard from "./RegProfileCard";

const TeamProfileCard = ({ teamProfile, formData, transaction, regID, timestamp }) => {
    const getStatus = `query getStatus($transactionID: String){
      getOnlinePaymentStatus(transactionID: $transactionID)
      {
        status
        data
      }
    }`;

    const getStatusData = async variables => await dataFetch({ query: getStatus, variables });

    const handleRefetch = () => {
        setLoading(true);
        getStatusData({transactionID}).then((response) => {
            setLoading(false);
            if (!Object.prototype.hasOwnProperty.call(response, 'errors')) {
                return response
            }
        })
    };

    const [allowEditing, setLockState] = useState(teamProfile.allowEditing);
    const UnlockTeamMutation = `mutation unlockTeamEditing($teamHash: String!)
        {
          unlockTeamEditing(teamHash: $teamHash)
          {
            status
          }
    }`;

    const unlockTeam = async variables => await dataFetch({ query: UnlockTeamMutation, variables });

    const [isLoading, setLoading] = useState(false);

    const handleUnlocking = () => {
        setLoading(true);
        const teamHash = teamProfile.hash;
        unlockTeam({teamHash}).then((response) => {
            setLockState(!allowEditing);
            setLoading(false);
        })
    };

    let form = [];
    if(formData && formData !== null && formData !== "false")
        form = JSON.parse(formData.replace(/'/g, '"'));

    return <ContentCard
        title={<div>
            <h6>{teamProfile.name}</h6>
            {
                transaction ?
                    transaction.isPaid ? <div className="badge badge-success p-2">Paid</div>
                        : !transaction.isProcessed ?
                        <div className="badge badge-warning mr-2 p-2">Not Processed</div>
                        : <div className="badge badge-danger mr-2 p-2">Failed</div>
                : <div className="badge badge-secondary mr-2 p-2">Not Attempted</div>
            }
        </div>}
        classNames="mt-3 p-2"
        node={
            !isLoading ? <div>
                <div className="alert alert-secondary my-2">
                    <div className="font-weight-bold mb-2">Team Profile</div>
                    <div className="small-text" style={{ lineHeight: '1.35'}}>
                        <div>
                            {regID ? <React.Fragment><b>Reg #</b>: {regID}</React.Fragment> : null}
                        </div>
                        <div>
                            <b>Timestamp</b>: {timestamp}
                        </div>
                        <div>
                            <b>Team Size</b>: {teamProfile.members.length}
                        </div>
                    </div>
                </div>
                <div className="alert alert-secondary my-2">
                    <div className="font-weight-bold mb-2">Quick Actions</div>
                    <button
                        className="btn btn-shadow btn-warning rounded-0 px-4 py-2"
                        onClick={handleUnlocking}
                    >
                        { allowEditing ? 'Lock Team Editing' : 'Unlock Team Editing'}
                    </button>
                </div>
                {
                        <div className="alert alert-secondary my-2">
                            <div className="mb-2 font-weight-bold">Transaction Details</div>
                            <div className="small-text" style={{ lineHeight: '1.5'}}>
                                <div><b>Status </b>: {
                                    transaction ?
                                        transaction.isPaid ? 'Successful'
                                            : !transaction.isProcessed ? 'Pending'
                                            : 'Failed'
                                        : 'Unattempted'
                                }</div>
                                <div><b>Transaction # </b>: {transaction ? transaction.transactionID : 'n/a'}</div>
                                <div><b>Amount</b> : Rs.{transaction ? `Rs. ${transaction.amount}` : 'n/a'}</div>
                            </div>
                        </div>
                }
                <div className="alert alert-secondary my-2">
                    <div className="mb-2 font-weight-bold">Team Leader Info</div>
                    <RegProfileCard
                        profile={teamProfile.leader}
                    />
                </div>
                <div className="alert alert-secondary my-2">
                    <div className="mb-2 font-weight-bold">Team Members</div>
                    <div className="row m-0">
                        {
                            teamProfile.members.map( m =>
                                <div className="col-md-6 p-md-2 px-0 py-2 col-12">
                                    <RegProfileCard profile={m} />
                                </div>
                            )
                        }
                    </div>
                </div>

                {
                    form.length > 0 ?
                        <div className="alert alert-secondary">
                            <div className="font-weight-bold mb-2">Form Data</div>
                            <div className="small-text" style={{ lineHeight: '1.35'}}>
                                {
                                    form.map(f => <div className="pt-2">
                                        <div className="font-weight-bold pb-2">{f.label}</div>
                                        <div>{f.value ? f.value : 'no response'}</div>
                                    </div>)
                                }
                            </div>
                        </div> : null
                }
            </div> : <div className="alert alert-warning p-2">Saving</div>
        }
    />
};

export default TeamProfileCard;