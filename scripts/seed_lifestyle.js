globalThis.WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env.local');
const env = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
env.split('\n').forEach(line => {
  const [k, ...v] = line.trim().split('=');
  if (k && !k.startsWith('#')) envVars[k.trim()] = v.join('=').trim();
});

const { createClient } = require('@supabase/supabase-js');
const sb = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const NEW_PRODUCTS = [
  // --- MALE LIFESTYLE PRODUCTS ---
  {
    title: "Nomos Glashütte Tangente 38: Reductionist Bauhaus Horology and In-House Alpha Caliber",
    description: `An icon of purposeful minimalism, the Tangente 38 embodies the enduring principles of the Bauhaus design ethos. Crafted in Glashütte, Germany, it features an ultra-slender stainless steel case measuring just 6.7mm in thickness, tempered cornflower-blue steel hands, and a galvanized white silver-plated dial with typographically balanced numerals. Powered by the in-house hand-wound Alpha caliber, it delivers 43 hours of precise power reserve beneath an anti-reflective sapphire crystal caseback.

Every proportion has been calculated with architectural discipline: the straight, angled lugs sit flat against the wrist, while the Horween Genuine Shell Cordovan strap offers unmatched density and suppleness that moulds to the wearer over time.

Designed for those who value mechanical purity over decorative excess, the Tangente 38 remains a masterclass in modern horology.`,
    price: 185000,
    currency: "INR",
    rating: 4.9,
    my_take: "The Tangente 38 is the definition of intentional restraint. In a market dominated by oversized, loud sports watches, its 37.5mm diameter and crisp typography sit with effortless poise beneath a French cuff or casual cashmere sweater. The tactile feedback of winding the manual crown every morning is a grounding ritual.",
    affiliate_url: "https://nomos-glashuette.com/en/tangente/tangente-38-164",
    image_path: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    source_content: "Nomos Glashutte Tangente 38 Bauhaus watch. In-house Alpha manual caliber. 37.5mm diameter, 6.7mm height. Tempered blue steel hands, sapphire crystal back, Horween shell cordovan strap.",
    status: "published"
  },
  {
    title: "Mühle Hexagon Anodized Aluminum Safety Razor & Silvertip Badger Set",
    description: `Engineered in collaboration with Berlin industrial designer Mark Braun, the Mühle Hexagon collection reimagines traditional wet shaving with architectural precision. The ergonomic hexagonal handle is machined from aerospace-grade aluminum, anodized in a satin forest matte finish for secure tactile handling even with lathered hands.

The companion shaving brush is bound with hand-selected silvertip badger hairs—the softest and highest water-retaining natural grade in wet shaving—creating a rich, dense micro-foam lather that lifts facial hair without irritating sensitive skin.

Completed with an engraved mirror-chrome stand, the set eliminates plastic cartridge waste completely while transforming a mundane grooming routine into a deliberate, satisfying morning ceremony.`,
    price: 16800,
    currency: "INR",
    rating: 4.8,
    my_take: "Multi-blade plastic cartridges are disposable, noisy, and cause chronic razor burn. Shaving with the Hexagon is a transformative sensory experience. The weight distribution balances naturally in the fingers without requiring downward pressure, cutting cleanly at skin level with zero tugging.",
    affiliate_url: "https://www.muehle-shaving.com/en/HEXAGON-shaving-set/S-091-M-HEXAGON-GR",
    image_path: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=85",
    video_url: null,
    source_content: "Muhle Hexagon wet shaving set designed by Mark Braun. Anodized aluminum handle with matte hexagonal profile. Silvertip badger hair brush, safety razor with closed comb. Chrome stand included. Zero plastic build.",
    status: "published"
  },
  {
    title: "Mismo M/S Utility Leather-Trimmed Cotton Canvas Travel Holdall",
    description: `Engineered from tight-weave water-repellent Italian cotton canvas and complemented by full-grain vegetable-tanned bridle leather, this holdall bridges utilitarian travel demands with bespoke Danish leather artistry. 

Features solid brass hardware with a brushed finish, internal padded compartments for a 15-inch laptop, zippered utility compartments for passports and chargers, and an adjustable, removable leather shoulder strap.

Proportioned specifically to fit European and international overhead flight cabins, it carries enough attire for a 72-hour journey while maintaining an uncompromised structural silhouette.`,
    price: 49500,
    currency: "INR",
    rating: 4.8,
    my_take: "Vegetable-tanned bridle leather rewards patience—it arrives firm, but across years of weekend travel it acquires a rich, individual patina that tells the story of your journeys. The canvas density offers total peace of mind against wet weather without feeling overly heavy on the shoulder.",
    affiliate_url: "https://www.mismo.dk/products/ms-utility-navy-dark-brown",
    image_path: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85",
    video_url: null,
    source_content: "Mismo M/S Utility bag. Navy water repellent cotton canvas with dark brown bridle leather handles. Solid brass hardware, YKK Excella zippers. 42x34x15 cm. Fits 15 inch laptop.",
    status: "published"
  },

  // --- FEMALE LIFESTYLE PRODUCTS ---
  {
    title: "Dyson Airwrap Multi-Styler Complete Long in Strawberry Bronze and Blush Pink",
    description: `The Dyson Airwrap harnesses aerodynamic Coanda airflow physics rather than extreme heat to style, curl, shape, and hide flyaways simultaneously. Powered by the Dyson digital motor V9 spinning at up to 110,000 RPM, intelligent thermal sensors measure air temperature over 40 times per second, ensuring the heating element never exceeds 150°C.

Comes equipped with 30mm and 40mm re-engineered directional barrels, firm smoothing brushes, round volumising brushes, and a multi-functional Coanda smoothing dryer.

Engineered specifically for chest-length and longer hair types, it achieves runway-worthy salon blowouts in minutes while protecting natural keratin integrity and moisture levels.`,
    price: 49900,
    currency: "INR",
    rating: 4.9,
    my_take: "Traditional curling irons bake hair cuticle fibers, leading to chronic split ends and dullness. The Airwrap replaces four separate appliances with acoustic engineering and airflow. For daily blowouts or loose editorial waves, it cuts styling time in half while preserving natural shine and hair density.",
    affiliate_url: "https://www.dyson.in/hair-care/dyson-airwrap-multi-styler-complete-long-strawberry-bronze",
    image_path: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85",
    video_url: null,
    source_content: "Dyson Airwrap Multi-Styler Complete Long in Strawberry Bronze. Powered by Dyson V9 motor. Coanda airflow for wrapping and smoothing without extreme heat damage. 13-blade impeller. Intelligent heat control under 150 degrees Celsius. Includes multiple smoothing brushes and barrels.",
    status: "published"
  },
  {
    title: "Le Labo Santal 33 Eau de Parfum: Artisanal Smoked Amber and Australian Sandalwood",
    description: `Hand-compounded with meticulous precision, Le Labo Santal 33 is an intoxicating sensory portrait of the American West. Opening with fresh violet accord and spiced cardamom, the formulation reveals an intoxicating heart of iris and ambrox before resting on a base of cedarwood, leather, and smoked Australian sandalwood.

Formulated without animal ingredients, parabens, or preservatives, each bottle is personalized on demand with the curator's label and bottled in Le Labo's iconic apothecary glass silhouette.

Its lingering sillage creates an undeniable olfactory signature that blurs gender boundaries with smoky warmth and papery elegance.`,
    price: 27500,
    currency: "INR",
    rating: 4.8,
    my_take: "Santal 33 achieved its legendary status because it completely eschewed sugary department-store cliches. The smoky, papery drydown is unmistakable—subtle enough for a boardroom meeting yet captivating in an intimate evening dinner setting. It lingers on cashmere scarves and wool coats for days.",
    affiliate_url: "https://www.lelabofragrances.com/santal-33-146.html",
    image_path: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85",
    video_url: null,
    source_content: "Le Labo Santal 33 EDP 100ml. Notes of cardamom, iris, violet, ambrox, cedarwood, Australian sandalwood, and leather. Freshly blended perfume. Iconic apothecary glass bottle.",
    status: "published"
  },
  {
    title: "Polène Paris Numéro Neuf Textured Calf Leather Handbag in Chalk",
    description: `Designed in Paris and handcrafted by master leatherworkers in Ubrique, Spain—the historic cradle of luxury leathercraft. The Numéro Neuf features an organic draped construction where certified full-grain Italian textured calfskin is pinched and folded into sculptural undulating curves.

Features a hand-stitched curved top handle, hidden magnetic snap closure, 100% microfibre velvet lining, and an optional cross-body leather strap for versatile daily styling.

Free from oversized logos or unnecessary metallic hardware, it asserts itself purely through sculptural geometry and artisanal leather craftsmanship.`,
    price: 44000,
    currency: "INR",
    rating: 4.9,
    my_take: "Polène represents the best of the quiet luxury movement: no giant hardware, no loud monograms, just flawless leather drapery and geometric balance. The chalk shade pairs effortlessly with monochrome linen or structured winter coats.",
    affiliate_url: "https://eng.polene-paris.com/products/numero-neuf-craie-graine",
    image_path: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85",
    video_url: null,
    source_content: "Polene Paris Numero Neuf in Chalk. Italian full-grain textured calf leather. Handcrafted in Ubrique, Spain. Organic drape design with hand-sewn folds. Removable shoulder strap. Magnetic closure. Dimensions 19 x 32 x 16 cm.",
    status: "published"
  }
];

