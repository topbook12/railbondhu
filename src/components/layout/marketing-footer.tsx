import Link from 'next/link';
import { Train } from 'lucide-react';

/*
 * FOOTER DESIGN - LIGHT THEME
 * ===========================
 * 
 * Layout:
 * - Grid: 5 columns (brand + 4 link groups)
 * - Mobile: 2 columns for links
 * - Sticky footer behavior with mt-auto
 * 
 * Colors:
 * - Background: Light gray (muted) to differentiate from content
 * - Text: Dark for readability
 * - Links: Muted color with teal hover
 * - Border: Subtle top border
 * 
 * Typography:
 * - Headings: Semibold, 14px
 * - Links: Regular, 14px
 * - Description: Regular, 14px, muted
 * 
 * Design Principles:
 * - Clean, organized layout
 * - Easy to scan
 * - Consistent with header styling
 * - Accessible color contrast
 */

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'App', href: '/app' },
    { name: 'Roadmap', href: '/roadmap' },
    { name: 'Pricing', href: '#' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Cookies', href: '#' },
  ],
  social: [
    { name: 'Twitter', href: '#' },
    { name: 'Facebook', href: '#' },
    { name: 'LinkedIn', href: '#' },
  ],
};

export function MarketingFooter() {
  return (
    <footer className="bg-muted border-t border-border mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <Train className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-foreground">
                Rail<span className="text-primary">Bondhu</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
              Your trusted companion for Bangladesh railway travel. 
              Track trains in real-time with community-powered data.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Connect</h3>
            <ul className="space-y-3">
              {footerLinks.social.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} RailBondhu. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Made with ❤️ in Bangladesh
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
