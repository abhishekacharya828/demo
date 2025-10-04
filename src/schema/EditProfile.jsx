import * as yup from "yup";

export const EditProfileSchema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .matches(
      /^[A-Za-z0-9\s]+$/,
      "Full name must not contain special characters"
    )
    .test(
      "not-only-space-or-number",
      "Full name must contain at least one letter",
      (value) => !!value && /[A-Za-z]/.test(value)
    )
    .required("Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  schoolName: yup
    .string()
    .min(2, "School name must be at least 2 characters")
  //    .matches(
  //   /^[A-Za-z0-9\s\-\/,]+$/,
  //   "School Name can only contain letters, numbers, spaces, hyphens (-), commas (,) and slashes (/)"
  // )
    .required("School name is required"),
  address: yup
    .string()
    .min(5, "Address must be at least 5 characters")
    .matches(
      /^[^@?!$%^&*~+_"']*$/,
      "Address must not contain special characters like @ ? ! $ % ^ & * ~ + _ \" '"
    )
    .required("Address is required"),
  state: yup
    .string()
    .min(2, "State must be at least 2 characters")
    .required("State is required"),
  whatsappNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Mobile Number must contain exactly 10 digits")
    .required("Whatsapp number is required"),
  dob: yup
    .date()
    .required("Date of Birth is required")
    .max(new Date(), "Date of Birth cannot be in the future"),
  pincode: yup
    .string()
    .matches(
      /^(?!000)\d{6}$/,
      "Pincode must be 6 digits and cannot start with 000"
    )
    .required("Pincode is required"),
});