const NEW_BLOGS = [
  // --- MALE COMPANION BLOGS ---
  {
    slug: "the-architecture-of-time-why-bauhaus-horology-outlives-the-smartwatch",
    title: "The Architecture of Time: Why Bauhaus Horology Outlives the Smartwatch",
    excerpt: "In an era of buzzing wrist notifications and annual battery obsolescence, mechanical manual-wind watches offer a grounding, distraction-free sanctuary.",
    content: `We have reached peak notification saturation. From the moment our morning alarms sound until our heads touch the pillow, silicon screens buzz with calendar reminders, group chats, news alerts, and biometric updates. The digital smartwatch has turned our wrists into secondary monitors—demanding our attention every few minutes.

In direct contrast to this digital intrusion stands mechanical horology, specifically the clean, reductionist lineage born from the Bauhaus movement in Weimar and Dessau.

### Form Follows Function Without Distraction

Watches like the Nomos Glashütte Tangente 38 do not seek to measure your heart rate or prompt you to stand up every sixty minutes. They perform a single, disciplined duty: telling time with architectural clarity. 

- **Typographical Discipline:** Every numeral and index is placed with intentional typographic weight. There are no decorative chronographs, tachymeter scales, or rotating bezels cluttering the dial.
- **Micro-Mechanical Longevity:** While a smartwatch battery degrades in 36 months, a manual-wind mechanical movement constructed from brass, steel, and synthetic rubies can be serviced and handed down across generations.
- **The Morning Ritual:** Winding the crown twenty turns every morning is a tactile pause. It demands sixty seconds of physical presence before the digital noise of the day begins.

### The Value of Understatement

Quiet confidence does not require a bulky, gold-plated diver's watch that protrudes beneath a cuff. A 6.7mm stainless steel profile finished with heated cornflower-blue hands speaks to discernment rather than status posturing. When you glance down, you are not checking what needs your attention; you are simply checking where you stand in the day.`,
    external_link: "https://nomos-glashuette.com",
    external_link_label: "Nomos Glashütte Manufacture",
    status: "published",
    image_path: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85"
  },
  {
    slug: "reclaiming-the-morning-the-case-for-single-blade-wet-shaving",
    title: "Reclaiming the Morning: The Case for Single-Blade Wet Shaving",
    excerpt: "How transitioning from multi-blade plastic cartridges to a weighted safety razor transforms a daily chore into a deliberate mindfulness ritual.",
    content: `For decades, mass-market consumer grooming brands convinced men that five blades were inherently superior to three, vibrating handles were essential, and canned aerosols of artificial foam were the standard of modern hygiene. 

The result for millions of men? Ingrown hairs, razor burn, excessive plastic landfill waste, and a morning routine rushed with resentment.

### The Geometry of the Single Blade

The resurgence of traditional double-edge safety razors—exemplified by precision industrial designs like the Mühle Hexagon—is not mere hipster nostalgia. It is grounded in dermatological physics.

- **Zero Hysteresis Effect:** Multi-blade cartridges work through "hysteresis"—the first blade hooks and pulls the hair follicle outward while subsequent blades cut below the skin line. When the hair retracts, it curls beneath the surface, resulting in painful ingrown bumps. A single double-edge blade shears hair flush at skin level in a single stroke.
- **Natural Weighted Balance:** High-end safety razors are machined from solid brass or aerospace aluminum. Their calibrated mass does the cutting work; you never need to press the razor down into the dermis.
- **Thermal Preparation:** Whipping genuine silvertip badger bristles with warm water and essential oil shaving cream opens the pores and lifts facial hair naturally.

### A Mindful Morning Ceremony

When you lather with a brush and guide a safety razor along your jawline, you cannot scroll your phone or rush the strokes. It forces fifteen minutes of quiet concentration, transforming a tedious chore into an intentional ritual that sets a centered tone for the hours ahead.`,
    external_link: "https://www.muehle-shaving.com",
    external_link_label: "Mühle Shaving Culture",
    status: "published",
    image_path: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=85"
  },
  {
    slug: "the-art-of-the-72-hour-carry-traveling-light-with-enduring-luggage",
    title: "The Art of the 72-Hour Carry: Traveling Light with Enduring Luggage",
    excerpt: "A disciplined philosophy on weekend travel: choosing vegetable-tanned bridle leather, heavy canvas, and capsule packing.",
    content: `Modern airport travel is notoriously stressful: checked luggage fees, baggage claim carousels, and fragile plastic wheeled spinners that crack at the first hard bump. 

The seasoned traveler approaches mobility through a disciplined editorial lens: pack only what fits in a single holdall, carry it by hand, and bypass the chaos.

### Materials That Age Gracefully

Most modern luggage uses synthetic ballistic nylon or molded polycarbonate shells. While functional, they wear down rather than wearing in.

- **Italian Tight-Weave Canvas:** High-density cotton canvas repels seasonal rain while offering pliable expansion when slipping an extra sweater inside.
- **Full-Grain Bridle Leather:** Tanned with vegetable bark tannins rather than harsh chrome salts, bridle leather develops a deep amber sheen over years of flights and train rides. Scratches don't ruin it; they become character marks.
- **Solid Brass Zippers:** Heavy-duty YKK Excella zippers with brushed brass teeth never jam or split open under pressure.

### The 72-Hour Capsule Wardrobe

Traveling with a single holdall enforces curatorial discipline:
1. **One Pair of Versatile Footwear:** Worn in transit, freeing up interior bag volume.
2. **Neutral Base Layers:** Merino wool tees and tailored trousers that resist wrinkles and can be worn across three days without losing shape.
3. **Structured Outerwear:** An unconstructed blazer or tailored overcoat that bridges business dinners and casual weekend exploration.

When everything you need for 72 hours hangs effortlessly from your shoulder, travel ceases to be an ordeal and becomes a liberating experience.`,
    external_link: "https://www.mismo.dk",
    external_link_label: "Mismo Copenhagen",
    status: "published",
    image_path: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85"
  },

  // --- FEMALE COMPANION BLOGS ---
  {
    slug: "the-science-of-styling-without-heat-damage-living-with-the-airwrap",
    title: "The Science of Styling Without Heat Damage: Living with the Airwrap",
    excerpt: "Why aerodynamic Coanda airflow physics and real-time thermistor regulation are quietly redefining modern hair care.",
    content: `For decades, the standard path to salon-quality curls or a sleek blowout required subjecting delicate hair strands to scorching 200°C ceramic plates. The consequences were predictable: permanent keratin denaturation, moisture loss, and chronic split ends that no hair mask could truly reverse.

The introduction of the Dyson Airwrap marked a rare paradigm shift where aerospace fluid dynamics replaced brute heat.

### The Physics of the Coanda Effect

Named after Romanian aeronautics engineer Henri Coandă, the Coanda phenomenon occurs when a high-speed jet of air attaches itself to an adjacent curved surface.

- **Automatic Wrapping:** The Airwrap utilizes a 13-blade digital motor spinning at 110,000 RPM. This creates a vortex of air along the barrel that draws hair toward it and wraps it automatically, eliminating the wrist acrobatics of traditional irons.
- **Intelligent Thermal Guard:** Embedded glass-bead thermistors measure air temperature 40 times per second, guaranteeing that airflow never exceeds 150°C—the critical threshold before irreversible structural keratin damage occurs.
- **Styling from Damp to Dry:** By styling hair while it retains 20% residual dampness, hydrogen bonds are gently reset into new curves as the moisture evaporates, creating natural bounce that lasts throughout the day.

### Reclaiming the Morning Vanity Routine

What previously required a round brush, a heavy professional dryer, and a separate curling iron can now be completed in 15 minutes using a single modular tool. It is an investment in hair health that eliminates vanity clutter while delivering consistently polished results.`,
    external_link: "https://www.dyson.in",
    external_link_label: "Dyson Technology",
    status: "published",
    image_path: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85"
  },
  {
    slug: "anatomy-of-a-signature-scent-why-santal-33-defined-a-decade-of-olfactory-luxury",
    title: "Anatomy of a Signature Scent: Why Santal 33 Defined a Decade of Olfactory Luxury",
    excerpt: "Moving beyond synthetic florals: how cardamom, iris, and smoked Australian sandalwood created a unisex cult classic.",
    content: `Walk into any boutique hotel lobby in Tokyo, a creative agency in SoHo, or an art gallery in Paris, and the olfactory fingerprint is immediately recognizable: a smoky, intoxicating blend of Australian sandalwood, crisp cardamom, and leather notes.

How did Le Labo Santal 33 transcend the commercial perfume market to become the defining unisex fragrance of our era?

### Dismantling the Commercial Perfume Playbook

For decades, mainstream fragrance houses relied on celebrity endorsements, overly sweet synthetic florals for women, and aggressively harsh musks for men. 

Le Labo founded its philosophy on pharmaceutical minimalism:
- **Apothecary Aesthetics:** Hand-typed curator labels, amber glass apothecary bottles, and plain cardboard packaging that prioritizes the juice inside over gaudy bottle stoppers.
- **Sublime Structural Notes:** Santal 33 opens not with sugary citrus, but with crisp violet and spiced cardamom. As it warms against body heat, cedarwood and ambrox emerge, resting on a dry, smoky sandalwood foundation that smells like aged paper and vintage leather jackets.
- **Uncompromising Longevity:** Because the formulation emphasizes heavy woody base molecules, a single spray on a wool coat or silk collar persists subtly for days without turning rancid or cloying.

### Finding a Personal Scent Anchor

A signature fragrance is not an accessory you wear for other people; it is an intimate sensory anchor. Santal 33 succeeds because it is comforting, architectural, and completely free from gendered cliches.`,
    external_link: "https://www.lelabofragrances.com",
    external_link_label: "Le Labo Fragrances",
    status: "published",
    image_path: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85"
  },
  {
    slug: "quiet-luxury-and-architectural-leather-inside-the-rise-of-polene-paris",
    title: "Quiet Luxury and Architectural Leather: Inside the Rise of Polène Paris",
    excerpt: "Why the modern luxury consumer is abandoning gaudy logo plates in favor of organic Spanish leather drapery and sculptural silhouettes.",
    content: `The era of the "it bag" covered in monogram logos and oversized gold buckles is quietly coming to an end. Today's discerning luxury consumer is seeking something more refined: pure silhouettes, uncompromised artisanal leathercraft, and an understated aesthetic that speaks through form rather than branding.

Nowhere is this shift more evident than in the meteoric ascent of French atelier Polène.

### Ubrique: The Spanish Cradle of Leather Craftsmanship

While Polène designs its collections in Paris, every bag is produced in Ubrique, Andalusia—the legendary mountain town where Europe's top haute-couture houses have quietly sourced their leather artisans for over a century.

- **Sculptural Folds and Draping:** The signature Numéro Neuf bag is crafted from full-grain Italian textured calfskin that is hand-pinched and sewn into organic, undulating curves reminiscent of fabric drapery.
- **Absence of Monograms:** There are no logos stamped across the face of the leather. A subtle, blind-debossed foil mark at the base is all that identifies the maker.
- **Tactile Longevity:** The textured pebble grain resists everyday scratching and raindrops, allowing it to transition seamlessly from a workday commute to an evening dinner without delicate babying.

### Elevating the Everyday Wardrobe

An architectural bag in a neutral chalk or warm cognac tone acts as an anchor for everyday dressing. Paired with a simple trench coat or cashmere knit, its sculpted folds provide visual intrigue without shouting for attention. It is luxury distilled down to craftsmanship and form.`,
    external_link: "https://eng.polene-paris.com",
    external_link_label: "Polène Paris Atelier",
    status: "published",
    image_path: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85"
  }
];

