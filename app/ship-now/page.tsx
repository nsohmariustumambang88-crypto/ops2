"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ShipNowPage() {
  const [formData, setFormData] = useState({
    contents: "",
    roughWeight: "",
    anythingElse: "",
    collectFrom: "",
    deliverTo: "",
    readyCollection: "Tomorrow",
    name: "",
    company: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <>
      <div className="bg-white">
        {/* Section 1: Intro */}
        <section className="bg-white py-16 md:py-20 lg:py-24">
          <Container>
            <div className="max-w-3xl">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Ship Now</p>
              <h1 className="text-[40px] md:text-[56px] font-extrabold text-navy mb-8" style={{ color: "#0B2C5F" }}>
                You have decided. Let us come and <span style={{ color: "#1173D4" }}>get it.</span>
              </h1>
              <p className="text-base md:text-lg text-gray-600" style={{ color: "#1A1A1A" }}>
                This is a collection request, not an instant checkout – it reaches a person who confirms the collection with you. Ten fields, seven of them required, and no pricing questions, because you are past that part.
              </p>
            </div>
          </Container>
        </section>

        {/* Section 2: Two Ways In */}
        <section className="bg-blue-50 py-16 md:py-20 lg:py-24">
          <Container>
            <div className="mb-12">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Two Ways In</p>
              <h2 className="text-2xl md:text-[28px] font-extrabold text-navy mb-6" style={{ color: "#0B2C5F" }}>
                Which of these are you?
              </h2>
              <p className="text-base text-gray-600" style={{ color: "#1A1A1A" }}>
                If you already have an account, the portal is considerably faster – your addresses and saved lanes are already in it.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 rounded-2xl bg-navy text-left" style={{ backgroundColor: "#0B2C5F" }}>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Door 01</p>
                <h3 className="text-[19px] font-bold text-white mb-4">I have an account</h3>
                <p className="text-base text-white/90 mb-6">
                  Book in the portal. Your addresses, saved lanes and service preferences are already stored, so a repeat collection takes about a minute and everything lands on your monthly invoice.
                </p>
                <span className="inline-flex items-center text-white font-bold">
                  Open the portal <span className="ml-2">→</span>
                </span>
              </div>

              <div className="p-8 rounded-2xl border-2 bg-white text-left" style={{ borderColor: "#1173D4" }}>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Door 02</p>
                <h3 className="text-[19px] font-bold text-navy mb-4" style={{ color: "#0B2C5F" }}>
                  First time, or a one-off
                </h3>
                <p className="text-base text-gray-600 mb-6" style={{ color: "#1A1A1A" }}>
                  No account needed. Fill in the short form below and we will confirm the collection with you directly. If it turns into a regular thing, we can set up an account afterwards.
                </p>
                <span className="inline-flex items-center font-bold" style={{ color: "#1173D4" }}>
                  Go to the form <span className="ml-2">↓</span>
                </span>
              </div>
            </div>
          </Container>
        </section>

        {/* Section 3: The Request Form */}
        <section className="bg-white py-16 md:py-20 lg:py-24">
          <Container>
            <div className="max-w-4xl">
              <div className="mb-12">
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">The Request</p>
                <h2 className="text-2xl md:text-[28px] font-extrabold text-navy mb-6" style={{ color: "#0B2C5F" }}>
                  Three steps
                </h2>
                <p className="text-base text-gray-600" style={{ color: "#1A1A1A" }}>
                  Everything we need to send someone. If a field does not apply, leave it – we would rather ask one question than have you abandon the form.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-12">
                {/* Step 1 */}
                <div className="border-b border-gray-200 pb-12">
                  <div className="flex items-start gap-4 mb-8">
                    <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold shrink-0" style={{ backgroundColor: "#0B2C5F" }}>1</div>
                    <div><h3 className="text-xl font-bold text-navy" style={{ color: "#0B2C5F" }}>What is going <span className="text-gray-500 font-normal text-base">Plain words are fine.</span></h3></div>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-navy mb-2" style={{ color: "#0B2C5F" }}>Contents <span className="text-primary">*</span></label>
                        <input type="text" name="contents" placeholder="e.g. 2 boxes of samples, documents" value={formData.contents} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-navy mb-2" style={{ color: "#0B2C5F" }}>Rough weight <span className="text-primary">*</span></label>
                        <input type="text" name="roughWeight" placeholder="e.g. 12 kg total" value={formData.roughWeight} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-navy mb-2" style={{ color: "#0B2C5F" }}>Anything we should know <span className="text-gray-400 font-normal text-xs">OPTIONAL</span></label>
                      <textarea name="anythingElse" placeholder="Fragile, batteries inside, needs a tail lift, awkward access..." value={formData.anythingElse} onChange={handleChange} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary resize-none" />
                    </div>
                    <p className="text-sm text-gray-500" style={{ color: "#1A1A1A" }}>Batteries, liquids and aerosols are regulated – mention them and we will tell you what applies.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="border-b border-gray-200 pb-12">
                  <div className="flex items-start gap-4 mb-8">
                    <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold shrink-0" style={{ backgroundColor: "#0B2C5F" }}>2</div>
                    <div><h3 className="text-xl font-bold text-navy" style={{ color: "#0B2C5F" }}>Where and when <span className="text-gray-500 font-normal text-base">We confirm the slot back to you.</span></h3></div>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-navy mb-2" style={{ color: "#0B2C5F" }}>Collect from <span className="text-primary">*</span></label>
                        <input type="text" name="collectFrom" placeholder="Address or postcode" value={formData.collectFrom} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-navy mb-2" style={{ color: "#0B2C5F" }}>Deliver to <span className="text-primary">*</span></label>
                        <input type="text" name="deliverTo" placeholder="Address, or city and country" value={formData.deliverTo} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-navy mb-2" style={{ color: "#0B2C5F" }}>Ready for collection</label>
                      <select name="readyCollection" value={formData.readyCollection} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary">
                        <option value="Tomorrow">Tomorrow</option>
                        <option value="Today">Today</option>
                        <option value="This week">This week</option>
                        <option value="Next week">Next week</option>
                      </select>
                    </div>
                    <p className="text-sm text-gray-500" style={{ color: "#1A1A1A" }}>Tell us when it is ready and we will confirm what is achievable rather than promising a slot we have not checked.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="pb-12">
                  <div className="flex items-start gap-4 mb-8">
                    <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold shrink-0" style={{ backgroundColor: "#0B2C5F" }}>3</div>
                    <div><h3 className="text-xl font-bold text-navy" style={{ color: "#0B2C5F" }}>Who to call <span className="text-gray-500 font-normal text-base">A driver needs a number that answers.</span></h3></div>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-navy mb-2" style={{ color: "#0B2C5F" }}>Name <span className="text-primary">*</span></label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-navy mb-2" style={{ color: "#0B2C5F" }}>Company <span className="text-gray-400 font-normal text-xs">OPTIONAL</span></label>
                        <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-navy mb-2" style={{ color: "#0B2C5F" }}>Email <span className="text-primary">*</span></label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-navy mb-2" style={{ color: "#0B2C5F" }}>Phone <span className="text-primary">*</span></label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500" style={{ color: "#1A1A1A" }}>Required for a collection, not for marketing.</p>
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="w-full py-4 bg-primary text-white font-bold text-lg rounded-lg hover:opacity-90 transition-opacity" style={{ backgroundColor: "#1173D4" }}>
                  Request the collection
                </button>

                {/* Footer Text */}
                <p className="text-sm text-gray-600 text-center" style={{ color: "#1A1A1A" }}>
                  This opens an email to us. A person reads it and comes back to confirm the collection – it is not an automatic booking. In a hurry? Call <a href="tel:+18564287703" className="font-bold" style={{ color: "#1173D4" }}>+1 856-428-7703</a>, open around the clock. We use what you send to arrange the shipment and nothing else; see our <a href="#" style={{ color: "#1173D4" }} className="underline">privacy policy</a>.
                </p>
              </form>
            </div>
          </Container>
        </section>
        {/* Section 4: Four things that stop a collection failing */}
        <section className="py-16 md:py-20 lg:py-24" style={{ backgroundColor: "#0B2C5F" }}>
          <Container>
            <div className="mb-12">
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#1173D4" }}>Before We Arrive</p>
              <h2 className="text-2xl md:text-[28px] font-extrabold mb-6" style={{ color: "#FFFFFF" }}>
                Four things that stop a collection failing
              </h2>
              <p className="text-base md:text-lg max-w-2xl" style={{ color: "#FFFFFF" }}>
                A driver turning up to something that is not ready costs everybody a day. None of this takes long, and it is the difference between one visit and two.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-lg" style={{ border: "1px solid rgba(255,255,255,0.3)" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#1173D4" }}>Ready 01</p>
                <h3 className="text-lg font-bold mb-3" style={{ color: "#FFFFFF" }}>Packed and sealed</h3>
                <p className="text-sm" style={{ color: "#FFFFFF" }}>
                  Not still being taped when the van arrives. Drivers work to a route and cannot wait. <a href="#" className="underline font-semibold" style={{ color: "#FFFFFF" }}>Packing guidance</a>.
                </p>
              </div>

              <div className="p-6 rounded-lg" style={{ border: "1px solid rgba(255,255,255,0.3)" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#1173D4" }}>Ready 02</p>
                <h3 className="text-lg font-bold mb-3" style={{ color: "#FFFFFF" }}>Somebody there to hand it over</h3>
                <p className="text-sm" style={{ color: "#FFFFFF" }}>
                  With the phone number you gave us switched on. Most failed collections are an unanswered phone rather than a missing parcel.
                </p>
              </div>

              <div className="p-6 rounded-lg" style={{ border: "1px solid rgba(255,255,255,0.3)" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#1173D4" }}>Ready 03</p>
                <h3 className="text-lg font-bold mb-3" style={{ color: "#FFFFFF" }}>Paperwork if it crosses a border</h3>
                <p className="text-sm" style={{ color: "#FFFFFF" }}>
                  Invoice, contents and values. We will tell you exactly what your destination needs when we confirm. <a href="#" className="underline font-semibold" style={{ color: "#FFFFFF" }}>What customs needs</a>.
                </p>
              </div>

              <div className="p-6 rounded-lg" style={{ border: "1px solid rgba(255,255,255,0.3)" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#1173D4" }}>Ready 04</p>
                <h3 className="text-lg font-bold mb-3" style={{ color: "#FFFFFF" }}>Access sorted</h3>
                <p className="text-sm" style={{ color: "#FFFFFF" }}>
                  Gate codes, loading bay, parking, stairs. Tell us in advance rather than letting a driver discover it.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Section 5: Three other doors */}
        <section className="bg-white py-16 md:py-20 lg:py-24">
          <Container>
            <div className="mb-12">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Not This</p>
              <h2 className="text-2xl md:text-[28px] font-extrabold text-navy mb-6" style={{ color: "#0B2C5F" }}>
                Three other doors
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg bg-white" style={{ borderTop: "4px solid #1173D4", border: "1px solid #E5E7EB", borderTopWidth: "4px" }}>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Instead 01</p>
                <h3 className="text-lg font-bold text-navy mb-3" style={{ color: "#0B2C5F" }}>You want a price first</h3>
                <p className="text-sm text-gray-600" style={{ color: "#1A1A1A" }}>
                  Perfectly reasonable. The quote form asks the cargo questions this one deliberately skips.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-white" style={{ borderTop: "4px solid #1173D4", border: "1px solid #E5E7EB", borderTopWidth: "4px" }}>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Instead 02</p>
                <h3 className="text-lg font-bold text-navy mb-3" style={{ color: "#0B2C5F" }}>You will be doing this weekly</h3>
                <p className="text-sm text-gray-600" style={{ color: "#1A1A1A" }}>
                  Do not fill this in every time. An account stores your addresses and puts it all on one invoice.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-white" style={{ borderTop: "4px solid #1173D4", border: "1px solid #E5E7EB", borderTopWidth: "4px" }}>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Instead 03</p>
                <h3 className="text-lg font-bold text-navy mb-3" style={{ color: "#0B2C5F" }}>You already sent it</h3>
                <p className="text-sm text-gray-600" style={{ color: "#1A1A1A" }}>
                  Tracking is the page you want. Have the reference from your confirmation to hand.
                </p>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}
