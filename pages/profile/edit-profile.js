import React, {useEffect, useState} from "react";
import Head from "next/head";
import classNames from 'classnames';

import Base from "../../components/base";
import DashboardFooter from "../../modules/dashboard/footer";
import EditBasicDetails from "../../modules/profile/basic";
import EditPreferences from "../../modules/profile/preferences";
import dataFetch from "../../utils/dataFetch";
import EditContacts from "../../modules/profile/contacts";
import TitleBar from "../../components/titleBar";

import "../../styles/profile/edit-profile.sass";
import ProfilePicture from "../../modules/profile/profilePicture";
import EmergencyContacts from "../../modules/profile/emergency";
import EducationDetails from "../../modules/profile/education";
import CollegeIDPhoto from "../../modules/profile/collegeIDCard";
import SwitchAccountType from "../../modules/profile/accountType";
import Topbar from "../../components/common/topbar";
import MenuBar from "../../components/common/menubar";
import BottomBar from "../../components/common/bottombar";


const UpdateProfile = () => {
    const [selection, setSelection] = useState(1);
    const [isQueried, setQueried] = useState(false);
    const [isLoaded, setLoaded] = useState(false);
    const [data, setData] = useState(false);

    const query = `{
      myProfile
      {
        vidyutID
        vidyutHash
        username
        firstName
        lastName
        isAmritian
        isAmritapurian
        isSchoolStudent
        isFaculty
        college
        {
            id
            name
        }
        photo
        idPhoto
        rollNo
        email
        location
        phone
        gender
        graduationYear
        degreeType
        foodPreference
        shirtSize
        emergencyContactName
        emergencyPhone
      }
    }`;

    const getProfile = async () => await dataFetch({ query });

    useEffect(() => {
        if(!isQueried)
        {
            getProfile().then(  response => {
                setQueried(true);
                if (!Object.prototype.hasOwnProperty.call(response, 'errors')) {
                    setData(response.data);
                    setLoaded(true);
                }
            })
        }
    });

    const renderAbout = isLoaded ? (
        <div className={classNames("row m-0", selection !== 1 ? "d-none" : null)}>
            <div className="col-md-6 p-3">
                <div className="mb-4">
                    <SwitchAccountType
                        isFaculty={data.myProfile.isFaculty}
                        isSchoolStudent={data.myProfile.isSchoolStudent}
                    />
                </div>
                <ProfilePicture
                    profilePhoto={data.myProfile.photo}
                />
            </div>
            <div className="col-md-6 p-3">
                <EditBasicDetails
                    firstName={data.myProfile.firstName}
                    lastName={data.myProfile.lastName}
                    gender={data.myProfile.gender}
                />
                <div className="mt-4">
                    <EditPreferences
                        foodPreference={data.myProfile.foodPreference}
                        shirtSize={data.myProfile.shirtSize}
                    />
                </div>
            </div>
        </div>
    ) : null;

    const renderEducation = isLoaded ? (
        <div className={classNames("row m-0", selection !== 2 ? "d-none" : null)}>
            <div className="col-md-6 p-3">
                <EducationDetails
                    collegeID={data.myProfile.college !== null ? data.myProfile.college.id : null}
                    collegeName={data.myProfile.college !== null ? data.myProfile.college.name : null}
                    graduationYear={data.myProfile.graduationYear}
                    degreeType={data.myProfile.degreeType}
                    rollNo={data.myProfile.rollNo}
                />
            </div>
            <div className="col-md-6 p-3">
                <CollegeIDPhoto
                    collegeIDPhoto={data.myProfile.idPhoto}
                />
            </div>
        </div>
    ) : null;

    const renderContacts = isLoaded ? (
        <div className={classNames("row m-0", selection !== 3 ? "d-none" : null)}>
            <div className="col-md-6 p-3">
                <EditContacts
                    email={data.myProfile.email}
                    phone={data.myProfile.phone}
                    location={data.myProfile.location}
                />
            </div>
            <div className="col-md-6 p-3">
               <EmergencyContacts
                    emergencyContactName={data.myProfile.emergencyContactName}
                    emergencyContactNumber={data.myProfile.emergencyPhone}
               />
            </div>
        </div>
    ) : null;

    const ProfileEditNav = (
        <nav id="edit-profile-nav">
            <button className={selection===1 ? "is-selected" : null} onClick={() => setSelection(1)}>
                <img src={require('../../images/icons/info.png')} /> About
            </button>
            <button className={selection===2 ? "is-selected" : null}  onClick={() => setSelection(2)}>
                <img src={require('../../images/icons/university.png')} />Education
            </button>
            <button className={selection===3 ? "is-selected" : null}  onClick={() => setSelection(3)}>
                <img src={require('../../images/icons/ringing-phone.png')} />Contact
            </button>
        </nav>
    );

    return <Base loginRequired>
        <Head>
            <title>Edit My Profile | Vidyut 2020 | National Level Multifest - Amrita Vishwa Vidyapeetham, Amritapuri Campus</title>
        </Head>
        <Topbar/>
        <MenuBar/>
        {ProfileEditNav}
        <div className="container p-0">
            {renderAbout}
            {renderEducation}
            {renderContacts}
        </div>
        <BottomBar
            currentTabIcon={require('../../images/icons/edit-profile-icon.png')}
            currentTabName="Edit Profile"
            showDashboardIcon
        />
    </Base>
};

export default UpdateProfile;