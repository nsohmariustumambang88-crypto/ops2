"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function QuotePage() {
  const [formData, setFormData] = useState({
    whereFrom: "",
    whereTo: "",
    preferredRoute: "",
    incoterms: "",
    whatShipping: "",
    totalWeight: "",
    readyCollection: "",
    mustArriveBy: "",
    name: "",
    company: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [status, setStatus] = useState<{ type: "sending" | "sent" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "sending", text: "Sending..." });
    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "quote",
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        message: formData.whatShipping,
        payload: formData,
      }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus({ type: "error", text: j.error || "Your enquiry could not be sent. Please try again." });
      return;
    }
    setStatus({ type: "sent", text: j.message });
    setFormData({
      whereFrom: "", whereTo: "", preferredRoute: "", incoterms: "", whatShipping: "", totalWeight: "",
      readyCollection: "", mustArriveBy: "", name: "", company: "", email: "", phone: "",
    });
  };

  const infoCards = [
    {
      title: "We need it properly",
      description: "Providing accurate information means we'll provide you with a shipping estimate that matches what you actually need."
    },
    {
      title: "We price the options",
      description: "We provide quotes for a variety of transport options so you can choose the one that best suits your needs."
    },
    {
      title: "Ranked, not a single number",
      description: "Rates and surcharges change frequently. We can compare options from a variety of partners to get you the best price."
    },
    {
      title: "How long it takes",
      description: "Project scope, resources needed, and other project factors affect how long a project typically takes to complete."
    }
  ];

  return (
    <>
      <div className="bg-white">
        {/* Hero Section */}
        <section className="bg-white py-16 md:py-20 lg:py-24">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left - Form */}
              <div className="lg:col-span-2">
                <div className="mb-12">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Get a Quote</p>
                  <h1 className="text-[40px] md:text-[56px] font-extrabold text-navy mb-4" style={{ color: "#0B2C5F" }}>
                    Tell us what is moving. We will price it properly.
                  </h1>
                  <p className="text-gray-600 text-base" style={{ color: "#1A1A1A" }}>
                    Six fields are required. Everything else is optional and genuinely is – a half-filled enquiry still reaches a person, and we would rather ask you one question than have you give up on a form.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* The Route */}
                  <div className="border-b border-gray-200 pb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">1</div>
                      <h2 className="text-lg font-extrabold text-navy" style={{ color: "#0B2C5F" }}>The route</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-navy mb-2" style={{ color: "#0B2C5F" }}>Where from, where to</label>
                        <input
                          type="text"
                          name="whereFrom"
                          placeholder="City and country"
                          value={formData.whereFrom}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy mb-2" style={{ color: "#0B2C5F" }}>To</label>
                        <input
                          type="text"
                          name="whereTo"
                          placeholder="City and country"
                          value={formData.whereTo}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-navy mb-2" style={{ color: "#0B2C5F" }}>Preferred route</label>
                        <select
                          name="preferredRoute"
                          value={formData.preferredRoute}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        >
                          <option value="">Select route</option>
                          <option value="air">Air</option>
                          <option value="sea">Sea</option>
                          <option value="land">Land</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy mb-2" style={{ color: "#0B2C5F" }}>Incoterms</label>
                        <select
                          name="incoterms"
                          value={formData.incoterms}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        >
                          <option value="">If you do not know, leave it blank</option>
                          <option value="fob">FOB</option>
                          <option value="cif">CIF</option>
                          <option value="ddu">DDU</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* The Cargo */}
                  <div className="border-b border-gray-200 pb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">2</div>
                      <h2 className="text-lg font-extrabold text-navy" style={{ color: "#0B2C5F" }}>The cargo</h2>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-navy mb-2" style={{ color: "#0B2C5F" }}>What are you shipping?</label>
                      <textarea
                        name="whatShipping"
                        placeholder="Will containerized imports, tailored support"
                        value={formData.whatShipping}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy mb-2" style={{ color: "#0B2C5F" }}>Total weight</label>
                      <input
                        type="text"
                        name="totalWeight"
                        placeholder="E.g. 5 kg"
                        value={formData.totalWeight}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* The Dates */}
                  <div className="border-b border-gray-200 pb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">3</div>
                      <h2 className="text-lg font-extrabold text-navy" style={{ color: "#0B2C5F" }}>The dates</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-navy mb-2" style={{ color: "#0B2C5F" }}>Ready for collection</label>
                        <input
                          type="date"
                          name="readyCollection"
                          value={formData.readyCollection}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy mb-2" style={{ color: "#0B2C5F" }}>Must arrive by</label>
                        <input
                          type="date"
                          name="mustArriveBy"
                          value={formData.mustArriveBy}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* You */}
                  <div className="pb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">4</div>
                      <h2 className="text-lg font-extrabold text-navy" style={{ color: "#0B2C5F" }}>You</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-navy mb-2" style={{ color: "#0B2C5F" }}>Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy mb-2" style={{ color: "#0B2C5F" }}>Company</label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-navy mb-2" style={{ color: "#0B2C5F" }}>Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy mb-2" style={{ color: "#0B2C5F" }}>Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {status && (
                    <p role="status" className={status.type === "error" ? "text-red-700 font-bold" : "text-primary font-bold"}>
                      {status.text}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
                    style={{ backgroundColor: "#1173D4" }}
                  >
                    Send this enquiry
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    Finder to send email confirmation. We will respect your <a href="#" className="text-primary hover:underline">privacy policy</a>
                  </p>
                </form>
              </div>

              {/* Right - Info Cards */}
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  {infoCards.map((card, index) => (
                    <div key={index} className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                          OPS
                        </div>
                      </div>
                      <h3 className="font-bold text-navy mb-2" style={{ color: "#0B2C5F" }}>{card.title}</h3>
                      <p className="text-sm text-gray-600" style={{ color: "#1A1A1A" }}>{card.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Why Choose Section */}
        <section className="bg-navy py-16 md:py-20 lg:py-24" style={{ backgroundColor: "#0B2C5F" }}>
          <Container>
            <div className="text-center mb-12">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">What happens next</p>
              <h2 className="text-2xl md:text-[28px] font-extrabold text-white mb-4">
                A person reads it. Not a rate engine.
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto">
                Which is slower than an instant online rate, and considerably more likely to be the price you actually pay. Within quotes are accurate, right up until your cargo starts to be shipped.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: "We read it properly", desc: "Reading your email takes us a moment more, but it also means we are less likely to miss important details." },
                { title: "We price the options", desc: "We price the options, not a single price. Dedicated routes are cheaper, and dedicated routes are rarely available." },
                { title: "Ranked, not a single number", desc: "Rates and surcharges change. Project scope, resources, and a high budget cost is easier than a readily available route." },
                { title: "How long it takes", desc: "Project scope, resources needed, and other project factors affect how long a project typically takes to complete." }
              ].map((item, index) => (
                <div key={index} className="bg-blue-900 p-6 rounded-lg border border-blue-800">
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-white/70">{item.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Benefits Section */}
        <section className="bg-white py-16 md:py-20 lg:py-24">
          <Container>
            <div className="text-center mb-12">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Why this beats email</p>
              <h2 className="text-2xl md:text-[28px] font-extrabold text-navy mb-4" style={{ color: "#0B2C5F" }}>
                Three faster routes than this form
              </h2>
              <p className="text-gray-600">
                A quote is not always the right first step. If one of these is better – let us know.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "It is in a parcel",
                  desc: "If it is in a parcel box that fits in a suitcase, and does not weigh more than a suitcase, and you're happy to wait two weeks – try our parcel service."
                },
                {
                  title: "You ship this regularly",
                  desc: "Do you ship it every week. Direct? Please tell us. A regular pick-up may well save you money versus individual shipments."
                },
                {
                  title: "You are not sure what you need",
                  desc: "Message the shipping specialists. From parcel options to international transport – we help pick the right fit."
                }
              ].map((item, index) => (
                <div key={index} className="border-t-4 border-primary pt-6">
                  <h3 className="text-lg font-bold text-navy mb-3" style={{ color: "#0B2C5F" }}>{item.title}</h3>
                  <p className="text-gray-600" style={{ color: "#1A1A1A" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="bg-navy py-12 md:py-16" style={{ backgroundColor: "#0B2C5F" }}>
          <Container>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl md:text-[19px] font-bold text-white mb-2">
                  Need help with your shipment? Our team is available 24/7
                </h3>
              </div>
              <a href="/track" className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap" style={{ backgroundColor: "#1173D4" }}>
                Track Your Shipment
              </a>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}
