import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Vehicle } from "../../api/vehicleApi";
import API from "../../api/vehicleApi";
import Swal from 'sweetalert2';

interface VehicleFormProps {
  initialData?: Partial<Vehicle>;
  onSubmit: (data: FormData) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

const VehicleForm = ({ initialData = {}, onSubmit, isSubmitting = false, onCancel }: VehicleFormProps) => {
  const [vehicle, setVehicle] = useState<Partial<Vehicle>>(initialData);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loadingDescription, setLoadingDescription] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVehicle((prev) => ({
      ...prev,
      [name]: name === "year" || name === "price" ? Number(value) : value
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prev) => [...prev, ...filesArray]);

      const previews = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previews]);
    }
  };

  //Handle remove images
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  //Generate description
  const handleGenerateDescription = async () => {
    try {
      setLoadingDescription(true);
      const desc = await API.generateDescription({
        brand: vehicle.brand,
        model: vehicle.model,
        type: vehicle.type,
        color: vehicle.color,
        engineSize: vehicle.engineSize,
        year: vehicle.year,
        price: vehicle.price,
      });
      setVehicle((prev) => ({ ...prev, description: desc }));
    } catch (err) {
      console.error(err);
      alert("Failed to generate description");
    } finally {
      setLoadingDescription(false);
    }
  };


  //Handle submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: 'Confirm Submission',
      text: "Please review the vehicle details before submitting.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Submit Vehicle',
      cancelButtonText: 'Review Details'
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Submitting...',
        text: 'Please wait while we process your vehicle.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        const formData = new FormData();
        Object.entries(vehicle).forEach(([k, v]) => {
          if (v !== undefined) formData.append(k, v as string | Blob);
        });
        images.forEach((img) => formData.append("images", img));

        await onSubmit(formData);

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Vehicle has been submitted successfully.',
          confirmButtonColor: '#10b981',
        });
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to submit vehicle. Please try again.',
          confirmButtonColor: '#ef4444',
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Form Fields*/}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {["type", "brand", "model", "color", "engineSize", "year", "price"].map((field) => (
          <div key={field} className="space-y-2">
            <label htmlFor={field} className="block text-sm font-medium text-slate-700 capitalize">
              {field === "engineSize" ? "Engine Size" :
                field === "price" ? "Price ($)" : field}
            </label>
            {field === "price" ? (
              <input
                id={field}
                name={field}
                type="number"
                placeholder="0.00"
                value={(vehicle[field as keyof Vehicle] as number) || ""}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            ) : field === "year" ? (
              <input
                id={field}
                name={field}
                type="number"
                placeholder={field === "year" ? "e.g., 2024" : `Enter ${field}`}
                value={(vehicle[field as keyof Vehicle] as string) || ""}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear() + 1}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            ) : (
              <input
                id={field}
                name={field}
                type="text"
                placeholder={field === "engineSize" ? "e.g., 2.0L" : `Enter ${field}`}
                value={(vehicle[field as keyof Vehicle] as string) || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            )}
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="description" className="block text-sm font-medium text-slate-700">
            Description
          </label>
          <button
            type="button"
            onClick={handleGenerateDescription}
            disabled={loadingDescription}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {loadingDescription ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{vehicle.description ? "Regenerate AI Description" : "Generate AI Description"}</span>
              </>
            )}
          </button>
        </div>
        <textarea
          id="description"
          name="description"
          placeholder="Vehicle description will be generated automatically or enter manually"
          value={vehicle.description || ""}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Vehicle Images
        </label>

        {/* File Upload */}
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer block">
            <svg className="w-12 h-12 text-slate-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-slate-600 font-medium">Click to upload images</p>
            <p className="text-slate-500 text-sm mt-1">PNG, JPG, GIF up to 5MB each</p>
          </label>
        </div>

        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
            {imagePreviews.map((src, idx) => (
              <div key={idx} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border-2 border-slate-200">
                  <img
                    src={src}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg hover:bg-red-600"
                >
                  ×
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Preview {idx + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 disabled:opacity-50 transition-all duration-200"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-gradient-to-r from-blue-800 to-blue-900 text-white rounded-xl font-semibold hover:from-blue-900 hover:to-navy-900 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Submitting...</span>
            </div>
          ) : (
            "Submit Vehicle"
          )}
        </button>
      </div>
    </form>
  );
};

export default VehicleForm;