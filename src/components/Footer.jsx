import { Link } from "react-router-dom";
import { Camera, MessageSquare, Globe, ExternalLink } from "lucide-react";
import { Stack, Cluster, Grid } from "@/components/ui";

export default function Footer() {
  return (
    <footer className="py-24 px-6 md:px-12 bg-[#FDFBF7] border-t border-stone-200">
      <Grid className="max-w-7xl mx-auto md:grid-cols-4 gap-16">
        {/* Brand */}
        <Stack className="col-span-2 gap-8">
          <Link
            to="/"
            className="text-3xl font-display font-bold tracking-tighter text-stone-900 hover:opacity-70 transition-opacity"
          >
            CANDERA
          </Link>
          <p className="text-stone-500 max-w-sm text-sm leading-relaxed font-light italic">
            Cultivating intentional living through scent and micro-batch artisanry. Based in the
            studio, shared everywhere.
          </p>
          <Cluster className="gap-6 text-stone-400">
            <a
              href="https://www.instagram.com/canderacandles"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Camera size={20} className="hover:text-stone-900 transition-colors" />
            </a>
            <a
              href="https://www.etsy.com/shop/CanderaCandles"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Etsy shop"
            >
              <MessageSquare size={20} className="hover:text-stone-900 transition-colors" />
            </a>
            <a
              href="https://candera.co"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Website"
            >
              <Globe size={20} className="hover:text-stone-900 transition-colors" />
            </a>
          </Cluster>
        </Stack>

        {/* Navigation */}
        <Stack className="gap-6">
          <h5 className="text-[11px] uppercase tracking-[0.2em] font-bold text-stone-400">
            Navigation
          </h5>
          <ul className="text-stone-600 text-xs space-y-4 font-semibold">
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
                href="https://www.etsy.com/shop/CanderaCandles"
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
          <h5 className="text-[11px] uppercase tracking-[0.2em] font-bold text-stone-400">
            Assistance
          </h5>
          <ul className="text-stone-600 text-xs space-y-4 font-semibold">
            <li className="text-stone-400">Shipping & Returns</li>
            <li className="text-stone-400">Wholesale</li>
            <li>
              <Link to="/inner-circle" className="hover:text-candera-ember transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </Stack>
      </Grid>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-stone-400 font-bold uppercase tracking-widest">
        <p>© 2024 Candera Studio. All rights reserved.</p>
        <Cluster className="gap-8">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </Cluster>
      </div>
    </footer>
  );
}
