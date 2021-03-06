import React, {useEffect, useState} from 'react'
import Base from "../components/base";
import dataFetch from "../utils/dataFetch";
import Head from "next/head";
const shortid = require('shortid');

import '../styles/events/style.sass';
import '../styles/bootstrap.sass';
import EventCard from "../components/events/card";
import TitleBar from "../components/titleBar";
import StatusContainer from "../components/StatusContainer";
import DepartmentSelector from "../modules/events/departmentSelector";
import DashboardFooter from "../modules/dashboard/footer";
import LoadingScreen from "../components/loadingScreen";
import OrganizerSelector from "../modules/events/organizerSelector";
import ContentCard from "../components/events/contentCard";

import classNames from 'classnames';
import Slideshow from "../components/slideshow";

const Workshops = () => {
    const [isQueried, setQueried] = useState(false);
    const [isLoaded, setLoaded] = useState(false);
    const [data, setData] = useState(false);
    const [profileData, setProfileData] = useState(false);

    const [deptSel, setDept] = useState('');
    const [orgSel, setOrg] = useState('');
    const [sQuery, setSQuery] = useState('');

    const query = `{
      myProfile
      {
        isAmritian
        isAmritapurian
        isFaculty
        isSchoolStudent
        hasEventsRegistered
      }
      listWorkshops
      {
        name
        cover
        description
        fee
        slug
        isRecommended
        KTUActivityPoints
        products
        {
           productID
           name
           price
           isAvailable
           isOutsideOnly
           requireRegistration
           isGSTAccounted
           isAmritapurianOnly
           isFacultyOnly
           isSchoolOnly  
        }
        organizer
        {
          label: name
          value: id
        }
        isNew
        accreditedBy
        {
          name
        }
        department
        {
          label: name
          value: slug
        }
      }
    }`;

    const getWorkshopList = async () => await dataFetch({ query });

    useEffect(() => {
       if(!isQueried) {
           getWorkshopList().then((response) =>{
               setQueried(true);
               if (!Object.prototype.hasOwnProperty.call(response, 'errors')) {
                   setData(response.data.listWorkshops);
                   setProfileData(response.data.myProfile);
                   setLoaded(true);
               }
           })
       }
    });

    const renderWorkshopCard = (w) => (
        <div key={shortid.generate()} className="col-md-6 col-lg-4 p-2">
            <EventCard
                name={w.name}
                text={w.description}
                cover={w.cover}
                price={w.fee}
                organizer={w.organizer ? w.organizer.label : null}
                isNew={w.isNew}
                dept={deptSel === '' || deptSel == null && w.department ? w.department.label : null}
                isRecommended={w.isRecommended}
                detailsURL={`/workshop/${w.slug}`}
                products={w.products}
                profileData={profileData}
                KTUActivityPoints={w.KTUActivityPoints}
                accreditedBy={w.accreditedBy ? w.accreditedBy.name : null}
            />
        </div>
    );

    const renderFilters = () => (
        <div>
            <div className="p-2">
                <ContentCard
                    title="Search"
                    isOpen
                    classNames="bg-gradient p-2"
                    node={<input
                        className="form-control mt-3 rounded-0 border-0"
                        onChange={(e) => setSQuery(e.target.value)}
                        placeholder="Search by name / dept "
                    />}
                />
            </div>
            <div className="p-2">
                <DepartmentSelector  onSelect={(e) => setDept(e)} />
            </div>
            <div className="p-2">
                <OrganizerSelector isOpen onSelect={(e) => setOrg(e)} />
            </div>
        </div>
    );

    const isInName = (name,query) => {
        const words = name.toLowerCase().split(" ");
        for(let i = 0; i<words.length; i++)
        {
            if(words[i].startsWith(query.toLowerCase()))
                return true;
        }
        return false

    };

    const renderWorkshops = () => {
        const filtered = data.map(c => {
            let flag = 0;
            if(sQuery != '' && !isInName(c.name,sQuery) && !isInName(c.department.label, sQuery))
                flag = 1;
            if(deptSel !== '' && deptSel != null && deptSel.value !== c.department.value)
                flag = 1;
            if(orgSel !== '' && orgSel != null && c.organizer && orgSel.value !== c.organizer.value)
                flag = 1;
            if(orgSel !== '' && orgSel != null && !c.organizer)
                flag = 1;
            if(!flag) return c;
        });
        return filtered.map(c => c ? renderWorkshopCard(c) : null);
    };


    const [showFilterScreen, setShowFilterScreen] = useState(false);

    const renderFooterFilters = () => (
      <div className="d-md-none d-block">
          <div id="footer-filter-screen" className={classNames(!showFilterScreen ? 'd-none' : null)}>
              <div className="p-2">
                  <DepartmentSelector
                      onSelect={(e) => { setDept(e); setShowFilterScreen(false); }}
                  />
              </div>
              <div className="p-2">
                  <OrganizerSelector isOpen onSelect={(e) => { setOrg(e); setShowFilterScreen(false)}} />
              </div>
          </div>
          <div id="footer-filter-bar">
              <div className="row m-0">
                  <div className="col-6">
                      <a href="#search-box"  onClick={() => setShowFilterScreen(false)} className="plain-link font-weight-bold text-dark">
                          <img src={require('../images/icons/search-icon.png')} style={{ width: '20px', margin: '5px' }} />
                          Search
                      </a>
                  </div>
                  <div className="col-6">
                      <button
                          className="plain-button font-weight-bold"
                          onClick={() => setShowFilterScreen(!showFilterScreen)}
                      >
                          <img src={require('../images/icons/filter-icon.png')} style={{ width: '20px', margin: '5px'  }} />
                          Filter
                      </button>
                  </div>
              </div>
          </div>
      </div>
    );

    return <Base>
        <Head>
            <title>Workshops | Vidyut 2020</title>
        </Head>
        {
            isLoaded ?
                <React.Fragment>
                    <TitleBar
                        breadcrumbs={[
                            {
                                name: "Workshops",
                                link: '/workshops',
                                active: true
                            },
                        ]}
                    />
                    {
                        deptSel === '' &&  sQuery === '' && orgSel === '' ?
                            <div className="my-4">
                                <Slideshow feedSlug="workshops" />
                            </div> : null
                    }
                    <div className="d-block d-md-none px-2 pt-4" id="search-box">
                        <ContentCard
                            title="Search"
                            isOpen
                            classNames="bg-gradient p-2"
                            node={<input
                                className="form-control mt-3 rounded-0 border-0"
                                onChange={(e) => setSQuery(e.target.value)}
                                placeholder="Search by name / dept "
                            />}
                        />
                    </div>
                        {
                            data.length > 0 ?
                                <div>
                                    <div id="event-listing">
                                        <div className="row m-0">
                                            <div className="col-lg-3 col-md-4 px-0">
                                                <div className="d-none d-md-block filter-sidebar">
                                                    {renderFilters()}
                                                </div>
                                            </div>
                                            <div className="col-lg-9 col-md-8 px-2 py-4">
                                                <div className="row m-0">
                                                    { isLoaded ? renderWorkshops() : null }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            </div> :
                            <div className="container d-flex justify-content-center  align-items-center" style={{ minHeight: '90vh' }}>
                                <StatusContainer
                                title="No Workshops Found"
                                image={require('../images/illus/cleanup.png')}
                                text="We have not listed any workshops for your account type at Vidyut 2020, check back later or change your account type to the right category."
                                />
                            </div>
                        }
                    <DashboardFooter />
                    { renderFooterFilters() }
                </React.Fragment>: <LoadingScreen text="Loading Workshops" />
        }
    </Base>
};

export default Workshops
