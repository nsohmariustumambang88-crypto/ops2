import Link from 'next/link';
import Container from '@/components/ui/Container';

export type InfoSection = { title: string; body: string[]; bullets?: string[] };

type Props = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: InfoSection[];
  cta?: { label: string; href: string };
};

export default function InfoPage({ eyebrow, title, intro, sections, cta }: Props) {
  return (
    <div className="bg-white text-black">
      <section className="py-16 md:py-20 bg-navy text-white">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-widest text-white/80 mb-3">{eyebrow}</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{title}</h1>
            <p className="text-lg text-white/90 leading-relaxed">{intro}</p>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          <div className="max-w-3xl space-y-12">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="text-2xl md:text-[28px] font-extrabold text-navy mb-4">{s.title}</h2>
                {s.body.map((p, i) => (
                  <p key={i} className="mb-4 leading-relaxed">{p}</p>
                ))}
                {s.bullets && (
                  <ul className="space-y-3 mt-4">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3">
                        <span className="text-primary font-bold">✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {cta && (
            <div className="mt-16 max-w-3xl">
              <Link
                href={cta.href}
                className="inline-block px-8 py-3 font-bold rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
              >
                {cta.label}
              </Link>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
