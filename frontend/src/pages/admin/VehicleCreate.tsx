import { useNavigate } from "react-router-dom";
import VehicleForm from "../../components/admin/VehicleForm";
import API from "../../api/vehicleApi";
import { useState } from "react";


const VehicleCreate = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  //Handle submit
  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await API.createVehicle(formData);
      navigate("/vehicles/create");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  //Handle cancel
  const handleCancel = () => {
    navigate("/vehicles/create");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">

          {/* Form Header */}
          <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Vehicle Information</h2>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <VehicleForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              onCancel={handleCancel}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default VehicleCreate;