async function seed() {
  console.log('Seeding 6 products (3 male, 3 female)...');
  for (const prod of NEW_PRODUCTS) {
    // Check if title already exists
    const { data: existing } = await sb.from('products').select('id, article_number, title').eq('title', prod.title).maybeSingle();
    if (existing) {
      console.log(`Product already exists: [#${existing.article_number}] ${existing.title.slice(0, 40)}...`);
    } else {
      const { data, error } = await sb.from('products').insert([{
        ...prod,
        published_at: new Date().toISOString()
      }]).select().single();
      if (error) {
        console.error('Error inserting product:', prod.title, error.message);
      } else {
        console.log(`✓ Inserted product [#${data.article_number}]: ${data.title.slice(0, 45)}...`);
      }
    }
  }

  console.log('\nSeeding 6 companion blogs (3 male, 3 female)...');
  for (const blog of NEW_BLOGS) {
    const { data: existing } = await sb.from('blogs').select('id, slug, title').eq('slug', blog.slug).maybeSingle();
    if (existing) {
      console.log(`Blog already exists: [${existing.slug}]`);
    } else {
      const { data, error } = await sb.from('blogs').insert([{
        ...blog,
        published_at: new Date().toISOString()
      }]).select().single();
      if (error) {
        console.error('Error inserting blog:', blog.slug, error.message);
      } else {
        console.log(`✓ Inserted blog [${data.slug}]: ${data.title.slice(0, 45)}...`);
      }
    }
  }

  console.log('\nFinished seeding!');
}

seed().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
