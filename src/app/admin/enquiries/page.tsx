"use client";

import { useState, useEffect } from "react";
import {
  getStoredEnquiries,
  updateEnquiryStatusStore,
  deleteEnquiryStore,
  Enquiry,
} from "@/lib/enquiryStore";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "New" | "Contacted" | "Resolved">("All");

  const loadEnquiries = async () => {
    const list = await getStoredEnquiries();
    setEnquiries(list);
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const filteredEnquiries = enquiries.filter((item) => {
    if (statusFilter !== "All" && item.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase();
      const matches =
        item.name.toLowerCase().includes(term) ||
        item.phone.toLowerCase().includes(term) ||
        (item.email && item.email.toLowerCase().includes(term)) ||
        (item.designCode && item.designCode.toLowerCase().includes(term)) ||
        item.message.toLowerCase().includes(term);
      if (!matches) return false;
    }
    return true;
  });

  const handleStatusChange = async (id: string, newStatus: "New" | "Contacted" | "Resolved") => {
    await updateEnquiryStatusStore(id, newStatus);
    loadEnquiries();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this enquiry lead?")) {
      await deleteEnquiryStore(id);
      loadEnquiries();
    }
  };

  const getWhatsAppLink = (phone: string, name: string, designCode?: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const msg = `Hello ${name}, thank you for contacting Kashvi Cards regarding design ${designCode ? `(${designCode})` : ""}. How can we assist you?`;
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="max-w-container-max mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display-lg-mobile md:font-display-lg text-primary text-display-lg-mobile md:text-display-lg">
            Enquiries & Customer Leads ({filteredEnquiries.length})
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Manage incoming customer messages, card inquiries, and WhatsApp leads.
          </p>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-surface-container-low p-4 border border-outline/15 flex flex-col md:flex-row gap-4 justify-between items-center rounded-xl">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone, code..."
            className="w-full pl-9 pr-4 py-2 bg-surface border border-outline/20 text-sm focus:border-secondary outline-none rounded-lg"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {(["All", "New", "Contacted", "Resolved"] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-1.5 font-label-sm text-label-sm uppercase tracking-wider transition-colors rounded-lg ${
                statusFilter === st
                  ? "bg-primary text-white font-semibold"
                  : "bg-surface text-on-surface-variant border border-outline/20 hover:border-secondary"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries Grid/Table */}
      <div className="space-y-4">
        {filteredEnquiries.length > 0 ? (
          filteredEnquiries.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-lowest border border-outline/15 p-5 rounded-2xl shadow-sm space-y-4 hover:border-secondary/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-outline/10 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary font-bold flex items-center justify-center font-headline-md text-lg">
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-headline-md text-base text-primary leading-tight">
                      {item.name}
                    </h3>
                    <span className="text-xs text-on-surface-variant font-mono">
                      📞 {item.phone} {item.email && `• ✉️ ${item.email}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Dropdown */}
                  <select
                    value={item.status}
                    onChange={(e) =>
                      handleStatusChange(item.id, e.target.value as "New" | "Contacted" | "Resolved")
                    }
                    className={`px-3 py-1 font-label-sm text-label-sm uppercase tracking-wider text-xs border outline-none cursor-pointer rounded-lg ${
                      item.status === "New"
                        ? "bg-primary/10 text-primary border-primary/30 font-semibold"
                        : item.status === "Contacted"
                        ? "bg-secondary/10 text-secondary border-secondary/30"
                        : "bg-surface-container-low text-on-surface-variant border-outline/20"
                    }`}
                  >
                    <option value="New">Status: New</option>
                    <option value="Contacted">Status: Contacted</option>
                    <option value="Resolved">Status: Resolved</option>
                  </select>

                  <span className="text-[11px] text-outline">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Message Body */}
              <div className="space-y-1">
                {item.subject && (
                  <span className="font-label-sm text-xs uppercase tracking-widest text-secondary block">
                    Subject: {item.subject} {item.designCode && `(#${item.designCode})`} {item.format && `[${item.format.toUpperCase()}]`}
                  </span>
                )}
                <p className="font-body-md text-sm text-on-surface leading-relaxed">
                  "{item.message}"
                </p>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 flex items-center justify-between border-t border-outline/10">
                <a
                  href={getWhatsAppLink(item.phone, item.name, item.designCode)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white px-4 py-2 font-label-sm text-xs uppercase tracking-wider inline-flex items-center gap-1.5 rounded-lg shadow-sm hover:bg-[#1EBE57] transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">chat</span>
                  Chat on WhatsApp
                </a>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="text-error hover:text-error-container text-xs font-label-sm uppercase tracking-wider flex items-center gap-1 p-1"
                >
                  <span className="material-symbols-outlined text-sm">delete</span> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-surface-container-lowest border border-outline/15 p-12 text-center rounded-2xl">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">contact_support</span>
            <h3 className="font-headline-md text-primary mb-1">No enquiries found</h3>
            <p className="font-body-md text-on-surface-variant text-sm">
              Incoming customer messages and card inquiries will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
