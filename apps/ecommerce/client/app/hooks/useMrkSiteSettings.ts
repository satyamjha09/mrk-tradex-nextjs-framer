"use client";

import { MRK_COMPANY } from "@/app/lib/constants/mrk";
import { useGetSiteSettingQuery } from "@/app/store/apis/MrkApi";

const phoneHref = (phone: string) => `tel:${phone.replace(/\s/g, "")}`;

const whatsappHref = (whatsapp: string, fallbackPhone: string) => {
  const digits = (whatsapp || fallbackPhone).replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "#";
};

export const useMrkSiteSettings = () => {
  const { data, isLoading, isError } = useGetSiteSettingQuery();
  const siteSetting = data?.siteSetting;
  const phone = siteSetting?.phone || MRK_COMPANY.phone;
  const whatsapp = siteSetting?.whatsapp || MRK_COMPANY.whatsappNumber;
  const email = siteSetting?.email || MRK_COMPANY.email;

  const company = {
    ...MRK_COMPANY,
    phone,
    email,
    address: siteSetting?.address || MRK_COMPANY.address,
    whatsappNumber: whatsapp,
    gstNumber: siteSetting?.gstNumber || MRK_COMPANY.gstNumber,
    youtubeUrl: siteSetting?.youtubeUrl || MRK_COMPANY.youtubeUrl,
  };

  return {
    company,
    urls: {
      phone: phoneHref(phone),
      whatsapp: whatsappHref(whatsapp, phone),
      email: `mailto:${email}`,
    },
    isLoading,
    isError,
  };
};
