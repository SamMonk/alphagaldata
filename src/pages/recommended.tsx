import React from 'react';
import Layout from '../components/Layout';

const TAG = 'experience0cf-20';
const az = (path: string) => `https://www.amazon.com${path}?tag=${TAG}`;

interface Product {
  title: string;
  description: string;
  url: string;
  why: string;
}

interface Category {
  name: string;
  intro: string;
  products: Product[];
}

const categories: Category[] = [
  {
    name: 'Emergency preparedness',
    intro:
      'Every AGS patient should have an emergency plan. These are the essentials we recommend keeping on hand at all times.',
    products: [
      {
        title: 'EpiPen Carrying Case',
        description: 'Insulated case that fits two auto-injectors with a belt clip or carabiner.',
        url: az('/s?k=epipen+carrying+case+insulated'),
        why: 'Your EpiPen needs to be accessible at all times — not buried in a bag. An insulated case protects it from temperature extremes and keeps it on your person.',
      },
      {
        title: 'Medical Alert Bracelet',
        description: 'Engraved silicone or stainless steel wristband for alpha-gal / no heparin alerts.',
        url: az('/s?k=medical+alert+bracelet+allergy+engraved'),
        why: 'If you cannot speak during an emergency, a bracelet tells EMTs about your alpha-gal allergy and heparin restriction before they administer anything.',
      },
      {
        title: 'Benadryl (Diphenhydramine) Tablets',
        description: 'Antihistamine tablets (not gel caps — gel caps contain gelatin).',
        url: az('/s?k=benadryl+diphenhydramine+tablets+not+gelcap'),
        why: 'Many AGS patients keep diphenhydramine on hand for milder reactions. Important: avoid gel caps, which typically contain bovine or porcine gelatin. Tablets are safe.',
      },
    ],
  },
  {
    name: 'Tick prevention',
    intro:
      'Preventing tick bites is the only way to avoid re-sensitization. These are the products recommended in our prevention guide.',
    products: [
      {
        title: 'Sawyer Permethrin Spray',
        description: 'Permethrin clothing treatment — lasts through 6 washes.',
        url: az('/s?k=sawyer+permethrin+spray+clothing'),
        why: 'Permethrin-treated clothing is one of the most effective tick deterrents. Spray it on pants, socks, shoes, and shirts before outdoor activity. It kills ticks on contact.',
      },
      {
        title: 'Picaridin Insect Repellent',
        description: 'Skin-safe repellent that is effective against lone star ticks.',
        url: az('/s?k=picaridin+insect+repellent+tick'),
        why: 'Picaridin is as effective as DEET without the plastic-melting properties. Apply to exposed skin when spending time in tick habitat.',
      },
      {
        title: 'Tick Removal Tool Kit',
        description: 'Fine-tipped tweezers and tick removal tools designed for clean extraction.',
        url: az('/s?k=tick+removal+tool+kit+fine+tip+tweezers'),
        why: 'Proper tick removal reduces the chance of the tick releasing more saliva. Fine-tipped tweezers let you grasp the tick close to the skin without squeezing the body.',
      },
      {
        title: 'Permethrin-Treated Clothing',
        description: 'Pre-treated shirts, pants, and socks from Insect Shield and similar brands.',
        url: az('/s?k=permethrin+treated+clothing+insect+shield'),
        why: 'If you do not want to spray your own clothes, pre-treated options last through 70 washes and are available in everyday styles.',
      },
    ],
  },
  {
    name: 'Kitchen & dairy-free staples',
    intro:
      'Switching to an alpha-gal safe kitchen means finding reliable dairy-free and mammal-free alternatives. These are staples that AGS patients commonly rely on.',
    products: [
      {
        title: 'Oat Milk (Shelf-Stable)',
        description: 'Barista-style oat milk for coffee, cooking, and baking.',
        url: az('/s?k=oat+milk+shelf+stable+barista'),
        why: 'Oat milk is the most popular dairy replacement in the AGS community — it froths well, bakes well, and is widely available. Stock up on shelf-stable cartons.',
      },
      {
        title: 'Vegan Butter',
        description: 'Plant-based butter sticks for cooking and baking.',
        url: az('/s?k=vegan+butter+plant+based+sticks'),
        why: 'A direct substitute for butter in any recipe. Look for brands that explicitly state "vegan" — some "plant-based" butters still contain trace dairy.',
      },
      {
        title: 'Nutritional Yeast',
        description: 'Flaky seasoning with a cheesy, savory flavor — completely dairy-free.',
        url: az('/s?k=nutritional+yeast+flakes'),
        why: 'The go-to cheese flavor replacement for pasta, popcorn, sauces, and casseroles. Rich in B vitamins and completely safe for AGS patients.',
      },
      {
        title: 'Vegetarian Capsules (Empty)',
        description: 'HPMC capsules for supplements — no gelatin.',
        url: az('/s?k=vegetarian+empty+capsules+hpmc'),
        why: 'If you take supplements that only come in gelatin capsules, you can open them and transfer the contents to plant-based capsules. A practical workaround for highly sensitive patients.',
      },
    ],
  },
  {
    name: 'Books & education',
    intro:
      'Understanding your condition is part of managing it. These books are recommended by the AGS community.',
    products: [
      {
        title: 'The Alpha-Gal Allergy Handbook',
        description: 'Practical guide to living with alpha-gal syndrome.',
        url: az('/s?k=alpha+gal+allergy+book'),
        why: 'A comprehensive reference covering diet, medications, social situations, and the science behind AGS. Useful for newly diagnosed patients and their families.',
      },
      {
        title: 'Dairy-Free Cookbook',
        description: 'Recipe collections focused on dairy-free and plant-based cooking.',
        url: az('/s?k=dairy+free+cookbook'),
        why: 'When dairy is off the table, a good cookbook helps you expand your repertoire beyond just substituting ingredients. Look for ones with whole-food recipes rather than processed alternatives.',
      },
    ],
  },
];

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg text-slate-900">{product.title}</h3>
      <p className="text-sm text-slate-600 mt-1">{product.description}</p>
      <p className="text-sm text-slate-700 mt-2">{product.why}</p>
      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="inline-block mt-3 px-4 py-2 bg-teal-700 text-white text-sm font-medium rounded-lg hover:bg-teal-800 transition-colors"
      >
        View on Amazon
      </a>
    </div>
  );
}

