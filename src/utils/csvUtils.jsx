export const downloadSampleSuppliersCSV = () => {
  const data = [
    {
      companyName: "OLAM COCOA PROCESSING GHANA",
      countryIso3: "GHA",
      sector: "Agriculture",
      hsCodes: "1801",
      dataSource: "IMPORT_YETI",
      verificationStatus: "PARTIAL",
    },
    {
      companyName: "COCOA MARKETING COMPANY GHANA",
      countryIso3: "GHA",
      sector: "Agriculture",
      hsCodes: "1801",
      dataSource: "REGISTRY",
      verificationStatus: "VERIFIED",
    },
    {
      companyName: "DANGOTE AGRICULTURE LIMITED",
      countryIso3: "NGA",
      sector: "Agriculture",
      hsCodes: "1001",
      dataSource: "REGISTRY",
      verificationStatus: "VERIFIED",
    },
    {
      companyName: "EXPORT TRADING GROUP NIGERIA",
      countryIso3: "NGA",
      sector: "Agriculture",
      hsCodes: "1201",
      dataSource: "IMPORT_YETI",
      verificationStatus: "PARTIAL",
    },
    {
      companyName: "BUA AGRICULTURE LIMITED",
      countryIso3: "NGA",
      sector: "Agriculture",
      hsCodes: "1006",
      dataSource: "REGISTRY",
      verificationStatus: "VERIFIED",
    },
  ];

  const headers = [
    "companyName",
    "countryIso3",
    "sector",
    "hsCodes",
    "dataSource",
    "verificationStatus",
  ];

  const csvRows = [
    headers.join(","), // header row
    ...data.map((row) =>
      headers.map((field) => `"${row[field] || ""}"`).join(",")
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