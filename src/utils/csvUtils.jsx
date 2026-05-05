export const downloadSampleSuppliersCSV = () => {
  const data = [
    {
      companyName: "OLAM COCOA PROCESSING GHANA",
      countryIso3: "GHA",
      verificationStatus: "PARTIAL",
      dataSource: "IMPORT_YETI",
      registrationNumber: "GH12345",
      hsCodes: "1801",

      yearEstablished: "2005",
      primaryCommodities: "Cocoa",

      certificationType: "NAFDAC",
      certificationExpiry: "2026-12-31",

      exportPricePerTonne: "2400",
      pricingBasis: "FOB",
      annualExportVolume: "10000",
      supplyConsistency: "YEAR_ROUND",

      avgLeadTime: "14",
      primaryPort: "Tema Port",
      preferredShippingTerms: "FOB",

      exportMarkets: "UK,UAE",
      exportLicenseStatus: "ACTIVE",
    },
    {
      companyName: "COCOA MARKETING COMPANY GHANA",
      countryIso3: "GHA",
      verificationStatus: "VERIFIED",
      dataSource: "REGISTRY",
      registrationNumber: "GH67890",
      hsCodes: "1801",

      yearEstablished: "1998",
      primaryCommodities: "Cocoa",

      certificationType: "SON",
      certificationExpiry: "2027-06-30",

      exportPricePerTonne: "2550",
      pricingBasis: "CIF",
      annualExportVolume: "15000",
      supplyConsistency: "YEAR_ROUND",

      avgLeadTime: "12",
      primaryPort: "Tema Port",
      preferredShippingTerms: "CIF",

      exportMarkets: "UK,USA",
      exportLicenseStatus: "ACTIVE",
    },
    {
      companyName: "DANGOTE AGRICULTURE LIMITED",
      countryIso3: "NGA",
      verificationStatus: "VERIFIED",
      dataSource: "REGISTRY",
      registrationNumber: "NG12345",
      hsCodes: "1001",

      yearEstablished: "2000",
      primaryCommodities: "Wheat",

      certificationType: "NAFDAC",
      certificationExpiry: "2026-08-15",

      exportPricePerTonne: "1800",
      pricingBasis: "FOB",
      annualExportVolume: "20000",
      supplyConsistency: "YEAR_ROUND",

      avgLeadTime: "10",
      primaryPort: "Lagos Port",
      preferredShippingTerms: "FOB",

      exportMarkets: "UAE,UK",
      exportLicenseStatus: "ACTIVE",
    },
  ];

  const headers = [
    "companyName",
    "countryIso3",
    "verificationStatus",
    "dataSource",
    "registrationNumber",
    "hsCodes",
    "yearEstablished",
    "primaryCommodities",
    "certificationType",
    "certificationExpiry",
    "exportPricePerTonne",
    "pricingBasis",
    "annualExportVolume",
    "supplyConsistency",
    "avgLeadTime",
    "primaryPort",
    "preferredShippingTerms",
    "exportMarkets",
    "exportLicenseStatus",
  ];

  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((field) => `"${row[field] ?? ""}"`).join(",")
    ),
  ];

  const csvString = csvRows.join("\n");

  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "sample_suppliers.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};