export default function RecommendedPage() {
  return (
    <Layout
      title="Recommended Products"
      description="Products recommended by the alpha-gal community — tick prevention, emergency preparedness, dairy-free kitchen staples, and more. Curated for AGS patients."
      image="https://alphagaldata.com/pins/recommended-products.png"
      noindex
    >
      <div className="space-y-10">
        <section className="card">
          <h1 className="text-3xl font-bold mb-3">Recommended Products for AGS Patients</h1>
          <p className="text-slate-700 leading-relaxed">
            Living with alpha-gal syndrome means rethinking everyday products — from the
            medication in your cabinet to the milk in your fridge. These recommendations come
            from real AGS patient experience and are organized by the situations where they
            matter most.
          </p>
          <p className="text-sm text-slate-500 mt-3">
            As an Amazon Associate, AlphaGalData earns from qualifying purchases. This does
            not affect your price.{' '}
            <a href="/disclosure" className="underline">
              Full disclosure
            </a>
            .
          </p>
        </section>

        {categories.map(cat => (
          <section key={cat.name} className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">{cat.name}</h2>
              <p className="text-slate-600 mt-1">{cat.intro}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {cat.products.map(p => (
                <ProductCard key={p.title} product={p} />
              ))}
            </div>
          </section>
        ))}

        <section className="card">
          <h2 className="text-xl font-semibold mb-2">A note on product safety</h2>
          <p className="text-slate-700 leading-relaxed">
            Alpha-gal sensitivity varies between individuals. A product that is safe for one
            patient may trigger a reaction in another — especially with dairy-based items and
            medications. Always read ingredient labels before purchasing, even for products
            recommended here. When in doubt about a medication or supplement, consult your
            allergist or pharmacist.
          </p>
          <p className="text-slate-700 leading-relaxed mt-3">
            Have a product recommendation for the AGS community? We welcome suggestions.
            Use the{' '}
            <a href="/submit-recipe" className="text-teal-700 hover:underline">
              submission form
            </a>{' '}
            or reach out through the site.
          </p>
        </section>

        <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-sm">
          Educational content only — not medical advice. Product links go to Amazon.com.
          AlphaGalData earns from qualifying purchases at no extra cost to you.
        </div>
      </div>
    </Layout>
  );
}
