import { useEffect, useState } from "react";
import type { Vehicle } from "../../api/vehicleApi";
import API from "../../api/vehicleApi";
import Swal from 'sweetalert2';

interface Props {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const VehicleEditModal = ({ vehicle, isOpen, onClose, onUpdate }: Props) => {
  const [formData, setFormData] = useState<Partial<Vehicle>>({});
  const [imagesToKeep, setImagesToKeep] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<FileList | null>(null);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setFormData(vehicle);
      setImagesToKeep(vehicle.images || []);
      setNewImagePreviews([]);
    }
  }, [vehicle]);

  //Handle form data changes 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //Handle image changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(e.target.files);

      const previews = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setNewImagePreviews(previews);
    }
  };

  const handleRemoveExistingImage = (img: string) => {
    setImagesToKeep(imagesToKeep.filter(i => i !== img));
  };

  const handleRemoveNewImage = (index: number) => {
    if (newImages) {
      const updatedFiles = Array.from(newImages).filter((_, i) => i !== index);
      const dataTransfer = new DataTransfer();
      updatedFiles.forEach(file => dataTransfer.items.add(file));
      setNewImages(dataTransfer.files);
    }
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };


  //Handle image description updating
  const handleGenerateDescription = async () => {
    try {
      setLoadingDescription(true);
      const desc = await API.generateDescription({
        brand: formData.brand,
        model: formData.model,
        type: formData.type,
        color: formData.color,
        engineSize: formData.engineSize,
        year: formData.year,
      });
      setFormData((prev) => ({ ...prev, description: desc }));
    } catch (err) {
      console.error(err);
      alert("Failed to generate description");
    } finally {
      setLoadingDescription(false);
    }
  };


  //Handle Submit (update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const confirmResult = await Swal.fire({
      title: 'Update Vehicle',
      text: 'Are you sure you want to update this vehicle?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (!confirmResult.isConfirmed) {
      return;
    }

    setIsSubmitting(true);

    Swal.fire({
      title: 'Updating...',
      text: 'Please wait while we update the vehicle.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) data.append(key, String(value));
      });

      if (newImages) Array.from(newImages).forEach(file => data.append("images", file));

      data.append("keepImages", JSON.stringify(imagesToKeep));

      await API.updateVehicle(vehicle.id!, data);

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Vehicle has been updated successfully.',
        confirmButtonColor: '#10b981',
      });

      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'There was an error updating the vehicle. Please try again.',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const getImageUrl = (img: string) => {
    if (img.startsWith("http")) return img;
    return `http://localhost:4000${img}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[90vh]  overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Edit Vehicle</h2>
              <p className="text-blue-200 mt-1">
                Update details for {vehicle.brand} {vehicle.model}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(95vh-200px)]">
          <div className="p-6 space-y-6">

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "type", label: "Type", type: "text" },
                { name: "brand", label: "Brand", type: "text" },
                { name: "model", label: "Model", type: "text" },
                { name: "color", label: "Color", type: "text" },
                { name: "engineSize", label: "Engine Size", type: "text" },
                { name: "year", label: "Year", type: "number" },
                { name: "price", label: "Price ($)", type: "number" },
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label htmlFor={field.name} className="block text-sm font-medium text-slate-700">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name as keyof Vehicle] as string || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
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
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 transition-all duration-200"
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
                      <span>{formData.description ? "Regenerate AI Description" : "Generate AI Description"}</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
                placeholder="Vehicle description"
              />
            </div>

            {/* Existing Images Section */}
            {imagesToKeep.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800">Existing Images</h3>
                <p className="text-sm text-slate-600">Click × to remove images from the vehicle</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {imagesToKeep.map((img) => (
                    <div key={img} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border-2 border-slate-200">
                        <img
                          src={getImageUrl(img)}
                          alt="Existing vehicle"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(img)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Upload Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Add New Images</h3>

              {/* File Upload Area */}
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="new-images-upload"
                />
                <label htmlFor="new-images-upload" className="cursor-pointer block">
                  <svg className="w-12 h-12 text-slate-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-slate-600 font-medium">Click to upload new images</p>
                  <p className="text-slate-500 text-sm mt-1">PNG, JPG, GIF up to 5MB each</p>
                </label>
              </div>

              {/* New Image Previews */}
              {newImagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
                  {newImagePreviews.map((src, idx) => (
                    <div key={idx} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border-2 border-green-200">
                        <img
                          src={src}
                          alt={`New preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg hover:bg-red-600"
                      >
                        ×
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-xs p-1 text-center">
                        New
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 p-6 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 disabled:opacity-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-blue-800 to-blue-900 text-white rounded-xl font-semibold hover:from-blue-900 hover:to-navy-900 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating Vehicle...</span>
                </div>
              ) : (
                "Update Vehicle"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleEditModal;