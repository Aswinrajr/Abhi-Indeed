import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Contexts
import UserContext from "../Context/UserContext";
import RecruiterContext from "../Context/RecruiterContext";
import AdminContext from "../Context/AdminContext";
import CompanyContext from "../Context/CompanyContext";
import PageNotFound from "../Components/PageNotFound";


// Private Routes
import PrivateRoutes from "./PrivateRoutes";
import { RecruiterPrivateRoutes } from "./PrivateRoutes";
import { AdminPrivateRoutes } from "./PrivateRoutes";
import { CompanyPrivateRoutes } from "./PrivateRoutes";


import Home from "../Containers/Home/Home";
import About from "../Components/About";

// User routes
import Login from "../Containers/User/Login/Login";
import SignUp from "../Containers/User/SignUp/SignUp";
import ForgotPassword from "../Containers/User/ForgotPassword/ForgotPassword";
import Otp from "../Containers/User/Otp/Otp";
import ResetPassword from "../Containers/User/ResetPassword/ResetPassword";
import Profile from "../Containers/User/Profile/Profile";
import ContactForm from "../Containers/User/Profile/ContactForm";
import Qualifications from "../Containers/User/Profile/Qualifiacations";
import ApplicationSuccess from "../Containers/User/JobApplication/ApplicationSuccess";
import ApplicationFailure from "../Containers/User/JobApplication/ApplicationFailure";
import WorkExperience from "../Containers/User/Profile/WorkExperience";
import ReviewApplication from "../Containers/User/JobApplication/ReviewApplication";
import ApplicationListing from "../Containers/User/JobApplication/ApplicationListing";
import CompanyView from "../Containers/User/CompanyView/CompanyView";
import StartChat from "../Containers/User/Chat/StartChat";
import Reviews from "../Containers/User/Reviews/Reviews";
import ViewReviews from "../Containers/User/Reviews/ViewReviews";
import IndividualReviews from "../Containers/User/Reviews/IndividualReviews";

// Recruiter routes
import RecruiterSignUp from "../Containers/Recruiter/RecruiterSignup/RecruiterSignup";
import RecruiterLogin from "../Containers/Recruiter/RecruiterLogin/RecruiterLogin";
import RecruiterOtp from "../Containers/Recruiter/RecruiterOtp";
import RecruiterForgotPassword from "../Containers/Recruiter/RecruiterForgotPassword/RecruiterForgotPassword";
import RecruiterResetPassword from "../Containers/Recruiter/RecruiterResetPassword";
import RecruiterHome from "../Containers/Recruiter/RecruiterHome/RecruiterHome";
import JobPosting from "../Containers/Recruiter/JobPosting/JobPosting";
import JobListing from "../Containers/Recruiter/JobListing/JobListing";
import IndividualJob from "../Containers/Recruiter/JobListing/IndividualJob";
import EditJob from "../Containers/Recruiter/JobListing/EditJob";
import JobApplications from "../Containers/Recruiter/JobApplications/JobApplications";
import JobApplicationDetails from "../Containers/Recruiter/JobApplications/JobApplicationDetails";
import PlanListing from "../Containers/Recruiter/PlanListing/PlanListing";
import RecruiterChat from "../Containers/Recruiter/RecruiterMessage/RecruiterChat";

// Admin Routes
import AdminLogin from "../Containers/Admin/AdminLogin/AdminLogin";
import AdminHome from "../Containers/Admin/AdminHome/AdminHome";
import Candidates from "../Containers/Admin/AdminCandidates/Candidates";
import Recruiters from "../Containers/Admin/AdminRecruiters/Recruiters";
import Jobs from "../Containers/Admin/AdminJobs/Jobs";
import AdminJobListing from "../Containers/Admin/AdminJobs/AdminJobListing";
import Categories from "../Containers/Admin/AdminCategories/Categories";
import AddCategory from "../Containers/Admin/AdminCategories/AddCategory";
import EditCategory from "../Containers/Admin/AdminCategories/EditCategory";
import Plans from "../Containers/Admin/Plans/Plans";
import AddPlans from "../Containers/Admin/Plans/AddPlans";
import Companies from "../Containers/Admin/AdminCompanies/Companies";
import CompanyDetailedView from "../Containers/Admin/AdminCompanies/CompanyDetailedView";
import EditPlans from "../Containers/Admin/Plans/EditPlans";
import ShowReports from "../Containers/Admin/AdminJobs/ShowReports";
import Orders from "../Containers/Admin/AdminOrders/Orders";

// Company routes
import CompanySignup from "../Containers/Company/CompanySignUp/CompanySignup";
import CompanyLogin from "../Containers/Company/CompanyLogin/CompanyLogin";
import CompanyHome from "../Containers/Company/CompanyHome/CompanyHome";
import CompanyProfile from "../Containers/Company/CompanyProfile/CompanyProfile";
import CompanyProfileForm from "../Containers/Company/CompanyProfile/CompanyProfileForm";
import AboutCompany from "../Containers/Company/CompanyProfile/AboutCompany";
import EditAboutDetails from "../Containers/Company/CompanyProfile/EditAboutDetails";
import CompanyDocuments from "../Containers/Company/CompanyProfile/CompanyDocuments";
import CompanyReviews from "../Containers/Company/CompanyReviews/CompanyReviews";
import CompanyRecruiters from "../Containers/Company/CompanyRecruiters/CompanyRecruiters";

