import { Link } from "react-router-dom";
import { Camera, MessageSquare, Globe, ExternalLink } from "lucide-react";
import { Stack, Cluster } from "@/components/ui/stack";
import { Grid } from "@/components/ui/section";
import site from "@content/site.json";

export default function Footer() {
  return (
    <footer className="py-24 px-6 md:px-12 bg-candera-vellum border-t border-candera-stone/40">
      <Grid className="max-w-7xl mx-auto md:grid-cols-4 gap-16">
        {/* Brand */}
        <Stack className="col-span-2 gap-8">
          <Link
            to="/"
            className="text-3xl font-display font-bold tracking-tighter text-candera-obsidian hover:opacity-70 transition-opacity"
          >
            {site.brandName}
          </Link>
          <p className="text-candera-sage max-w-sm text-sm leading-relaxed font-light italic">
            {site.footerTagline}
          </p>
          <Cluster className="gap-6 text-candera-stone">
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Camera size={20} className="hover:text-candera-obsidian transition-colors" />
            </a>
            <a href={site.etsyUrl} target="_blank" rel="noopener noreferrer" aria-label="Etsy shop">
              <MessageSquare size={20} className="hover:text-candera-obsidian transition-colors" />
            </a>
            <a
              href={site.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Website"
            >
              <Globe size={20} className="hover:text-candera-obsidian transition-colors" />
            </a>
          </Cluster>
        </Stack>

        {/* Navigation */}
        <Stack className="gap-6">
          <h5 className="text-[11px] uppercase tracking-[0.2em] font-bold text-candera-stone">
            Navigation
          </h5>
          <ul className="text-candera-obsidian/60 text-xs space-y-4 font-semibold">
            <li>
              <Link to="/collection" className="hover:text-candera-ember transition-colors">
                Current Batch
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-candera-ember transition-colors">
                The Craft
              </Link>
            </li>
            <li>
              <Link to="/inner-circle" className="hover:text-candera-ember transition-colors">
                Inner Circle
              </Link>
            </li>
            <li>
              <a
                href={site.etsyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-candera-ember transition-colors flex items-center gap-1"
              >
                View All on Etsy <ExternalLink size={10} />
              </a>
            </li>
          </ul>
        </Stack>

        {/* Assistance */}
        <Stack className="gap-6">
          <h5 className="text-[11px] uppercase tracking-[0.2em] font-bold text-candera-stone">
            Assistance
          </h5>
          <ul className="text-candera-obsidian/60 text-xs space-y-4 font-semibold">
            <li className="text-candera-stone">Shipping & Returns</li>
            <li className="text-candera-stone">Wholesale</li>
            <li>
              <Link to="/inner-circle" className="hover:text-candera-ember transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </Stack>
      </Grid>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-candera-stone/20 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-candera-stone font-bold uppercase tracking-widest">
        <p>
          © {site.copyrightYear} {site.copyrightName}. All rights reserved.
        </p>
        <Cluster className="gap-8">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </Cluster>
      </div>
    </footer>
  );
}
