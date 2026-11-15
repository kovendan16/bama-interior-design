// ─────────────────────────────────────────────────────────────────────────────
//  COMPANY DETAILS — replace every placeholder below with your real details.
//  Nothing here is real yet: phone, WhatsApp, email and address are samples.
// ─────────────────────────────────────────────────────────────────────────────
export const SITE = {
  brand: 'Bama',
  brandSuffix: 'Interior Design',
  fullName: 'Bama Interior Design',
  tagline: 'Designing Spaces. Inspiring Living.',
  description:
    'Bama Interior Design creates thoughtful, beautiful interiors for homes and businesses — from the first sketch to the final cushion.',

  phone: '+91 00000 00000', // placeholder
  phoneHref: 'tel:+910000000000', // placeholder
  whatsapp: '910000000000', // placeholder — country code + number, digits only
  email: 'hello@your-domain.com', // placeholder
  address: 'Your studio address, City, State', // placeholder
  hours: 'Mon – Sat · 10:00 – 19:00', // placeholder

  // placeholder links — set to your real profiles (or remove)
  social: [
    { name: 'Instagram', href: '#' },
    { name: 'Facebook', href: '#' },
    { name: 'Pinterest', href: '#' },
    { name: 'LinkedIn', href: '#' },
  ],
}

export const whatsappLink = (text = 'Hello Bama Interior Design, I would like to discuss an interior project.') =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`
