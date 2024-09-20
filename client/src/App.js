import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Usertypes from './Pages/usertypes'
import UserLogin from './Pages/userlogin'
import Forgetpw from './Pages/forgetpw'
import UserSignup from './Pages/usersignup'
import Userotp from './Pages/userotp'
import ProfileInformation from './Pages/userprofile'
import OrganizerProfilePage from './Pages/Organizer/OrganizerProfilePage'

import OtpVerificationPage from './Pages/OtpVerificationPage';
import EventOrganizerSignUpPage from './Pages/Organizer/EventOrganizerSignUpPage';
import EventOrganizerOTPVerificationPage from './Pages/Organizer/EventOrganizerOTPVerificationPage';
import OrganizerSignInPage from './Pages/Organizer/OrganizerSignInPage';
import TicketVerifierLoginPage from './Pages/TicketVerifier/TicketVerifierLoginPage';
import SLTAdminLoginPage from './Pages/SLTAdmin/SLTAdminLoginPage';
import CreateNewEvent from './Pages/Organizer/CreateNewEvent';
import EditEvent from './Pages/Organizer/EditEvent';
import Events  from './Pages/User/events';
import EventCard from './componants/eventcard';
import BuyTickets from './Pages/User/buytickets';
import Mytickets from './Pages/User/mytickets';
import Dashboard from './Pages/Organizer/Dashboard';
import ViewEvent from './Pages/User/viewevent';
import AllCategory from './Pages/User/AllCategory';
import Category from './Pages/User/category';
import MyEvents from './Pages/Organizer/MyEvents';
import Unauthorized from './Pages/Unauthorized';

import Subscriptions from './Pages/Organizer/subscriptions';
import EditSubscription from './Pages/SLTAdmin/EditSubscription';
import SubCard from './componants/subcard';


import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripePayment from './componants/StripePayment';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EndUserHome from './Pages/User/userdashboard';
import AddVerifier from './Pages/Organizer/AddVerifierPage';
import EventNotifications from './Pages/Organizer/EventOrganizerNotification';
import ViewTicket from './Pages/User/viewticket'

import LiveEvents from './Pages/SLTAdmin/livevents';
import EventRequest from './Pages/SLTAdmin/eventrequest';
import EventRequestDetails from './Pages/SLTAdmin/EventRequestApprove';
import AdminDashboard from './Pages/SLTAdmin/AdminDashboard';
import AdminViewEvent from './Pages/SLTAdmin/viewevent';
import GuestHome from './Pages/GuestHome';
import GuestEventCard from './componants/guesteventcard';

import QRScanner from './Pages/TicketVerifier/QrScanner';

const stripePromise = loadStripe('pk_test_51PmtVV2MD4wZtHBHswLXfi3R98dI4gLQTCKeyWblGii8lGeopFthF0fWSwXAdCKAz2iZ6Vpr9y8wuMV2S3XhwnT200WNIctcig');

function App() {
  return (
    <Router>
    <AuthProvider>
        
      <Routes>
        <Route index element = {<Usertypes/>} />
        <Route path="/usertypes" element = {<Usertypes/>} />
        <Route path="/userlogin" element = {<UserLogin/>} />
        <Route path="/forgetpw" element = {<Forgetpw/>} />
        <Route path="/usersignup" element = {<UserSignup/>} />
        <Route path="/userotp" element = {<Userotp/>} />
        <Route path="/userprofile" element = {<ProfileInformation/>} />
        <Route path="/organizerprofile" element = {<OrganizerProfilePage/>} />
              
        {/* <Route path="/" element={<LoginPage />} /> */}
        {/* <Route path="/signup" element={<SignUpPage />} /> */}
        <Route path="/otp-verification" element={<OtpVerificationPage />} />
        <Route path="/event-organizer-signup" element={<EventOrganizerSignUpPage />} />
        <Route path="/event-organizer-otp-verification" element={<EventOrganizerOTPVerificationPage />} />
        <Route path="/organizer-signin" element={<OrganizerSignInPage />} />
        <Route path="/ticket-verifier-login" element={<TicketVerifierLoginPage />} />
        <Route path="/slt-admin-login" element={<SLTAdminLoginPage />} />
        <Route path="/create-event" element={<CreateNewEvent/>} />
        <Route path="/event-edit/:id" element={<EditEvent />} />
        <Route path="/event-edit" element={<EditEvent/>} />
        <Route path="/events" element = {<Events/>} />
        <Route path="/eventcard" element = {<EventCard/>} />
        <Route path="/buytickets/:eventId" element = {<BuyTickets/>} />
        <Route path="/mytickets" element = {<Mytickets/>} />
        <Route path="/viewevent/:eventId" element={<ViewEvent/>}/>
        <Route path="/categories" element={<AllCategory/>}/>
        <Route path="/category/:category" element={<Category/>}/>
        <Route path="/event-organizer-dashboard" element={<Dashboard/>}/>
        <Route path="/event-organizer-myevents" element={<MyEvents/>}/>

        <Route path="/subscriptions" element = {<Subscriptions/>} />
        <Route path="/edit-subscription" element={<EditSubscription/>} />
        <Route path="/subcard" element = {<SubCard/>} />

        <Route path="/unothorized" element= {<Unauthorized/>}/>

        <Route path='/home' element={<EndUserHome/>}/>
        <Route path="/event-organizer-myevents" element={<MyEvents/>}/>
        <Route path="/add-verifier" element={<AddVerifier/>}/>
        <Route path="/add-verifier/:eventId" element={<AddVerifier/>}/>
        <Route path="/event-organizer-notification" element={<EventNotifications/>}/>
        <Route path="/view-ticket/:ticketId" element = {<ViewTicket/>} />

        <Route path="/qr-scanner" element={<QRScanner/>} />

        <Route path='/admin-live-events' element={<LiveEvents/>}/>
        <Route path='/admin-event-requests' element={<EventRequest/>}/>
        <Route path='/admin-request-approve/:id' element={<EventRequestDetails/>}/>
        <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
        <Route path='/admin-viewevent/:eventId' element={<AdminViewEvent/>}/>
        <Route path='/guesthome' element={<GuestHome/>}/>
        <Route path="/guesteventcard" element = {<GuestEventCard/>} />

                    {/* Stripe payment route */}
            <Route
                        path="/payment"
                        element={
                            <Elements stripe={stripePromise}>
                                <StripePayment />
                            </Elements>
                        }
                    />
      </Routes>
      

      </AuthProvider>
    </Router>
  );
}

export default App;