function Api() {
  return (
    <>
      <UserContext>
        <RecruiterContext>
          <AdminContext>
            <CompanyContext>
              <Router>
                <Routes>

                  {/* Candidate side public routes */}

                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/employee-companyView/:id" element={<CompanyView />} />
                  <Route path="/employee-reviews" element={<Reviews />} />
                  <Route path="/employee-viewReviews/:id" element={<ViewReviews />} />


                  <Route path="/employee-signup" element={<SignUp />} />
                  <Route path="/employee-login" element={<Login />} />
                  <Route path="/employee-verifyOtp" element={<Otp />} />
                  <Route path="/employee-forgotPassword" element={<ForgotPassword />} />
                  <Route path="/employee-resetPassword/:token" element={<ResetPassword />} />

                  {/* Candidate side Private Routes */}

                  <Route element={<PrivateRoutes />}>
                    <Route path="/employee-profile" element={<Profile />} />
                    <Route path="/employee-profile/editcontact" element={<ContactForm />} />
                    <Route path="/employee-profile/qualifications" element={<Qualifications />} />
                    <Route path="/employee-jobApplicationSuccess/:id" element={<ApplicationSuccess />} />
                    <Route path="/employee-jobApplicationFailure" element={<ApplicationFailure />} />
                    <Route path="/employee-profile/workexperience" element={<WorkExperience />} />
                    <Route path="/employee-reviewApplication/:id" element={<ReviewApplication />} />
                    <Route path="/employee-applicationListing" element={<ApplicationListing />} />
                    <Route path="/employee-startChat/:jobId/:employerId" element={<StartChat />} />
                    <Route path="/employee-individualReviews" element={<IndividualReviews />} />
                  </Route>


                  {/* Recruiter public routes */}

                  <Route path="/recruiter-signup" element={<RecruiterSignUp />} />
                  <Route path="/recruiter-login" element={<RecruiterLogin />} />
                  <Route path="/recruiter-verifyOtp" element={<RecruiterOtp />} />
                  <Route path="/recruiter-forgotPassword" element={<RecruiterForgotPassword />} />
                  <Route path="/recruiter-resetPassword/:token" element={<RecruiterResetPassword />} />

                  {/* Recruiter private Routes */}

                  <Route element={<RecruiterPrivateRoutes />}>
                    <Route path="/recruiter-home" element={<RecruiterHome />} />
                    <Route path='/recruiter-postJob' element={<JobPosting />} />
                    <Route path="/recruiter-listJob" element={<JobListing />} />
                    <Route path="/recruiter-viewJob/:id" element={<IndividualJob />} />
                    <Route path="/recruiter-editJob/:id" element={<EditJob />} />
                    <Route path="/recruiter-showApplications/:id" element={<JobApplications />} />
                    <Route path="/recruiter-viewApplicationDetails/:id" element={<JobApplicationDetails />} />
                    <Route path="/recruiter-planListing" element={<PlanListing />} />
                    <Route path="/recruiter-Chat" element={<RecruiterChat />} />
                  </Route>

                  {/* Admin public routes */}

                  <Route path="/admin-login" element={<AdminLogin />} />

                  {/* Admin private routes */}

                  <Route element={<AdminPrivateRoutes />}>
                    <Route path="/admin-home" element={<AdminHome />} />
                    <Route path="/admin-candidates" element={<Candidates />} />
                    <Route path="/admin-recruiters" element={<Recruiters />} />
                    <Route path="/admin-jobs" element={<Jobs />} />
                    <Route path="/admin-jobdetails/:id" element={<AdminJobListing />} />
                    <Route path="/admin-showReports/:id" element={<ShowReports />} />
                    <Route path="/admin-categories" element={<Categories />} />
                    <Route path="/admin-categories/add" element={<AddCategory />} />
                    <Route path="/admin-editcategory/:id" element={<EditCategory />} />
                    <Route path="/admin-plans" element={<Plans />} />
                    <Route path="/admin-addPlans" element={<AddPlans />} />
                    <Route path="/admin-editPlans/:id" element={<EditPlans />} />
                    <Route path="/admin-companies" element={<Companies />} />
                    <Route path="/admin-companydetails/:id" element={<CompanyDetailedView />} />
                    <Route path="/admin-orders" element={<Orders />} />
                  </Route>


                  {/* Company public routes */}

                  <Route path="/company-signup" element={<CompanySignup />} />
                  <Route path="/company-login" element={<CompanyLogin />} />

                  {/* Company private routes */}

                  <Route element={<CompanyPrivateRoutes />}>
                    <Route path="/company-home" element={<CompanyHome />} />
                    <Route path="/company-profile" element={<CompanyProfile />} />
                    <Route path="/company-profile/editForm" element={<CompanyProfileForm />} />
                    <Route path="/company-about" element={<AboutCompany />} />
                    <Route path="/company-editAboutDetails" element={<EditAboutDetails />} />
                    <Route path="/company-documents" element={<CompanyDocuments />} />
                    <Route path="/company-reviews" element={<CompanyReviews />} />
                    <Route path="/company-recruiters" element={<CompanyRecruiters />} />
                  </Route>

                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              </Router>
            </CompanyContext>
          </AdminContext>
        </RecruiterContext>
      </UserContext>
    </>
  )
}

export default Api
