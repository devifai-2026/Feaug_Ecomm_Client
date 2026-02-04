export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Lakshadweep",
  "Delhi",
  "Puducherry",
];

// Field labels for better error messages
const FIELD_LABELS = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  phone: "Phone number",
  address: "Address",
  city: "City",
  state: "State",
  zipCode: "PIN code",
  cardNumber: "Card number",
  cardName: "Cardholder name",
  expiryDate: "Expiry date",
  cvv: "CVV",
  upiId: "UPI ID",
};

export const validateShippingField = (name, value, data) => {
  const trimmedValue = value?.toString().trim() || "";

  // Required field check
  if (!trimmedValue) {
    return `${FIELD_LABELS[name] || "This field"} is required`;
  }

  switch (name) {
    case "firstName":
    case "lastName":
      if (trimmedValue.length < 2) {
        return "Must be at least 2 characters";
      }
      if (trimmedValue.length > 50) {
        return "Must be less than 50 characters";
      }
      if (!/^[A-Za-z\s'.-]+$/.test(trimmedValue)) {
        return "Only letters, spaces, and common punctuation allowed";
      }
      return "";

    case "email":
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedValue)) {
        return "Please enter a valid email address";
      }
      return "";

    case "phone":
      const phoneDigits = trimmedValue.replace(/\D/g, "");
      if (phoneDigits.length !== 10) {
        return "Phone number must be exactly 10 digits";
      }
      if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
        return "Please enter a valid Indian mobile number";
      }
      return "";

    case "address":
      if (trimmedValue.length < 10) {
        return "Please enter a complete address (at least 10 characters)";
      }
      if (trimmedValue.length > 200) {
        return "Address is too long (max 200 characters)";
      }
      return "";

    case "city":
      if (trimmedValue.length < 2) {
        return "City name must be at least 2 characters";
      }
      if (!/^[A-Za-z\s-]+$/.test(trimmedValue)) {
        return "City name should only contain letters";
      }
      return "";

    case "state":
      if (!INDIAN_STATES.includes(trimmedValue)) {
        return "Please select a valid Indian state";
      }
      return "";

    case "zipCode":
      if (!/^\d{6}$/.test(trimmedValue)) {
        return "PIN code must be exactly 6 digits";
      }
      // Indian PIN codes start with 1-9, not 0
      if (!/^[1-9]\d{5}$/.test(trimmedValue)) {
        return "Please enter a valid Indian PIN code";
      }
      return "";

    default:
      return "";
  }
};

export const validateBillingField = (name, value, data) => {
  const trimmedValue = value?.toString().trim() || "";

  // Required field check
  if (!trimmedValue) {
    return `${FIELD_LABELS[name] || "This field"} is required`;
  }

  switch (name) {
    case "firstName":
    case "lastName":
      if (trimmedValue.length < 2) {
        return "Must be at least 2 characters";
      }
      if (trimmedValue.length > 50) {
        return "Must be less than 50 characters";
      }
      if (!/^[A-Za-z\s'.-]+$/.test(trimmedValue)) {
        return "Only letters, spaces, and common punctuation allowed";
      }
      return "";

    case "address":
      if (trimmedValue.length < 10) {
        return "Please enter a complete address (at least 10 characters)";
      }
      if (trimmedValue.length > 200) {
        return "Address is too long (max 200 characters)";
      }
      return "";

    case "city":
      if (trimmedValue.length < 2) {
        return "City name must be at least 2 characters";
      }
      if (!/^[A-Za-z\s-]+$/.test(trimmedValue)) {
        return "City name should only contain letters";
      }
      return "";

    case "state":
      if (!INDIAN_STATES.includes(trimmedValue)) {
        return "Please select a valid Indian state";
      }
      return "";

    case "zipCode":
      if (!/^\d{6}$/.test(trimmedValue)) {
        return "PIN code must be exactly 6 digits";
      }
      if (!/^[1-9]\d{5}$/.test(trimmedValue)) {
        return "Please enter a valid Indian PIN code";
      }
      return "";

    default:
      return "";
  }
};

const validateLuhn = (cardNumber) => {
  let sum = 0;
  let isEven = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

export const validatePaymentField = (name, value, paymentMethod) => {
  const trimmedValue = value?.toString().trim() || "";

  if (paymentMethod === "card") {
    // Required check for card fields
    if (!trimmedValue && ["cardNumber", "cardName", "expiryDate", "cvv"].includes(name)) {
      return `${FIELD_LABELS[name] || "This field"} is required`;
    }

    switch (name) {
      case "cardNumber":
        const cardDigits = trimmedValue.replace(/\s/g, "");
        if (!/^\d{16}$/.test(cardDigits)) {
          return "Card number must be 16 digits";
        }
        if (!validateLuhn(cardDigits)) {
          return "Please enter a valid card number";
        }
        return "";

      case "cardName":
        if (trimmedValue.length < 2) {
          return "Name must be at least 2 characters";
        }
        if (!/^[A-Za-z\s]+$/.test(trimmedValue)) {
          return "Name should only contain letters";
        }
        return "";

      case "expiryDate":
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(trimmedValue)) {
          return "Please use MM/YY format";
        }

        const [month, year] = trimmedValue.split("/");
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;

        if (
          parseInt(year) < currentYear ||
          (parseInt(year) === currentYear && parseInt(month) < currentMonth)
        ) {
          return "This card has expired";
        }
        return "";

      case "cvv":
        if (!/^\d{3,4}$/.test(trimmedValue)) {
          return "CVV must be 3 or 4 digits";
        }
        return "";

      default:
        return "";
    }
  }

  if (paymentMethod === "upi") {
    if (name === "upiId") {
      if (!trimmedValue) {
        return "UPI ID is required";
      }
      if (!/^[\w.\-_]+@[\w]+$/.test(trimmedValue)) {
        return "Please enter a valid UPI ID (e.g., name@upi)";
      }
    }
  }

  return "";
};

// Helper function to validate all fields at once
export const validateAllFields = (fields, data, validationFn) => {
  const errors = {};
  let isValid = true;

  fields.forEach((field) => {
    const error = validationFn(field, data[field], data);
    if (error) {
      errors[field] = error;
      isValid = false;
    }
  });

  return { errors, isValid };
};

// Helper function to check if form is complete (all required fields filled)
export const isFormComplete = (fields, data) => {
  return fields.every((field) => {
    const value = data[field];
    return value && value.toString().trim() !== "";
  });
};
