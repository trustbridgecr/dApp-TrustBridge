import { useState } from "react";
import trustBridgeDefaults from "../constants/trustBridgeDefaults";

export function useCreateLoanForm() {
  const [formData, setFormData] = useState({
    title: "",
    engagement: "",
    trustline: "",
    serviceProvider: "",
    amount: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
      ...trustBridgeDefaults,
      ...formData,
    };
    console.log("Submitting loan data:", submissionData);
  };

  return {
    formData,
    handleChange,
    handleSubmit,
  };
}
