import { useRef, useState, useEffect } from "react";
import TradePulseCard from "../../components/common/TradePulseCard";
import Select from "react-select";
import {
  GetSuppliers,
  CreateSupplier,
  VerifySupplier,
  GetSupplierVerificationStatuses,
  GetDataSources,
  DeleteSuppliers,
  CreateSupplierBulk,
} from "../../services/DashboardService";
import { FiX } from "react-icons/fi";
import { downloadSampleSuppliersCSV } from "../../utils/csvUtils";
import Papa from "papaparse";

const SuppliersManagement = () => {
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    supplierId: null,
    companyName: "",
  });
  /* ===============================
     MODAL STATE
  ================================ */
  const [openModal, setOpenModal] = useState(false);

  /* ===============================
     FORM STATE (UPDATED)
  ================================ */
  const [formData, setFormData] = useState({
    companyName: "",
    countryIso3: "",
    sector: "",
    verificationStatus: "PENDING",

    hsCodes: [],
    registrationNumber: "",
    dataSource: "",
  });

  const [loading, setLoading] = useState(false);
  const [verificationOptions, setVerificationOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [dataSources, setDataSources] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef(null);
  const [supplierMode, setSupplierMode] = useState("single");
  const [csvFile, setCsvFile] = useState(null);
  const [parsedCsvData, setParsedCsvData] = useState([]);
  const fileInputRef = useRef(null);

  const verificationSelectOptions = verificationOptions.map((status) => ({
    value: status,
    label: status,
  }));

  const dataSourceOptions = dataSources.map((ds) => ({
    value: ds,
    label: ds,
  }));

  const fetchSuppliers = async (pageNumber = 0, isSearch = false) => {
    try {
      setLoading(true);

      const res = await GetSuppliers({
        page: pageNumber,
        size: 10,
        query: search || undefined,
      });

      const newData = res?.data?.content || res?.data || [];

      setSuppliers((prev) => (isSearch ? newData : [...prev, ...newData]));

      setHasMore(newData.length === 10); // if less → no more pages
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSuppliers(0, true);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [verificationRes, dataSourcesRes] = await Promise.all([
          GetSupplierVerificationStatuses(),
          GetDataSources(),
        ]);

        setDataSources(dataSourcesRes?.data || dataSourcesRes || []);
        if (dataSourcesRes?.data?.length) {
          setFormData((prev) => ({
            ...prev,
            dataSource: dataSourcesRes.data[0], // ✅ default selected
          }));
        }
        setVerificationOptions(verificationRes?.data || []);
      } catch (error) {
        console.error("Error fetching suppliers/meta:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(0);
      fetchSuppliers(0, true);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  /* ===============================
     HANDLE CHANGE
  ================================ */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ===============================
     SUBMIT
  ================================ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
      };
      console.log(payload);

      await CreateSupplier(payload);

      const res = await GetSuppliers({
        page: 0,
        size: 10,
      });

      setSuppliers(res?.data?.content || res?.data || []);
      setOpenModal(false);

      /* RESET UPDATED */
      setFormData({
        companyName: "",
        countryIso3: "",
        sector: "",
        verificationStatus: "PENDING",
        hsCodes: [],
        registrationNumber: "",
        dataSource: "",
      });
    } catch (error) {
      console.error("Error creating supplier:", error);
    }
  };

  const handleVerify = async (id) => {
    try {
      await VerifySupplier(id, {
        verificationStatus: "VERIFIED",
      });

      setPage(0);
      fetchSuppliers(0, true);
    } catch (error) {
      console.error("Error verifying supplier:", error);
    }
  };

  /* ===============================
     SCROLL SYNC
  ================================ */
  const headerRef = useRef(null);
  const bodyRef = useRef(null);

  const handleHeaderScroll = () => {
    if (bodyRef.current) {
      bodyRef.current.scrollLeft = headerRef.current.scrollLeft;
    }
  };

  const handleBodyScroll = () => {
    if (headerRef.current) {
      headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
    }
  };
  const lastRowRef = (node) => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchSuppliers(nextPage);
      }
    });

    if (node) observer.current.observe(node);
  };
  const handleDelete = async (id) => {
    try {
      await DeleteSuppliers(id);

      setPage(0);
      fetchSuppliers(0, true);

      setDeleteModal({ open: false, supplierId: null, companyName: "" });
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  const handleModeChange = (mode) => {
    setSupplierMode(mode);

    // reset form when switching to bulk
    if (mode === "bulk") {
      setFormData({
        companyName: "",
        countryIso3: "",
        sector: "",
        verificationStatus: "PENDING",
        hsCodes: [],
        registrationNumber: "",
        dataSource: "",
      });
    }
  };

  const handleCsvUpload = (file) => {
    if (!file) return;

    setCsvFile(file);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log("Parsed CSV:", results.data);

        setParsedCsvData(results.data);
      },
      error: (err) => {
        console.error("CSV Parse Error:", err);
      },
    });
  };

  const transformCsvData = (data) => {
    return data.map((row) => ({
      companyName: row.companyName?.trim(),
      countryIso3: row.countryIso3?.trim(),
      sector: row.sector?.trim(),
      hsCodes: row.hsCodes ? row.hsCodes.split(",").map((c) => c.trim()) : [],
      dataSource: row.dataSource?.trim(),
      verificationStatus: row.verificationStatus?.trim(),
    }));
  };

  const validateCsvData = (data) => {
    const errors = [];

    data.forEach((row, index) => {
      if (!row.companyName) {
        errors.push(`Row ${index + 1}: Missing companyName`);
      }

      if (!row.countryIso3) {
        errors.push(`Row ${index + 1}: Missing countryIso3`);
      }

      if (!row.hsCodes || row.hsCodes.length === 0) {
        errors.push(`Row ${index + 1}: Missing hsCodes`);
      }

      if (!["IMPORT_YETI", "REGISTRY"].includes(row.dataSource)) {
        errors.push(`Row ${index + 1}: Invalid dataSource`);
      }

      if (
        !["VERIFIED", "PARTIAL", "PENDING"].includes(row.verificationStatus)
      ) {
        errors.push(`Row ${index + 1}: Invalid verificationStatus`);
      }
    });

    return errors;
  };

  const handleBulkUpload = async () => {
    try {
      if (!parsedCsvData.length) {
        alert("Please upload a CSV file first");
        return;
      }

      const transformed = transformCsvData(parsedCsvData);

      const errors = validateCsvData(transformed);

      if (errors.length > 0) {
        console.error("Validation Errors:", errors);
        alert(errors.slice(0, 5).join("\n")); // show first few
        return;
      }

      setLoading(true);

      await CreateSupplierBulk(transformed);

      alert("Bulk suppliers uploaded successfully!");

      // refresh list
      setPage(0);
      fetchSuppliers(0, true);

      // reset state
      setParsedCsvData([]);
      setCsvFile(null);
      setSupplierMode("single");
      setOpenModal(false);
    } catch (error) {
      console.error("Bulk upload error:", error);
      alert("Something went wrong while uploading CSV");
    } finally {
      setLoading(false);
    }
  };

  const handleClearCsv = () => {
    setCsvFile(null);
    setParsedCsvData([]);

    // reset file input (IMPORTANT)
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  return (
    <section className="tp-section tp-section--dashboard">
      <div className="tp-dashboard-container tp-grid-stack">
        <header>
          <div className="tp-overview-sub-row">
            <div>
              <h1 className="tp-section-title">
                Suppliers <span>Management</span>
              </h1>

              <p className="tp-section-sub">
                Manage, verify, and monitor your global supplier network.
              </p>
            </div>

            <div className="tp-filter-btn-wrapper tp-flex tp-gap-sm tp-supplier-header-btn">
              <input
                className="tp-input tp-supplier-header-input"
                placeholder="Search suppliers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button
                className="tp-btn-primary"
                onClick={() => setOpenModal(true)}
              >
                Add Supplier
              </button>
            </div>
          </div>
        </header>

        <TradePulseCard
          header={
            <div className="tp-card-header">
              <h3 className="tp-card-title">Suppliers Data</h3>
            </div>
          }
        >
          <div className="tp-table-wrapper tp-supplier-table">
            <div className="tp-table-wrapper-feedback">
              <div
                className="tp-table-head-scroll"
                ref={headerRef}
                onScroll={handleHeaderScroll}
              >
                <div className="tp-table-head tp-table-supplier-admin">
                  <span>Company</span>
                  <span>Country</span>

                  <span>Sector</span>
                  <span>Verification</span>
                  <span>Reliability</span>
                  <span>Sanctions</span>

                  <span>Sanctions Score</span>
                  <span>Source</span>
                  <span>LEI Code</span>
                  <span>Actions</span>
                </div>
              </div>

              <div
                className="tp-table-body-scroll"
                ref={bodyRef}
                onScroll={handleBodyScroll}
              >
                <div className="tp-table">
                  {suppliers.map((supplier, index) => {
                    const isLast = suppliers.length === index + 1;

                    return (
                      <div
                        key={supplier.id}
                        ref={isLast ? lastRowRef : null}
                        className="tp-table-row tp-table-supplier-admin"
                      >
                        {/* Company */}
                        <div className="tp-text-strong">
                          {supplier.companyName}
                        </div>

                        {/* Country */}
                        <span>{supplier.countryName}</span>

                        {/* Sector */}
                        <span>{supplier.sector}</span>

                        {/* Verification */}
                        <span>
                          <span
                            className={`tp-pill ${
                              supplier.verificationStatus === "VERIFIED"
                                ? "tp-pill-success"
                                : supplier.verificationStatus === "PARTIAL"
                                  ? "tp-pill-warning"
                                  : "tp-pill-danger"
                            }`}
                          >
                            {supplier.verificationStatus}
                          </span>
                        </span>

                        {/* Reliability */}
                        <span>
                          <span
                            className={`tp-pill ${
                              supplier.reliabilityScore < 0.3
                                ? "tp-pill-danger"
                                : supplier.reliabilityScore < 0.5
                                  ? "tp-pill-warning"
                                  : "tp-pill-success"
                            }`}
                          >
                            {supplier.reliabilityScore}
                          </span>
                        </span>

                        {/* Sanctions Flag */}
                        <span>
                          <span
                            className={`tp-pill ${
                              supplier.sanctionsFlag
                                ? "tp-pill-danger"
                                : "tp-pill-success"
                            }`}
                          >
                            {supplier.sanctionsFlag ? "Flagged" : "Clear"}
                          </span>
                        </span>

                        {/* Sanctions Score */}
                        <span>{supplier.sanctionsScore ?? 0}</span>

                        {/* Sanctions Source */}
                        <span>{supplier.sanctionsSource}</span>

                        {/* LEI */}
                        <span>{supplier.leiCode || "-"}</span>

                        {/* ACTIONS */}
                        <span>
                          <div className="tp-admin-actions">
                            {supplier.verificationStatus !== "VERIFIED" ? (
                              <button
                                className="tp-btn-primary tp-btn-sm"
                                onClick={() => handleVerify(supplier.id)}
                              >
                                Verify
                              </button>
                            ) : (
                              <button className="tp-btn-outline" disabled>
                                Verified
                              </button>
                            )}

                            <button
                              className="tp-btn-danger tp-btn-sm"
                              onClick={() =>
                                setDeleteModal({
                                  open: true,
                                  supplierId: supplier.id,
                                  companyName: supplier.companyName,
                                })
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </span>
                      </div>
                    );
                  })}
                </div>
                {loading && (
                  <div className="tp-loading-more">Loading more...</div>
                )}
              </div>
            </div>
          </div>
        </TradePulseCard>

        {openModal && (
          <div className="tp-modal-overlay" onClick={() => setOpenModal(false)}>
            <div className="tp-modal" onClick={(e) => e.stopPropagation()}>
              <div className="tp-supplier-modal-header">
                <div className="tp-modal-title-group">
                  <h3 className="tp-section-title">Add Supplier</h3>

                  <div className="tp-mode-toggle">
                    <button
                      type="button"
                      className={`tp-mode-btn ${supplierMode === "single" ? "active" : ""}`}
                      onClick={() => handleModeChange("single")}
                    >
                      Single
                    </button>

                    <button
                      type="button"
                      className={`tp-mode-btn ${supplierMode === "bulk" ? "active" : ""}`}
                      onClick={() => handleModeChange("bulk")}
                    >
                      Bulk
                    </button>
                  </div>
                </div>

                <button
                  className="tp-filter-close"
                  onClick={() => setOpenModal(false)}
                >
                  <FiX />
                </button>
              </div>

              {supplierMode === "single" ? (
                <form className="tp-form-grid" onSubmit={handleSubmit}>
                  {/* EXISTING FORM — DO NOT CHANGE ANYTHING INSIDE */}
                  <div className="tp-form-group">
                    <label>Company Name</label>
                    <input
                      name="companyName"
                      className="tp-input"
                      placeholder="Enter company name (e.g. ABC Cocoa Ltd)"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="tp-form-group">
                    <label>Country ISO3</label>
                    <input
                      name="countryIso3"
                      className="tp-input"
                      placeholder="Enter ISO3 code (e.g. GHA, IND, USA)"
                      value={formData.countryIso3}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="tp-form-group">
                    <label>Sector</label>
                    <input
                      name="sector"
                      className="tp-input"
                      placeholder="Enter sector (e.g. Agriculture, Manufacturing)"
                      value={formData.sector}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="tp-form-group">
                    <label>Verification Status</label>
                    {/* Verification Status */}
                    {/* <select
                    name="verificationStatus"
                    className="tp-input tp-select"
                    value={formData.verificationStatus}
                    onChange={handleChange}
                  >
                    <option value="">Select verification status</option>
                    {verificationOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select> */}
                    <Select
                      classNamePrefix="tp-select"
                      placeholder="Select verification status"
                      options={verificationSelectOptions}
                      value={
                        verificationSelectOptions.find(
                          (opt) => opt.value === formData.verificationStatus,
                        ) || null
                      }
                      onChange={(selectedOption) =>
                        setFormData((prev) => ({
                          ...prev,
                          verificationStatus: selectedOption?.value || "",
                        }))
                      }
                    />
                  </div>
                  <div className="tp-form-group">
                    <label>Data Source</label>
                    {/* <select
                    name="dataSource"
                    className="tp-input tp-select"
                    value={formData.dataSource}
                    onChange={handleChange}
                  >
                    <option value="">Select data source</option>
                    {dataSources.map((ds) => (
                      <option key={ds} value={ds}>
                        {ds}
                      </option>
                    ))}
                  </select> */}
                    <Select
                      classNamePrefix="tp-select"
                      placeholder="Select data source"
                      options={dataSourceOptions}
                      value={
                        dataSourceOptions.find(
                          (opt) => opt.value === formData.dataSource,
                        ) || null
                      }
                      onChange={(selectedOption) =>
                        setFormData((prev) => ({
                          ...prev,
                          dataSource: selectedOption?.value || "",
                        }))
                      }
                    />
                  </div>
                  <div className="tp-form-group">
                    <label>Registration Number</label>
                    <input
                      name="registrationNumber"
                      className="tp-input"
                      placeholder="Enter registration number (e.g. GH12345)"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="tp-form-group">
                    <label>HS Code</label>
                    <input
                      type="text"
                      name="hsCodes"
                      className="tp-input"
                      placeholder="Enter HS codes separated by commas (e.g. 1801, 0901)"
                      value={formData.hsCodes.join(",")}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          hsCodes: e.target.value.split(","),
                        }))
                      }
                    />
                  </div>

                  {/* <div className="tp-form-group">
                  <label>Sanctions Score</label>
                  <input
                    type="number"
                    name="sanctionsScore"
                    className="tp-input"
                    value={formData.sanctionsScore}
                    onChange={handleChange}
                  />
                </div> */}

                  <div className="tp-form-group tp-form-span-2 tp-actions">
                    <button type="submit" className="tp-btn-primary">
                      Save
                    </button>
                  </div>
                </form>
              ) : (
                <div className="tp-bulk-container">
                  <p className="tp-bulk-text">
                    Upload multiple suppliers using a CSV file.
                  </p>

                  <div className="tp-bulk-actions">
                    <button
                      type="button"
                      className="tp-btn-outline"
                      onClick={downloadSampleSuppliersCSV}
                    >
                      Download Sample CSV
                    </button>

                    <>
                      <input
                        type="file"
                        accept=".csv"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={(e) => handleCsvUpload(e.target.files[0])}
                      />

                      <button
                        type="button"
                        className="tp-btn-primary"
                        onClick={() => fileInputRef.current.click()}
                      >
                        Import CSV
                      </button>
                    </>

                    {parsedCsvData.length > 0 && (
                      <button
                        type="button"
                        className="tp-btn-success"
                        onClick={handleBulkUpload}
                        disabled={!parsedCsvData.length || loading}
                      >
                        {loading ? "Uploading..." : "Upload Data"}
                      </button>
                    )}
                  </div>
                  {csvFile && (
                    <div className="tp-file-row">
                      <div className="tp-file-name">📄 {csvFile.name}</div>

                      <button
                        type="button"
                        className="tp-btn-clear"
                        onClick={handleClearCsv}
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {deleteModal.open && (
          <div className="tp-modal-overlay">
            <div className="tp-modal tp-delete-modal">
              <h3 className="tp-section-title">Confirm Delete</h3>

              <p className="tp-delete-text">
                Are you sure you want to delete{" "}
                <strong>{deleteModal.companyName}</strong>?
              </p>

              <div className="tp-delete-actions">
                <button
                  className="tp-btn-outline"
                  onClick={() =>
                    setDeleteModal({
                      open: false,
                      supplierId: null,
                      companyName: "",
                    })
                  }
                >
                  No
                </button>

                <button
                  className="tp-btn-danger"
                  onClick={() => handleDelete(deleteModal.supplierId)}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SuppliersManagement;
