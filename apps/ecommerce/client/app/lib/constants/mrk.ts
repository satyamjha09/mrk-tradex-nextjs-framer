export const MRK_COMPANY = {
  name: "MRK Tradex Pvt Ltd",
  shortName: "MRK",
  tagline: "Water is life - and we fill your life with water.",
  address:
    "R/3A, Dooars Trp Compound, GT Road, Sahibabad, Ghaziabad, Uttar Pradesh 201005",
  phone: "+91 93197 19670",
  email: "rajesh.mrktradex@gmail.com",
  whatsappNumber: "919319719670",
  gstNumber: "To be updated",
  youtubeUrl: "",
  mapsUrl: "",
} as const;

export const MRK_WHATSAPP_URL = `https://wa.me/${MRK_COMPANY.whatsappNumber}`;
export const MRK_PHONE_URL = `tel:${MRK_COMPANY.phone.replace(/\s/g, "")}`;
export const MRK_EMAIL_URL = `mailto:${MRK_COMPANY.email}`;
