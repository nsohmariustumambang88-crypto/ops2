"use client";

import { useState, type FormEvent } from "react";
import Container from "@/components/ui/Container";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function RequestBusinessAccountPage() {
  const [frequency, setFrequency] = useState("Weekly");
  const [status, setStatus] = useState<{ type: "sending" | "sent" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    setStatus({ type: "sending", text: "Sending..." });
    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "business_account",
        name: data.name,
        company: data.company,
        email: data.email,
        phone: data.phone,
        message: data.lanes,
        payload: { ...data, frequency },
      }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus({ type: "error", text: j.error || "Your application could not be sent. Please try again." });
      return;
    }
    setStatus({ type: "sent", text: j.message });
  };

  return (
    <>
      <div className="bg-white">
        {/* Intro Section */}
        <section className="bg-white py-16 md:py-20 lg:py-24">
          <Container>
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Request a Business Account</p>
              <h1 className="text-[40px] md:text-[56px] font-extrabold font-bold text-navy mb-8" style={{ color: "#0B2C5F" }}>
                Send three months of shipments. That is the <span style={{ color: "#1173D4" }}>whole ask.</span>
              </h1>
              <p className="text-base md:text-lg text-gray-600" style={{ color: "#1A1A1A" }}>
                No tender document, no volume forecast, no commitment. Lanes, weights and how often – and you get your actual routes priced against what you pay now, itemised so you can see where the difference comes from.
              </p>
            </div>
          </Container>
        </section>

        {/* Eligibility Section */}
        <section className="bg-blue-50 py-16 md:py-20 lg:py-24">
          <Container>
            <div className="mb-12">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Before You Fill Anything In</p>
              <h2 className="text-[36px] font-extrabold text-navy mb-6" style={{ color: "#0B2C5F" }}>
                An account is not right for everyone yet
              </h2>
              <p className="text-base text-gray-600" style={{ color: "#1A1A1A" }}>
                There is no minimum volume and we will not turn you away for being small. But an account is administration, and administration should earn its place.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Worth Applying If */}
              <div className="p-8 rounded-lg bg-white" style={{ border: "2px solid #1173D4" }}>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Worth Applying If</p>
                <h3 className="text-[19px] font-bold text-navy mb-6" style={{ color: "#0B2C5F" }}>
                  Any two of these are true
                </h3>
                <div className="space-y-4">
                  {[
                    "You ship at least a few times a month, on lanes that repeat",
                    "Somebody re-types the same addresses regularly",
                    "You are quoting the same route again and again",
                    "Paying per shipment is creating work for your finance team",
                    "Your customers ask you where their orders are",
                    "You are sending high-value goods, even in small numbers"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#1173D4" }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700" style={{ color: "#1173D4" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Probably Not Yet If */}
              <div className="p-8 rounded-lg bg-white">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Probably Not Yet If</p>
                <h3 className="text-[19px] font-bold text-navy mb-6" style={{ color: "#0B2C5F" }}>
                  This sounds more like you
                </h3>
                <div className="space-y-4">
                  {[
                    "You ship occasionally, with no pattern to it",
                    "Every consignment is a different route and a different commodity",
                    "You are sending one thing, once",
                    "Your supplier already arranges and pays for the freight",
                    "You are comparing us out of curiosity rather than need"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-gray-400 font-bold mt-0.5">–</span>
                      <span className="text-sm text-gray-600" style={{ color: "#1A1A1A" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Note */}
            <div className="p-6 rounded-lg bg-white" style={{ borderLeft: "4px solid #1173D4" }}>
              <p className="text-sm text-gray-600" style={{ color: "#1A1A1A" }}>
                If you are on the right-hand side, use the <a href="/quote" className="font-semibold" style={{ color: "#1173D4" }}>quote form</a> instead. It takes less time, gets you a price for the shipment you actually have, and you can always <a href="/request-business-account" className="font-semibold" style={{ color: "#1173D4" }}>open an account later once the pattern appears</a>.
              </p>
            </div>
          </Container>
        </section>

        {/* Application Form Section */}
        <section className="bg-white py-16 md:py-20 lg:py-24">
          <Container>
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">The Application</p>
              <h2 className="text-[36px] font-extrabold text-navy mb-6" style={{ color: "#0B2C5F" }}>
                Nine fields, five of them required
              </h2>
              <p className="text-base text-gray-600 mb-12" style={{ color: "#1A1A1A" }}>
                Deliberately short. What decides your rates is the shipping history, not the form – so put your effort into the attachment rather than into filling boxes.
              </p>

              {/* Form Card */}
              <div className="border-t-4 border-primary rounded-lg bg-white p-8 md:p-10" style={{ borderTopColor: "#1173D4" }}>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Row 1: Company & Website */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2" style={{ color: "#0B2C5F" }}>
                        Company <span style={{ color: "#DC2626" }}>*</span>
                      </label>
                      <input name="company" required
                        type="text"
                        placeholder=""
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        style={{ borderColor: "#D5DFEC" }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2" style={{ color: "#0B2C5F" }}>
                        Website <span style={{ fontSize: "0.75rem", color: "#667085" }}>OPTIONAL</span>
                      </label>
                      <input name="website"
                        type="text"
                        placeholder="Helps us understand what you ship"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        style={{ borderColor: "#D5DFEC", color: "#1A1A1A" }}
                      />
                    </div>
                  </div>

                  {/* Row 2: Your name & Work email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2" style={{ color: "#0B2C5F" }}>
                        Your name <span style={{ color: "#DC2626" }}>*</span>
                      </label>
                      <input name="name" required
                        type="text"
                        placeholder=""
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        style={{ borderColor: "#D5DFEC" }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2" style={{ color: "#0B2C5F" }}>
                        Work email <span style={{ color: "#DC2626" }}>*</span>
                      </label>
                      <input name="email" required
                        type="email"
                        placeholder=""
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        style={{ borderColor: "#D5DFEC" }}
                      />
                    </div>
                  </div>

                  {/* Row 3: Phone & Who ships for you */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2" style={{ color: "#0B2C5F" }}>
                        Phone <span style={{ fontSize: "0.75rem", color: "#667085" }}>OPTIONAL</span>
                      </label>
                      <input name="phone"
                        type="tel"
                        placeholder=""
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        style={{ borderColor: "#D5DFEC" }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2" style={{ color: "#0B2C5F" }}>
                        Who ships for you now <span style={{ fontSize: "0.75rem", color: "#667085" }}>OPTIONAL</span>
                      </label>
                      <input name="whoShipsNow"
                        type="text"
                        placeholder="Carrier, forwarder, or 'nobody yet'"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        style={{ borderColor: "#D5DFEC", color: "#1A1A1A" }}
                      />
                    </div>
                  </div>

                  {/* What you ship */}
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2" style={{ color: "#0B2C5F" }}>
                      What you ship <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input name="whatYouShip" required
                      type="text"
                      placeholder="e.g. packaged electronics, apparel, machine parts"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      style={{ borderColor: "#D5DFEC", color: "#1A1A1A" }}
                    />
                  </div>

                  {/* Your main lanes */}
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2" style={{ color: "#0B2C5F" }}>
                      Your main lanes <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <textarea name="lanes" required
                      placeholder="Roughly where from and where to. One per line is fine – exact volumes not needed here."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-none"
                      style={{ borderColor: "#D5DFEC", color: "#1A1A1A" }}
                    />
                  </div>

                  {/* Roughly how often you ship */}
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-4" style={{ color: "#0B2C5F" }}>
                      Roughly how often you ship <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {["A few times a year", "Monthly", "Weekly", "Daily"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setFrequency(option)}
                          className="px-6 py-2 rounded-lg font-medium text-sm transition-all border"
                          style={{
                            backgroundColor: frequency === option ? "#1173D4" : "transparent",
                            color: frequency === option ? "white" : "#1A1A1A",
                            borderColor: frequency === option ? "#1173D4" : "#D5DFEC",
                          }}
                          onMouseEnter={(e) => {
                            if (frequency !== option) {
                              e.currentTarget.style.backgroundColor = "rgba(17, 115, 212, 0.1)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (frequency !== option) {
                              e.currentTarget.style.backgroundColor = "transparent";
                            }
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-3" style={{ color: "#667085" }}>
                      An estimate is fine. Nobody is held to this.
                    </p>
                  </div>

                  {/* Important Box */}
                  <div className="p-6 rounded-lg" style={{ backgroundColor: "#EDF4FD", borderLeft: "4px solid #1173D4" }}>
                    <h4 className="font-semibold text-navy mb-3" style={{ color: "#0B2C5F" }}>
                      The part that actually matters
                    </h4>
                    <p className="text-sm text-gray-700" style={{ color: "#1A1A1A" }}>
                      When your email opens, <span className="font-semibold">attach three months of shipping history</span> if you have it – a spreadsheet export, a batch of invoices, even a screenshot. Lanes, weights, frequency and what you paid. That is what lets us price your routes properly instead of guessing at a band. No history? Send it anyway and we will work from the lanes above.
                    </p>
                  </div>

                  {/* Anything else */}
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2" style={{ color: "#0B2C5F" }}>
                      Anything else we should know <span style={{ fontSize: "0.75rem", color: "#667085" }}>OPTIONAL</span>
                    </label>
                    <textarea name="anythingElse"
                      placeholder="Deadlines, problems with your current setup, seasonal peaks, anything that keeps going wrong"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-none"
                      style={{ borderColor: "#D5DFEC", color: "#1A1A1A" }}
                    />
                  </div>

                  {status && (
                    <p role="status" className={status.type === "error" ? "text-red-700 font-bold" : "text-primary font-bold"}>
                      {status.text}
                    </p>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 rounded-lg font-semibold text-white transition-all mt-8"
                    style={{ backgroundColor: "#1173D4" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0B5AA8")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1173D4")}
                  >
                    Send this application
                  </button>

                  {/* Footer Text */}
                  <p className="text-xs text-center text-gray-600 mt-6" style={{ color: "#667085" }}>
                    Prefer to talk it through first? Call <span className="font-semibold">+1 856-428-7703</span>, open around the clock. We use what you send to prepare your pricing and nothing else — see our <a href="/privacy-policy" className="underline" style={{ color: "#1173D4" }}>privacy policy</a>.
                  </p>
                </form>
              </div>
            </div>
          </Container>
        </section>

        {/* What Happens Next Section */}
        <section className="py-16 md:py-20 lg:py-24" style={{ backgroundColor: "#0B2C5F" }}>
          <Container>
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">What Happens Next</p>
              <h2 className="text-[36px] lg:text-[36px] font-extrabold text-white mb-6">
                Four steps, and you can stop after any of them
              </h2>
              <p className="text-base md:text-lg text-white mb-12" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                Nothing here commits you. Two of these conversations regularly end with us saying a business is fine as it is – which is a better outcome than signing someone up to save them nothing.
              </p>

              {/* Steps Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    step: "01",
                    title: "We read the history",
                    description: "Your actual lanes, weights and frequency. If something important is missing we ask, rather than pricing around a guess."
                  },
                  {
                    step: "02",
                    title: "We price your routes",
                    description: "Against what you pay now, line by line, so you can see whether the difference is in the base rate or in the charges underneath it."
                  },
                  {
                    step: "03",
                    title: "A straight answer",
                    description: "Including 'this would not save you enough to be worth the disruption' if that is what the numbers say."
                  },
                  {
                    step: "04",
                    title: "Set up, then one lane",
                    description: "Account opened, portal access issued, named contact introduced. Prove it on a single route before moving anything else."
                  }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-lg border transition-all hover:shadow-lg"
                    style={{
                      borderColor: "rgba(255, 255, 255, 0.2)",
                      backgroundColor: "rgba(255, 255, 255, 0.05)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(17, 115, 212, 0.15)";
                      e.currentTarget.style.borderColor = "#1173D4";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                    }}
                  >
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
                      Step {item.step}
                    </p>
                    <h3 className="text-lg font-bold text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm text-white" style={{ color: "rgba(255, 255, 255, 0.75)" }}>
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* What Setup Usually Asks For Section */}
        <section className="bg-white py-16 md:py-20 lg:py-24">
          <Container>
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Later, Not Now</p>
              <h2 className="text-[36px] font-extrabold text-navy mb-6" style={{ color: "#0B2C5F" }}>
                What setup usually asks for
              </h2>
              <p className="text-base text-gray-600 mb-12" style={{ color: "#1A1A1A" }}>
                None of this is needed to apply. It is here so nothing arrives as a surprise once a conversation is under way.
              </p>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    number: "01",
                    title: "Company details",
                    description: "Registered name, trading address and billing contact, so invoices go to the right entity and the right person."
                  },
                  {
                    number: "02",
                    title: "Checks, if credit terms are wanted",
                    description: "Accounts settled at booking need very little. Where invoicing on terms is requested, the usual commercial checks may apply."
                  },
                  {
                    number: "03",
                    title: "Authority to declare",
                    description: "For international shipping, written authority for our brokers to make customs declarations on your behalf. Standard, and quick."
                  }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-lg bg-white border-l-4"
                    style={{
                      borderLeftColor: "#1173D4",
                      backgroundColor: "#FFFFFF",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)"
                    }}
                  >
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
                      Usually {item.number}
                    </p>
                    <h3 className="text-lg font-bold text-navy mb-3" style={{ color: "#0B2C5F" }}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600" style={{ color: "#1A1A1A" }}>
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Three Other Doors Section */}
        <section className="bg-white py-16 md:py-20 lg:py-24">
          <Container>
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Not This</p>
              <h2 className="text-[36px] font-extrabold text-navy mb-12" style={{ color: "#0B2C5F" }}>
                Three other doors
              </h2>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    number: "01",
                    title: "Price one shipment",
                    description: "You have a consignment now and an account is a later problem. The quote form is quicker and gets you a number.",
                    href: "/quote"
                  },
                  {
                    number: "02",
                    title: "See what an account includes",
                    description: "Tools, rate factors and how the stages work, before you decide whether to apply for one.",
                    href: "/business-offerings"
                  },
                  {
                    number: "03",
                    title: "Just ask a question",
                    description: "If you are not sure an account is the thing you need, describe the problem instead and we will tell you what is.",
                    href: "/contact"
                  }
                ].map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="p-6 rounded-lg bg-white border-t-4 transition-all hover:shadow-lg hover:translate-y-1"
                    style={{
                      borderTopColor: "#1173D4",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)"
                    }}
                  >
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
                      Instead {item.number}
                    </p>
                    <h3 className="text-lg font-bold text-navy mb-3" style={{ color: "#0B2C5F" }}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600" style={{ color: "#1A1A1A" }}>
                      {item.description}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}
