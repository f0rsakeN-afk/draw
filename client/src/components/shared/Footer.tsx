import React from "react";
import { Link } from "react-router-dom";
import { Github, Twitter, Youtube } from "lucide-react";
import { LogoImage } from "@/utils/ImageExports";

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t bg-background text-muted-foreground">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 py-10 text-sm">
        <div className="space-y-2">
          <img src={LogoImage} alt="logo image" className="h-20 dark:invert" />

          <p className="text-xs leading-relaxed">
            Stream the world’s content. Discover, enjoy, and create.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className=" text-foreground font-semibold">Company</h4>
          <ul className="space-y-1">
            <li>
              <Link to="/about" className="hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link to="/careers" className="hover:underline">
                Careers
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:underline">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-foreground">Support</h4>
          <ul className="space-y-1">
            <li>
              <Link to="/help" className="hover:underline">
                Help Center
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/feedback" className="hover:underline">
                Send Feedback
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-foreground">Legal</h4>
            <ul className="space-y-1 mt-2">
              <li>
                <Link to="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:underline">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex gap-4 mt-4">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              <Youtube className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://github.com/f0rsakeN-afk"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t py-4 text-center text-xs">
        &copy; {new Date().getFullYear()}{" "}
        <span className="text-[#2a10ff] dark:invert font-semibold">Vizion</span>
        . All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
