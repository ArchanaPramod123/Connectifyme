import React, { useState } from "react";

const ReportModal = ({ isOpen, onClose, onSubmit }) => {
  const [selectedReason, setSelectedReason] = useState("");

  const handleReasonChange = (e) => {
    setSelectedReason(e.target.value);
  };

  const handleSubmit = () => {
    if (selectedReason) {
      onSubmit(selectedReason);
    } else {
      alert("Please select a reason for reporting.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Report Post</h2>
        <p>Please select a reason for reporting this post:</p>
        <select
          value={selectedReason}
          onChange={handleReasonChange}
          className="w-full p-2 mt-3 border border-gray-300 rounded"
        >
          <option value="">Select a reason</option>
          <option value="VIOLENCE">Violence</option>
          <option value="SEXUAL_CONTENT">Sexual Content</option>
          <option value="ALCOHOLIC">Alcoholic</option>
          <option value="OTHER">Other</option>
        </select>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
