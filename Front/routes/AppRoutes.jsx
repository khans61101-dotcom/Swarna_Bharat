import { Routes, Route } from "react-router-dom";
import Partners from "../pages/Partners";
import ProfileDetails from "../pages/ProfileDetails";

export default function AppRoutes() {
  return (
    <Routes>
      {/* <Route path="/partners" element={<Partners />} /> */}
      <Route path="/partners/:id" element={<ProfileDetails />} />
    </Routes>
  );
}