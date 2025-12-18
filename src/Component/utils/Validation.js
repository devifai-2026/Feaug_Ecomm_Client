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

export const validateShippingField = (name, value, data) => {
  if (!value || !value.toString().trim()) {
    return "This field is required";
  }

  switch (name) {
    case "firstName":
    case "lastName":
      return !/^[A-Za-z\s]{2,50}$/.test(value)
        ? "Must be 2-50 letters only"
        : "";

    case "email":
      return !/^\S+@\S+\.\S+$/.test(value) ? "Invalid email address" : "";

    case "phone":
      const phoneDigits = value.replace(/\D/g, "");
      return !/^\d{10}$/.test(phoneDigits) ? "Phone must be 10 digits" : "";

    case "address":
      return value.length < 10 ? "Address must be at least 10 characters" : "";

    case "city":
      return value.trim().length < 2 ? "City must be at least 2 characters" : "";

    case "state":
      return !INDIAN_STATES.includes(value) ? "Please select a valid state" : "";

    case "zipCode":
      return !/^\d{6}$/.test(value) ? "ZIP must be 6 digits" : "";

    default:
      return "";
  }
};

export const validateBillingField = (name, value, data) => {
  if (!value || !value.toString().trim()) {
    return "This field is required";
  }

  switch (name) {
    case "firstName":
    case "lastName":
      return !/^[A-Za-z\s]{2,50}$/.test(value)
        ? "Must be 2-50 letters only"
        : "";

    case "address":
      return value.length < 10 ? "Address must be at least 10 characters" : "";

    case "city":
      return value.trim().length < 2 ? "City must be at least 2 characters" : "";

    case "state":
      return !INDIAN_STATES.includes(value) ? "Please select a valid state" : "";

    case "zipCode":
      return !/^\d{6}$/.test(value) ? "ZIP must be 6 digits" : "";

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
  if (paymentMethod === "card") {
    switch (name) {
      case "cardNumber":
        const cardDigits = value.replace(/\s/g, "");
        if (!/^\d{16}$/.test(cardDigits)) return "Card must be 16 digits";
        return !validateLuhn(cardDigits) ? "Invalid card number" : "";

      case "cardName":
        return !/^[A-Za-z\s]{2,50}$/.test(value)
          ? "Must be 2-50 letters only"
          : "";

      case "expiryDate":
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value))
          return "Format must be MM/YY";

        const [month, year] = value.split("/");
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;

        if (
          parseInt(year) < currentYear ||
          (parseInt(year) === currentYear && parseInt(month) < currentMonth)
        ) {
          return "Card has expired";
        }
        return "";

      case "cvv":
        return !/^\d{3,4}$/.test(value) ? "CVV must be 3 or 4 digits" : "";

      default:
        return "";
    }
  }

  if (paymentMethod === "upi") {
    if (name === "upiId") {
      return !/^[\w\.\-_]+@[\w]+$/.test(value)
        ? "Enter valid UPI ID (e.g., username@upi)"
        : "";
    }
  }

  return "";
};